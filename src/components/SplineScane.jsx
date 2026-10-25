import { Component, Suspense, useState } from 'react'
import Spline from '@splinetool/react-spline'
import '../style/SplineScane.css'

// <Spline> melempar error saat render kalau scene gagal di-load (URL salah,
// offline, WebGL mati). Tanpa ErrorBoundary seluruh app jadi blank.
// Prop `onError` TIDAK ada di Spline, jadi harus ditangkap lewat boundary ini.
class SplineErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error('Spline gagal dimuat:', error)
    this.props.onError?.(error)
  }

  render() {
    return this.state.hasError ? null : this.props.children
  }
}

function SplineScene({ scene, className = '', onLoad, onError }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const handleLoad = (...args) => {
    setIsLoaded(true)
    onLoad?.(...args)
  }

  const handleError = (error) => {
    setIsLoaded(true)
    onError?.(error)
  }

  return (
    <>
      <SplineErrorBoundary onError={handleError}>
        <div className={`spline-container ${className}`}>
          {!isLoaded && <div className="spline-loading-skeleton skeleton-block" aria-hidden="true" />}
          <Suspense fallback={null}>
            <Spline scene={scene} onLoad={handleLoad} />
          </Suspense>
        </div>
        <div className="spline-penutup" />
      </SplineErrorBoundary>
    </>
  )
}

export default SplineScene
