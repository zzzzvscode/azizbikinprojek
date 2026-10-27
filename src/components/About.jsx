import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, Code2, FileText } from 'lucide-react';
import portrait from '../assets/orangAbout/me2.png';
import spiderSuit from '../assets/orangAbout/PhotoSpiderman.png';
import mobileSpiderSuit from '../assets/orangAbout/PhotoSpiderman-mobile.webp';
import SkeletonImage from './SkeletonImage';
import '../style/About.css';

export default function About() {
  const aboutSectionRef = useRef(null);
  const portraitStageRef = useRef(null);
  const idleAnimationTimeoutRef = useRef(null);

  useEffect(() => {
    const section = aboutSectionRef.current;
    const stage = portraitStageRef.current;
    if (!section || !stage) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        stage.classList.toggle('is-in-view', entry.isIntersecting);
        if (!entry.isIntersecting) {
          clearTimeout(idleAnimationTimeoutRef.current);
          stage.classList.remove('spider-hovered');
          delete stage.dataset.spiderVisible;
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      clearTimeout(idleAnimationTimeoutRef.current);
    };
  }, []);

  const handlePortraitPointerMove = event => {
    const stage = portraitStageRef.current;
    const portraitFrame = stage?.querySelector('.about-portrait');
    if (!stage || !portraitFrame) return;

    clearTimeout(idleAnimationTimeoutRef.current);
    const bounds = portraitFrame.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    stage.style.setProperty('--hover-x', `${x}%`);
    stage.style.setProperty('--hover-y', `${y}%`);
    stage.classList.add('spider-hovered');
    stage.dataset.spiderVisible = 'true';
  };

  const handlePortraitPointerLeave = () => {
    const stage = portraitStageRef.current;
    if (!stage) return;

    delete stage.dataset.spiderVisible;
    clearTimeout(idleAnimationTimeoutRef.current);
    idleAnimationTimeoutRef.current = setTimeout(() => {
      stage.classList.remove('spider-hovered');
    }, 7000);
  };

  return (
    <section ref={aboutSectionRef} className="about-root-section" id="About" aria-labelledby="about-section-heading">
      <h2 className="section-display-title" id="about-section-heading">About Me</h2>
      <div className="about-container-inner">
        <div className="about-intro">
          <h2 className="about-title" id="about-title">
            <span className="about-title-greeting">Hi, I&apos;m</span>
            <span>Muhammad<br />Al-Fari Yusuf</span>
          </h2>
          <a href="#Contact" className="about-action about-action-primary">
            <FileText size={17} />
            <span>Hubungi Saya</span>
          </a>
        </div>

        <div
          ref={portraitStageRef}
          className="about-portrait-stage"
          aria-label="Portrait with Spider-Man suit hover effect"
          onPointerMove={handlePortraitPointerMove}
          onPointerLeave={handlePortraitPointerLeave}
        >
          <div className="about-portrait-glow" />
          <div className="about-portrait">
            <SkeletonImage className="about-person-image" src={portrait} alt="Muhammad Al-Fari Yusuf" />
            <SkeletonImage
              className="about-spider-image"
              src={spiderSuit}
              mobileSrc={mobileSpiderSuit}
              alt=""
              aria-hidden="true"
            />
          </div>
          <span className="about-portrait-orbit about-portrait-orbit-one" />
          <span className="about-portrait-orbit about-portrait-orbit-two" />
          <span className="about-portrait-spark" />
        </div>

        <div className="about-bio">
          <p>
            Saya adalah <strong>Junior Developer</strong> yang berfokus pada pengembangan
            teknologi yang fungsional sekaligus menarik. Saya senang memadukan kode,
            desain, dan pengalaman 3D untuk membangun produk digital yang berkesan.
          </p>
          <p>
            Dengan React, Three.js, dan teknologi web modern, saya mengubah ide menjadi
            pengalaman digital yang intuitif, responsif, dan berdampak.
          </p>
          <a href="#Portofolio" className="about-action about-action-secondary">
            <Code2 size={17} />
            <span>Lihat Projek</span>
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
