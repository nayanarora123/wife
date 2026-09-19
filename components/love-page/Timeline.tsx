'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Section, TimelineConfig, TimelineItem } from '@/types';
import { formatDate } from '@/lib/utils';

interface Props {
  section: Section;
  items: TimelineItem[];
}

export default function Timeline({ section, items }: Props) {
  const config = section.config as TimelineConfig;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  const sorted = [...items].sort((a, b) => a.order_index - b.order_index);

  return (
    <section ref={ref} className="section-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-heading">{config.heading || 'Our Story'}</h2>
        {config.subtitle && <p className="section-subheading">{config.subtitle}</p>}
      </motion.div>

      <div className="relative mt-8">
        {/* Vertical line — hidden on mobile, centered on desktop */}
        <div
          className="absolute hidden sm:block"
          style={{
            left: '50%',
            top: 0,
            bottom: 0,
            width: '2px',
            background: 'linear-gradient(to bottom, var(--color-primary), var(--color-border))',
            transform: 'translateX(-50%)',
          }}
        />

        {/* Mobile line */}
        <div
          className="absolute sm:hidden"
          style={{
            left: '1.5rem',
            top: 0,
            bottom: 0,
            width: '2px',
            background: 'linear-gradient(to bottom, var(--color-primary), var(--color-border))',
          }}
        />

        <div className="space-y-8 sm:space-y-12">
          {sorted.map((item, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <TimelineItemCard
                key={item.id}
                item={item}
                isLeft={isLeft}
                index={idx}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TimelineItemCard({ item, isLeft, index }: { item: TimelineItem; isLeft: boolean; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div
      ref={ref}
      className={`relative flex items-start gap-4 sm:gap-0 ${isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
    >
      {/* Mobile: indent */}
      <div className="sm:hidden w-10 flex-shrink-0" />

      {/* Desktop: left side spacer */}
      <div className="hidden sm:block sm:w-1/2" />

      {/* Center dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ delay: index * 0.1, duration: 0.4, type: 'spring' }}
        className="absolute left-4 sm:left-1/2 w-8 h-8 rounded-full flex items-center justify-center text-base z-10"
        style={{
          background: 'var(--color-button)',
          transform: 'translateX(-50%)',
          boxShadow: '0 0 0 4px var(--color-bg)',
          top: '1rem',
        }}
      >
        {item.emoji || '❤️'}
      </motion.div>

      {/* Mobile left pad / Desktop half */}
      <div className="hidden sm:block sm:w-1/2" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: index * 0.1, duration: 0.6 }}
        className="card flex-1 sm:max-w-xs sm:mx-6 ml-6 sm:ml-0"
        style={{ padding: '1.25rem 1.5rem' }}
      >
        <p
          className="text-xs font-semibold tracking-wide uppercase mb-1"
          style={{ color: 'var(--color-primary)' }}
        >
          {item.date ? formatDate(item.date) : ''}
          {item.location && ` · ${item.location}`}
        </p>
        <h3
          className="text-lg font-bold mb-2"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
        >
          {item.title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
          {item.description}
        </p>
        {item.image_url && (
          <img
            src={item.image_url}
            alt={item.title}
            className="mt-3 w-full h-32 object-cover rounded-lg"
          />
        )}
      </motion.div>
    </div>
  );
}
