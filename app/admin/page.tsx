'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAdminData } from '@/components/admin/AdminDataContext';

export default function AdminDashboard() {
  const { data, publishChanges, isPublishing, isDirty } = useAdminData();

  const page = data.page;
  const sections = data.sections || [];
  const enabledCount = sections.filter(s => s.enabled).length;

  const stats = [
    { label: 'Total Sections', value: sections.length, icon: '☰', color: '#D94F73' },
    { label: 'Enabled Sections', value: enabledCount, icon: '✅', color: '#22c55e' },
    { label: 'Timeline Items', value: (data.timeline_items || []).length, icon: '📅', color: '#a855f7' },
    { label: 'Memories', value: (data.memories || []).length, icon: '📸', color: '#f59e0b' },
    { label: 'Songs', value: (data.songs || []).length, icon: '🎵', color: '#3b82f6' },
    { label: 'Quiz Questions', value: (data.game_questions || []).length, icon: '🎮', color: '#ec4899' },
  ];

  const quickLinks = [
    { href: '/admin/settings', label: 'Edit Basic Info', icon: '⚙️', desc: 'Names, title, hero message, slug' },
    { href: '/admin/theme', label: 'Change Theme', icon: '🎨', desc: 'Colors, fonts, presets' },
    { href: '/admin/sections', label: 'Manage Sections', icon: '☰', desc: 'Reorder, toggle, customize sections' },
    { href: '/admin/timeline', label: 'Edit Timeline', icon: '📅', desc: 'Add relationship milestones' },
    { href: '/admin/reasons', label: 'Things I Love', icon: '💗', desc: 'List reasons why you love her' },
    { href: '/admin/gallery', label: 'Photo Gallery', icon: '📸', desc: 'Upload memories and captions' },
    { href: '/admin/songs', label: 'Our Playlist', icon: '🎵', desc: 'Add romantic songs and tracks' },
    { href: '/admin/game', label: 'Quiz & Marriage Game', icon: '🎮', desc: 'Questions, teasing NO button' },
    { href: '/admin/wheel', label: 'Spin Wheel', icon: '🎡', desc: 'Wheel prizes, weights & dares' },
    { href: '/admin/compatibility', label: 'Compatibility', icon: '❤️', desc: 'Scores and love metrics' },
    { href: '/admin/media', label: 'Media Library', icon: '🖼️', desc: 'Upload photos and audio files' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl"
        style={{
          background: 'linear-gradient(135deg, #2d1520 0%, #1a0a0f 100%)',
          border: '1px solid #3d2030',
        }}
      >
        {/* Decorative hearts */}
        <div className="absolute top-4 right-4 text-3xl opacity-20 pointer-events-none">❤️</div>
        <div className="absolute bottom-4 right-12 text-2xl opacity-10 pointer-events-none">💕</div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: isDirty
                    ? 'rgba(234, 179, 8, 0.2)'
                    : page.status === 'published'
                    ? 'rgba(34, 197, 94, 0.2)'
                    : 'rgba(217, 79, 115, 0.2)',
                  color: isDirty ? '#eab308' : page.status === 'published' ? '#22c55e' : '#D94F73',
                }}
              >
                {isDirty ? '● Unsaved Changes' : page.status === 'published' ? '● Live & Published' : '● Draft'}
              </span>
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold mb-1"
              style={{ fontFamily: 'Playfair Display, serif', color: '#f9d8e1' }}
            >
              {page.title}
            </h2>
            <p className="text-sm mb-2" style={{ color: '#c7889a' }}>
              {page.subtitle}
            </p>
            <p className="text-xs font-mono" style={{ color: '#5d3040' }}>
              URL: /love/{page.slug}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <a
              href={`/love/${page.slug}?preview=true`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5"
              style={{ background: '#2d1520', border: '1px solid #3d2030', color: '#f9d8e1' }}
            >
              <span>👁</span>
              <span>Preview</span>
            </a>
            <a
              href={`/love/${page.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5"
              style={{ background: '#2d1520', border: '1px solid #3d2030', color: '#c7889a' }}
            >
              <span>🔗</span>
              <span>Public Link</span>
            </a>
            <motion.button
              onClick={() => publishChanges()}
              disabled={isPublishing}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #D94F73, #be185d)', color: 'white' }}
            >
              <span>{isPublishing ? '⏳' : '✨'}</span>
              <span>{isPublishing ? 'Publishing...' : 'Publish Live'}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="rounded-2xl p-4 sm:p-5"
            style={{ background: '#1a0a0f', border: '1px solid #2d1520' }}
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs mt-1" style={{ color: '#5d3040' }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h3
          className="text-sm font-semibold mb-4 uppercase tracking-wider"
          style={{ color: '#5d3040' }}
        >
          Manage Sections & Customizations
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickLinks.map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.03, duration: 0.3 }}
            >
              <Link
                href={link.href}
                className="flex items-center gap-4 p-4 rounded-2xl transition-all group"
                style={{
                  background: '#1a0a0f',
                  border: '1px solid #2d1520',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#D94F73'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2d1520'; }}
              >
                <span className="text-2xl">{link.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: '#f9d8e1' }}>{link.label}</p>
                  <p className="text-xs truncate" style={{ color: '#5d3040' }}>{link.desc}</p>
                </div>
                <span className="text-lg transition-transform group-hover:translate-x-1" style={{ color: '#3d2030' }}>→</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
