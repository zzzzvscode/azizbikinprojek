import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import '../style/Splash.css';

const MIN_LOADING_DURATION = 3000;
const EXIT_DURATION = 700;
const LANYARD_INTRO_LEAD = 500;

export default function WelcomeScreen({ onComplete, onExitAnimationStart }) {
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
  const lanyardIntroTimerRef = useRef(0);
  const completedRef = useRef(false);

  useLayoutEffect(() => {
    const { body, documentElement } = document;
    const previousStyles = {
      htmlOverflow: documentElement.style.overflow,
      htmlScrollBehavior: documentElement.style.scrollBehavior,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyWidth: body.style.width,
      bodyHeight: body.style.height,
      bodyOverflow: body.style.overflow,
    };
    const preventScroll = (event) => event.preventDefault();
    const preventScrollKeys = (event) => {
      if (
        event.target instanceof HTMLElement
        && event.target.closest('button, a, input, textarea, select, [contenteditable="true"]')
      ) {
        return;
      }

      if (['ArrowDown', 'ArrowUp', ' ', 'End', 'Home', 'PageDown', 'PageUp'].includes(event.key)) {
        event.preventDefault();
      }
    };

    documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    documentElement.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = '0';
    body.style.left = '0';
    body.style.width = '100%';
    body.style.height = '100%';
    body.style.overflow = 'hidden';
    document.addEventListener('wheel', preventScroll, { passive: false });
    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('keydown', preventScrollKeys);

    return () => {
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('keydown', preventScrollKeys);
      documentElement.style.overflow = previousStyles.htmlOverflow;
      documentElement.style.scrollBehavior = previousStyles.htmlScrollBehavior;
      body.style.position = previousStyles.bodyPosition;
      body.style.top = previousStyles.bodyTop;
      body.style.left = previousStyles.bodyLeft;
      body.style.width = previousStyles.bodyWidth;
      body.style.height = previousStyles.bodyHeight;
      body.style.overflow = previousStyles.bodyOverflow;
      window.scrollTo(0, 0);
    };
  }, []);

  const finishIntro = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsLeaving(true);
    lanyardIntroTimerRef.current = window.setTimeout(
      onExitAnimationStart,
      EXIT_DURATION - LANYARD_INTRO_LEAD,
    );
    exitTimerRef.current = window.setTimeout(onComplete, EXIT_DURATION);
  }, [onComplete, onExitAnimationStart]);

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
        preloadLanyardAssets(
          setProgress,
          controller.signal,
          window.matchMedia('(max-width: 767px)').matches,
        ),
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
      setLoadingPercent(100);
      if (result.failures.length > 0) {
        console.warn(
          'Sebagian aset lanyard gagal dimuat; halaman tetap dilanjutkan.',
          result.failures,
        );
      }
      finishIntro();
    }).catch((error) => {
      if (controller.signal.aborted) return;
      console.error('Gagal memeriksa aset lanyard:', error);
      setProgress((current) => ({
        ...current,
        failures: [...current.failures, { label: 'portfolio assets', error }],
      }));
      setLoadingPercent(100);
      finishIntro();
    });

    return () => {
      controller.abort();
      window.clearInterval(progressTimer);
      window.clearTimeout(exitTimerRef.current);
      window.clearTimeout(lanyardIntroTimerRef.current);
    };
  }, [attempt, finishIntro]);

  const percent = loadingPercent;

  const retryFailedAssets = () => {
    window.clearTimeout(exitTimerRef.current);
    window.clearTimeout(lanyardIntroTimerRef.current);
    completedRef.current = false;
    setIsLeaving(false);
    setLoadingPercent(0);
    setProgress({ completed: 0, loaded: 0, total: 3, failures: [] });
    setAttempt((current) => current + 1);
  };

  return (
    <div className={`welcome-screen-root${isLeaving ? ' is-leaving' : ''}`}>
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
