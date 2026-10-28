import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Send, Download, Sparkles } from 'lucide-react';
import { GithubIcon, InstagramIcon, TikTokIcon, LinkedInIcon } from './BrandIcons';
import LanyardCard from './LanyardCard';
import '../style/Hero.css';

const ROLES = [
  '3D Creative Developer',
  'React & Three.js Enthusiast',
  'Junior Developer',
  'Web Development',
];

export default function Hero({ lanyardIntroStarted }) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  // Typewriter effect matching reference
  const handleTypewriter = useCallback(() => {
    const currentRole = ROLES[roleIndex];
    if (isTyping) {
      if (charIndex < currentRole.length) {
        setDisplayText((prev) => prev + currentRole[charIndex]);
        setCharIndex((prev) => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), 2000);
      }
    } else {
      if (charIndex > 0) {
        setDisplayText((prev) => prev.slice(0, -1));
        setCharIndex((prev) => prev - 1);
      } else {
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, roleIndex]);

  useEffect(() => {
    const speed = isTyping ? 90 : 45;
    const timer = setTimeout(handleTypewriter, speed);
    return () => clearTimeout(timer);
  }, [handleTypewriter, isTyping]);

  const socials = [
    {
      icon: GithubIcon,
      link: 'https://github.com/gyzeennnpro-sudo',
      label: 'GitHub',
    },
    // {
    //   icon: LinkedInIcon,
    //   link: 'https://www.linkedin.com/in/eka-wahyu-maulidan-484021315',
    //   label: 'LinkedIn',
    // },
    {
      icon: InstagramIcon,
      link: 'https://www.instagram.com/alfariyusuff_/',
      label: 'Instagram',
    },
    {
      icon: TikTokIcon,
      link: 'https://www.tiktok.com/@mie_ayamm__3',
      label: 'TikTok',
    },
  ];

  return (
    <section className="hero-root-section" id="Home">
      <LanyardCard introFinished={lanyardIntroStarted} />
      <div className="hero-container-inner">
        {/* Left Column: Narrative, Typography & CTAs */}
        <div className="hero-text-col">

          {/* Heading */}
          <div className="hero-heading-group">
            <h1 className="hero-h1-gradient">Welcome to</h1>
            <h1 className="hero-h1-white">My Portfolio</h1>
          </div>

          {/* Typewriter text */}
          <div className="hero-typewriter-row">
            <span className="hero-typewriter-text">{displayText}</span>
            <span className="hero-typewriter-cursor" />
          </div>

          {/* Narrative Paragraph */}
          <p className="hero-description-copy">
            Berawal dari rasa penasaran, sekarang jadi passion. Aku suka bereksperimen dengan kode, mengeksplorasi teknologi baru, dan mengubah ide menjadi sesuatu yang nyata. Dari tampilan web yang menarik sampai interaksi 3D yang seru, aku selalu berusaha bikin sesuatu yang bukan cuma keren dilihat, tapi juga nyaman digunakan.
          </p>

          {/* Action Buttons */}
          <div className="hero-action-row">
            <a href="#Portofolio" className="hero-btn-primary">
              <span>Lihat Projek</span>
              <ArrowRight size={16} />
            </a>

            <a href="#Contact" className="hero-btn-secondary">
              <span>Hubungi Saya</span>
              <Send size={15} />
            </a>
          </div>

          {/* Social Links */}
          <div className="hero-find-me-wrap">
            <span className="hero-find-me-label">Find me</span>
            <div className="hero-social-buttons">
              {socials.map((soc) => {
                const IconComponent = soc.icon;
                return (
                  <a
                    key={soc.label}
                    href={soc.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero-social-icon-btn"
                    aria-label={soc.label}
                    title={soc.label}
                  >
                    <IconComponent size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
