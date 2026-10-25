import { useEffect, useRef } from 'react';
import { liquidMetalFragmentShader, ShaderMount } from '@paper-design/shaders';

export default function LiquidMetalBorder() {
  const shaderContainerRef = useRef(null);

  useEffect(() => {
    const container = shaderContainerRef.current;
    if (!container) return undefined;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const shader = new ShaderMount(
      container,
      liquidMetalFragmentShader,
      {
        u_repetition: 4,
        u_softness: 0.5,
        u_shiftRed: 0.3,
        u_shiftBlue: 0.3,
        u_distortion: 0,
        u_contour: 0,
        u_angle: 45,
        u_scale: 8,
        u_shape: 0,
        u_offsetX: 0.1,
        u_offsetY: -0.1,
      },
      undefined,
      reducedMotionQuery.matches ? 0 : 0.6
    );

    const handleMotionPreferenceChange = event => {
      shader.setSpeed(event.matches ? 0 : 0.6);
    };
    reducedMotionQuery.addEventListener('change', handleMotionPreferenceChange);

    return () => {
      reducedMotionQuery.removeEventListener('change', handleMotionPreferenceChange);
      shader.dispose();
    };
  }, []);

  return <div ref={shaderContainerRef} className="experience-metal-border" aria-hidden="true" />;
}
