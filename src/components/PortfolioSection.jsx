import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import {
  Code2,
  ExternalLink,
  ArrowRight,
  Award,
  Trophy,
  Cpu,
  X,
} from 'lucide-react';
import xamppLogo from '../assets/TECH/xampp-svgrepo-com.svg';
import viteLogo from '../assets/TECH/vite-svgrepo-com.svg';
import vercelLogo from '../assets/TECH/vercel-icon-svgrepo-com.svg';
import supabaseLogo from '../assets/TECH/supabase-icon.svg';
import reactLogo from '../assets/TECH/react-svgrepo-com.svg';
import pythonLogo from '../assets/TECH/python-svgrepo-com.svg';
import phpLogo from '../assets/TECH/php-svgrepo-com.svg';
import mysqlLogo from '../assets/TECH/mysql-logo-svgrepo-com.svg';
import javascriptLogo from '../assets/TECH/js-official-svgrepo-com.svg';
import htmlLogo from '../assets/TECH/html-5-svgrepo-com.svg';
import githubLogo from '../assets/TECH/github-svgrepo-com.svg';
import gitLogo from '../assets/TECH/git-svgrepo-com.svg';
import fontAwesomeLogo from '../assets/TECH/font-awesome.svg';
import firebaseLogo from '../assets/TECH/firebase-icon.svg';
import cssLogo from '../assets/TECH/css-svgrepo-com.svg';

import udemy01Sertif from '../assets/SERTIFIKAT/UC-f106f323-2cad-4f16-a2d3-e0e843fb2016-1.png';
import pklSertif from '../assets/SERTIFIKAT/pkl.png'
import mobilePklSertif from '../assets/SERTIFIKAT/pkl-mobile.webp';
import cssjsCourse from '../assets/SERTIFIKAT/css-js-course.jpg'
import ksmSertif from '../assets/SERTIFIKAT/ksm.png'
import mobileKsmSertif from '../assets/SERTIFIKAT/ksm-mobile.webp';

import cyberGyzn from  '../assets/Project/cyberGyzn.png';
import mobileCyberGyzn from '../assets/Project/cyberGyzn-mobile.webp';
import botArtikel from '../assets/Project/botArtikel.png'
import mobileBotArtikel from '../assets/Project/botArtikel-mobile.webp';
import dataSiswa from '../assets/Project/dataSiswa.png'
import mobileDataSiswa from '../assets/Project/dataSiswa-mobile.webp';

import SkeletonImage from './SkeletonImage';
import BorderGlow from './BorderGlow';
import '../style/PortfolioSection.css';
import LiquidMetalBorder from './LiquidMetalBorder';

