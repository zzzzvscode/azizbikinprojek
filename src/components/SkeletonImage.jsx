import { useEffect, useState } from 'react';

export default function SkeletonImage({
  className = '',
  src,
  mobileSrc,
  onLoad,
  onError,
  loading = 'lazy',
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const updateViewport = (event) => setIsMobile(event.matches);
    mediaQuery.addEventListener('change', updateViewport);
    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, []);

  const handleLoad = (event) => {
    setLoaded(true);
    onLoad?.(event);
  };

  const handleError = (event) => {
    setLoaded(true);
    onError?.(event);
  };

  return (
    <img
      {...props}
      src={isMobile && mobileSrc ? mobileSrc : src}
      loading={loading}
      decoding="async"
      className={`skeleton-image${loaded ? '' : ' is-loading'}${className ? ` ${className}` : ''}`}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
}
