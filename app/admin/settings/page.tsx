'use client';

import { motion } from 'framer-motion';
import { useAdminData } from '@/components/admin/AdminDataContext';
import AdminFormCard from '@/components/admin/AdminFormCard';
import AdminInput from '@/components/admin/AdminInput';
import AdminTextarea from '@/components/admin/AdminTextarea';

export default function SettingsPage() {
  const { data, updatePage, updateSectionConfig, saveChanges, isSaving, isDirty } = useAdminData();
  const page = data.page;

  const update = (key: string, value: string | boolean | number) => {
    updatePage({ [key]: value });

    // Sync relationship start date to timeTogether section config as well
    if (key === 'relationship_start_date' || key === 'relationship_start_time') {
      const timeTogetherSec = data.sections.find(s => s.type === 'timeTogether');
      if (timeTogetherSec) {
        updateSectionConfig(timeTogetherSec.id, {
          [key === 'relationship_start_date' ? 'start_date' : 'start_time']: value,
        });
      }
    }
  };

  const handleSave = async () => {
    await saveChanges();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-2">
        <div>
          <h2 className="text-lg font-bold" style={{ color: '#f9d8e1' }}>Page Settings</h2>
          <p className="text-xs" style={{ color: '#c7889a' }}>
            Configure basic information, couple names, custom slug, and background music.
          </p>
        </div>
        <motion.button
          onClick={handleSave}
          disabled={isSaving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all disabled:opacity-50"
          style={{ background: isDirty ? '#D94F73' : '#10b981', color: 'white' }}
        >
          {isSaving ? 'Saving...' : isDirty ? 'Save Changes' : '✓ Saved'}
        </motion.button>
      </div>

      <AdminFormCard title="Basic Information" icon="💝">
        <AdminInput
          label="Author Name (You)"
          value={page.author_name || ''}
          onChange={v => update('author_name', v)}
          placeholder="Nayan"
        />
        <AdminInput
          label="Partner Name (Her)"
          value={page.partner_name || ''}
          onChange={v => update('partner_name', v)}
          placeholder="Charan"
        />
        <AdminInput
          label="Page Title"
          value={page.title || ''}
          onChange={v => update('title', v)}
          placeholder="Nayan ❤️ Charan"
        />
        <AdminTextarea
          label="Subtitle"
          value={page.subtitle || ''}
          onChange={v => update('subtitle', v)}
          placeholder="For the person who makes my world better..."
        />
        <AdminInput
          label="Custom URL Slug"
          value={page.slug || ''}
          onChange={v => update('slug', v.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
          placeholder="nayan-charan"
          prefix="/love/"
        />
      </AdminFormCard>

      <AdminFormCard title="Hero & Special Dates" icon="🏠">
        <AdminInput
          label="Hero Subtitle Message"
          value={page.hero_message || ''}
          onChange={v => update('hero_message', v)}
          placeholder="I made a little something for you..."
        />
        <AdminInput
          label="Relationship Start Date"
          type="date"
          value={page.relationship_start_date || ''}
          onChange={v => update('relationship_start_date', v)}
        />
        <AdminInput
          label="Relationship Start Time"
          type="time"
          value={page.relationship_start_time || ''}
          onChange={v => update('relationship_start_time', v)}
        />
      </AdminFormCard>

      <AdminFormCard title="SEO & Sharing Previews" icon="🔗">
        <AdminInput
          label="Browser Tab Title"
          value={page.browser_title || ''}
          onChange={v => update('browser_title', v)}
        />
        <AdminInput
          label="OG Title (WhatsApp / Social preview)"
          value={page.og_title || ''}
          onChange={v => update('og_title', v)}
        />
        <AdminTextarea
          label="OG Description"
          value={page.og_description || ''}
          onChange={v => update('og_description', v)}
        />
      </AdminFormCard>

      <AdminFormCard title="Footer" icon="📝">
        <AdminInput
          label="Footer Text"
          value={page.footer_text || ''}
          onChange={v => update('footer_text', v)}
          placeholder="Made with love by Nayan ❤️"
        />
      </AdminFormCard>

      <AdminFormCard title="Background Music" icon="🎵">
        <AdminInput
          label="Music URL (MP3 or direct audio file)"
          value={page.music_url || ''}
          onChange={v => update('music_url', v)}
          placeholder="https://... or /uploads/song.mp3"
        />
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(page.music_autoplay)}
              onChange={e => update('music_autoplay', e.target.checked)}
              className="w-4 h-4 rounded accent-pink-500"
            />
            <span className="text-sm" style={{ color: '#c7889a' }}>Autoplay after enter</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(page.music_loop)}
              onChange={e => update('music_loop', e.target.checked)}
              className="w-4 h-4 rounded accent-pink-500"
            />
            <span className="text-sm" style={{ color: '#c7889a' }}>Loop continuously</span>
          </label>
        </div>
      </AdminFormCard>

      <AdminFormCard title="Background Floating Effects" icon="✨">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#c7889a' }}>
              Effect Type
            </label>
            <select
              value={page.bg_effects_type || 'hearts'}
              onChange={e => update('bg_effects_type', e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm"
              style={{ background: '#120508', border: '1px solid #3d2030', color: '#f9d8e1' }}
            >
              <option value="hearts">Hearts ❤️</option>
              <option value="sparkles">Sparkles ✨</option>
              <option value="petals">Petals 🌸</option>
              <option value="dots">Dots •</option>
            </select>
          </div>
          <label className="flex items-center gap-3 cursor-pointer self-end pb-2">
            <input
              type="checkbox"
              checked={Boolean(page.bg_effects_enabled)}
              onChange={e => update('bg_effects_enabled', e.target.checked)}
              className="w-4 h-4 rounded accent-pink-500"
            />
            <span className="text-sm" style={{ color: '#c7889a' }}>Enable floating effects</span>
          </label>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#c7889a' }}>
            Density: {page.bg_effects_density || 4}
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={page.bg_effects_density || 4}
            onChange={e => update('bg_effects_density', Number(e.target.value))}
            className="w-full accent-pink-500"
          />
        </div>
      </AdminFormCard>

      {/* Bottom Save bar */}
      <div className="flex justify-end gap-3 pt-2">
        <motion.button
          onClick={handleSave}
          disabled={isSaving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-7 py-3 rounded-xl font-semibold text-sm shadow-lg transition-all disabled:opacity-50"
          style={{ background: isDirty ? '#D94F73' : '#10b981', color: 'white' }}
        >
          {isSaving ? 'Saving...' : isDirty ? 'Save Changes' : '✓ All Saved!'}
        </motion.button>
      </div>
    </div>
  );
}
