import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Menu, X, Volume2, VolumeX, Send } from 'lucide-react';
import { useSound } from '../context/SoundContext';
import GlassSurface from './GlassSurface';
import '../style/Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('Home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [clickRevision, setClickRevision] = useState(0);
  const [clickRipple, setClickRipple] = useState(null);
  const { soundEnabled, toggleSound } = useSound();
  const navItemsRef = useRef([]);
  const activePillRef = useRef(null);
  const rippleSequenceRef = useRef(0);

  const navLinks = [
    { name: 'Home', href: '#Home' },
    { name: 'About', href: '#About' },
    { name: 'Hobby', section: 'Projects', href: '#Projects' },
    { name: 'Contact', href: '#Contact' },
  ];
  const activeLinkIndex = Math.max(
    0,
    navLinks.findIndex(link => (link.section || link.name) === activeSection),
  );
  const highlightedLinkIndex = selectedLink ?? activeLinkIndex;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ['Home', 'About', 'Projects', 'Contact'];
      const activationLine = window.innerHeight * 0.38;
      let currentSection = sections[0];

      sections.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (section && section.getBoundingClientRect().top <= activationLine) {
          currentSection = sectionId;
        }
      });

      setActiveSection(currentSection);
      const currentLinkIndex = navLinks.findIndex(link => (link.section || link.name) === currentSection);
      setSelectedLink(selected => (selected === currentLinkIndex ? null : selected));
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
    const activePill = activePillRef.current;
    const targetLink = navItemsRef.current[highlightedLinkIndex];
    if (!activePill || !targetLink) return undefined;

    const x = targetLink.offsetLeft;
    const width = targetLink.offsetWidth;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(activePill, { x, width, opacity: 1, scaleX: 1, scaleY: 1 });
      return undefined;
    }

    const currentX = Number(gsap.getProperty(activePill, 'x')) || 0;
    const distance = Math.abs(x - currentX);
    const stretch = Math.min(1.2, 1 + distance / 500);
    const directionClass = x >= currentX ? 'is-moving-forward' : 'is-moving-backward';
    activePill.classList.remove('is-long-jump', 'is-moving-forward', 'is-moving-backward');
    if (distance > 140) {
      activePill.classList.add('is-long-jump', directionClass);
    }

    const animation = gsap.timeline({
      onComplete: () => activePill.classList.remove('is-long-jump', 'is-moving-forward', 'is-moving-backward'),
    })
      .to(activePill, {
        x,
        width,
        opacity: 1,
        scaleX: stretch,
        scaleY: 1.08,
        duration: 0.42,
        ease: 'power3.out',
      })
      .to(activePill, {
        scaleX: 1,
        scaleY: 1,
        duration: 0.45,
        ease: 'elastic.out(1, 0.65)',
      });

    return () => {
      animation.kill();
      activePill.classList.remove('is-long-jump', 'is-moving-forward', 'is-moving-backward');
    };
  }, [activeSection, highlightedLinkIndex, clickRevision]);

  const scrollTo = (e, href, linkIndex) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      if (linkIndex !== undefined) {
        setSelectedLink(linkIndex === activeLinkIndex ? null : linkIndex);
        setClickRevision(revision => revision + 1);
        const bounds = e.currentTarget.getBoundingClientRect();
        setClickRipple({
          id: ++rippleSequenceRef.current,
          linkIndex,
          x: e.detail === 0 ? bounds.width / 2 : e.clientX - bounds.left,
          y: e.detail === 0 ? bounds.height / 2 : e.clientY - bounds.top,
        });
      }
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`navbar-root ${scrolled ? 'navbar-scrolled' : ''}`}>
      <GlassSurface
        className="navbar-container"
        width="var(--navbar-width)"
        height="auto"
        borderRadius={999}
        blur={14}
        distortionScale={-70}
        displace={0.25}
        greenOffset={4}
        blueOffset={8}
        backgroundOpacity={scrolled ? 0.12 : 0.08}
      >
        {/* Desktop Nav Items */}
        <nav className="navbar-links">
          <span ref={activePillRef} className="navbar-active-pill" aria-hidden="true" />
          {navLinks.map((link, index) => {
            const isActive = activeSection === (link.section || link.name);
            return (
              <a
                key={link.name}
                ref={element => { navItemsRef.current[index] = element; }}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href, index)}
                className={`navbar-link-item ${isActive ? 'is-active' : ''}`}
              >
                <span>{link.name}</span>
                {clickRipple?.linkIndex === index && (
                  <span
                    key={clickRipple.id}
                    className="navbar-click-ripple"
                    style={{ left: clickRipple.x, top: clickRipple.y }}
                    onAnimationEnd={() => {
                      setClickRipple(current => (current?.id === clickRipple.id ? null : current));
                    }}
                    aria-hidden="true"
                  />
                )}
              </a>
            );
          })}
        </nav>

        <span className="navbar-mobile-brand" aria-label="Azizdev.">Azizdev.</span>

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
      </GlassSurface>

      {/* Mobile Drawer Menu */}
      <div className={`navbar-mobile-menu ${mobileOpen ? 'is-open' : ''}`}>
        <GlassSurface
          className="navbar-mobile-glass"
          width="100%"
          height="auto"
          borderRadius={20}
          blur={14}
          distortionScale={-70}
          displace={0.25}
          greenOffset={4}
          blueOffset={8}
          backgroundOpacity={0.08}
        >
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
        </GlassSurface>
      </div>
    </header>
  );
}
