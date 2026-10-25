import { useCallback, useEffect, useRef, useState } from 'react';
import ParticleBackground from './ParticleBackground';
import '../style/Splash.css';

const MIN_LOADING_DURATION = 3000;
const EXIT_DURATION = 700;

export default function WelcomeScreen({ onComplete }) {
  const [attempt, setAttempt] = useState(0);
  const [progress, setProgress] = useState({
    completed: 0,
    loaded: 0,
    total: 3,
    failures: [],
  });
  const [isLeaving, setIsLeaving] = useState(false);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const exitTimerRef = useRef(0);
  const completedRef = useRef(false);

  const finishIntro = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsLeaving(true);
    exitTimerRef.current = window.setTimeout(onComplete, EXIT_DURATION);
  }, [onComplete]);

  useEffect(() => {
    const controller = new AbortController();
    const startedAt = performance.now();
    completedRef.current = false;

    const progressTimer = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      setLoadingPercent(Math.min(Math.floor((elapsed / MIN_LOADING_DURATION) * 95), 95));
    }, 50);

    const minimumLoadingTime = new Promise((resolve) => {
      const timer = window.setTimeout(resolve, MIN_LOADING_DURATION);
      controller.signal.addEventListener('abort', () => {
        window.clearTimeout(timer);
        resolve();
      }, { once: true });
    });

    import('../utils/preloadPortfolioAssets').then(({ preloadLanyardAssets }) => (
      Promise.all([
        preloadLanyardAssets(setProgress, controller.signal),
        minimumLoadingTime,
      ]).then(([result]) => result)
    )).then((result) => {
      if (controller.signal.aborted) return;
      setProgress({
        completed: result.total,
        loaded: result.loaded,
        total: result.total,
        failures: result.failures,
      });
      if (result.failures.length === 0) {
        setLoadingPercent(100);
        finishIntro();
      }
    }).catch((error) => {
      if (controller.signal.aborted) return;
      setProgress((current) => ({
        ...current,
        failures: [...current.failures, { label: 'portfolio assets', error }],
      }));
    });

    return () => {
      controller.abort();
      window.clearInterval(progressTimer);
      window.clearTimeout(exitTimerRef.current);
    };
  }, [attempt, finishIntro]);

  const percent = loadingPercent;

  const retryFailedAssets = () => {
    window.clearTimeout(exitTimerRef.current);
    completedRef.current = false;
    setIsLeaving(false);
    setLoadingPercent(0);
    setProgress({ completed: 0, loaded: 0, total: 3, failures: [] });
    setAttempt((current) => current + 1);
  };

  return (
    <div className={`welcome-screen-root${isLeaving ? ' is-leaving' : ''}`}>
      <ParticleBackground />
      <div className="welcome-loader">
        <span
          className="welcome-loader-number"
          role="status"
          aria-live="polite"
          aria-label={`Memuat aset portfolio ${percent}%`}
        >
          {percent}<span>%</span>
        </span>
        <div className="welcome-progress-track" aria-hidden="true">
          <span style={{ transform: `scaleX(${percent / 100})` }} />
        </div>
        <span className="welcome-loader-count">
          Memuat assets...
        </span>

        {progress.failures.length > 0 && (
          <div className="welcome-loader-error" role="alert">
            <span>{progress.failures.length} aset gagal dimuat.</span>
            <div>
              <button type="button" onClick={retryFailedAssets}>Coba lagi</button>
              <button type="button" onClick={finishIntro}>Lanjutkan</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
