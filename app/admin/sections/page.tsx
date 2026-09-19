'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import Link from 'next/link';
import { useAdminData } from '@/components/admin/AdminDataContext';
import type { Section, SectionType } from '@/types';
import AdminInput from '@/components/admin/AdminInput';
import AdminTextarea from '@/components/admin/AdminTextarea';

const SECTION_LABELS: Record<SectionType, { label: string; icon: string }> = {
  hero: { label: 'Hero Header', icon: '🏠' },
  secretReveal: { label: 'Secret Photo Reveal', icon: '🔒' },
  loveLetter: { label: 'Love Letter', icon: '💌' },
  timeline: { label: 'Our Story (Milestones)', icon: '📅' },
  timeTogether: { label: 'Time Together Counter', icon: '⏱️' },
  reasons: { label: 'Things I Love About You', icon: '💗' },
  quiz: { label: 'Love Quiz', icon: '🎮' },
  marriageGame: { label: 'Will You Marry Me? (Game)', icon: '💍' },
  gallery: { label: 'Photo Memories Gallery', icon: '📸' },
  spinWheel: { label: 'Spin Wheel', icon: '🎡' },
  compatibility: { label: 'Compatibility Scores', icon: '❤️' },
  songs: { label: 'Our Romantic Songs', icon: '🎵' },
  slideshow: { label: 'Slideshow', icon: '🖼️' },
  moonPhase: { label: 'The Moon That Night', icon: '🌙' },
  finalMessage: { label: 'Final Love Message', icon: '✍️' },
};

const EDIT_PATHS: Partial<Record<SectionType, string>> = {
  timeline: '/admin/timeline',
  reasons: '/admin/reasons',
  gallery: '/admin/gallery',
  songs: '/admin/songs',
  quiz: '/admin/game',
  marriageGame: '/admin/game',
  spinWheel: '/admin/wheel',
  compatibility: '/admin/compatibility',
};

