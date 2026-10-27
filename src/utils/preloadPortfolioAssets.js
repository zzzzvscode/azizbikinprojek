import backCardImage from '../assets/lanyard/backCard.png';
import mobileBackCardImage from '../assets/lanyard/backCard-mobile.webp';
import bandImage from '../assets/lanyard/bandd.png';
import frontCardImage from '../assets/lanyard/frontCard.png';
import mobileFrontCardImage from '../assets/lanyard/frontCard-mobile.webp';

const DESKTOP_LANYARD_ASSETS = [
  { label: 'Kartu depan', url: frontCardImage },
  { label: 'Kartu belakang', url: backCardImage },
  { label: 'Tali kartu', url: bandImage },
];
const MOBILE_LANYARD_ASSETS = [
  { label: 'Kartu depan', url: mobileFrontCardImage },
  { label: 'Kartu belakang', url: mobileBackCardImage },
  { label: 'Tali kartu', url: bandImage },
];

const IMAGE_LOAD_TIMEOUT = 15000;

const preloadImage = ({ label, url }, signal) => new Promise((resolve) => {
  const image = new Image();
  let settled = false;
  let timeoutId;

  const finish = (error = null) => {
    if (settled) return;
    settled = true;
    window.clearTimeout(timeoutId);
    signal.removeEventListener('abort', onAbort);
    if (error) resolve({ error, label });
    else resolve({ label });
  };

  const onAbort = () => {
    image.src = '';
    finish(new DOMException('Pemuatan dibatalkan', 'AbortError'));
  };

  image.onload = async () => {
    try {
      await image.decode?.();
      finish();
    } catch (error) {
      if (image.naturalWidth > 0) finish();
      else finish(error);
    }
  };
  image.onerror = () => finish(new Error(`Gagal memuat ${label}`));

  if (signal.aborted) {
    onAbort();
    return;
  }

  signal.addEventListener('abort', onAbort, { once: true });
  timeoutId = window.setTimeout(
    () => finish(new Error(`Waktu memuat ${label} habis`)),
    IMAGE_LOAD_TIMEOUT,
  );
  image.src = url;
});

export async function preloadLanyardAssets(onProgress, signal, isMobile = false) {
  let completed = 0;
  let loaded = 0;
  const failures = [];
  const assets = isMobile ? MOBILE_LANYARD_ASSETS : DESKTOP_LANYARD_ASSETS;

  onProgress({
    completed,
    loaded,
    total: assets.length,
    failures: [...failures],
  });

  await Promise.all(assets.map(async (asset) => {
    const result = await preloadImage(asset, signal);
    if (signal.aborted) return;

    completed += 1;
    if (result.error) failures.push(result);
    else loaded += 1;

    onProgress({
      completed,
      loaded,
      total: assets.length,
      failures: [...failures],
    });
  }));

  return { failures, loaded, total: assets.length };
}
