'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Section, SongsConfig, Song } from '@/types';

interface Props {
  section: Section;
  songs: Song[];
}

export default function Songs({ section, songs }: Props) {
  const config = section.config as SongsConfig;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const sorted = [...songs].sort((a, b) => a.order_index - b.order_index);

  return (
    <section ref={ref} className="section-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-heading">{config.heading || 'Songs That Remind Me of You 🎵'}</h2>
        {config.subtitle && <p className="section-subheading">{config.subtitle}</p>}
      </motion.div>

      <div className="space-y-3 mt-6">
        {sorted.map((song, i) => (
          <SongCard key={song.id} song={song} index={i} inView={inView} />
        ))}
      </div>
    </section>
  );
}

function SongCard({ song, index, inView }: { song: Song; index: number; inView: boolean }) {
  const playUrl = song.youtube_url || song.spotify_url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="card flex items-center gap-4"
      style={{ padding: '1rem 1.25rem' }}
    >
      {/* Track number */}
      <span
        className="text-xs font-bold w-6 text-right flex-shrink-0"
        style={{ color: 'var(--color-muted)' }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Cover art */}
      <div
        className="w-12 h-12 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center text-2xl"
        style={{ background: 'var(--color-bg)' }}
      >
        {song.cover_url ? (
          <img src={song.cover_url} alt={song.title} className="w-full h-full object-cover" />
        ) : (
          '🎵'
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className="font-semibold text-sm truncate"
          style={{ color: 'var(--color-text)' }}
        >
          {song.title}
        </p>
        <p className="text-xs truncate" style={{ color: 'var(--color-muted)' }}>
          {song.artist}
        </p>
        {song.description && (
          <p className="text-xs mt-1 italic truncate" style={{ color: 'var(--color-muted)' }}>
            "{song.description}"
          </p>
        )}
      </div>

      {/* Play button */}
      {playUrl && (
        <motion.a
          href={playUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: 'var(--color-button)',
            color: 'var(--color-button-text)',
          }}
          aria-label={`Play ${song.title}`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <path d="M2 2l10 5-10 5V2z" />
          </svg>
        </motion.a>
      )}
    </motion.div>
  );
}