export default function SectionsPage() {
  const { data, updateSections, updateSectionConfig, saveChanges, isSaving, isDirty } = useAdminData();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sections = [...(data.sections || [])].sort((a, b) => a.order_index - b.order_index);

  const handleReorder = (newOrder: Section[]) => {
    const updated = newOrder.map((s, idx) => ({ ...s, order_index: idx }));
    updateSections(updated);
  };

  const toggleSection = (id: string) => {
    const updated = sections.map(s => (s.id === id ? { ...s, enabled: !s.enabled } : s));
    updateSections(updated);
  };

  const deleteSection = (id: string) => {
    if (confirm('Are you sure you want to remove this section? You can also hide it instead.')) {
      const updated = sections.filter(s => s.id !== id);
      updateSections(updated);
    }
  };

  const handleConfigChange = (sectionId: string, key: string, value: any) => {
    updateSectionConfig(sectionId, { [key]: value });
  };

  const handleSave = async () => {
    await saveChanges();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <h2 className="text-lg font-bold" style={{ color: '#f9d8e1' }}>Manage & Customize Sections</h2>
          <p className="text-xs" style={{ color: '#c7889a' }}>
            Drag to reorder sections. Click any section to edit its text, headings, or content.
          </p>
        </div>
        <motion.button
          onClick={handleSave}
          disabled={isSaving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all disabled:opacity-50 self-start sm:self-auto"
          style={{ background: isDirty ? '#D94F73' : '#10b981', color: 'white' }}
        >
          {isSaving ? 'Saving...' : isDirty ? 'Save Sections & Order' : '✓ Sections Saved'}
        </motion.button>
      </div>

      <Reorder.Group
        axis="y"
        values={sections}
        onReorder={handleReorder}
        className="space-y-3"
      >
        {sections.map(section => (
          <SectionItem
            key={section.id}
            section={section}
            isExpanded={expandedId === section.id}
            onToggleExpand={() => setExpandedId(expandedId === section.id ? null : section.id)}
            onToggleEnabled={() => toggleSection(section.id)}
            onDelete={() => deleteSection(section.id)}
            onConfigChange={(k, v) => handleConfigChange(section.id, k, v)}
          />
        ))}
      </Reorder.Group>

      {/* Bottom Save Bar */}
      <div className="flex justify-end pt-4">
        <motion.button
          onClick={handleSave}
          disabled={isSaving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-3 rounded-xl text-sm font-semibold shadow-lg transition-all disabled:opacity-50"
          style={{ background: isDirty ? '#D94F73' : '#10b981', color: 'white' }}
        >
          {isSaving ? 'Saving Changes...' : isDirty ? 'Save All Changes' : '✓ All Saved!'}
        </motion.button>
      </div>
    </div>
  );
}

function SectionItem({
  section,
  isExpanded,
  onToggleExpand,
  onToggleEnabled,
  onDelete,
  onConfigChange,
}: {
  section: Section;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleEnabled: () => void;
  onDelete: () => void;
  onConfigChange: (key: string, value: any) => void;
}) {
  const meta = SECTION_LABELS[section.type as SectionType];
  const dedicatedPath = EDIT_PATHS[section.type as SectionType];
  const config = (section.config || {}) as any;

  return (
    <Reorder.Item value={section} id={section.id}>
      <motion.div
        layout
        className="rounded-2xl overflow-hidden transition-all"
        style={{
          background: '#1a0a0f',
          border: `1px solid ${isExpanded ? '#D94F73' : section.enabled ? '#3d2030' : '#2d1520'}`,
          opacity: section.enabled ? 1 : 0.6,
        }}
      >
        {/* Header row */}
        <div className="p-4 flex items-center gap-3.5">
          {/* Drag handle */}
          <div className="text-lg cursor-grab active:cursor-grabbing text-pink-700 select-none">
            ⠿
          </div>

          {/* Icon */}
          <span className="text-xl w-7 text-center flex-shrink-0">{meta?.icon || '📄'}</span>

          {/* Title and click to expand */}
          <div
            className="flex-1 min-w-0 cursor-pointer"
            onClick={onToggleExpand}
          >
            <p className="text-sm font-semibold truncate" style={{ color: '#f9d8e1' }}>
              {meta?.label || section.title}
            </p>
            <p className="text-xs truncate" style={{ color: '#5d3040' }}>
              {config.heading || config.title || section.type}
            </p>
          </div>

          {/* Visibility toggle */}
          <button
            type="button"
            onClick={onToggleEnabled}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              background: section.enabled ? 'rgba(34, 197, 94, 0.15)' : '#2d1520',
              color: section.enabled ? '#22c55e' : '#5d3040',
            }}
          >
            {section.enabled ? '● Visible' : '○ Hidden'}
          </button>

          {/* Dedicated page link if exists */}
          {dedicatedPath && (
            <Link
              href={dedicatedPath}
              className="text-xs px-2.5 py-1.5 rounded-xl transition-all font-semibold flex items-center gap-1"
              style={{ background: '#2d1520', color: '#c7889a' }}
            >
              <span>Items</span>
              <span>↗</span>
            </Link>
          )}

          {/* Expand toggle chevron */}
          <button
            type="button"
            onClick={onToggleExpand}
            className="p-1.5 text-xs rounded-lg transition-colors"
            style={{ color: '#c7889a', background: '#2d1520' }}
          >
            {isExpanded ? '▲' : '▼'}
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={onDelete}
            className="text-sm p-1"
            style={{ color: '#5d3040' }}
            aria-label="Delete section"
          >
            ✕
          </button>
        </div>

        {/* Expandable Configuration Area */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-5 pb-5 pt-3 space-y-4"
              style={{ borderTop: '1px solid #2d1520', background: '#14060b' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                  {meta?.label} Configuration
                </span>
                {dedicatedPath && (
                  <Link
                    href={dedicatedPath}
                    className="text-xs underline text-pink-400 font-semibold"
                  >
                    Open Full Sub-Editor →
                  </Link>
                )}
              </div>

              {/* RENDER SPECIFIC INPUTS BY SECTION TYPE */}
              {renderSectionSpecificFields(section.type as SectionType, config, onConfigChange)}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Reorder.Item>
  );
}

function renderSectionSpecificFields(
  type: SectionType,
  config: any,
  onChange: (key: string, value: any) => void
) {
  switch (type) {
    case 'hero':
      return (
        <div className="space-y-3">
          <AdminInput
            label="Top Sub-heading"
            value={config.heading || ''}
            onChange={v => onChange('heading', v)}
            placeholder="For My Love ❤️"
          />
          <AdminInput
            label="Main Title / Partner Name"
            value={config.subheading || ''}
            onChange={v => onChange('subheading', v)}
            placeholder="Charan"
          />
          <AdminInput
            label="Hero Love Note"
            value={config.message || ''}
            onChange={v => onChange('message', v)}
            placeholder="I made a little something for you..."
          />
          <AdminInput
            label="Background Image URL (Optional)"
            value={config.background_image_url || ''}
            onChange={v => onChange('background_image_url', v)}
            placeholder="https://... or /uploads/pic.jpg"
          />
          <label className="flex items-center gap-3 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={Boolean(config.show_scroll_indicator !== false)}
              onChange={e => onChange('show_scroll_indicator', e.target.checked)}
              className="w-4 h-4 rounded accent-pink-500"
            />
            <span className="text-xs font-medium" style={{ color: '#c7889a' }}>
              Show animated "Scroll" down indicator
            </span>
          </label>
        </div>
      );

    case 'secretReveal':
      return (
        <div className="space-y-3">
          <AdminInput
            label="Teaser Title"
            value={config.title || ''}
            onChange={v => onChange('title', v)}
            placeholder="Aren't we cute? 👀"
          />
          <AdminInput
            label="Subtitle Description"
            value={config.description || ''}
            onChange={v => onChange('description', v)}
            placeholder="Click to reveal something special..."
          />
          <AdminInput
            label="Revealed Photo URL"
            value={config.image_url || ''}
            onChange={v => onChange('image_url', v)}
            placeholder="https://... or /uploads/our_photo.jpg"
          />
          <AdminInput
            label="Button Text"
            value={config.reveal_text || ''}
            onChange={v => onChange('reveal_text', v)}
            placeholder="Tap to reveal ✨"
          />
          <AdminInput
            label="Post-Reveal Reaction Note"
            value={config.post_reveal_message || ''}
            onChange={v => onChange('post_reveal_message', v)}
            placeholder="We really are though 🥹"
          />
        </div>
      );

    case 'loveLetter':
      return (
        <div className="space-y-3">
          <AdminInput
            label="Salutation"
            value={config.salutation || ''}
            onChange={v => onChange('salutation', v)}
            placeholder="My Love,"
          />
          <AdminTextarea
            label="Letter Body (HTML or paragraphs supported)"
            value={config.body || ''}
            onChange={v => onChange('body', v)}
            rows={5}
            placeholder="Write your heartfelt letter here..."
          />
          <div className="grid grid-cols-2 gap-3">
            <AdminInput
              label="Closing Line"
              value={config.closing || ''}
              onChange={v => onChange('closing', v)}
              placeholder="With all my heart,"
            />
            <AdminInput
              label="Signature"
              value={config.signature || ''}
              onChange={v => onChange('signature', v)}
              placeholder="Nayan ❤️"
            />
          </div>
        </div>
      );

    case 'timeTogether':
      return (
        <div className="space-y-3">
          <AdminInput
            label="Heading"
            value={config.heading || ''}
            onChange={v => onChange('heading', v)}
            placeholder="Time Together"
          />
          <AdminInput
            label="Subtitle"
            value={config.subtitle || ''}
            onChange={v => onChange('subtitle', v)}
            placeholder="Every second with you is a gift"
          />
          <div className="grid grid-cols-2 gap-3">
            <AdminInput
              label="Start Date"
              type="date"
              value={config.start_date || '2022-06-12'}
              onChange={v => onChange('start_date', v)}
            />
            <AdminInput
              label="Start Time"
              type="time"
              value={config.start_time || '18:30'}
              onChange={v => onChange('start_time', v)}
            />
          </div>
        </div>
      );

    case 'moonPhase':
      return (
        <div className="space-y-3">
          <AdminInput
            label="Heading"
            value={config.heading || ''}
            onChange={v => onChange('heading', v)}
            placeholder="The Moon That Night 🌙"
          />
          <AdminInput
            label="Subtitle"
            value={config.subtitle || ''}
            onChange={v => onChange('subtitle', v)}
            placeholder="Somehow, even the moon remembers that day."
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#c7889a' }}>
                Date Mode
              </label>
              <select
                value={config.date_mode || 'relationship'}
                onChange={e => onChange('date_mode', e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-sm"
                style={{ background: '#120508', border: '1px solid #3d2030', color: '#f9d8e1' }}
              >
                <option value="relationship">Use Relationship Start Date</option>
                <option value="custom">Custom Date</option>
              </select>
            </div>
            {config.date_mode === 'custom' && (
              <AdminInput
                label="Custom Date"
                type="date"
                value={config.custom_date || ''}
                onChange={v => onChange('custom_date', v)}
              />
            )}
          </div>
        </div>
      );

    case 'finalMessage':
      return (
        <div className="space-y-3">
          <AdminInput
            label="Heading"
            value={config.heading || ''}
            onChange={v => onChange('heading', v)}
            placeholder="Thank You for Being with Me ❤️"
          />
          <AdminTextarea
            label="Body Message"
            value={config.body || ''}
            onChange={v => onChange('body', v)}
            rows={5}
            placeholder="Thank you for every laugh..."
          />
          <div className="grid grid-cols-2 gap-3">
            <AdminInput
              label="Signature"
              value={config.signature || ''}
              onChange={v => onChange('signature', v)}
              placeholder="— Nayan"
            />
            <label className="flex items-center gap-3 cursor-pointer self-end pb-2">
              <input
                type="checkbox"
                checked={Boolean(config.show_hearts !== false)}
                onChange={e => onChange('show_hearts', e.target.checked)}
                className="w-4 h-4 rounded accent-pink-500"
              />
              <span className="text-xs" style={{ color: '#c7889a' }}>Show floating hearts</span>
            </label>
          </div>
        </div>
      );

    default:
      // Generic heading & subtitle for other sections
      return (
        <div className="space-y-3">
          <AdminInput
            label="Section Heading"
            value={config.heading || ''}
            onChange={v => onChange('heading', v)}
            placeholder="Section Heading"
          />
          <AdminInput
            label="Section Subtitle"
            value={config.subtitle || ''}
            onChange={v => onChange('subtitle', v)}
            placeholder="Subtitle or description"
          />
          {type === 'reasons' && (
            <AdminInput
              label="Footer Note"
              value={config.footer_note || ''}
              onChange={v => onChange('footer_note', v)}
              placeholder="...and a hundred more"
            />
          )}
          {type === 'spinWheel' && (
            <div className="grid grid-cols-2 gap-3">
              <AdminInput
                label="Spin Button Text"
                value={config.spin_button_text || 'SPIN ❤️'}
                onChange={v => onChange('spin_button_text', v)}
              />
              <AdminInput
                label="Result Prefix"
                value={config.result_prefix || "Tonight's mission:"}
                onChange={v => onChange('result_prefix', v)}
              />
            </div>
          )}
          {type === 'compatibility' && (
            <div className="grid grid-cols-2 gap-3">
              <AdminInput
                label="Partner 1 Name"
                value={config.name1 || 'Nayan'}
                onChange={v => onChange('name1', v)}
              />
              <AdminInput
                label="Partner 2 Name"
                value={config.name2 || 'Charan'}
                onChange={v => onChange('name2', v)}
              />
            </div>
          )}
        </div>
      );
  }
}
