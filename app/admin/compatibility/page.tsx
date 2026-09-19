'use client';

import { motion, Reorder } from 'framer-motion';
import { useAdminData } from '@/components/admin/AdminDataContext';
import type { CompatibilityItem } from '@/types';
import AdminInput from '@/components/admin/AdminInput';

export default function CompatibilityPage() {
  const {
    data,
    updateCompatibilityItems,
    updateSectionConfig,
    saveChanges,
    isSaving,
    isDirty,
  } = useAdminData();

  const items = [...(data.compatibility_items || [])].sort((a, b) => a.order_index - b.order_index);
  const compSection = data.sections.find(s => s.type === 'compatibility');
  const compConfig = (compSection?.config as any) || { name1: 'Nayan', name2: 'Charan' };

  const addItem = () => {
    const newItem: CompatibilityItem = {
      id: `compat-${Date.now()}`,
      page_id: data.page.id || 'mock-page-1',
      label: 'New Trait',
      percentage: 95,
      order_index: items.length,
    };
    updateCompatibilityItems([...items, newItem]);
  };

  const updateItem = (id: string, key: string, value: string | number) => {
    const updated = items.map(i => (i.id === id ? { ...i, [key]: value } : i));
    updateCompatibilityItems(updated);
  };

  const deleteItem = (id: string) => {
    if (confirm('Delete this trait?')) {
      const updated = items.filter(i => i.id !== id);
      updateCompatibilityItems(updated);
    }
  };

  const handleReorder = (newOrder: CompatibilityItem[]) => {
    const updated = newOrder.map((c, idx) => ({ ...c, order_index: idx }));
    updateCompatibilityItems(updated);
  };

  const updateNames = (key: 'name1' | 'name2', value: string) => {
    if (compSection) {
      updateSectionConfig(compSection.id, { [key]: value });
    }
  };

  const handleSave = async () => {
    await saveChanges();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold" style={{ color: '#f9d8e1' }}>Love Compatibility Scores</h2>
          <p className="text-sm" style={{ color: '#c7889a' }}>
            {items.length} traits · Drag to reorder
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addItem}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: '#2d1520', color: '#f9d8e1', border: '1px solid #3d2030' }}
          >
            + Add Trait
          </button>
          <motion.button
            onClick={handleSave}
            disabled={isSaving}
            whileHover={{ scale: 1.02 }}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all disabled:opacity-50"
            style={{ background: isDirty ? '#D94F73' : '#10b981', color: 'white' }}
          >
            {isSaving ? 'Saving...' : isDirty ? 'Save Compatibility' : '✓ Saved'}
          </motion.button>
        </div>
      </div>

      {/* Couple Names for Compatibility */}
      <div className="rounded-2xl p-4 space-y-3" style={{ background: '#1a0a0f', border: '1px solid #2d1520' }}>
        <p className="text-xs font-semibold uppercase tracking-wider text-pink-400">Couple Comparison Header</p>
        <div className="grid grid-cols-2 gap-3">
          <AdminInput
            label="Your Name"
            value={compConfig.name1 || 'Nayan'}
            onChange={v => updateNames('name1', v)}
          />
          <AdminInput
            label="Partner Name"
            value={compConfig.name2 || 'Charan'}
            onChange={v => updateNames('name2', v)}
          />
        </div>
      </div>

      {/* Trait list */}
      <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="space-y-3">
        {items.map(item => (
          <Reorder.Item key={item.id} value={item} id={item.id}>
            <motion.div
              layout
              className="rounded-2xl p-4 space-y-2.5 transition-all"
              style={{ background: '#1a0a0f', border: '1px solid #2d1520' }}
            >
              <div className="flex items-center gap-3">
                <span className="cursor-grab text-pink-700 select-none">⠿</span>
                <div className="flex-1">
                  <input
                    value={item.label}
                    onChange={e => updateItem(item.id, 'label', e.target.value)}
                    className="bg-transparent text-sm font-semibold outline-none w-full border-b border-transparent focus:border-pink-500 transition-colors"
                    style={{ color: '#f9d8e1' }}
                    placeholder="Trait Name (e.g. Love, Humour)"
                  />
                </div>
                <span className="text-sm font-bold w-12 text-right" style={{ color: '#D94F73' }}>
                  {item.percentage}%
                </span>
                <button
                  type="button"
                  onClick={() => deleteItem(item.id)}
                  className="text-sm p-1 ml-2 text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              </div>

              {/* Slider */}
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={50}
                  max={100}
                  value={item.percentage}
                  onChange={e => updateItem(item.id, 'percentage', Number(e.target.value))}
                  className="flex-1 accent-pink-500"
                />
              </div>
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
          {isSaving ? 'Saving...' : isDirty ? 'Save Compatibility' : '✓ All Saved!'}
        </motion.button>
      </div>
    </div>
  );
}
