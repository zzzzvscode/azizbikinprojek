import React, { useRef } from 'react';
import { FileText } from 'lucide-react';
import portrait from '../assets/orangAbout/me.png';
import spiderSuit from '../assets/orangAbout/spiderman.png';
import SkeletonImage from './SkeletonImage';
import '../style/About.css';

export default function About() {
  const portraitStageRef = useRef(null);

  const handlePortraitPointerMove = event => {
    const stage = portraitStageRef.current;
    const portraitFrame = stage?.querySelector('.about-portrait');
    const spiderImage = stage?.querySelector('.about-spider-image');
    if (!stage || !portraitFrame || !spiderImage) return;

    const bounds = portraitFrame.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;

    const scale = Number.parseFloat(window.getComputedStyle(spiderImage).getPropertyValue('--spider-scale')) || 1;
    const pointerX = (event.clientX - bounds.left) / bounds.width;
    const pointerY = (event.clientY - bounds.top) / bounds.height;
    const x = (0.5 + (pointerX - 0.5) / scale) * 100;
    const y = (1 + (pointerY - 1) / scale) * 100;
    stage.style.setProperty('--hover-x', `${x}%`);
    stage.style.setProperty('--hover-y', `${y}%`);
    stage.classList.add('spider-hovered');
    stage.dataset.spiderVisible = 'true';
  };

  const handlePortraitPointerLeave = () => {
    const stage = portraitStageRef.current;
    if (!stage) return;

    stage.classList.remove('spider-hovered');
    delete stage.dataset.spiderVisible;
  };

  return (
    <section className="about-root-section" id="About" aria-labelledby="about-section-heading">
      <h2 className="section-display-title" id="about-section-heading">About Me</h2>
      <div className="about-container-inner">
        <div className="about-intro">
          <h2 className="about-title" id="about-title">
            <span className="about-title-greeting">Hi, I&apos;m</span>
            <span>Firmansyah<br />Aziz Rasya Mahendra</span>
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
            <SkeletonImage className="about-person-image" src={portrait} alt="Firmansyah Aziz Rasya Mahendra" />
            <SkeletonImage
              className="about-spider-image"
              src={spiderSuit}
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
            Saya adalah <strong>DJ</strong> yang berfokus pada pengembangan teknologi interaktif,
            audio digital, dan performa musik. Saya senang memadukan kode, beat, dan hardware untuk
            membangun pengalaman digital serta panggung live yang berkesan.
          </p>
          <p>
            Dengan algoritma, synthesizer, dan teknologi web modern, saya mengubah baris kode
            menjadi harmoni, memadukan teknologi untuk menciptakan inovasi digital yang interaktif dan dinamis.
          </p>
        </div>
      </div>
    </section>
  );
}
