'use client';

import { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { useAdminData } from '@/components/admin/AdminDataContext';
import type { WheelItem } from '@/types';
import AdminInput from '@/components/admin/AdminInput';

const WHEEL_COLORS = ['#D94F73', '#9E2F50', '#F472B6', '#EC4899', '#BE185D', '#F9A8D4', '#FBCFE8'];

export default function WheelPage() {
  const { data, updateWheelItems, saveChanges, isSaving, isDirty } = useAdminData();
  const [editingId, setEditingId] = useState<string | null>(null);

  const items = [...(data.wheel_items || [])].sort((a, b) => a.order_index - b.order_index);

  const addItem = () => {
    const newItem: WheelItem = {
      id: `wheel-${Date.now()}`,
      page_id: data.page.id || 'mock-page-1',
      text: 'New Option',
      emoji: '🎁',
      weight: 1,
      result_message: 'You unlocked this special prize!',
      color: WHEEL_COLORS[items.length % WHEEL_COLORS.length],
      order_index: items.length,
    };
    updateWheelItems([...items, newItem]);
    setEditingId(newItem.id);
  };

  const update = (id: string, key: string, value: string | number) => {
    const updated = items.map(i => (i.id === id ? { ...i, [key]: value } : i));
    updateWheelItems(updated);
  };

  const deleteItem = (id: string) => {
    if (confirm('Delete this wheel slice?')) {
      const updated = items.filter(i => i.id !== id);
      updateWheelItems(updated);
    }
  };

  const handleReorder = (newOrder: WheelItem[]) => {
    const updated = newOrder.map((w, idx) => ({ ...w, order_index: idx }));
    updateWheelItems(updated);
  };

  const handleSave = async () => {
    await saveChanges();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold" style={{ color: '#f9d8e1' }}>Spin Wheel Activities</h2>
          <p className="text-sm" style={{ color: '#c7889a' }}>
            {items.length} options on wheel · Drag to reorder slices
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addItem}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: '#2d1520', color: '#f9d8e1', border: '1px solid #3d2030' }}
          >
            + Add Option
          </button>
          <motion.button
            onClick={handleSave}
            disabled={isSaving}
            whileHover={{ scale: 1.02 }}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all disabled:opacity-50"
            style={{ background: isDirty ? '#D94F73' : '#10b981', color: 'white' }}
          >
            {isSaving ? 'Saving...' : isDirty ? 'Save Wheel' : '✓ Saved'}
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
              {/* Row summary */}
              <div
                className="flex items-center gap-3 p-4 cursor-pointer"
                onClick={() => setEditingId(editingId === item.id ? null : item.id)}
              >
                <span className="cursor-grab text-pink-700 select-none">⠿</span>
                <div
                  className="w-5 h-5 rounded-full flex-shrink-0 border border-white/20"
                  style={{ background: item.color }}
                />
                <span className="text-xl">{item.emoji || '🎁'}</span>
                <p className="flex-1 text-sm font-semibold truncate" style={{ color: '#f9d8e1' }}>
                  {item.text}
                </p>
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-mono"
                  style={{ background: '#2d1520', color: '#c7889a' }}
                >
                  Weight: {item.weight}
                </span>
                <span className="text-xs" style={{ color: '#5d3040' }}>
                  {editingId === item.id ? '▲' : '▼'}
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

              {/* Edit Drawer */}
              {editingId === item.id && (
                <div
                  className="px-4 pb-4 pt-2 space-y-3"
                  style={{ borderTop: '1px solid #2d1520', background: '#14060b' }}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <AdminInput
                      label="Option Text"
                      value={item.text}
                      onChange={v => update(item.id, 'text', v)}
                    />
                    <AdminInput
                      label="Emoji"
                      value={item.emoji}
                      onChange={v => update(item.id, 'emoji', v)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1" style={{ color: '#c7889a' }}>
                        Slice Color
                      </label>
                      <div
                        className="flex items-center gap-2 px-3 py-2 rounded-xl"
                        style={{ background: '#120508', border: '1px solid #3d2030' }}
                      >
                        <input
                          type="color"
                          value={item.color || '#D94F73'}
                          onChange={e => update(item.id, 'color', e.target.value)}
                          className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={item.color || ''}
                          onChange={e => update(item.id, 'color', e.target.value)}
                          className="flex-1 bg-transparent text-xs font-mono outline-none"
                          style={{ color: '#f9d8e1' }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1" style={{ color: '#c7889a' }}>
                        Probability Weight: {item.weight}
                      </label>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={item.weight}
                        onChange={e => update(item.id, 'weight', Number(e.target.value))}
                        className="w-full mt-3 accent-pink-500"
                      />
                    </div>
                  </div>
                  <AdminInput
                    label="Result Message When Landed On"
                    value={item.result_message || ''}
                    onChange={v => update(item.id, 'result_message', v)}
                    placeholder="e.g. Pick a movie and cuddle up! 🍿"
                  />
                </div>
              )}
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <motion.button
          onClick={handleSave}
          disabled={isSaving}
          whileHover={{ scale: 1.02 }}
          className="px-7 py-3 rounded-xl font-semibold text-sm shadow-lg transition-all disabled:opacity-50"
          style={{ background: isDirty ? '#D94F73' : '#10b981', color: 'white' }}
        >
          {isSaving ? 'Saving...' : isDirty ? 'Save Wheel Options' : '✓ All Saved!'}
        </motion.button>
      </div>
    </div>
  );
}
