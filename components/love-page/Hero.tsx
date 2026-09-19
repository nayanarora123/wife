'use client';

import { motion } from 'framer-motion';
import type { Section, HeroConfig, LovePage } from '@/types';

interface Props {
  section: Section;
  page: LovePage;
}

export default function Hero({ section, page }: Props) {
  const config = section.config as HeroConfig;

  const floats = [
    { id: 0, x: 8, delay: 0, duration: 4.2, size: 22 },
    { id: 1, x: 22, delay: 0.4, duration: 3.8, size: 28 },
    { id: 2, x: 38, delay: 0.8, duration: 4.6, size: 18 },
    { id: 3, x: 62, delay: 0.3, duration: 4.0, size: 26 },
    { id: 4, x: 78, delay: 0.7, duration: 3.5, size: 20 },
    { id: 5, x: 90, delay: 1.2, duration: 4.8, size: 24 },
  ];

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={
        config.background_image_url
          ? {
              backgroundImage: `url(${config.background_image_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : {}
      }
    >
      {/* Overlay for bg image */}
      {config.background_image_url && (
        <div className="absolute inset-0 bg-black/30" />
      )}

      {/* Floating hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floats.map(h => (
          <motion.div
            key={h.id}
            className="absolute"
            style={{ left: `${h.x}%`, bottom: '10%', fontSize: `${h.size}px` }}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: h.duration, delay: h.delay, repeat: Infinity, ease: 'easeInOut' }}
          >
            ❤️
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 section-wrapper">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-sm font-medium tracking-widest uppercase mb-6"
          style={{ color: 'var(--color-primary)' }}
        >
          {config.heading || 'For My Love ❤️'}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-6xl md:text-8xl font-bold leading-none mb-6"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text)',
          }}
        >
          {config.subheading || page.partner_name}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="w-16 h-0.5 mx-auto mb-6"
          style={{ background: 'var(--color-primary)' }}
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7 }}
          className="text-lg md:text-xl max-w-sm mx-auto leading-relaxed"
          style={{ color: 'var(--color-muted)' }}
        >
          {config.message || page.hero_message}
        </motion.p>

        {/* Scroll indicator */}
        {config.show_scroll_indicator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="mt-16"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-2"
              style={{ color: 'var(--color-muted)' }}
            >
              <span className="text-xs tracking-widest uppercase">Scroll</span>
              <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                <path d="M8 0v20M1 14l7 7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
