'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Section, FinalMessageConfig } from '@/types';

interface Props {
  section: Section;
}

export default function FinalMessage({ section }: Props) {
  const config = section.config as FinalMessageConfig;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const floatingHearts = [
    { id: 0, x: 10, delay: 0, size: 24, duration: 4.0 },
    { id: 1, x: 26, delay: 0.4, size: 30, duration: 3.5 },
    { id: 2, x: 42, delay: 0.8, size: 22, duration: 4.5 },
    { id: 3, x: 58, delay: 0.2, size: 28, duration: 3.8 },
    { id: 4, x: 74, delay: 0.6, size: 20, duration: 4.2 },
    { id: 5, x: 88, delay: 1.0, size: 26, duration: 3.6 },
  ];

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, var(--color-bg) 0%, #fff 60%, var(--color-bg) 100%)',
      }}
    >
      {/* Floating hearts */}
      {config.show_hearts !== false && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingHearts.map(h => (
            <motion.div
              key={h.id}
              className="absolute"
              style={{ left: `${h.x}%`, bottom: '5%', fontSize: `${h.size}px`, opacity: 0.3 }}
              animate={{ y: [0, -30, 0] }}
              transition={{ duration: h.duration, delay: h.delay, repeat: Infinity, ease: 'easeInOut' }}
            >
              ❤️
            </motion.div>
          ))}
        </div>
      )}

      <div className="section-wrapper text-center relative z-10">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="section-heading mb-8"
        >
          {config.heading || 'Thank You for Being with Me ❤️'}
        </motion.h2>

        {/* Body text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="card p-8 sm:p-10 max-w-sm mx-auto mb-8"
        >
          <div
            className="tiptap-content text-base leading-loose space-y-2"
            style={{ color: 'var(--color-text)' }}
            dangerouslySetInnerHTML={{ __html: config.body || '' }}
          />
        </motion.div>

        {/* Signature */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <p
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-secondary)' }}
          >
            {config.signature || '— Nayan'}
          </p>
        </motion.div>

        {/* Final heart */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 1.1, duration: 0.6, type: 'spring' }}
          className="mt-8"
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="text-5xl"
          >
            ❤️
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
