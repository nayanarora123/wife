'use client';

import { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { useAdminData } from '@/components/admin/AdminDataContext';
import type { Reason } from '@/types';
import AdminInput from '@/components/admin/AdminInput';
import AdminTextarea from '@/components/admin/AdminTextarea';

export default function ReasonsPage() {
  const { data, updateReasons, saveChanges, isSaving, isDirty } = useAdminData();
  const [editingId, setEditingId] = useState<string | null>(null);

  const reasons = [...(data.reasons || [])].sort((a, b) => a.order_index - b.order_index);

  const addReason = () => {
    const newReason: Reason = {
      id: `reason-${Date.now()}`,
      page_id: data.page.id || 'mock-page-1',
      emoji: '💗',
      title: 'New Reason',
      description: 'Write why you adore this about her...',
      order_index: reasons.length,
    };
    updateReasons([...reasons, newReason]);
    setEditingId(newReason.id);
  };

  const updateReason = (id: string, key: string, value: string) => {
    const updated = reasons.map(r => (r.id === id ? { ...r, [key]: value } : r));
    updateReasons(updated);
  };

  const deleteReason = (id: string) => {
    if (confirm('Delete this reason?')) {
      const updated = reasons.filter(r => r.id !== id);
      updateReasons(updated);
    }
  };

  const handleReorder = (newOrder: Reason[]) => {
    const updated = newOrder.map((r, idx) => ({ ...r, order_index: idx }));
    updateReasons(updated);
  };

  const handleSave = async () => {
    await saveChanges();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold" style={{ color: '#f9d8e1' }}>Things I Love About You</h2>
          <p className="text-sm" style={{ color: '#c7889a' }}>
            {reasons.length} reasons · Drag to reorder
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addReason}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: '#2d1520', color: '#f9d8e1', border: '1px solid #3d2030' }}
          >
            + Add Reason
          </button>
          <motion.button
            onClick={handleSave}
            disabled={isSaving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all disabled:opacity-50"
            style={{ background: isDirty ? '#D94F73' : '#10b981', color: 'white' }}
          >
            {isSaving ? 'Saving...' : isDirty ? 'Save Reasons' : '✓ Saved'}
          </motion.button>
        </div>
      </div>

      <Reorder.Group axis="y" values={reasons} onReorder={handleReorder} className="space-y-3">
        {reasons.map(reason => (
          <Reorder.Item key={reason.id} value={reason} id={reason.id}>
            <motion.div
              layout
              className="rounded-2xl overflow-hidden transition-all"
              style={{
                background: '#1a0a0f',
                border: `1px solid ${editingId === reason.id ? '#D94F73' : '#2d1520'}`,
              }}
            >
              {/* Row */}
              <div
                className="flex items-center gap-3 p-4 cursor-pointer"
                onClick={() => setEditingId(editingId === reason.id ? null : reason.id)}
              >
                <span className="text-lg cursor-grab text-pink-700 select-none">⠿</span>
                <span className="text-2xl">{reason.emoji || '💗'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: '#f9d8e1' }}>
                    {reason.title}
                  </p>
                  <p className="text-xs truncate" style={{ color: '#5d3040' }}>
                    {reason.description}
                  </p>
                </div>
                <span className="text-xs" style={{ color: '#5d3040' }}>
                  {editingId === reason.id ? '▲ Close' : '▼ Edit'}
                </span>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    deleteReason(reason.id);
                  }}
                  className="text-sm p-1 ml-2 text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              </div>

              {/* Edit form */}
              {editingId === reason.id && (
                <div
                  className="px-4 pb-4 pt-2 space-y-3"
                  style={{ borderTop: '1px solid #2d1520', background: '#14060b' }}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <AdminInput
                      label="Title"
                      value={reason.title}
                      onChange={v => updateReason(reason.id, 'title', v)}
                    />
                    <AdminInput
                      label="Emoji"
                      value={reason.emoji}
                      onChange={v => updateReason(reason.id, 'emoji', v)}
                    />
                  </div>
                  <AdminTextarea
                    label="Description"
                    value={reason.description}
                    onChange={v => updateReason(reason.id, 'description', v)}
                    rows={3}
                  />
                  <AdminInput
                    label="Image URL (optional)"
                    value={reason.image_url || ''}
                    onChange={v => updateReason(reason.id, 'image_url', v)}
                    placeholder="https://... or /uploads/pic.jpg"
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
          {isSaving ? 'Saving...' : isDirty ? 'Save Reasons' : '✓ All Saved!'}
        </motion.button>
      </div>
    </div>
  );
}
