import React, { useState, useEffect, useCallback } from "react";
import { ArrowRight, Send, Download, Sparkles } from "lucide-react";
import {
  InstagramIcon,
  TikTokIcon,
} from "./BrandIcons";
import LanyardCard from "./LanyardCard";
import "../style/Hero.css";

const ROLES = ["Music", "Tech Enthusiast", "DJ"];

export default function Hero({ lanyardIntroStarted }) {
  const [displayText, setDisplayText] = useState("");
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
      icon: InstagramIcon,
      link: "https://www.instagram.com/zizzz__z.co",
      label: "Instagram",
    },
    {
      icon: TikTokIcon,
      link: "https://www.tiktok.com/@zizz2511",
      label: "TikTok",
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
            Frekuensi hidup diatur oleh algoritma bass, Setiap ketukan adalah
            sinyal bagi sistemku. Live mixing data di mixer digital, Tinggal di
            dunia tanpa lag dan anti buffering. This is the future of sound.
          </p>

          {/* Action Buttons */}
          <div className="hero-action-row">
            <a href="#About" className="hero-btn-primary">
              <span>Tentang Saya</span>
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
