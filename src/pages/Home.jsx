import React, { useRef, useState } from 'react';
import WelcomeScreen from '../components/WelcomeScreen';
import ParticleBackground from '../components/ParticleBackground';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import ExperienceEducation from '../components/ExperienceEducation';
import SpotifyPlaylist from '../components/SpotifyPlaylist';
import PortfolioSection from '../components/PortfolioSection';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import usePortfolioAnimations from '../hooks/usePortfolioAnimations';

export default function Home({ onOpenProject }) {
  const homeRef = useRef(null);
  const [introFinished, setIntroFinished] = useState(
    () => sessionStorage.getItem('portfolio-intro-finished') === 'true',
  );
  usePortfolioAnimations(homeRef, introFinished);

  const finishIntro = () => {
    sessionStorage.setItem('portfolio-intro-finished', 'true');
    setIntroFinished(true);
  };

  return (
    <div ref={homeRef} className="home-page-container">
      <div className="gsap-ambient" aria-hidden="true">
        <span className="gsap-ambient-orb gsap-ambient-orb-one" />
        <span className="gsap-ambient-orb gsap-ambient-orb-two" />
        <span className="gsap-ambient-orb gsap-ambient-orb-three" />
      </div>
      {introFinished && <ParticleBackground />}
      <div className="home-ui-scale">
        {!introFinished && <WelcomeScreen onComplete={finishIntro} />}

        <Navbar />

        <main>
          <Hero introFinished={introFinished} />
          <About />
          <ExperienceEducation />
          <SpotifyPlaylist />
          <PortfolioSection onOpenProject={onOpenProject} />
          <Contact />
        </main>

        <Footer />
      </div>
    </div>
  );
}
