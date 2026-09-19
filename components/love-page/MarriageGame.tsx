'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import type { Section, MarriageGameConfig } from '@/types';
import YesCelebration from './YesCelebration';

interface Props {
  section: Section;
}

export default function MarriageGame({ section }: Props) {
  const config = section.config as MarriageGameConfig;
  const ref = useRef(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [saidYes, setSaidYes] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [noRotation, setNoRotation] = useState(0);

  const noTexts = config.no_button_texts?.length
    ? config.no_button_texts
    : ['NO 😈', 'Nice try 😏', 'Nope!', 'Are you sure? 😂', 'Wrong button!', "You can't escape ❤️", "You know there's only one answer 😌"];

  const currentNoText = noTexts[Math.min(noCount, noTexts.length - 1)];

  const moveNoButton = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;

    const cardRect = card.getBoundingClientRect();
    const btnWidth = 120;
    const btnHeight = 48;
    const margin = 16;

    const maxX = cardRect.width - btnWidth - margin * 2;
    const maxY = cardRect.height - btnHeight - margin * 2;

    const newX = margin + Math.random() * maxX;
    const newY = margin + Math.random() * maxY;
    const newRotation = (Math.random() - 0.5) * 20;

    setNoPos({ x: newX - (cardRect.width / 2 - btnWidth / 2), y: newY - (cardRect.height / 2 - btnHeight / 2) });
    setNoRotation(newRotation);
    setNoCount(c => c + 1);
  }, []);

  const handleNoInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    moveNoButton();
  }, [moveNoButton]);

  if (saidYes) {
    return (
      <YesCelebration
        title={config.yes_celebration_title || 'She Said YES! ❤️'}
        subtitle={config.yes_celebration_subtitle || "I knew you'd choose correctly 😌"}
        body={config.yes_celebration_body || 'Forever starts here. 💍'}
      />
    );
  }

  return (
    <section ref={ref} className="section-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center"
      >
        <h2 className="section-heading">{config.heading || 'One last question...'}</h2>

        {/* Game card */}
        <div
          ref={cardRef}
          className="card mt-8 w-full max-w-sm relative overflow-hidden"
          style={{ minHeight: 280, padding: '2.5rem 2rem' }}
        >
          {/* Ring emoji */}
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-center text-5xl mb-6"
          >
            💍
          </motion.div>

          {/* Question */}
          <p
            className="text-xl font-bold text-center mb-8 leading-snug"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
          >
            {config.question || 'Will you marry me? 💍❤️'}
          </p>

          {/* Attempt counter */}
          {noCount > 0 && (
            <p className="text-center text-xs mb-4" style={{ color: 'var(--color-muted)' }}>
              {noCount === 1 ? 'Nice try 😄' : noCount > 3 ? 'You know the answer 😌' : 'Keep trying...'}
            </p>
          )}

          {/* YES button — always accessible */}
          <div className="flex justify-center mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSaidYes(true)}
              className="btn-primary text-lg px-10 py-4"
              style={{ fontSize: noCount > 2 ? `${Math.min(24, 16 + noCount * 2)}px` : '1rem' }}
            >
              {config.yes_button_text || 'YES ❤️'}
            </motion.button>
          </div>

          {/* NO button — moves away on touch/click */}
          <motion.button
            animate={{
              x: noPos.x,
              y: noPos.y,
              rotate: noRotation,
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25,
            }}
            onClick={handleNoInteraction}
            onTouchStart={handleNoInteraction}
            className="absolute text-sm font-semibold px-5 py-2.5 rounded-full border-2 cursor-pointer select-none"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-muted)',
              background: 'var(--color-card)',
              touchAction: 'none',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              // Position in center bottom initially
              bottom: noCount === 0 ? '2rem' : undefined,
              left: noCount === 0 ? '50%' : undefined,
              transform: noCount === 0 ? 'translateX(-50%)' : undefined,
            }}
            aria-label="No button (it will move away)"
          >
            {currentNoText}
          </motion.button>
        </div>

        {/* Fun note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-4 text-xs text-center"
          style={{ color: 'var(--color-muted)' }}
        >
          {noCount === 0
            ? 'Choose wisely 😌'
            : noCount < 3
            ? 'Still trying? 😄'
            : "There's really only one answer... ❤️"}
        </motion.p>
      </motion.div>
    </section>
  );
}
