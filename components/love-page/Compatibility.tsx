'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Section, CompatibilityConfig, CompatibilityItem } from '@/types';

interface Props {
  section: Section;
  items: CompatibilityItem[];
}

export default function Compatibility({ section, items }: Props) {
  const config = section.config as CompatibilityConfig;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const sorted = [...items].sort((a, b) => a.order_index - b.order_index);

  return (
    <section ref={ref} className="section-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="section-heading">{config.heading || 'How Compatible Are We? ❤️'}</h2>
        {config.subtitle && <p className="section-subheading">{config.subtitle}</p>}

        {/* Names banner */}
        <div className="inline-flex items-center gap-3 mb-8">
          <span
            className="text-lg font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
          >
            {config.name1 || 'Nayan'}
          </span>
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-xl"
          >
            ❤️
          </motion.span>
          <span
            className="text-lg font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
          >
            {config.name2 || 'Charan'}
          </span>
        </div>

        {/* Compatibility bars */}
        <div className="card p-6 sm:p-8 space-y-5 text-left">
          {sorted.map((item, i) => (
            <CompatBar key={item.id} item={item} index={i} inView={inView} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function CompatBar({ item, index, inView }: { item: CompatibilityItem; index: number; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
          {item.label}
        </span>
        <motion.span
          className="text-sm font-bold"
          style={{ color: 'var(--color-primary)' }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 + index * 0.1 + 0.6, duration: 0.4 }}
        >
          {item.percentage}%
        </motion.span>
      </div>
      <div className="compat-bar-bg">
        <motion.div
          className="compat-bar-fill"
          initial={{ width: 0 }}
          animate={inView ? { width: `${item.percentage}%` } : { width: 0 }}
          transition={{ delay: 0.2 + index * 0.12, duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </motion.div>
  );
}
