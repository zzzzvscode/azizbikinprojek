import { X, ExternalLink, CheckCircle2, Cpu } from 'lucide-react'
import { GithubIcon } from './BrandIcons'

export default function ProjectModal({ project, onClose }) {
  if (!project) return null

  return (
    <div className="project-modal-backdrop" onClick={onClose}>
      <div
        className="project-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Tutup Modal"
        >
          <X size={18} />
        </button>

        {/* Modal Top Banner */}
        <div className="modal-banner" style={{ background: project.gradient }}>
          <div className="modal-banner-content">
            <span className="modal-badge">{project.tag}</span>
            <h2 className="modal-title">{project.title}</h2>
            <p className="modal-kicker">{project.subtitle}</p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="modal-desc-wrap">
            <h4>Tentang Proyek</h4>
            <p>{project.longDescription}</p>
          </div>

          {/* Key Metrics */}
          <div className="modal-metrics-grid">
            {project.highlights.map((h, i) => (
              <div key={i} className="modal-metric-card">
                <CheckCircle2 size={16} className="highlight-icon" />
                <span>{h}</span>
              </div>
            ))}
          </div>

          {/* Tech Stack */}
          <div className="modal-tech-wrap">
            <h4><Cpu size={14} /> Teknologi yang Digunakan</h4>
            <div className="modal-tech-pills">
              {project.stack.map((t, idx) => (
                <span key={idx} className="tech-pill">{t}</span>
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div className="modal-actions">
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-btn-primary"
            >
              <span>Buka Demo Interaktif</span>
              <ExternalLink size={16} />
            </a>

            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-btn-secondary"
            >
              <GithubIcon size={16} />
              <span>Lihat Source Code</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
