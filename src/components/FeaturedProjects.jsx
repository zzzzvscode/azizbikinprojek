import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, X } from 'lucide-react';
import ninjaImage from '../assets/portfolio/ninja.jpeg';
import gitarImage from '../assets/portfolio/gitar.jpeg';
import djImage from '../assets/portfolio/dj.jpeg';
import biliardImage from '../assets/portfolio/biliard.jpeg';
import '../style/FeaturedProjects.css';

const projects = [
  {
    title: 'Sport Motorcycle',
    description: 'Fotografi motor yang menghadirkan karakter kendaraan dan detail desain.',
    image: ninjaImage,
    position: 'center 42%',
    technologies: ['html', 'css', 'js'],
  },
  {
    title: 'Music Performance',
    description: 'Potret gitar dengan nuansa gelap, kontras tinggi, dan visual panggung.',
    image: gitarImage,
    position: 'center 56%',
    technologies: ['photo', 'music'],
  },
  {
    title: 'DJ Setup',
    description: 'Dokumentasi peralatan DJ dan pengalaman performa musik elektronik.',
    image: djImage,
    position: 'center',
    technologies: ['dj', 'audio'],
  },
  {
    title: 'Billiard Session',
    description: 'Momen olahraga billiard dengan komposisi hitam-putih yang dramatis.',
    image: biliardImage,
    position: 'center 58%',
    technologies: ['photo', 'sport'],
  },
];

export default function FeaturedProjects() {
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    if (!activeProject) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setActiveProject(null);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [activeProject]);

  const renderProjectCard = (project) => (
    <article className="project-card" key={project.title}>
      <div className="project-card-visual">
        <img
          className="project-card-image"
          src={project.image}
          alt={project.title}
          loading="lazy"
          style={{ objectPosition: project.position }}
        />
        <div className="project-card-overlay">
          <div className="project-card-copy">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <button
              className="project-card-link"
              type="button"
              aria-haspopup="dialog"
              onClick={() => setActiveProject(project)}
            >
              Lihat <ArrowUpRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );

  return (
    <section className="projects-section" id="Projects" aria-labelledby="projects-heading">
      <header className="projects-heading">
        <h2 className="section-display-title" id="projects-heading">
          Beberapa Hobi Saya
        </h2>
        <p>Beberapa soft skill yang saya punya</p>
      </header>

      <div className="projects-grid">
        <div className="projects-column projects-column-left">
          {projects.slice(0, 1).map(renderProjectCard)}
        </div>

        <div className="projects-column projects-column-center">
          {projects.slice(1, 3).map(renderProjectCard)}
        </div>

        <div className="projects-column projects-column-right">
          {projects.slice(3).map(renderProjectCard)}
        </div>
      </div>

      {activeProject && createPortal(
        <div
          className="project-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeProject.title} full-screen image`}
          onClick={(event) => {
            if (event.target === event.currentTarget) setActiveProject(null);
          }}
        >
          <button
            className="project-lightbox-close"
            type="button"
            aria-label="Tutup gambar"
            autoFocus
            onClick={() => setActiveProject(null)}
          >
            <X size={24} />
          </button>
          <figure className="project-lightbox-figure">
            <img src={activeProject.image} alt={activeProject.title} />
            <figcaption>{activeProject.title}</figcaption>
          </figure>
        </div>,
        document.body,
      )}
    </section>
  );
}
