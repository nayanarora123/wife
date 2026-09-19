'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  subtitle: string;
  body: string;
}

export default function YesCelebration({ title, subtitle, body }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let confetti: ((opts: object) => void) | null = null;
    
    import('canvas-confetti').then((module) => {
      confetti = module.default;
      
      const canvas = canvasRef.current;
      if (!canvas || !confetti) return;

      const myConfetti = module.create(canvas, { resize: true, useWorker: true });
      
      const fire = (particleRatio: number, opts: object) => {
        myConfetti({
          ...opts,
          origin: { y: 0.6 },
          particleCount: Math.floor(200 * particleRatio),
          spread: 80,
          startVelocity: 45,
        });
      };

      const launch = () => {
        fire(0.25, { angle: 55, spread: 55, startVelocity: 60, colors: ['#D94F73', '#F9D8E1', '#9E2F50', '#FFFFFF', '#FFD700'] });
        fire(0.20, { angle: 125, spread: 55, startVelocity: 55, colors: ['#D94F73', '#F9D8E1', '#9E2F50', '#FFFFFF'] });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#D94F73', '#F9D8E1'] });
        fire(0.10, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ['#FFD700', '#FFFFFF'] });
        fire(0.10, { spread: 120, startVelocity: 45, colors: ['#D94F73', '#9E2F50'] });
      };

      // Initial burst
      launch();
      // Repeat
      const t1 = setTimeout(launch, 800);
      const t2 = setTimeout(launch, 1600);

      return () => { clearTimeout(t1); clearTimeout(t2); };
    });
  }, []);

  // Floating hearts
  const hearts = [
    { id: 0, x: 8, delay: 0.2, duration: 4.5 },
    { id: 1, x: 18, delay: 1.2, duration: 3.8 },
    { id: 2, x: 28, delay: 0.5, duration: 5.2 },
    { id: 3, x: 38, delay: 1.8, duration: 4.0 },
    { id: 4, x: 48, delay: 0.8, duration: 3.5 },
    { id: 5, x: 58, delay: 1.5, duration: 4.8 },
    { id: 6, x: 68, delay: 0.3, duration: 5.0 },
    { id: 7, x: 78, delay: 1.0, duration: 3.6 },
    { id: 8, x: 88, delay: 0.6, duration: 4.2 },
    { id: 9, x: 94, delay: 1.6, duration: 4.6 },
  ];

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, var(--color-bg) 0%, #fff0f6 50%, var(--color-bg) 100%)' }}
    >
      {/* Confetti canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 50 }}
      />

      {/* Floating hearts */}
      {hearts.map(h => (
        <div
          key={h.id}
          className="absolute bottom-0 pointer-events-none text-3xl"
          style={{
            left: `${h.x}%`,
            animation: `floatUp ${h.duration}s ${h.delay}s ease-in infinite`,
          }}
        >
          ❤️
        </div>
      ))}

      <div className="section-wrapper text-center relative z-10">
        {/* Ring */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
          className="text-7xl mb-6"
        >
          💍
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-4xl sm:text-5xl font-bold mb-4 gradient-text"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-lg mb-6"
          style={{ color: 'var(--color-muted)' }}
        >
          {subtitle}
        </motion.p>

        {/* Body */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="card p-8 max-w-sm mx-auto"
        >
          <p
            className="text-2xl font-bold leading-relaxed"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
          >
            {body}
          </p>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-5xl mt-6"
          >
            ❤️
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
