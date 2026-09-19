'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import type { Section, LoveLetterConfig } from '@/types';

interface Props {
  section: Section;
}

export default function LoveLetter({ section }: Props) {
  const config = section.config as LoveLetterConfig;
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center"
      >
        {/* Closed envelope */}
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="closed"
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="card text-center cursor-pointer w-full max-w-sm"
              style={{ padding: '3rem 2rem' }}
              onClick={() => setIsOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="text-6xl mb-4"
              >
                💌
              </motion.div>
              <h2
                className="text-xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
              >
                A letter for you
              </h2>
              <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                Tap to open
              </p>

              {/* Envelope flap lines */}
              <div className="mt-6 flex gap-2 justify-center">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-0.5 rounded-full"
                    style={{
                      width: i === 1 ? 40 : 24,
                      background: 'var(--color-border)',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="card w-full max-w-lg"
              style={{ padding: '2.5rem 2rem' }}
            >
              {/* Envelope top decoration */}
              <div className="flex justify-center mb-6">
                <div
                  className="w-12 h-0.5 rounded-full"
                  style={{ background: 'var(--color-border)' }}
                />
                <span className="mx-3 text-xl">💌</span>
                <div
                  className="w-12 h-0.5 rounded-full"
                  style={{ background: 'var(--color-border)' }}
                />
              </div>

              {/* Salutation */}
              <p
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
              >
                {config.salutation || 'My Love,'}
              </p>

              {/* Body */}
              <div
                className="tiptap-content text-base leading-relaxed mb-6 space-y-4"
                style={{ color: 'var(--color-text)' }}
                dangerouslySetInnerHTML={{ __html: config.body || '' }}
              />

              {/* Closing */}
              <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                <p className="text-sm mb-1" style={{ color: 'var(--color-muted)' }}>
                  {config.closing || 'With all my heart,'}
                </p>
                <p
                  className="text-lg font-semibold"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
                >
                  {config.signature || 'Nayan ❤️'}
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="mt-6 text-xs"
                style={{ color: 'var(--color-muted)' }}
              >
                Close envelope ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
