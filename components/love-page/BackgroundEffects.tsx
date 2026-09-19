'use client';

import { useEffect, useRef, useState } from 'react';

type EffectType = 'hearts' | 'dots' | 'sparkles' | 'petals';

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  content: string;
  opacity: number;
  wobble: number;
}

interface Props {
  type: EffectType;
  density: number; // 1–10
  speed: number;   // 1–10
}

const HEART_CHARS = ['❤️', '💕', '💗', '💖', '💝', '🩷'];
const SPARKLE_CHARS = ['✨', '⭐', '💫', '🌟', '✦', '✧'];
const PETAL_CHARS = ['🌸', '🌺', '🌷', '🌹', '💐'];

function getContent(type: EffectType): string {
  switch (type) {
    case 'hearts': return HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)];
    case 'sparkles': return SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)];
    case 'petals': return PETAL_CHARS[Math.floor(Math.random() * PETAL_CHARS.length)];
    default: return '•';
  }
}

export default function BackgroundEffects({ type, density, speed }: Props) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const counterRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const spawnInterval = Math.max(300, 3000 - density * 250);
  const baseDuration = Math.max(4, 12 - speed);

  useEffect(() => {
    const spawn = () => {
      const id = counterRef.current++;
      const particle: Particle = {
        id,
        x: Math.random() * 100,
        size: type === 'dots' ? Math.random() * 8 + 4 : Math.random() * 16 + 14,
        duration: baseDuration + Math.random() * 4,
        delay: Math.random() * 0.5,
        content: getContent(type),
        opacity: Math.random() * 0.4 + 0.3,
        wobble: (Math.random() - 0.5) * 60,
      };
      setParticles(prev => [...prev.slice(-30), particle]);
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== id));
      }, (particle.duration + particle.delay + 1) * 1000);
    };

    spawn();
    intervalRef.current = setInterval(spawn, spawnInterval);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [type, spawnInterval, baseDuration]);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
      style={{ zIndex: 1 }}
    >
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute bottom-0"
          style={{
            left: `${p.x}%`,
            fontSize: type === 'dots' ? `${p.size}px` : `${p.size}px`,
            opacity: p.opacity,
            animation: `floatUp ${p.duration}s ${p.delay}s linear forwards`,
            willChange: 'transform, opacity',
            lineHeight: 1,
            color: type === 'dots' ? 'var(--color-border)' : undefined,
          }}
        >
          {type === 'dots' ? '●' : p.content}
        </div>
      ))}
    </div>
  );
}
