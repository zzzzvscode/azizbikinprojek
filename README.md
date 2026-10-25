# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## Supabase comment rate limit

Comment submissions go through the `post-comment` Edge Function, which enforces
a 120-second cooldown per client IP. Direct anonymous inserts into `comments`
are disabled; public comment reads and realtime updates remain enabled.
To change the enforced cooldown, edit `v_cooldown` in
`supabase/comments.sql` and run that SQL again in the Supabase SQL Editor.

1. Link the Supabase CLI to the project with `supabase link --project-ref <project-ref>`.
2. Set a private HMAC key of at least 32 random bytes:
   `supabase secrets set COMMENT_RATE_LIMIT_SECRET="<random-secret>"`
3. Deploy the public endpoint with
   `supabase functions deploy post-comment --no-verify-jwt`.
4. Run [`supabase/comments.sql`](./supabase/comments.sql) in the Supabase SQL Editor.
5. Deploy the frontend after the function and SQL are ready.

The function uses Supabase's server-provided `x-forwarded-for` header and stores
only an HMAC of the client IP. Never expose the HMAC secret or service-role key
in frontend environment variables.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
