import { useCallback, useEffect, useRef } from 'react';
import '../style/BorderGlow.css';

const GRADIENT_POSITIONS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
const GRADIENT_KEYS = [
  '--gradient-one',
  '--gradient-two',
  '--gradient-three',
  '--gradient-four',
  '--gradient-five',
  '--gradient-six',
  '--gradient-seven',
];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

const parseHSL = (value) => {
  const match = value.match(/([\d.]+)\s+([\d.]+)%?\s+([\d.]+)%?/);
  if (!match) return { hue: 40, saturation: 80, lightness: 80 };
  return {
    hue: Number.parseFloat(match[1]),
    saturation: Number.parseFloat(match[2]),
    lightness: Number.parseFloat(match[3]),
  };
};

const buildGlowVars = (glowColor, intensity) => {
  const { hue, saturation, lightness } = parseHSL(glowColor);
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ['', '-60', '-50', '-40', '-30', '-20', '-10'];
  return Object.fromEntries(opacities.map((opacity, index) => [
    `--glow-color${keys[index]}`,
    `hsl(${hue}deg ${saturation}% ${lightness}% / ${Math.min(opacity * intensity, 100)}%)`,
  ]));
};

const buildGradientVars = (colors) => {
  const safeColors = colors.length ? colors : ['#c084fc'];
  const vars = Object.fromEntries(GRADIENT_KEYS.map((key, index) => {
    const color = safeColors[Math.min(COLOR_MAP[index], safeColors.length - 1)];
    return [key, `radial-gradient(at ${GRADIENT_POSITIONS[index]}, ${color} 0px, transparent 50%)`];
  }));
  vars['--gradient-base'] = `linear-gradient(${safeColors[0]} 0 100%)`;
  return vars;
};

const isLightColor = (color) => {
  const value = color.trim().replace('#', '');
  if (!/^[\da-f]{3}([\da-f]{3})?$/i.test(value)) return false;
  const hex = value.length === 3 ? value.split('').map((character) => character + character).join('') : value;
  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);
  return red * 0.2126 + green * 0.7152 + blue * 0.0722 > 180;
};

export default function BorderGlow({
  as: Component = 'div',
  children,
  className = '',
  style,
  edgeSensitivity = 30,
  glowColor = '40 80 80',
  backgroundColor = '#120F17',
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1,
  coneSpread = 25,
  animated = false,
  colors = ['#c084fc', '#f472b6', '#38bdf8'],
  fillOpacity = 0.5,
  ...rest
}) {
  const cardRef = useRef(null);

  const getCenter = useCallback((element) => {
    const { width, height } = element.getBoundingClientRect();
    return [width / 2, height / 2];
  }, []);

  const updatePointer = useCallback((event) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const [centerX, centerY] = getCenter(card);
    const dx = x - centerX;
    const dy = y - centerY;
    const ratioX = dx === 0 ? Infinity : centerX / Math.abs(dx);
    const ratioY = dy === 0 ? Infinity : centerY / Math.abs(dy);
    const edgeProximity = Math.min(Math.max(1 / Math.min(ratioX, ratioY), 0), 1);
    const angle = dx === 0 && dy === 0
      ? 0
      : (Math.atan2(dy, dx) * (180 / Math.PI) + 450) % 360;

    card.style.setProperty('--edge-proximity', `${(edgeProximity * 100).toFixed(3)}`);
    card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
  }, [getCenter]);

  useEffect(() => {
    if (!animated || !cardRef.current) return undefined;
    const card = cardRef.current;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;

    const start = performance.now();
    const cycleDuration = 5000;
    let frame = 0;

    const animate = (now) => {
      const progress = ((now - start) % cycleDuration) / cycleDuration;
      card.classList.add('sweep-active');
      card.style.setProperty('--cursor-angle', `${110 + 360 * progress}deg`);
      card.style.setProperty('--edge-proximity', '100');

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      card.classList.remove('sweep-active');
    };
  }, [animated]);

  const sensitivity = Math.min(Math.max(edgeSensitivity, 0), 79);
  const glowVars = buildGlowVars(glowColor, Math.max(0, glowIntensity));
  const gradientVars = buildGradientVars(colors);

  return (
    <Component
      ref={cardRef}
      onPointerMove={updatePointer}
      className={`border-glow-card${isLightColor(backgroundColor) ? ' border-glow-card--light' : ''}${className ? ` ${className}` : ''}`}
      style={{
        '--card-bg': backgroundColor,
        '--edge-sensitivity': sensitivity,
        '--border-radius': `${borderRadius}px`,
        '--glow-padding': `${glowRadius}px`,
        '--cone-spread': Math.min(Math.max(coneSpread, 0), 100),
        '--fill-opacity': Math.min(Math.max(fillOpacity, 0), 1),
        ...glowVars,
        ...gradientVars,
        ...style,
      }}
      {...rest}
    >
      <span className="edge-light" aria-hidden="true" />
      <div className="border-glow-inner">
        {children}
      </div>
    </Component>
  );
}
