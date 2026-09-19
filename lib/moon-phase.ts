// ============================================================
// Moon Phase Calculator
// Pure JS implementation — no external dependencies needed
// ============================================================

export interface MoonPhaseResult {
  phase: number;        // 0–1 (0/1 = new moon, 0.5 = full moon)
  phaseName: string;
  illumination: number; // 0–100%
  emoji: string;
  description: string;
}

/**
 * Calculate moon phase for a given date.
 * Uses the Julian Date approach with a known new moon reference.
 */
export function getMoonPhase(date: Date): MoonPhaseResult {
  // Known new moon: January 6, 2000
  const KNOWN_NEW_MOON = new Date('2000-01-06T18:14:00Z');
  const SYNODIC_MONTH = 29.53058867; // days

  const diffMs = date.getTime() - KNOWN_NEW_MOON.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const cyclePos = ((diffDays % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
  const phase = cyclePos / SYNODIC_MONTH;

  // Illumination (0-100)
  const illumination = Math.round((1 - Math.cos(phase * 2 * Math.PI)) / 2 * 100);

  let phaseName: string;
  let emoji: string;
  let description: string;

  if (phase < 0.0625 || phase >= 0.9375) {
    phaseName = 'New Moon';
    emoji = '🌑';
    description = 'A new beginning — just like us.';
  } else if (phase < 0.1875) {
    phaseName = 'Waxing Crescent';
    emoji = '🌒';
    description = 'Growing brighter, just like our love.';
  } else if (phase < 0.3125) {
    phaseName = 'First Quarter';
    emoji = '🌓';
    description = 'Half of a beautiful whole.';
  } else if (phase < 0.4375) {
    phaseName = 'Waxing Gibbous';
    emoji = '🌔';
    description = 'Almost full — almost perfect.';
  } else if (phase < 0.5625) {
    phaseName = 'Full Moon';
    emoji = '🌕';
    description = 'As full and bright as my love for you.';
  } else if (phase < 0.6875) {
    phaseName = 'Waning Gibbous';
    emoji = '🌖';
    description = 'Still glowing, always beautiful.';
  } else if (phase < 0.8125) {
    phaseName = 'Last Quarter';
    emoji = '🌗';
    description = 'Beautiful in every phase.';
  } else {
    phaseName = 'Waning Crescent';
    emoji = '🌘';
    description = 'Fading gently, but never gone.';
  }

  return { phase, phaseName, illumination, emoji, description };
}

/**
 * Get SVG path data for moon rendering
 * Returns left/right side arcs to simulate moon phases
 */
export function getMoonSVGParams(phase: number): {
  leftSide: 'light' | 'dark';
  rightSide: 'light' | 'dark';
  archWidth: number; // 0–1 scale of inner arch
  leftFirst: boolean;
} {
  const normalized = phase;
  
  if (normalized < 0.5) {
    // Waxing: right side lit
    return {
      leftSide: 'dark',
      rightSide: 'light',
      archWidth: Math.abs(0.5 - normalized) * 2,
      leftFirst: normalized < 0.25,
    };
  } else {
    // Waning: left side lit
    return {
      leftSide: 'light',
      rightSide: 'dark',
      archWidth: Math.abs(normalized - 0.5) * 2,
      leftFirst: normalized < 0.75,
    };
  }
}
