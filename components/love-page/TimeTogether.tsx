'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Section, TimeTogetherConfig } from '@/types';
import { formatDuration, pad } from '@/lib/utils';

interface Props {
  section: Section;
}

export default function TimeTogether({ section }: Props) {
  const config = section.config as TimeTogetherConfig;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const getStartDate = () => {
    const dateStr = config.start_date || '2022-06-12';
    const timeStr = config.start_time || '18:30';
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);
    return new Date(year, (month || 1) - 1, day || 1, hours || 0, minutes || 0, 0);
  };

  const [mounted, setMounted] = useState(false);
  const [duration, setDuration] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setMounted(true);
    const startMs = getStartDate().getTime();
    setDuration(formatDuration(Date.now() - startMs));

    const interval = setInterval(() => {
      setDuration(formatDuration(Date.now() - startMs));
    }, 1000);
    return () => clearInterval(interval);
  }, [config.start_date, config.start_time]);

  const units = [
    { label: 'Years', value: duration.years },
    { label: 'Months', value: duration.months },
    { label: 'Days', value: duration.days },
    { label: 'Hours', value: duration.hours },
    { label: 'Minutes', value: duration.minutes },
    { label: 'Seconds', value: duration.seconds },
  ];

  return (
    <section ref={ref} className="section-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="section-heading">{config.heading || 'Time Together'}</h2>
        {config.subtitle && <p className="section-subheading">{config.subtitle}</p>}

        <div className="card mt-8 p-8 max-w-lg mx-auto">
          {/* Date label */}
          <p className="text-sm mb-6" style={{ color: 'var(--color-muted)' }}>
            Since{' '}
            <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              {config.start_date
                ? new Date(config.start_date + 'T00:00:00').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'June 12, 2022'}
            </span>
          </p>

          {/* Counter grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {units.map((unit, i) => (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl"
                style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <span
                  className="text-2xl sm:text-3xl font-bold tracking-tight font-mono"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {mounted ? pad(unit.value) : '--'}
                </span>
                <span
                  className="text-xs font-medium uppercase tracking-wider mt-1"
                  style={{ color: 'var(--color-muted)' }}
                >
                  {unit.label}
                </span>
              </motion.div>
            ))}
          </div>

          <p className="text-xs mt-6 italic" style={{ color: 'var(--color-muted)' }}>
            ...and counting every single heartbeat ❤️
          </p>
        </div>
      </motion.div>
    </section>
  );
}
