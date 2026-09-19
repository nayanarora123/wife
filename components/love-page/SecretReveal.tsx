'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import type { Section, SecretRevealConfig } from '@/types';

interface Props {
  section: Section;
}

export default function SecretReveal({ section }: Props) {
  const config = section.config as SecretRevealConfig;
  const [revealed, setRevealed] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const handleReveal = () => {
    if (revealed) return;
    setRevealed(true);
    // Burst hearts
    const newHearts = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 200 - 100,
      y: Math.random() * -150 - 20,
    }));
    setHearts(newHearts);
    setTimeout(() => setHearts([]), 1500);
  };

  return (
    <section ref={ref} className="section-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center"
      >
        <h2 className="section-heading mb-2">{config.title || "Aren't we cute? 👀"}</h2>
        <p className="section-subheading mb-8">{config.description}</p>

        <div className="relative">
          {/* Heart burst */}
          <AnimatePresence>
            {hearts.map(h => (
              <motion.div
                key={h.id}
                className="absolute top-1/2 left-1/2 text-2xl pointer-events-none z-10"
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{ x: h.x, y: h.y, opacity: 0, scale: 1.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
              >
                ❤️
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Image card */}
          <motion.div
            className="card relative overflow-hidden cursor-pointer"
            style={{ width: 280, height: 280 }}
            onClick={handleReveal}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Image */}
            {config.image_url && (
              <img
                src={config.image_url}
                alt="Secret reveal"
                className="w-full h-full object-cover"
                style={{
                  filter: revealed ? 'none' : 'blur(20px) brightness(0.6)',
                  transition: 'filter 0.8s ease',
                }}
              />
            )}

            {/* Reveal overlay */}
            <AnimatePresence>
              {!revealed && (
                <motion.div
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex flex-col items-center justify-center"
                  style={{ background: 'rgba(217, 79, 115, 0.15)' }}
                >
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-5xl mb-3"
                  >
                    🔒
                  </motion.span>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-button-text)', background: 'var(--color-button)', padding: '6px 16px', borderRadius: '999px' }}>
                    {config.reveal_text || 'Tap to reveal ✨'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Post-reveal message */}
          <AnimatePresence>
            {revealed && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-center mt-4 text-base font-medium"
                style={{ color: 'var(--color-primary)' }}
              >
                {config.post_reveal_message || 'We really are 🥹'}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
