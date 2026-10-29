import { useEffect, useState } from 'react';
import Particles from './Particles';

const METEORS = [
  { top: '-8%', left: '8%', duration: '9s', delay: '-3s' },
  { top: '-12%', left: '35%', duration: '11s', delay: '-9s' },
  { top: '12%', left: '-10%', duration: '10s', delay: '-6s' },
  { top: '28%', left: '4%', duration: '12s', delay: '-10s' },
  { top: '-14%', left: '54%', duration: '10s', delay: '-2s' },
  { top: '-6%', left: '78%', duration: '12s', delay: '-7s' },
  { top: '8%', left: '18%', duration: '11s', delay: '-5s' },
  { top: '22%', left: '-8%', duration: '9s', delay: '-8s' },
  { top: '-10%', left: '92%', duration: '13s', delay: '-11s' },
  { top: '36%', left: '-12%', duration: '11s', delay: '-4s' },
  { top: '-18%', left: '43%', duration: '8s', delay: '-6s' },
  { top: '4%', left: '3%', duration: '12s', delay: '-1s' },
  { top: '16%', left: '30%', duration: '10s', delay: '-9s' },
  { top: '30%', left: '-6%', duration: '13s', delay: '-12s' },
  { top: '-5%', left: '65%', duration: '9s', delay: '-4s' },
];

export default function ParticleBackground() {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia('(max-width: 767px)').matches,
  );
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const updateMobile = () => setIsMobile(mobileQuery.matches);
    mobileQuery.addEventListener('change', updateMobile);
    return () => mobileQuery.removeEventListener('change', updateMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) return undefined;

    let scrollTimeout;
    const pauseDuringScroll = () => {
      setIsScrolling(true);
      window.clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => setIsScrolling(false), 120);
    };

    window.addEventListener('scroll', pauseDuringScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', pauseDuringScroll);
      window.clearTimeout(scrollTimeout);
    };
  }, [isMobile]);

  return (
    <>
      <Particles
        particleColors={['#ffffff', '#ffffff', '#ffffff']}
        particleCount={isMobile ? 280 : 660}
        pixelRatio={isMobile ? 1 : undefined}
        particleSpread={10}
        speed={0.01}
        particleBaseSize={40}
        glow={0.05}
        twinkle={0}
        moveParticlesOnHover={false}
        hoverEffect="parallax"
        sizeRandomness={2}
        shape="circle"
        depthOfField={0}
        connections={false}
        connectionDistance={110}
        particleHoverFactor={1}
        hoverRadius={140}
        drift="up"
        driftSpeed={0.6}
        alphaParticles
        disableRotation
        cameraDistance={20}
        variation={0}
        opacity={1}
        paused={isMobile && isScrolling}
        clickBurst={false}
        intro={false}
        lightMode={false}
        className="particles-background"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <div className="meteor-background" aria-hidden="true">
        {METEORS.map((meteor, index) => (
          <span
            key={index}
            className="meteor"
            style={{
              '--meteor-top': meteor.top,
              '--meteor-left': meteor.left,
              '--meteor-duration': meteor.duration,
              '--meteor-delay': meteor.delay,
            }}
          />
        ))}
      </div>
    </>
  );
}
