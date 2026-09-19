'use client';

import { motion } from 'framer-motion';
import type { LovePage } from '@/types';

interface Props {
  page: LovePage;
  onEnter: () => void;
}

const floatingHearts = [
  { id: 0, x: 12, duration: 5.5, delay: 0.5, size: 20 },
  { id: 1, x: 24, duration: 6.8, delay: 1.8, size: 28 },
  { id: 2, x: 38, duration: 4.8, delay: 0.2, size: 18 },
  { id: 3, x: 52, duration: 7.2, delay: 2.2, size: 24 },
  { id: 4, x: 65, duration: 5.0, delay: 1.1, size: 30 },
  { id: 5, x: 76, duration: 6.2, delay: 0.8, size: 22 },
  { id: 6, x: 88, duration: 4.5, delay: 2.5, size: 26 },
  { id: 7, x: 95, duration: 7.0, delay: 1.5, size: 18 },
];

export default function TapToEnter({ page, onEnter }: Props) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, var(--color-bg) 0%, #fff 50%, var(--color-bg) 100%)',
      }}
      onClick={onEnter}
    >
      {/* Background floating hearts */}
      {floatingHearts.map(h => (
        <div
          key={h.id}
          className="absolute bottom-0 pointer-events-none"
          style={{
            left: `${h.x}%`,
            fontSize: `${h.size}px`,
            opacity: 0.25,
            animation: `floatUp ${h.duration}s ${h.delay}s linear infinite`,
          }}
        >
          ❤️
        </div>
      ))}

      {/* Center content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-center px-8 relative z-10"
      >
        {/* Pulsing heart */}
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="text-6xl mb-8"
        >
          💗
        </motion.div>

        {/* Title */}
        <h1
          className="text-3xl md:text-4xl font-bold mb-3 leading-tight"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text)',
          }}
        >
          {page.title || 'Something Special'}
        </h1>

        {/* Subtitle */}
        {page.subtitle && (
          <p
            className="text-base mb-10 max-w-xs mx-auto leading-relaxed"
            style={{ color: 'var(--color-muted)' }}
          >
            {page.subtitle}
          </p>
        )}

        {/* Tap to enter pill */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div
            className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-full cursor-pointer"
            style={{
              background: 'var(--color-button)',
              color: 'var(--color-button-text)',
              boxShadow: '0 8px 32px rgba(217, 79, 115, 0.3)',
            }}
          >
            <span>💝</span>
            <span>Tap to open</span>
          </div>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-10 text-xs"
          style={{ color: 'var(--color-muted)' }}
        >
          Made with love ❤️
        </motion.p>
      </motion.div>

      {/* Bottom gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, var(--color-bg), transparent)',
        }}
      />
    </motion.div>
  );
}
