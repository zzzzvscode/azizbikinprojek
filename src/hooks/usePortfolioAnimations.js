import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SECTION_REVEAL_OFFSET = 120;
const SECTION_CONTENT_REVEAL_DELAY = 90;

const createSectionReveal = (section, titleSelector, contentSelector) => {
  const titles = section.querySelectorAll(titleSelector);
  const content = section.querySelectorAll(contentSelector);
  if (!titles.length && !content.length) return;

  const hiddenState = { autoAlpha: 0, y: 24, filter: 'blur(6px)' };
  const visibleState = { autoAlpha: 1, y: 0, filter: 'blur(0px)' };
  const trigger = titles[0] || section;

  const revealTargets = (targets, delay = 0, stagger = 0.12) => {
    if (!targets.length) return;

    gsap.fromTo(targets, hiddenState, {
      ...visibleState,
      duration: 0.65,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger,
        start: `top bottom-=${SECTION_REVEAL_OFFSET + delay}`,
        toggleActions: 'play none none reverse',
      },
    });
  };

  revealTargets(titles, 0, 0.08);
  revealTargets(content, SECTION_CONTENT_REVEAL_DELAY);
};

export default function usePortfolioAnimations(scopeRef, enabled) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!enabled || !scope) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const cleanups = [];
    const context = gsap.context(() => {
      gsap.utils.toArray('.gsap-ambient-orb', scope).forEach((orb, index) => {
        gsap.to(orb, {
          x: index % 2 === 0 ? 28 : -24,
          y: index === 1 ? -34 : 26,
          scale: index === 2 ? 1.12 : 1.06,
          autoAlpha: index === 1 ? 0.72 : 0.9,
          duration: 7 + index * 1.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * -1.4,
        });
      });

      const hero = scope.querySelector('.hero-root-section');
      if (hero) {
        const page = scope.querySelector('.home-ui-scale');
        const navbar = scope.querySelector('.navbar-root');
        const navLinks = scope.querySelectorAll('.navbar-link-item');
        const lanyard = hero.querySelector('.lanyard-card-container');
        const headings = hero.querySelectorAll('.hero-heading-group h1');
        const typewriter = hero.querySelector('.hero-typewriter-row');
        const description = hero.querySelector('.hero-description-copy');
        const actions = hero.querySelector('.hero-action-row');
        const socials = hero.querySelector('.hero-find-me-wrap');

        if (navbar) gsap.set(navbar, { autoAlpha: 0, y: -20, scale: 0.96 });
        if (navLinks.length) gsap.set(navLinks, { y: -7 });
        if (headings.length) gsap.set(headings, { autoAlpha: 0, y: 42, filter: 'blur(7px)' });
        if (typewriter) gsap.set(typewriter, { autoAlpha: 0, y: 18, filter: 'blur(4px)' });
        if (description) gsap.set(description, { autoAlpha: 0, y: 20, filter: 'blur(4px)' });
        if (actions) gsap.set(actions, { autoAlpha: 0, y: 18 });
        if (socials) gsap.set(socials, { autoAlpha: 0, y: 12 });
        if (lanyard) gsap.set(lanyard, { autoAlpha: 0, y: 28, scale: 0.96 });

        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });

        if (page) {
          gsap.set(page, { y: -22 });
          intro.to(page, {
            y: 0,
            duration: 0.42,
            ease: 'power2.out',
            clearProps: 'transform',
          });
        }

        if (navbar) {
          intro.to(navbar, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: 'back.out(1.7)',
          }, '-=0.02');
        }

        if (navLinks.length) {
          intro.to(navLinks, {
            y: 0,
            duration: 0.28,
            stagger: 0.05,
          }, '-=0.24');
        }

        if (lanyard) {
          intro.to(lanyard, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.72,
            ease: 'power3.out',
          }, '-=0.2');
        }

        if (headings.length) {
          intro.to(headings, {
            y: 0,
            autoAlpha: 1,
            filter: 'blur(0px)',
            duration: 0.68,
            stagger: 0.12,
          }, '-=0.52');
        }

        if (typewriter) {
          intro.to(typewriter, {
            y: 0,
            autoAlpha: 1,
            filter: 'blur(0px)',
            duration: 0.38,
          }, '-=0.12');
        }

        if (description) {
          intro.to(description, {
            y: 0,
            autoAlpha: 1,
            filter: 'blur(0px)',
            duration: 0.48,
          }, '-=0.12');
        }

        if (actions) {
          intro.to(actions, {
            y: 0,
            autoAlpha: 1,
            duration: 0.42,
          }, '-=0.08');
        }

        if (socials) {
          intro.to(socials, {
            y: 0,
            autoAlpha: 1,
            duration: 0.34,
          }, '-=0.12');
        }

        intro.eventCallback('onComplete', () => {
          if (actions) gsap.set(actions, { clearProps: 'transform,opacity,visibility' });
        });
      }

      const sectionReveals = [
        ['.about-root-section', '.section-display-title', '.about-intro, .about-portrait-stage, .about-bio'],
        ['.experience-section', '.experience-group h2', '.experience-card, .experience-stat-card'],
        ['.spotify-section', '.spotify-copy h2', '.spotify-card'],
        [
          '.portfolio-root-section',
          '.section-display-title',
          '.portfolio-tab-bar, .portfolio-projects-view, .portfolio-skills-view, .portfolio-certificates-view, .portfolio-awards-view',
        ],
        ['.contact-root-section', '.section-display-title', '.contact-panel, .contact-comments-panel'],
        [
          '.footer-root',
          '.footer-logo, .footer-col-heading',
          '.footer-tagline, .footer-links-list, .footer-social-row, .footer-bottom-row',
        ],
      ];

      sectionReveals.forEach(([sectionSelector, titleSelector, contentSelector]) => {
        const section = scope.querySelector(sectionSelector);
        if (section) createSectionReveal(section, titleSelector, contentSelector);
      });
    }, scope);

    ScrollTrigger.refresh();
    return () => {
      cleanups.forEach((cleanup) => cleanup());
      context.revert();
    };
  }, [enabled, scopeRef]);
}
