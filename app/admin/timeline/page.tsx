'use client';

import { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { useAdminData } from '@/components/admin/AdminDataContext';
import type { TimelineItem } from '@/types';
import AdminInput from '@/components/admin/AdminInput';
import AdminTextarea from '@/components/admin/AdminTextarea';

export default function TimelinePage() {
  const { data, updateTimelineItems, saveChanges, isSaving, isDirty } = useAdminData();
  const [editingId, setEditingId] = useState<string | null>(null);

  const items = [...(data.timeline_items || [])].sort((a, b) => a.order_index - b.order_index);

  const addItem = () => {
    const newItem: TimelineItem = {
      id: `timeline-${Date.now()}`,
      page_id: data.page.id || 'mock-page-1',
      date: new Date().toISOString().split('T')[0],
      title: 'Our New Milestone',
      description: 'Write about what happened on this special day...',
      location: '',
      emoji: '❤️',
      order_index: items.length,
    };
    updateTimelineItems([...items, newItem]);
    setEditingId(newItem.id);
  };

  const updateItem = (id: string, key: string, value: string) => {
    const updated = items.map(i => (i.id === id ? { ...i, [key]: value } : i));
    updateTimelineItems(updated);
  };

  const deleteItem = (id: string) => {
    if (confirm('Delete this milestone?')) {
      const updated = items.filter(i => i.id !== id);
      updateTimelineItems(updated);
    }
  };

  const handleReorder = (newOrder: TimelineItem[]) => {
    const updated = newOrder.map((it, idx) => ({ ...it, order_index: idx }));
    updateTimelineItems(updated);
  };

  const handleSave = async () => {
    await saveChanges();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold" style={{ color: '#f9d8e1' }}>Relationship Timeline</h2>
          <p className="text-sm" style={{ color: '#c7889a' }}>
            {items.length} milestones · Drag to reorder chronologically
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addItem}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: '#2d1520', color: '#f9d8e1', border: '1px solid #3d2030' }}
          >
            + Add Milestone
          </button>
          <motion.button
            onClick={handleSave}
            disabled={isSaving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all disabled:opacity-50"
            style={{ background: isDirty ? '#D94F73' : '#10b981', color: 'white' }}
          >
            {isSaving ? 'Saving...' : isDirty ? 'Save Timeline' : '✓ Saved'}
          </motion.button>
        </div>
      </div>

      <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="space-y-3">
        {items.map(item => (
          <Reorder.Item key={item.id} value={item} id={item.id}>
            <motion.div
              layout
              className="rounded-2xl overflow-hidden transition-all"
              style={{
                background: '#1a0a0f',
                border: `1px solid ${editingId === item.id ? '#D94F73' : '#2d1520'}`,
              }}
            >
              {/* Summary row */}
              <div
                className="flex items-center gap-3 p-4 cursor-pointer"
                onClick={() => setEditingId(editingId === item.id ? null : item.id)}
              >
                <span className="text-lg cursor-grab text-pink-700 select-none">⠿</span>
                <span className="text-2xl">{item.emoji || '❤️'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: '#f9d8e1' }}>
                    {item.title}
                  </p>
                  <p className="text-xs" style={{ color: '#5d3040' }}>
                    {item.date} {item.location ? `· ${item.location}` : ''}
                  </p>
                </div>
                <span className="text-xs" style={{ color: '#5d3040' }}>
                  {editingId === item.id ? '▲ Close' : '▼ Edit'}
                </span>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    deleteItem(item.id);
                  }}
                  className="text-sm p-1 ml-2 text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              </div>

              {/* Edit drawer */}
              {editingId === item.id && (
                <div
                  className="px-4 pb-4 pt-2 space-y-3"
                  style={{ borderTop: '1px solid #2d1520', background: '#14060b' }}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <AdminInput
                      label="Title"
                      value={item.title}
                      onChange={v => updateItem(item.id, 'title', v)}
                    />
                    <AdminInput
                      label="Emoji"
                      value={item.emoji}
                      onChange={v => updateItem(item.id, 'emoji', v)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <AdminInput
                      label="Date"
                      type="date"
                      value={item.date}
                      onChange={v => updateItem(item.id, 'date', v)}
                    />
                    <AdminInput
                      label="Location (optional)"
                      value={item.location || ''}
                      onChange={v => updateItem(item.id, 'location', v)}
                    />
                  </div>
                  <AdminTextarea
                    label="Story Description"
                    value={item.description}
                    onChange={v => updateItem(item.id, 'description', v)}
                    rows={3}
                  />
                  <AdminInput
                    label="Image URL (optional)"
                    value={item.image_url || ''}
                    onChange={v => updateItem(item.id, 'image_url', v)}
                    placeholder="https://... or /uploads/memory.jpg"
                  />
                </div>
              )}
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Bottom Save */}
      <div className="flex justify-end pt-2">
        <motion.button
          onClick={handleSave}
          disabled={isSaving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-7 py-3 rounded-xl font-semibold text-sm shadow-lg transition-all disabled:opacity-50"
          style={{ background: isDirty ? '#D94F73' : '#10b981', color: 'white' }}
        >
          {isSaving ? 'Saving...' : isDirty ? 'Save Timeline' : '✓ All Saved!'}
        </motion.button>
      </div>
    </div>
  );
}
