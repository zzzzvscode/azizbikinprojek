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
      ];

      sectionReveals.forEach(([sectionSelector, titleSelector, contentSelector]) => {
        const section = scope.querySelector(sectionSelector);
        if (section) createSectionReveal(section, titleSelector, contentSelector);
      });

      if (window.matchMedia('(max-width: 900px)').matches) {
        const commentsPanel = scope.querySelector('.contact-comments-panel');
        if (commentsPanel) {
          gsap.fromTo(
            commentsPanel,
            { autoAlpha: 0, y: 24, filter: 'blur(6px)' },
            {
              autoAlpha: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: commentsPanel,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            },
          );
        }
      }
    }, scope);

    ScrollTrigger.refresh();
    return () => {
      cleanups.forEach((cleanup) => cleanup());
      context.revert();
    };
  }, [enabled, scopeRef]);
}