export const PROJECTS_DATA = [
  {
    id: 'CYBER GYZN',
    title: 'CYBER GYZN',
    category: 'fullstack',
    categoryLabel: 'Phising',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #0369a1 50%, #0284c7 100%)',
    image: cyberGyzn,
    mobileImage: mobileCyberGyzn,
    description:
      'Aplikasi dashboard hasil link phising untuk memantau dan menganalisis data phishing.',
    longDesc:
      'CYBER GYZN adalah aplikasi mobile yang memantau dan mengelola data hasil link phishing melalui dashboard terintegrasi untuk memvisualisasikan informasi dan mendukung analisis keamanan siber.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Capacitor', 'Firebase', 'VScode', 'Android Studio', 'Vercel'],
  },
  {
    id: 'bot artikel',
    title: 'Bot Generate Artikel',
    category: 'bot',
    categoryLabel: 'automatisasi',
    image: botArtikel,
    mobileImage: mobileBotArtikel,
    gradient: 'linear-gradient(135deg, #091e3a 0%, #1e3a8a 50%, #3b82f6 100%)',
    description:
      'Aplikasi dashboard otomatisasi pembuatan artikel berbasis AI untuk menghasilkan, mengelola, dan memantau proses pembuatan serta publikasi artikel secara efisien pada website.',
    longDesc:
      'Website otomatisasi pembuatan artikel yang memanfaatkan kecerdasan buatan (AI) untuk membuat artikel secara otomatis berdasarkan kata kunci atau topik yang ditentukan, lengkap dengan optimasi SEO, pengelolaan konten, dan penjadwalan publikasi dalam satu dashboard.',
    tags: ['Python', 'HTML', 'CSS', 'JavaScript', 'VScode', 'Gemini', 'Chromium'],
  },
  {
    id: 'database',
    title: 'Database Siswa',
    category: 'db',
    categoryLabel: 'db',
    image: dataSiswa,
    mobileImage: mobileDataSiswa,
    gradient: 'linear-gradient(135deg, #091e3a 0%, #1e3a8a 50%, #3b82f6 100%)',
    description:
      'Aplikasi Dashboard Data Siswa merupakan platform berbasis website untuk memantau data siswa secara terpusat.',
    longDesc:
      'Aplikasi Dashboard Data Siswa merupakan platform berbasis website yang dirancang untuk memantau data siswa secara terpusat. Sistem ini memudahkan proses pencatatan identitas siswa, pengelolaan data kelas, pencarian informasi, serta pemantauan status siswa secara cepat dan efisien. Dengan tampilan dashboard yang modern, interaktif, dan responsif, aplikasi ini membantu meningkatkan efektivitas administrasi sekolah, meminimalkan kesalahan pengolahan data, serta menyediakan informasi siswa yang terstruktur dan mudah diakses oleh pihak yang berwenang.',
    tags: ['PHP', 'HTML', 'CSS', 'JavaScript', 'VScode', 'XAMPP', 'MySQL'],
  },
];

const TECH_STACK_DATA = [
  {
    category: 'Frontend Development',
    skills: [
      { name: 'React', logo: reactLogo },
      { name: 'JavaScript', logo: javascriptLogo },
      { name: 'HTML5', logo: htmlLogo },
      { name: 'CSS3', logo: cssLogo },
      { name: 'Font Awesome', logo: fontAwesomeLogo },
    ],
  },
  {
    category: 'Backend & Database',
    skills: [
      { name: 'Python', logo: pythonLogo },
      { name: 'PHP', logo: phpLogo },
      { name: 'MySQL', logo: mysqlLogo },
      { name: 'Supabase', logo: supabaseLogo },
      { name: 'Firebase', logo: firebaseLogo },
      { name: 'XAMPP', logo: xamppLogo },
    ],
  },
  {
    category: 'Tools & DevOps',
    skills: [
      { name: 'Git', logo: gitLogo },
      { name: 'GitHub', logo: githubLogo, logoClass: 'is-light' },
      { name: 'Vite', logo: viteLogo },
      { name: 'Vercel', logo: vercelLogo, logoClass: 'is-light' },
    ],
  },
];

const CERTIFICATES_DATA = [
  {
    id: 'pkl',
    title: 'Sertifikat',
    image: pklSertif,
    mobileImage: mobilePklSertif,
  },
  {
    id: 'udemy',
    title: 'Sertifikat',
    image: cssjsCourse,
  },
  {
    id: 'udemy',
    title: 'Sertifikat',
    image: udemy01Sertif,
  },
];

const AWARDS_DATA = [
  {
    id: 'ksm-2022',
    title: 'Juara III Bidang Studi IPS Terpadu',
    event: 'Kompetisi Sains Madrasah Tingkat Kota Jayapura',
    year: '2022',
    image: ksmSertif,
    mobileImage: mobileKsmSertif,
  },
];

