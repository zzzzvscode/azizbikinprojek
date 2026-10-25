import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const revealFromScroll = (scope, selector, trigger, options = {}) => {
  const targets = scope.querySelectorAll(selector);
  if (!targets.length) return;

  gsap.fromTo(
    targets,
    { autoAlpha: 0, y: options.y ?? 34, filter: 'blur(7px)' },
    {
      autoAlpha: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: options.duration ?? 0.8,
      stagger: options.stagger ?? 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger,
        start: options.start ?? 'top 82%',
        toggleActions: 'play reverse play reverse',
      },
    },
  );
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

      const lanyard = scope.querySelector('.lanyard-card-container');
      if (lanyard) {
        gsap.to(lanyard, {
          y: -12,
          duration: 3.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

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

      scope.querySelectorAll('main section:not(.hero-root-section)').forEach((section) => {
        const heading = section.querySelector('.section-display-title');
        if (!heading) return;
        gsap.fromTo(
          heading,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 86%',
              toggleActions: 'play reverse play reverse',
            },
          },
        );
      });

      const about = scope.querySelector('.about-root-section');
      if (about) {
        revealFromScroll(about, '.about-intro, .about-portrait-stage, .about-bio', about, {
          start: 'top 78%',
          y: 38,
          stagger: 0.16,
        });
      }

      const experience = scope.querySelector('.experience-section');
      if (experience) {
        revealFromScroll(experience, '.experience-group, .experience-stat-card', experience, {
          start: 'top 78%',
          y: 32,
          stagger: 0.1,
        });
      }

      const spotify = scope.querySelector('.spotify-section');
      if (spotify) {
        revealFromScroll(spotify, '.spotify-card', spotify, {
          start: 'top 84%',
          y: 28,
          duration: 0.9,
          stagger: 0,
        });
      }

      const portfolio = scope.querySelector('.portfolio-root-section');
      if (portfolio) {
        revealFromScroll(portfolio, '.portfolio-tab-bar, .portfolio-project-card', portfolio, {
          start: 'top 78%',
          y: 42,
          duration: 0.9,
          stagger: 0.14,
        });
      }

      const contact = scope.querySelector('.contact-root-section');
      if (contact) {
        revealFromScroll(contact, '.contact-panel, .contact-comments-panel', contact, {
          start: 'top 78%',
          y: 32,
          stagger: 0.15,
        });
      }

      const footer = scope.querySelector('.footer-root');
      if (footer) {
        revealFromScroll(footer, '.footer-top-row, .footer-bottom-row', footer, {
          start: 'top 90%',
          y: 20,
          stagger: 0.12,
        });
      }
    }, scope);

    ScrollTrigger.refresh();
    return () => {
      cleanups.forEach((cleanup) => cleanup());
      context.revert();
    };
  }, [enabled, scopeRef]);
}
