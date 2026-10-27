import { useEffect } from 'react';
import { ArrowLeft, ChevronRight, Code2 } from 'lucide-react';
import androidStudioLogo from '../assets/TECH/android-studio-icon.svg';
import capacitorLogo from '../assets/TECH/capacitor-svgrepo-com.svg';
import chromiumLogo from '../assets/TECH/chromium-svgrepo-com.svg';
import cssLogo from '../assets/TECH/css-svgrepo-com.svg';
import firebaseLogo from '../assets/TECH/firebase-icon.svg';
import geminiLogo from '../assets/TECH/gemini.svg';
import htmlLogo from '../assets/TECH/html-5-svgrepo-com.svg';
import javascriptLogo from '../assets/TECH/js-official-svgrepo-com.svg';
import mysqlLogo from '../assets/TECH/mysql-logo-svgrepo-com.svg';
import phpLogo from '../assets/TECH/php-svgrepo-com.svg';
import pythonLogo from '../assets/TECH/python-svgrepo-com.svg';
import vercelLogo from '../assets/TECH/vercel-icon-svgrepo-com.svg';
import vscodeLogo from '../assets/TECH/vscode-svgrepo-com.svg';
import xamppLogo from '../assets/TECH/xampp-svgrepo-com.svg';
import BorderGlow from '../components/BorderGlow';
import SkeletonImage from '../components/SkeletonImage';
import '../style/PortfolioSection.css';

const TECHNOLOGY_LOGOS = {
  'Android Studio': androidStudioLogo,
  Capacitor: capacitorLogo,
  Chromium: chromiumLogo,
  CSS: cssLogo,
  Firebase: firebaseLogo,
  Gemini: geminiLogo,
  HTML: htmlLogo,
  JavaScript: javascriptLogo,
  MySQL: mysqlLogo,
  PHP: phpLogo,
  Python: pythonLogo,
  Vercel: vercelLogo,
  VScode: vscodeLogo,
  XAMPP: xamppLogo,
};

export default function ProjectDetailPage({ project, onBack }) {
  useEffect(() => {
    const syncPointer = (event) => {
      const root = document.documentElement;
      const x = event.clientX.toFixed(2);
      const y = event.clientY.toFixed(2);
      const xProgress = event.clientX / window.innerWidth;

      root.style.setProperty('--tech-glow-x', `${x}px`);
      root.style.setProperty('--tech-glow-y', `${y}px`);
      root.style.setProperty('--tech-glow-hue', `${210 + xProgress * 100}`);
    };

    window.addEventListener('pointermove', syncPointer, { passive: true });
    return () => {
      window.removeEventListener('pointermove', syncPointer);
      document.documentElement.style.removeProperty('--tech-glow-x');
      document.documentElement.style.removeProperty('--tech-glow-y');
      document.documentElement.style.removeProperty('--tech-glow-hue');
    };
  }, []);

  return (
    <main className="project-detail-page">
      <div className="project-detail-inner">
        <div className="project-detail-breadcrumbs">
          <button type="button" className="project-detail-back" onClick={onBack}>
            <ArrowLeft size={20} aria-hidden="true" />
            <span>Back</span>
          </button>
          <span className="project-detail-crumb-muted">Projects</span>
          <ChevronRight size={18} aria-hidden="true" className="project-detail-crumb-chevron" />
          <span className="project-detail-crumb-current">{project.title}</span>
        </div>

        <div className="project-detail-layout">
          <div className="project-detail-copy">
            <h1 className="project-detail-title">{project.title}</h1>
            <p className="project-detail-description">{project.longDesc}</p>

            <div className="project-detail-tech">
              <h2><Code2 size={20} aria-hidden="true" /> Technologies Used</h2>
              <div className="project-detail-tech-list">
                {project.tags.map((tag) => {
                  const technologyLogo = TECHNOLOGY_LOGOS[tag];

                  return (
                    <span key={tag} className="project-detail-tech-chip" data-glow>
                      {technologyLogo ? (
                        <SkeletonImage
                          className={tag === 'Vercel' ? 'is-light' : ''}
                          src={technologyLogo}
                          alt=""
                          aria-hidden="true"
                        />
                      ) : (
                        <Code2 size={18} aria-hidden="true" />
                      )}
                      {tag}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {project.image ? (
            <BorderGlow
              className="project-detail-preview-glow"
              edgeSensitivity={8}
              glowColor="205 90 75"
              backgroundColor="#050814"
              borderRadius={20}
              glowRadius={28}
              glowIntensity={1.5}
              coneSpread={23}
              colors={['#38bdf8', '#6366f1', '#c084fc']}
            >
              <div className="project-detail-preview has-image" style={{ background: project.gradient }}>
                <SkeletonImage
                  src={project.image}
                  mobileSrc={project.mobileImage}
                  alt={`Tampilan ${project.title}`}
                />
              </div>
            </BorderGlow>
          ) : (
            <div className="project-detail-preview" style={{ background: project.gradient }}>
              <div className="project-detail-preview-placeholder">
                <div className="project-detail-preview-window"><span /><span /><span /></div>
                <Code2 size={54} aria-hidden="true" />
                <span>{project.categoryLabel}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
