import { useState } from 'react';

export default function SkeletonImage({ className = '', onLoad, onError, ...props }) {
  const [loaded, setLoaded] = useState(false);

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
      className={`skeleton-image${loaded ? '' : ' is-loading'}${className ? ` ${className}` : ''}`}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
}
