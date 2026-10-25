import backCardImage from '../assets/lanyard/backCard.png';
import bandImage from '../assets/lanyard/bandd.png';
import frontCardImage from '../assets/lanyard/frontCard.png';

const LANYARD_ASSETS = [
  { label: 'Kartu depan', url: frontCardImage },
  { label: 'Kartu belakang', url: backCardImage },
  { label: 'Tali kartu', url: bandImage },
];

const preloadImage = ({ label, url }, signal) => new Promise((resolve) => {
  const image = new Image();
  let settled = false;

  const finish = (error = null) => {
    if (settled) return;
    settled = true;
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
      finish(error);
    }
  };
  image.onerror = () => finish(new Error(`Gagal memuat ${label}`));

  if (signal.aborted) {
    onAbort();
    return;
  }

  signal.addEventListener('abort', onAbort, { once: true });
  image.src = url;
});

export async function preloadLanyardAssets(onProgress, signal) {
  let completed = 0;
  let loaded = 0;
  const failures = [];

  await Promise.all(LANYARD_ASSETS.map(async (asset) => {
    const result = await preloadImage(asset, signal);
    if (signal.aborted) return;

    completed += 1;
    if (result.error) failures.push(result);
    else loaded += 1;

    onProgress({
      completed,
      loaded,
      total: LANYARD_ASSETS.length,
      failures: [...failures],
    });
  }));

  return { failures, loaded, total: LANYARD_ASSETS.length };
}
