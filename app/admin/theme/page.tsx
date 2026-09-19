'use client';

import { motion } from 'framer-motion';
import { useAdminData } from '@/components/admin/AdminDataContext';
import { THEME_PRESETS } from '@/lib/theme-utils';
import AdminFormCard from '@/components/admin/AdminFormCard';

const FONT_OPTIONS = [
  'Playfair Display',
  'Inter',
  'Georgia',
  'Merriweather',
  'Lora',
  'EB Garamond',
  'Cormorant Garamond',
  'Crimson Text',
  'DM Serif Display',
];

export default function ThemePage() {
  const { data, updateTheme, saveChanges, publishChanges, isSaving, isPublishing, isDirty } = useAdminData();
  const theme = data.theme;

  const update = (key: string, value: string) => {
    updateTheme({ [key]: value });
  };

  const applyPreset = (presetName: string) => {
    const preset = THEME_PRESETS.find(p => p.name === presetName);
    if (preset) {
      updateTheme({
        ...preset.theme,
        preset_name: preset.label,
      });
    }
  };

  const handleSave = async () => {
    await saveChanges();
  };

  const handlePublish = async () => {
    await publishChanges();
  };

  const colorFields = [
    { key: 'bg_color', label: 'Background Color' },
    { key: 'primary_color', label: 'Primary Accent Color' },
    { key: 'secondary_color', label: 'Deep Wine / Secondary' },
    { key: 'card_color', label: 'Card Background' },
    { key: 'text_color', label: 'Main Text Color' },
    { key: 'muted_text_color', label: 'Muted Text Color' },
    { key: 'border_color', label: 'Border Color' },
    { key: 'button_color', label: 'Button Color' },
    { key: 'button_text_color', label: 'Button Text Color' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <h2 className="text-lg font-bold" style={{ color: '#f9d8e1' }}>Theme & Styling</h2>
          <p className="text-xs" style={{ color: '#c7889a' }}>
            Choose from curated romantic palettes or customize your colors and fonts.
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            onClick={handleSave}
            disabled={isSaving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2.5 rounded-xl font-semibold text-xs shadow-md transition-all disabled:opacity-50"
            style={{ background: '#2d1520', border: '1px solid #3d2030', color: '#f9d8e1' }}
          >
            {isSaving ? 'Saving...' : '💾 Save Draft'}
          </motion.button>
          <motion.button
            onClick={handlePublish}
            disabled={isPublishing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2.5 rounded-xl font-semibold text-xs shadow-lg transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #D94F73, #be185d)', color: 'white' }}
          >
            {isPublishing ? 'Publishing...' : 'Publish Live ✨'}
          </motion.button>
        </div>
      </div>

      {/* Presets */}
      <AdminFormCard title="Theme Presets" icon="✨">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {THEME_PRESETS.map(preset => {
            const isSelected = theme.preset_name === preset.label;
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset.name)}
                className="p-3.5 rounded-xl text-left transition-all border group relative"
                style={{
                  background: preset.theme.bg_color,
                  borderColor: isSelected ? '#D94F73' : '#3d2030',
                  boxShadow: isSelected ? '0 0 0 2px #D94F73' : 'none',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold" style={{ color: preset.theme.text_color }}>
                    {preset.label}
                  </span>
                  {isSelected && <span className="text-xs font-bold text-pink-600">✓</span>}
                </div>
                <div className="flex gap-1.5">
                  {[
                    preset.theme.primary_color,
                    preset.theme.secondary_color,
                    preset.theme.card_color,
                    preset.theme.border_color,
                  ].map((c, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full border border-black/10"
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </AdminFormCard>

      {/* Colors */}
      <AdminFormCard title="Color Palette" icon="🎨">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {colorFields.map(field => (
            <div key={field.key}>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#c7889a' }}>
                {field.label}
              </label>
              <div
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
                style={{ background: '#120508', border: '1px solid #3d2030' }}
              >
                <input
                  type="color"
                  value={(theme as any)[field.key] || '#ffffff'}
                  onChange={e => update(field.key, e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={(theme as any)[field.key] || ''}
                  onChange={e => update(field.key, e.target.value)}
                  className="flex-1 bg-transparent text-sm font-mono outline-none"
                  style={{ color: '#f9d8e1' }}
                />
              </div>
            </div>
          ))}
        </div>
      </AdminFormCard>

      {/* Typography */}
      <AdminFormCard title="Typography" icon="✍️">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: '#c7889a' }}>
              Heading Font
            </label>
            <select
              value={theme.heading_font || 'Playfair Display'}
              onChange={e => update('heading_font', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm"
              style={{ background: '#120508', border: '1px solid #3d2030', color: '#f9d8e1' }}
            >
              {FONT_OPTIONS.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: '#c7889a' }}>
              Body Font
            </label>
            <select
              value={theme.body_font || 'Inter'}
              onChange={e => update('body_font', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm"
              style={{ background: '#120508', border: '1px solid #3d2030', color: '#f9d8e1' }}
            >
              {['Inter', 'Roboto', 'Open Sans', 'Lato'].map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>
      </AdminFormCard>

      {/* Corner radius & shadows */}
      <AdminFormCard title="Shape & Shadows" icon="📐">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: '#c7889a' }}>
              Card Border Radius
            </label>
            <select
              value={theme.border_radius || '16px'}
              onChange={e => update('border_radius', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm"
              style={{ background: '#120508', border: '1px solid #3d2030', color: '#f9d8e1' }}
            >
              <option value="8px">Small (8px)</option>
              <option value="16px">Medium (16px)</option>
              <option value="24px">Large (24px)</option>
              <option value="32px">Pill / Extra Soft (32px)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: '#c7889a' }}>
              Shadow Intensity
            </label>
            <select
              value={theme.shadow_intensity || 'md'}
              onChange={e => update('shadow_intensity', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm"
              style={{ background: '#120508', border: '1px solid #3d2030', color: '#f9d8e1' }}
            >
              <option value="none">None</option>
              <option value="sm">Soft / Subtle</option>
              <option value="md">Medium Romantic</option>
              <option value="lg">Deep Floating</option>
            </select>
          </div>
        </div>
      </AdminFormCard>

      {/* ======================================================== */}
      {/* REAL-TIME LIVE THEME PREVIEW AS REQUESTED BY USER */}
      {/* ======================================================== */}
      <div className="rounded-2xl p-5 sm:p-6 space-y-4" style={{ background: '#1a0a0f', border: '1px solid #2d1520' }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-pink-400 flex items-center gap-2">
              <span>👁️</span> Live Theme Preview
            </h3>
            <p className="text-xs mt-0.5" style={{ color: '#c7889a' }}>
              Real-time demonstration of your custom colors, fonts, shapes, and buttons.
            </p>
          </div>
          <span
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{ background: '#2d1520', color: '#f9d8e1' }}
          >
            {theme.preset_name || 'Custom Palette'}
          </span>
        </div>

        {/* Mock Simulated Browser Window */}
        <div
          className="rounded-2xl overflow-hidden border transition-all duration-300 shadow-xl"
          style={{
            background: theme.bg_color,
            borderColor: theme.border_color,
            fontFamily: theme.body_font,
          }}
        >
          {/* Simulated Browser Bar */}
          <div
            className="flex items-center gap-2 px-4 py-2 border-b text-xs font-mono opacity-80"
            style={{
              background: 'rgba(0,0,0,0.05)',
              borderColor: theme.border_color,
              color: theme.muted_text_color,
            }}
          >
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
            </div>
            <span className="mx-auto text-[11px]">yourlovestory.com/love/{data.page.slug}</span>
          </div>

          {/* Simulated Website Hero & Content */}
          <div className="p-6 sm:p-8 space-y-6 text-center">
            {/* Tagline */}
            <p
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: theme.primary_color }}
            >
              FOR MY LOVE ❤️
            </p>

            {/* Couple Heading */}
            <h1
              className="text-3xl sm:text-4xl font-bold leading-tight"
              style={{
                fontFamily: theme.heading_font,
                color: theme.text_color,
              }}
            >
              {data.page.title || 'Nayan ❤️ Charan'}
            </h1>

            {/* Subtitle */}
            <p
              className="text-sm max-w-sm mx-auto leading-relaxed"
              style={{ color: theme.muted_text_color }}
            >
              {data.page.subtitle || 'For the person who makes my world better every single day.'}
            </p>

            {/* Mock Card Preview */}
            <div
              className="p-5 max-w-sm mx-auto text-left transition-all duration-300 border"
              style={{
                background: theme.card_color,
                borderColor: theme.border_color,
                borderRadius: theme.border_radius,
                boxShadow:
                  theme.shadow_intensity === 'none'
                    ? 'none'
                    : theme.shadow_intensity === 'sm'
                    ? '0 2px 8px rgba(0,0,0,0.06)'
                    : theme.shadow_intensity === 'lg'
                    ? '0 12px 28px rgba(0,0,0,0.15)'
                    : '0 4px 16px rgba(0,0,0,0.09)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💌</span>
                <span
                  className="font-bold text-sm"
                  style={{ fontFamily: theme.heading_font, color: theme.text_color }}
                >
                  A Special Note
                </span>
              </div>
              <p className="text-xs leading-relaxed mb-4" style={{ color: theme.text_color }}>
                "Every morning is brighter because you exist. Thank you for choosing me every day."
              </p>

              {/* Sample Styled Button */}
              <div className="flex justify-center">
                <button
                  type="button"
                  className="px-5 py-2 text-xs font-bold transition-transform hover:scale-105"
                  style={{
                    background: theme.button_color,
                    color: theme.button_text_color,
                    borderRadius: theme.border_radius,
                    boxShadow: `0 3px 10px ${theme.primary_color}44`,
                  }}
                >
                  Tap to Reveal Love ✨
                </button>
              </div>
            </div>

            {/* Color Swatch Indicators */}
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {[
                { label: 'Background', color: theme.bg_color },
                { label: 'Primary', color: theme.primary_color },
                { label: 'Dark Accent', color: theme.secondary_color },
                { label: 'Card', color: theme.card_color },
                { label: 'Text', color: theme.text_color },
                { label: 'Button', color: theme.button_color },
              ].map(s => (
                <div
                  key={s.label}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border"
                  style={{
                    background: 'rgba(255,255,255,0.7)',
                    borderColor: theme.border_color,
                    color: theme.text_color,
                  }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block"
                    style={{ background: s.color }}
                  />
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Save & Publish Bar */}
      <div className="flex justify-end gap-3 pt-2">
        <motion.button
          onClick={handleSave}
          disabled={isSaving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 rounded-xl font-semibold text-sm shadow-md transition-all disabled:opacity-50"
          style={{ background: '#2d1520', border: '1px solid #3d2030', color: '#f9d8e1' }}
        >
          {isSaving ? 'Saving...' : 'Save Draft'}
        </motion.button>
        <motion.button
          onClick={handlePublish}
          disabled={isPublishing}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-3 rounded-xl font-semibold text-sm shadow-lg transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #D94F73, #be185d)', color: 'white' }}
        >
          {isPublishing ? 'Publishing...' : 'Publish Live ✨'}
        </motion.button>
      </div>
    </div>
  );
}
