import SplineScene from './SplineScane'
import ThemeToggle from './ThemeToggle'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import '../style/RobotScreen.css'

const sceneUrl = 'https://prod.spline.design/O49YJbfScdvWS566/scene.splinecode'

export default function RobotScreen({ onEnterPortfolio, onLoadSpline, onErrorSpline }) {
  return (
    <div className="robot-viewport">
      {/* 3D Spline Canvas */}
      <div className="robot-spline-layer">
        <SplineScene
          scene={sceneUrl}
          className="robot-canvas-embed"
          onLoad={onLoadSpline}
          onError={onErrorSpline}
        />
      </div>

      {/* Clean Top Navigation */}
      <header className="robot-clean-header">
        <div className="header-brand">
          <span className="brand-dot" />
          <span className="brand-label">ALFARI — 2026</span>
        </div>

        <div className="header-actions">
          <ThemeToggle />
          <button
            type="button"
            className="clean-skip-btn"
            onClick={onEnterPortfolio}
          >
            <span>Lewati</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </header>

      {/* Clean Editorial Bottom Card */}
      <footer className="robot-clean-footer">
        <div className="clean-hero-card">
          <div className="hero-kicker">CREATIVE DEVELOPER & DESIGNER</div>
          <h1 className="hero-title">
            Membangun produk web yang <em>berasa</em> dan interaktif.
          </h1>
          <p className="hero-subtext">
            Eksplorasi pengalaman 3D, animasi halus, dan antarmuka bersih yang dirancang dengan presisi.
          </p>

          <div className="hero-button-row">
            <button
              type="button"
              className="clean-enter-btn"
              onClick={onEnterPortfolio}
            >
              <span>Masuk ke Portofolio</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
