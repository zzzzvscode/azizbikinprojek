import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { Menu, X, Volume2, VolumeX, Send } from 'lucide-react';
import { useSound } from '../context/SoundContext';
import '../style/Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('Home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { soundEnabled, toggleSound } = useSound();

  const navLinks = [
    { name: 'Home', href: '#Home' },
    { name: 'About', href: '#About' },
    { name: 'Portfolio', section: 'Portofolio', href: '#Portofolio' },
    { name: 'Contact', href: '#Contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ['Home', 'About', 'Portofolio', 'Contact'];
      const activationLine = window.innerHeight * 0.38;
      let currentSection = sections[0];

      sections.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (section && section.getBoundingClientRect().top <= activationLine) {
          currentSection = sectionId;
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const activePill = document.querySelector('.navbar-link-item.is-active .navbar-active-pill');
    if (!activePill) return undefined;

    const intro = gsap.fromTo(
      activePill,
      { autoAlpha: 0, scale: 0.82 },
      { autoAlpha: 1, scale: 1, duration: 0.55, ease: 'back.out(2)' },
    );
    const glow = gsap.to(activePill, {
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,.18), 0 0 28px rgba(59,130,246,.36)',
      duration: 1.5,
      delay: 0.55,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    return () => {
      intro.kill();
      glow.kill();
      gsap.set(activePill, { clearProps: 'all' });
    };
  }, [activeSection]);

  const scrollTo = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`navbar-root ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Desktop Nav Items */}
        <nav className="navbar-links">
          {navLinks.map((link) => {
            const isActive = activeSection === (link.section || link.name);
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                className={`navbar-link-item ${isActive ? 'is-active' : ''}`}
              >
                <span>{link.name}</span>
                {isActive && <span className="navbar-active-pill" />}
              </a>
            );
          })}
        </nav>

        <span className="navbar-mobile-brand" aria-label="AlfariDev.">AlfariDev.</span>

        {/* Sound and appearance controls */}
        <div className="navbar-actions">
          <span className="navbar-actions-divider" aria-hidden="true" />
          <button
            type="button"
            onClick={toggleSound}
            className="navbar-icon-btn"
            title={soundEnabled ? 'Matikan Suara SFX' : 'Nyalakan Suara SFX'}
            aria-label={soundEnabled ? 'Matikan suara' : 'Nyalakan suara'}
            aria-pressed={soundEnabled}
          >
            {soundEnabled ? <Volume2 size={16} className="text-blue-400" /> : <VolumeX size={16} />}
          </button>

          {/* <ThemeToggle /> */}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="navbar-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`navbar-mobile-menu ${mobileOpen ? 'is-open' : ''}`}>
        <div className="navbar-mobile-inner">
          {navLinks.map((link) => {
            const isActive = activeSection === (link.section || link.name);
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                className={`navbar-mobile-link ${isActive ? 'is-active' : ''}`}
              >
                <span>{link.name}</span>
                {isActive && <span className="navbar-mobile-indicator" />}
              </a>
            );
          })}

          <div className="navbar-mobile-footer">
            <a
              href="#Contact"
              onClick={(e) => scrollTo(e, '#Contact')}
              className="navbar-mobile-cta"
            >
              <span>Hubungi Saya</span>
              <Send size={14} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
