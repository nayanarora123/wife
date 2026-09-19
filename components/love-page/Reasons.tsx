'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Section, ReasonsConfig, Reason } from '@/types';

interface Props {
  section: Section;
  reasons: Reason[];
}

export default function Reasons({ section, reasons }: Props) {
  const config = section.config as ReasonsConfig;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const sorted = [...reasons].sort((a, b) => a.order_index - b.order_index);

  return (
    <section ref={ref} className="section-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-heading">{config.heading || 'Things I Love About You'}</h2>
        {config.subtitle && <p className="section-subheading">{config.subtitle}</p>}
      </motion.div>

      <div className="space-y-4 mt-6">
        {sorted.map((reason, i) => (
          <ReasonCard key={reason.id} reason={reason} index={i} />
        ))}
      </div>

      {config.footer_note && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: sorted.length * 0.08 + 0.3, duration: 0.6 }}
          className="text-center mt-8 text-sm italic"
          style={{ color: 'var(--color-muted)' }}
        >
          {config.footer_note}
        </motion.p>
      )}
    </section>
  );
}

function ReasonCard({ reason, index }: { reason: Reason; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="card flex gap-4 items-start"
      style={{ padding: '1.25rem 1.5rem' }}
      whileHover={{ x: 4 }}
    >
      {/* Emoji */}
      <div
        className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
        style={{ background: 'var(--color-bg)' }}
      >
        {reason.emoji || '💗'}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3
          className="font-semibold text-base mb-1"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
        >
          {reason.title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
          {reason.description}
        </p>
        {reason.image_url && (
          <img
            src={reason.image_url}
            alt={reason.title}
            className="mt-2 rounded-lg h-24 object-cover w-full"
          />
        )}
      </div>
    </motion.div>
  );
}
