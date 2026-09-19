'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import type { Section, GalleryConfig, Memory } from '@/types';

interface Props {
  section: Section;
  memories: Memory[];
}

export default function MemoryGallery({ section, memories }: Props) {
  const config = (section.config || {}) as GalleryConfig;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [lightboxImg, setLightboxImg] = useState<Memory | null>(null);

  const sorted = [...(memories || [])].sort((a, b) => a.order_index - b.order_index);
  const layout = config.layout || 'polaroid';

  const rotations = [-3, 2, -1.5, 3, -2, 1];

  return (
    <section ref={ref} className="section-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-heading">{config.heading || 'Our Memories 📸'}</h2>
        {config.subtitle && <p className="section-subheading">{config.subtitle}</p>}
      </motion.div>

      {/* Empty State */}
      {sorted.length === 0 && (
        <div className="card text-center p-8 mt-8 text-sm" style={{ color: 'var(--color-muted)' }}>
          No memories added yet. Add photos in the Admin Panel!
        </div>
      )}

      {/* Polaroid layout */}
      {layout === 'polaroid' && sorted.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-8">
          {sorted.map((mem, i) => (
            <motion.div
              key={mem.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="polaroid cursor-pointer group"
              style={{ '--rotation': `${rotations[i % rotations.length]}deg` } as React.CSSProperties}
              onClick={() => setLightboxImg(mem)}
            >
              <div className="w-full aspect-square overflow-hidden bg-gray-100 rounded-sm">
                <img
                  src={mem.image_url}
                  alt={mem.caption || 'Memory'}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              {mem.caption && (
                <p
                  className="text-center text-xs mt-2.5 leading-relaxed truncate"
                  style={{ fontFamily: 'var(--font-heading)', color: '#666', fontStyle: 'italic' }}
                >
                  {mem.caption}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Masonry layout */}
      {layout === 'masonry' && sorted.length > 0 && (
        <div className="columns-2 gap-4 mt-8">
          {sorted.map((mem, i) => (
            <motion.div
              key={mem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="card overflow-hidden cursor-pointer break-inside-avoid mb-4 group"
              onClick={() => setLightboxImg(mem)}
            >
              <div className="overflow-hidden">
                <img
                  src={mem.image_url}
                  alt={mem.caption || 'Memory'}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              {mem.caption && (
                <p className="p-3 text-xs leading-snug" style={{ color: 'var(--color-muted)' }}>
                  {mem.caption}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Carousel layout */}
      {layout === 'carousel' && sorted.length > 0 && (
        <CarouselGallery memories={sorted} onSelect={setLightboxImg} inView={inView} />
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-overlay"
            onClick={() => setLightboxImg(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={e => e.stopPropagation()}
              className="relative max-w-lg w-full mx-4"
            >
              <img
                src={lightboxImg.image_url}
                alt={lightboxImg.caption || ''}
                className="w-full rounded-2xl max-h-[80vh] object-contain mx-auto"
              />
              {lightboxImg.caption && (
                <p className="text-center text-white mt-3 text-sm font-medium">{lightboxImg.caption}</p>
              )}
              {lightboxImg.date && (
                <p className="text-center text-gray-400 text-xs mt-1">
                  {lightboxImg.date} {lightboxImg.location ? `· ${lightboxImg.location}` : ''}
                </p>
              )}
              <button
                onClick={() => setLightboxImg(null)}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center text-sm shadow-md"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function CarouselGallery({
  memories,
  onSelect,
  inView,
}: {
  memories: Memory[];
  onSelect: (m: Memory) => void;
  inView: boolean;
}) {
  const [idx, setIdx] = useState(0);

  if (!memories.length) return null;
  const safeIdx = idx >= memories.length ? 0 : idx;
  const current = memories[safeIdx];

  return (
    <div className="mt-8 max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        className="card overflow-hidden cursor-pointer group shadow-lg"
        onClick={() => onSelect(current)}
      >
        <div className="relative aspect-square sm:aspect-video overflow-hidden bg-black/10">
          <AnimatePresence mode="wait">
            <motion.img
              key={safeIdx}
              src={current.image_url}
              alt={current.caption || ''}
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
        </div>
        {current.caption && (
          <p className="p-4 text-center text-sm font-medium" style={{ color: 'var(--color-text)' }}>
            {current.caption}
          </p>
        )}
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={() => setIdx(i => (i - 1 + memories.length) % memories.length)}
          className="w-10 h-10 rounded-full flex items-center justify-center border shadow-sm transition-all hover:scale-105 active:scale-95"
          style={{
            background: 'var(--color-card)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
          aria-label="Previous photo"
        >
          ←
        </button>
        <div className="flex gap-1.5 items-center">
          {memories.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className="w-2.5 h-2.5 rounded-full transition-all"
              style={{
                background: i === safeIdx ? 'var(--color-primary)' : 'var(--color-border)',
                transform: i === safeIdx ? 'scale(1.3)' : 'scale(1)',
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => setIdx(i => (i + 1) % memories.length)}
          className="w-10 h-10 rounded-full flex items-center justify-center border shadow-sm transition-all hover:scale-105 active:scale-95"
          style={{
            background: 'var(--color-card)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
          aria-label="Next photo"
        >
          →
        </button>
      </div>
    </div>
  );
}
