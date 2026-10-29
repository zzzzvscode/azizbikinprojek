const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const jsonResponse = (body, status = 200, headers = {}) => (
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, ...headers },
  })
);

const createIpHash = async (ip, secret) => {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const digest = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(ip));
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 150000) {
    return jsonResponse({ error: 'Ukuran permintaan terlalu besar.' }, 413);
  }

  let payload;
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return jsonResponse({ error: 'Format komentar tidak valid.' }, 400);
    }
    payload = body;
  } catch {
    return jsonResponse({ error: 'Format komentar tidak valid.' }, 400);
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const comment = typeof payload.comment === 'string' ? payload.comment.trim() : '';
  const avatarUrl = payload.avatar_url === null || payload.avatar_url === undefined
    ? null
    : typeof payload.avatar_url === 'string'
      ? payload.avatar_url
      : '';

  if (!name || name.length > 50 || !comment || comment.length > 500) {
    return jsonResponse({ error: 'Nama atau komentar tidak valid.' }, 400);
  }
  if (
    avatarUrl !== null
    && (avatarUrl.length > 100000 || !avatarUrl.startsWith('data:image/jpeg;base64,'))
  ) {
    return jsonResponse({ error: 'Foto profil tidak valid.' }, 400);
  }

  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor?.split(',').map((value) => value.trim()).filter(Boolean).at(-1);
  const supabaseUrl = Deno.env.get('SUPABASE_URL')?.replace(/\/+$/, '');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const rateLimitSecret = Deno.env.get('COMMENT_RATE_LIMIT_SECRET');

  if (!ip || !supabaseUrl || !serviceRoleKey || !rateLimitSecret || rateLimitSecret.length < 32) {
    console.error('Comment function is missing a trusted client IP or required server configuration.');
    return jsonResponse({ error: 'Layanan komentar sedang tidak tersedia.' }, 503);
  }

  try {
    const ipHash = await createIpHash(ip, rateLimitSecret);
    const response = await fetch(
      `${supabaseUrl}/rest/v1/rpc/post_comment_with_rate_limit`,
      {
        method: 'POST',
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          p_ip_hash: ipHash,
          p_name: name,
          p_comment: comment,
          p_avatar_url: avatarUrl,
        }),
      },
    );

    if (!response.ok) {
      console.error('Comment rate-limit RPC failed:', response.status);
      return jsonResponse({ error: 'Komentar gagal dikirim. Coba lagi nanti.' }, 500);
    }

    const result = await response.json();
    if (!result.allowed) {
      const retryAfterSeconds = Math.max(1, Number(result.retry_after_seconds) || 60);
      if (result.reason === 'duplicate_message') {
        return jsonResponse(
          {
            error: 'Komentar yang sama sudah dikirim 3 kali berturut-turut.',
            reason: 'duplicate_message',
            retry_after_seconds: retryAfterSeconds,
          },
          429,
          { 'Retry-After': String(retryAfterSeconds) },
        );
      }

      return jsonResponse(
        {
          error: 'JANGAN SPAM!! Tunggu sebelum mengirim komentar lagi.',
          retry_after_seconds: retryAfterSeconds,
        },
        429,
        { 'Retry-After': String(retryAfterSeconds) },
      );
    }

    return jsonResponse({
      comment: result.comment,
      retry_after_seconds: Number(result.retry_after_seconds) || 60,
    }, 201);
  } catch (error) {
    console.error('Comment function request failed:', error);
    return jsonResponse({ error: 'Komentar gagal dikirim. Coba lagi nanti.' }, 500);
  }
});
