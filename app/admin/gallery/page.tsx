'use client';

import { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { useAdminData } from '@/components/admin/AdminDataContext';
import type { Memory } from '@/types';
import AdminInput from '@/components/admin/AdminInput';

export default function GalleryPage() {
  const {
    data,
    updateMemories,
    updateSectionConfig,
    saveChanges,
    publishChanges,
    isSaving,
    isPublishing,
    isDirty,
  } = useAdminData();

  const [editingId, setEditingId] = useState<string | null>(null);

  const memories = [...(data.memories || [])].sort((a, b) => a.order_index - b.order_index);
  const gallerySection = data.sections.find(s => s.type === 'gallery');
  const currentLayout = (gallerySection?.config as any)?.layout || 'polaroid';

  const update = (id: string, key: string, value: string) => {
    const updated = memories.map(m => (m.id === id ? { ...m, [key]: value } : m));
    updateMemories(updated);
  };

  const addMemory = () => {
    const m: Memory = {
      id: `memory-${Date.now()}`,
      page_id: data.page.id || 'mock-page-1',
      image_url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400',
      caption: 'A sweet memory together',
      date: new Date().toISOString().split('T')[0],
      location: '',
      order_index: memories.length,
    };
    updateMemories([...memories, m]);
    setEditingId(m.id);
  };

  const deleteMemory = (id: string) => {
    if (confirm('Delete this photo memory?')) {
      const updated = memories.filter(m => m.id !== id);
      updateMemories(updated);
    }
  };

  const setLayout = (layout: 'polaroid' | 'masonry' | 'carousel') => {
    if (gallerySection) {
      updateSectionConfig(gallerySection.id, { layout });
    }
  };

  const handleReorder = (newOrder: Memory[]) => {
    const updated = newOrder.map((m, idx) => ({ ...m, order_index: idx }));
    updateMemories(updated);
  };

  const handleSave = async () => {
    await saveChanges();
  };

  const handlePublish = async () => {
    await publishChanges();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold" style={{ color: '#f9d8e1' }}>Photo Memories Gallery</h2>
          <p className="text-sm" style={{ color: '#c7889a' }}>
            {memories.length} photos · Choose layout and drag to reorder
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={addMemory}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: '#2d1520', color: '#f9d8e1', border: '1px solid #3d2030' }}
          >
            + Add Photo
          </button>
          <motion.button
            onClick={handleSave}
            disabled={isSaving}
            whileHover={{ scale: 1.02 }}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all disabled:opacity-50"
            style={{ background: isDirty ? '#3d2030' : '#22c55e22', color: isDirty ? '#f9d8e1' : '#22c55e', border: '1px solid #3d2030' }}
          >
            {isSaving ? 'Saving...' : isDirty ? '💾 Save Draft' : '✓ Saved'}
          </motion.button>
          <motion.button
            onClick={handlePublish}
            disabled={isPublishing}
            whileHover={{ scale: 1.02 }}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #D94F73, #be185d)', color: 'white' }}
          >
            {isPublishing ? 'Publishing...' : 'Publish Live ✨'}
          </motion.button>
        </div>
      </div>

      {/* Layout selector */}
      <div className="rounded-2xl p-5" style={{ background: '#1a0a0f', border: '1px solid #2d1520' }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-pink-400">
            Select Gallery Layout Style
          </p>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize" style={{ background: '#2d1520', color: '#f9d8e1' }}>
            Active: {currentLayout}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {(['polaroid', 'masonry', 'carousel'] as const).map(l => {
            const isActive = currentLayout === l;
            return (
              <button
                key={l}
                type="button"
                onClick={() => setLayout(l)}
                className="py-3 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1.5 border"
                style={{
                  background: isActive ? 'linear-gradient(135deg, #D94F73, #9e2f50)' : '#14060b',
                  color: isActive ? 'white' : '#c7889a',
                  borderColor: isActive ? '#f472b6' : '#2d1520',
                  boxShadow: isActive ? '0 4px 12px rgba(217, 79, 115, 0.3)' : 'none',
                }}
              >
                <span className="text-xl">
                  {l === 'polaroid' ? '📷' : l === 'masonry' ? '🧱' : '🎠'}
                </span>
                <span className="capitalize">{l}</span>
                <span className="text-[10px] font-normal opacity-80">
                  {l === 'polaroid' ? 'Tilted photo cards' : l === 'masonry' ? 'Pinterest grid' : 'Smooth slider'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Layout Preview Box */}
        <div className="mt-4 pt-4 border-t border-[#2d1520]">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#a76a7d] mb-2.5">
            Layout Preview ({currentLayout}):
          </p>

          <div
            className="p-4 rounded-xl border border-[#3d2030] overflow-hidden"
            style={{ background: '#0e0407' }}
          >
            {currentLayout === 'polaroid' && (
              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
                {memories.slice(0, 3).map((mem, i) => (
                  <div
                    key={mem.id}
                    className="p-1.5 bg-white rounded shadow-sm transition-transform"
                    style={{
                      transform: `rotate(${i === 0 ? '-3deg' : i === 1 ? '2deg' : '-2deg'})`,
                    }}
                  >
                    <div
                      className="aspect-square bg-cover bg-center rounded-sm"
                      style={{ backgroundImage: `url(${mem.image_url})` }}
                    />
                    <p className="text-[8px] text-gray-700 italic text-center mt-1 truncate">
                      {mem.caption || 'Memory'}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {currentLayout === 'masonry' && (
              <div className="columns-3 gap-2 max-w-sm mx-auto">
                {memories.slice(0, 3).map((mem, i) => (
                  <div
                    key={mem.id}
                    className="bg-[#1f0d15] rounded-lg overflow-hidden border border-[#3d2030] mb-2 break-inside-avoid"
                  >
                    <div
                      className="bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${mem.image_url})`,
                        height: i === 1 ? 65 : 50,
                      }}
                    />
                    <p className="p-1 text-[8px] text-[#f9d8e1] truncate">
                      {mem.caption || 'Memory'}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {currentLayout === 'carousel' && (
              <div className="max-w-xs mx-auto text-center">
                <div className="relative rounded-xl overflow-hidden border border-[#3d2030] bg-[#1f0d15] aspect-video">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${memories[0]?.image_url})` }}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1.5 text-[9px] text-white truncate">
                    {memories[0]?.caption || 'Photo Slider (1 of ' + memories.length + ')'}
                  </div>
                </div>
                <div className="flex justify-center gap-1 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Photos List */}
      <Reorder.Group axis="y" values={memories} onReorder={handleReorder} className="space-y-3">
        {memories.map(mem => (
          <Reorder.Item key={mem.id} value={mem} id={mem.id}>
            <motion.div
              layout
              className="rounded-2xl overflow-hidden"
              style={{
                background: '#1a0a0f',
                border: `1px solid ${editingId === mem.id ? '#D94F73' : '#2d1520'}`,
              }}
            >
              <div
                className="flex items-center gap-3.5 p-3.5 cursor-pointer"
                onClick={() => setEditingId(editingId === mem.id ? null : mem.id)}
              >
                <span className="text-lg cursor-grab text-pink-700 select-none">⠿</span>
                {/* Image thumbnail */}
                <div
                  className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-cover bg-center border border-white/10"
                  style={{ backgroundImage: `url(${mem.image_url})` }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: '#f9d8e1' }}>
                    {mem.caption || 'Photo'}
                  </p>
                  <p className="text-xs truncate" style={{ color: '#5d3040' }}>
                    {mem.date || 'No date'} {mem.location ? `· ${mem.location}` : ''}
                  </p>
                </div>
                <span className="text-xs" style={{ color: '#5d3040' }}>
                  {editingId === mem.id ? '▲ Close' : '▼ Edit'}
                </span>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    deleteMemory(mem.id);
                  }}
                  className="text-sm p-1 ml-2 text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              </div>

              {/* Edit Drawer */}
              {editingId === mem.id && (
                <div
                  className="px-4 pb-4 pt-2 space-y-3"
                  style={{ borderTop: '1px solid #2d1520', background: '#14060b' }}
                >
                  <AdminInput
                    label="Image URL or Path"
                    value={mem.image_url}
                    onChange={v => update(mem.id, 'image_url', v)}
                    placeholder="https://... or /uploads/memory.jpg"
                  />
                  <AdminInput
                    label="Caption"
                    value={mem.caption || ''}
                    onChange={v => update(mem.id, 'caption', v)}
                    placeholder="That evening we stayed out too late..."
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <AdminInput
                      label="Date"
                      type="date"
                      value={mem.date || ''}
                      onChange={v => update(mem.id, 'date', v)}
                    />
                    <AdminInput
                      label="Location"
                      value={mem.location || ''}
                      onChange={v => update(mem.id, 'location', v)}
                      placeholder="Hyderabad"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Bottom Save & Publish Bar */}
      <div className="flex justify-end gap-3 pt-2">
        <motion.button
          onClick={handleSave}
          disabled={isSaving}
          whileHover={{ scale: 1.02 }}
          className="px-6 py-3 rounded-xl font-semibold text-sm shadow-md transition-all disabled:opacity-50"
          style={{ background: '#2d1520', border: '1px solid #3d2030', color: '#f9d8e1' }}
        >
          {isSaving ? 'Saving...' : 'Save Draft'}
        </motion.button>
        <motion.button
          onClick={handlePublish}
          disabled={isPublishing}
          whileHover={{ scale: 1.02 }}
          className="px-8 py-3 rounded-xl font-semibold text-sm shadow-lg transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #D94F73, #be185d)', color: 'white' }}
        >
          {isPublishing ? 'Publishing...' : 'Publish Live ✨'}
        </motion.button>
      </div>
    </div>
  );
}
