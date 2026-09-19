'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Section, MoonPhaseConfig, LovePage } from '@/types';
import { getMoonPhase } from '@/lib/moon-phase';

interface Props {
  section: Section;
  page: LovePage;
}

export default function MoonPhase({ section, page }: Props) {
  const config = section.config as MoonPhaseConfig;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  // Determine which date to use
  const targetDateStr = config.date_mode === 'custom' && config.custom_date
    ? config.custom_date
    : page.relationship_start_date;

  const targetDate = new Date(targetDateStr + 'T00:00:00');
  const moonData = getMoonPhase(targetDate);

  const formattedDate = targetDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <section ref={ref} className="section-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="section-heading">{config.heading || 'The Moon That Night 🌙'}</h2>
        {config.subtitle && (
          <p className="section-subheading italic">"{config.subtitle}"</p>
        )}

        {/* Moon card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.7, type: 'spring' }}
          className="card mt-8 p-8 sm:p-10 max-w-xs mx-auto"
        >
          {/* Moon SVG */}
          <MoonSVG phase={moonData.phase} />

          {/* Phase name */}
          <p
            className="text-2xl mt-4"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)', fontWeight: 600 }}
          >
            {moonData.phaseName}
          </p>

          {/* Illumination */}
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
            {moonData.illumination}% illuminated
          </p>

          {/* Date */}
          <div
            className="mt-6 pt-4 text-sm"
            style={{ borderTop: '1px solid var(--color-border)', color: 'var(--color-muted)' }}
          >
            {formattedDate}
          </div>

          {/* Romantic note */}
          <p
            className="text-sm italic mt-3"
            style={{ color: 'var(--color-primary)' }}
          >
            {moonData.description}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}

function MoonSVG({ phase }: { phase: number }) {
  const SIZE = 120;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const r = SIZE / 2 - 4;

  // Calculate the lit/dark portions
  // phase: 0=new, 0.25=first quarter, 0.5=full, 0.75=last quarter
  const isWaxing = phase < 0.5;
  const absPhase = isWaxing ? phase * 2 : (phase - 0.5) * 2; // 0–1 within half cycle

  // Inner ellipse X radius (varies from r to 0 to r)
  const innerRx = r * Math.abs(1 - 2 * absPhase);

  // New moon or full moon
  if (phase < 0.03 || phase > 0.97) {
    return (
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto">
        <circle cx={cx} cy={cy} r={r} fill="#1a1a2e" />
        {/* Subtle glow for new moon */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#3a3a5e" strokeWidth="2" />
      </svg>
    );
  }

  if (phase > 0.47 && phase < 0.53) {
    // Full moon
    return (
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto">
        <defs>
          <radialGradient id="fullMoon" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#fffde7" />
            <stop offset="60%" stopColor="#fff9c4" />
            <stop offset="100%" stopColor="#f5e642" />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill="url(#fullMoon)" />
        {/* Craters */}
        <circle cx={cx + 15} cy={cy - 20} r={6} fill="rgba(0,0,0,0.06)" />
        <circle cx={cx - 20} cy={cy + 10} r={4} fill="rgba(0,0,0,0.05)" />
        <circle cx={cx + 5} cy={cy + 22} r={5} fill="rgba(0,0,0,0.04)" />
      </svg>
    );
  }

  const lightColor = '#fff9c4';
  const darkColor = '#1a1a2e';

  // Waxing: right side lit
  // Waning: left side lit
  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto">
      <defs>
        <clipPath id="rightHalf">
          <rect x={cx} y={0} width={cx} height={SIZE} />
        </clipPath>
        <clipPath id="leftHalf">
          <rect x={0} y={0} width={cx} height={SIZE} />
        </clipPath>
      </defs>

      {/* Dark base */}
      <circle cx={cx} cy={cy} r={r} fill={darkColor} />

      {isWaxing ? (
        <>
          {/* Right half lit */}
          <circle cx={cx} cy={cy} r={r} fill={lightColor} clipPath="url(#rightHalf)" />
          {/* Inner ellipse: dark on right (makes crescent) when thin, covers less as it gets fuller */}
          <ellipse
            cx={cx}
            cy={cy}
            rx={innerRx}
            ry={r}
            fill={absPhase < 0.5 ? darkColor : lightColor}
            clipPath="url(#rightHalf)"
          />
        </>
      ) : (
        <>
          {/* Left half lit */}
          <circle cx={cx} cy={cy} r={r} fill={lightColor} clipPath="url(#leftHalf)" />
          {/* Inner ellipse */}
          <ellipse
            cx={cx}
            cy={cy}
            rx={innerRx}
            ry={r}
            fill={absPhase < 0.5 ? darkColor : lightColor}
            clipPath="url(#leftHalf)"
          />
        </>
      )}
    </svg>
  );
}
