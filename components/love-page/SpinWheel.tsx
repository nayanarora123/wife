'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import type { Section, SpinWheelConfig, WheelItem } from '@/types';

interface Props {
  section: Section;
  items: WheelItem[];
}

export default function SpinWheel({ section, items }: Props) {
  const config = section.config as SpinWheelConfig;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<WheelItem | null>(null);
  const [currentAngle, setCurrentAngle] = useState(0);

  const sorted = [...items].sort((a, b) => a.order_index - b.order_index);

  // Draw wheel on canvas
  const drawWheel = useCallback((angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !sorted.length) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = cx - 8;
    const sliceAngle = (2 * Math.PI) / sorted.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    sorted.forEach((item, i) => {
      const start = angle + i * sliceAngle;
      const end = start + sliceAngle;

      // Slice
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();
      ctx.fillStyle = item.color || `hsl(${(i * 360) / sorted.length}, 65%, 65%)`;
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = 'white';
      ctx.font = 'bold 13px Inter, sans-serif';
      const label = `${item.emoji} ${item.text}`;
      ctx.fillText(label, r - 12, 5);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 24, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#f3c8d3';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center heart
    ctx.font = '16px serif';
    ctx.textAlign = 'center';
    ctx.fillText('❤️', cx, cy + 6);
  }, [sorted]);

  // Draw on mount & angle change
  useEffect(() => {
    drawWheel(currentAngle);
  }, [drawWheel, currentAngle]);

  const spin = () => {
    if (spinning || !sorted.length) return;

    // Pick weighted random result
    const totalWeight = sorted.reduce((s, i) => s + i.weight, 0);
    let random = Math.random() * totalWeight;
    let winner = sorted[0];
    for (const item of sorted) {
      random -= item.weight;
      if (random <= 0) { winner = item; break; }
    }

    setSpinning(true);
    setResult(null);

    const sliceAngle = (2 * Math.PI) / sorted.length;
    const winnerIdx = sorted.indexOf(winner);
    const targetSliceCenter = winnerIdx * sliceAngle + sliceAngle / 2;

    // Pointer is at 12 o'clock (1.5 * PI). For winner slice center to land at 12 o'clock:
    const targetNormalized = ((1.5 * Math.PI - targetSliceCenter) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    const currentNormalized = ((currentAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    let delta = targetNormalized - currentNormalized;
    if (delta <= 0) {
      delta += 2 * Math.PI;
    }

    // 5 full rotations + exact delta to target slice
    const fullSpins = 5 * 2 * Math.PI;
    const totalRotation = fullSpins + delta;

    const startAngle = currentAngle;
    const duration = 4000;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const angle = startAngle + totalRotation * eased;

      drawWheel(angle);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Snap directly to exact normalized angle to prevent any subpixel drift
        setCurrentAngle(targetNormalized);
        drawWheel(targetNormalized);
        setSpinning(false);
        setTimeout(() => setResult(winner), 200);
      }
    };

    requestAnimationFrame(animate);
  };

  // Draw initial wheel when section enters view
  useEffect(() => {
    if (inView && canvasRef.current) drawWheel(currentAngle);
  }, [inView, drawWheel, currentAngle]);

  return (
    <section ref={ref} className="section-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
      >
        <h2 className="section-heading">{config.heading || 'Spin to Win! 🎡'}</h2>
        {config.subtitle && <p className="section-subheading">{config.subtitle}</p>}

        {/* Wheel container */}
        <div className="relative mt-8 flex flex-col items-center">
          {/* Pointer */}
          <div
            className="w-0 h-0 -mb-2 z-20"
            style={{
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderTop: '24px solid var(--color-primary)',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))',
            }}
          />

          {/* Canvas */}
          <div
            className="relative cursor-pointer"
            onClick={() => !result && spin()}
          >
            <canvas
              ref={canvasRef}
              width={280}
              height={280}
              className="rounded-full"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
            />
          </div>

          {/* Spin button */}
          <motion.button
            whileHover={{ scale: spinning ? 1 : 1.05 }}
            whileTap={{ scale: spinning ? 1 : 0.96 }}
            onClick={spin}
            disabled={spinning}
            className="btn-primary mt-6 text-base"
          >
            {spinning ? 'Spinning... ✨' : (config.spin_button_text || 'SPIN ❤️')}
          </motion.button>
        </div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="card mt-6 p-6 w-full text-center"
            >
              <p className="text-sm mb-2" style={{ color: 'var(--color-muted)' }}>
                {config.result_prefix || "Tonight's mission:"}
              </p>
              <p className="text-3xl mb-2">{result.emoji}</p>
              <h3
                className="text-xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
              >
                {result.text}
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                {result.result_message}
              </p>
              <button
                onClick={() => { setResult(null); spin(); }}
                className="mt-4 text-xs underline"
                style={{ color: 'var(--color-muted)' }}
              >
                Spin again?
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
