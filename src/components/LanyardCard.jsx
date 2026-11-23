import React, { lazy, Suspense, useEffect, useState } from 'react';
import frontCardImg from '../assets/lanyard/frontCard.png';
import backCardImg from '../assets/lanyard/backCard.png';
import bandImg from '../assets/lanyard/bandd.png';
import '../style/Lanyard.css';

const Lanyard = lazy(() => import('./Lanyard'));

export default function LanyardCard({ introFinished }) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const updateViewport = (event) => setIsMobile(event.matches);
    mediaQuery.addEventListener('change', updateViewport);
    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, []);

  return (
    <section className={`lanyard-card-container${isMobile ? ' is-mobile' : ''}`} aria-label="Interactive 3D Lanyard">
      <div className="lanyard-viewport">
        <Suspense fallback={null}>
          <Lanyard
            frontImage={frontCardImg}
            backImage={backCardImg}
            strapImage={bandImg}
            cardColor="#04010e09"
            imagePadding={0.035}
            strapColor="#111827"
            finish="glossy"
            anchor={isMobile ? 'center' : 'right'}
            orientation="portrait"
            size={0.62}
            // size={isMobile ? 0.62 : 0.56} mobile kiri, desktop kanan
            cornerRadius={0.25}
            strapLength={0.59}
            strapWidth={0.62}
            gravity={1.2}
            damping={0.35}
            elasticity={0.7}
            breeze={0.1}
            interactive={true}
            autoFlip={true}
            metal="silver"
            intro={introFinished}
          />
        </Suspense>
      </div>
    </section>
  );
}