export default function PortfolioSection({ onOpenProject }) {
  const portfolioRef = useRef(null);
  const previousTabRef = useRef(null);
  const [activeTab, setActiveTab] = useState('projects');
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    const previousTab = previousTabRef.current;
    previousTabRef.current = activeTab;
    if (!previousTab || previousTab === activeTab) return undefined;

    const portfolio = portfolioRef.current;
    const view = portfolio?.querySelector(`.portfolio-${activeTab}-view`);
    const itemSelector = activeTab === 'projects'
      ? '.portfolio-project-card'
      : activeTab === 'skills'
        ? '.portfolio-skill-card'
        : '.portfolio-cert-card';
    const items = view?.querySelectorAll(itemSelector);
    if (!items?.length) return undefined;
    const animateBlur = !window.matchMedia('(max-width: 767px)').matches;

    const context = gsap.context(() => {
      gsap.fromTo(
        items,
        {
          autoAlpha: 0,
          y: 28,
          scale: 0.94,
          ...(animateBlur ? { filter: 'blur(5px)' } : {}),
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          ...(animateBlur ? { filter: 'blur(0px)' } : {}),
          duration: 0.52,
          stagger: { each: 0.065, from: 'start' },
          ease: 'power3.out',
          clearProps: 'transform,opacity,visibility,filter',
        },
      );

      const visuals = view.querySelectorAll(
        '.portfolio-card-thumbnail-image, .portfolio-skill-logo, .portfolio-cert-preview-image',
      );
      if (visuals.length) {
        gsap.fromTo(
          visuals,
          { scale: 0.86, autoAlpha: 0 },
          {
            scale: 1,
            autoAlpha: 1,
            duration: 0.58,
            stagger: { each: 0.055, from: 'start' },
            ease: 'back.out(1.4)',
            clearProps: 'transform,opacity,visibility',
          },
        );
      }

      const activeButton = portfolio.querySelector('.portfolio-tab-btn.is-active');
      if (activeButton) {
        gsap.fromTo(activeButton, { scale: 0.95 }, { scale: 1, duration: 0.35, ease: 'back.out(2)' });
      }
    }, portfolio);

    return () => context.revert();
  }, [activeTab]);

  useEffect(() => {
    if (!selectedCertificate) return undefined;

    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedCertificate(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
    };
  }, [selectedCertificate]);

  const tabs = [
    { id: 'projects', label: 'Projects', icon: Code2 },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'awards', label: 'Achievements', icon: Trophy },
    { id: 'skills', label: 'Tech Stack', icon: Cpu },
  ];

  return (
    <section ref={portfolioRef} className="portfolio-root-section" id="Portofolio" aria-labelledby="portfolio-section-heading">
      <div className="portfolio-container-inner">
        <h2 className="section-display-title" id="portfolio-section-heading">Portfolio</h2>

        {/* Tab Switcher */}
        <div className="portfolio-tab-bar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`portfolio-tab-btn ${isActive ? 'is-active' : ''}`}
              >
                <Icon size={22} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: PROJECTS */}
        {activeTab === 'projects' && (
          <div className="portfolio-projects-view">
            {/* Projects Grid */}
            <div className="portfolio-cards-grid">
              {PROJECTS_DATA.map((proj) => (
                <article key={proj.id} className="portfolio-project-card">
                  <LiquidMetalBorder className="portfolio-project-metal-border" />
                  <div className="portfolio-project-card-content">
                    <div
                      className="portfolio-card-thumbnail"
                      style={{ background: proj.image ? '#000' : proj.gradient }}
                    >
                      {proj.image && (
                        <SkeletonImage
                          className="portfolio-card-thumbnail-image"
                          src={proj.image}
                          mobileSrc={proj.mobileImage}
                          alt={`Thumbnail ${proj.title}`}
                          loading="lazy"
                        />
                      )}
                    </div>

                    <div className="portfolio-card-body">
                      <h3 className="portfolio-card-title">{proj.title}</h3>

                      <p className="portfolio-card-desc">{proj.description}</p>

                      <button
                        type="button"
                        className="portfolio-details-btn"
                        onClick={(event) => {
                          event.stopPropagation();
                          onOpenProject(proj.id);
                        }}
                      >
                        <span>Details</span>
                        <ArrowRight size={20} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: TECH STACK */}
        {activeTab === 'skills' && (
          <div className="portfolio-skills-view">
            <div className="portfolio-skills-grid">
              {TECH_STACK_DATA.flatMap((group) => group.skills)
                .filter((skill) => skill.logo)
                .map((skill) => (
                  <BorderGlow
                    as="article"
                    className="portfolio-skill-card"
                    key={skill.name}
                    edgeSensitivity={0}
                    glowColor="40 80 80"
                    backgroundColor="#0e1625"
                    borderRadius={20}
                    glowRadius={28}
                    glowIntensity={2.2}
                    coneSpread={23}
                    colors={['#c084fc', '#f472b6', '#38bdf8']}
                  >
                    <div className="portfolio-skill-card-content">
                      <div className="portfolio-skill-mark">
                        <SkeletonImage
                          className={`portfolio-skill-logo ${skill.logoClass || ''}`}
                          src={skill.logo}
                          alt=""
                          loading="lazy"
                        />
                      </div>
                      <h3 className="portfolio-skill-name">{skill.name}</h3>
                    </div>
                  </BorderGlow>
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: CERTIFICATES */}
        {activeTab === 'certificates' && (
          <div className="portfolio-certificates-view">
            <div className="portfolio-certificates-grid">
              {CERTIFICATES_DATA.map((cert) => (
                <article
                  key={cert.id}
                  className="portfolio-cert-card"
                  role="button"
                  tabIndex={0}
                  aria-label={`Lihat sertifikat ${cert.title}`}
                  onClick={() => setSelectedCertificate(cert)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedCertificate(cert);
                    }
                  }}
                >
                  <div className="portfolio-cert-preview">
                    <SkeletonImage
                      className="portfolio-cert-preview-image"
                      src={cert.image}
                      mobileSrc={cert.mobileImage}
                      alt={`Preview ${cert.title}`}
                      loading="lazy"
                    />
                    <span className="portfolio-cert-preview-overlay">
                      Lihat sertifikat
                      <ExternalLink size={18} aria-hidden="true" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: AWARDS */}
        {activeTab === 'awards' && (
          <div className="portfolio-awards-view">
            <div className="portfolio-certificates-grid">
              {AWARDS_DATA.map((award) => (
                <article
                  key={award.id}
                  className="portfolio-cert-card"
                  role="button"
                  tabIndex={0}
                  aria-label={`Lihat piagam ${award.title}`}
                  onClick={() => setSelectedCertificate(award)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedCertificate(award);
                    }
                  }}
                >
                  <div className="portfolio-cert-preview">
                    <SkeletonImage
                      className="portfolio-cert-preview-image"
                      src={award.image}
                      mobileSrc={award.mobileImage}
                      alt={`Piagam ${award.title}`}
                      loading="lazy"
                    />
                    <span className="portfolio-cert-preview-overlay">
                      Lihat piagam
                      <ExternalLink size={18} aria-hidden="true" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Certificate Preview Modal */}
      {selectedCertificate && (
        createPortal(
          <div
            className="portfolio-cert-viewer-backdrop"
            onClick={() => setSelectedCertificate(null)}
          >
            <button
              type="button"
              className="portfolio-cert-viewer-close"
              onClick={() => setSelectedCertificate(null)}
              aria-label="Tutup sertifikat"
            >
              <X size={30} />
            </button>
            <div
              className="portfolio-cert-viewer"
              role="dialog"
              aria-modal="true"
              aria-label={selectedCertificate.title}
              onClick={(event) => event.stopPropagation()}
            >
              <SkeletonImage
                className="portfolio-cert-viewer-image"
                src={selectedCertificate.image}
                mobileSrc={selectedCertificate.mobileImage}
                alt={selectedCertificate.title}
              />
            </div>
          </div>,
          document.body,
        )
      )}

    </section>
  );
}
