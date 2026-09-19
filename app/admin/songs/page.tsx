'use client';

import { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { useAdminData } from '@/components/admin/AdminDataContext';
import type { Song } from '@/types';
import AdminInput from '@/components/admin/AdminInput';
import AdminTextarea from '@/components/admin/AdminTextarea';

export default function SongsPage() {
  const { data, updateSongs, saveChanges, isSaving, isDirty } = useAdminData();
  const [editingId, setEditingId] = useState<string | null>(null);

  const songs = [...(data.songs || [])].sort((a, b) => a.order_index - b.order_index);

  const addSong = () => {
    const newSong: Song = {
      id: `song-${Date.now()}`,
      page_id: data.page.id || 'mock-page-1',
      title: 'Our Song',
      artist: 'Artist Name',
      description: 'Why this track is special to us...',
      youtube_url: '',
      spotify_url: '',
      order_index: songs.length,
    };
    updateSongs([...songs, newSong]);
    setEditingId(newSong.id);
  };

  const update = (id: string, key: string, value: string) => {
    const updated = songs.map(s => (s.id === id ? { ...s, [key]: value } : s));
    updateSongs(updated);
  };

  const deleteSong = (id: string) => {
    if (confirm('Delete this song?')) {
      const updated = songs.filter(s => s.id !== id);
      updateSongs(updated);
    }
  };

  const handleReorder = (newOrder: Song[]) => {
    const updated = newOrder.map((s, idx) => ({ ...s, order_index: idx }));
    updateSongs(updated);
  };

  const handleSave = async () => {
    await saveChanges();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold" style={{ color: '#f9d8e1' }}>Romantic Playlist</h2>
          <p className="text-sm" style={{ color: '#c7889a' }}>
            {songs.length} songs · Drag to reorder
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addSong}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: '#2d1520', color: '#f9d8e1', border: '1px solid #3d2030' }}
          >
            + Add Song
          </button>
          <motion.button
            onClick={handleSave}
            disabled={isSaving}
            whileHover={{ scale: 1.02 }}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all disabled:opacity-50"
            style={{ background: isDirty ? '#D94F73' : '#10b981', color: 'white' }}
          >
            {isSaving ? 'Saving...' : isDirty ? 'Save Songs' : '✓ Saved'}
          </motion.button>
        </div>
      </div>

      <Reorder.Group axis="y" values={songs} onReorder={handleReorder} className="space-y-3">
        {songs.map((song, i) => (
          <Reorder.Item key={song.id} value={song} id={song.id}>
            <motion.div
              layout
              className="rounded-2xl overflow-hidden transition-all"
              style={{
                background: '#1a0a0f',
                border: `1px solid ${editingId === song.id ? '#D94F73' : '#2d1520'}`,
              }}
            >
              <div
                className="flex items-center gap-3 p-4 cursor-pointer"
                onClick={() => setEditingId(editingId === song.id ? null : song.id)}
              >
                <span className="text-lg cursor-grab text-pink-700 select-none">⠿</span>
                <span className="text-xs font-bold w-6 text-pink-400">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: '#2d1520' }}
                >
                  🎵
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: '#f9d8e1' }}>
                    {song.title}
                  </p>
                  <p className="text-xs truncate" style={{ color: '#5d3040' }}>
                    {song.artist || 'Unknown artist'}
                  </p>
                </div>
                <span className="text-xs" style={{ color: '#5d3040' }}>
                  {editingId === song.id ? '▲ Close' : '▼ Edit'}
                </span>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    deleteSong(song.id);
                  }}
                  className="text-sm p-1 ml-2 text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              </div>

              {editingId === song.id && (
                <div
                  className="px-4 pb-4 pt-2 space-y-3"
                  style={{ borderTop: '1px solid #2d1520', background: '#14060b' }}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <AdminInput
                      label="Song Title"
                      value={song.title}
                      onChange={v => update(song.id, 'title', v)}
                    />
                    <AdminInput
                      label="Artist"
                      value={song.artist}
                      onChange={v => update(song.id, 'artist', v)}
                    />
                  </div>
                  <AdminInput
                    label="YouTube URL"
                    value={song.youtube_url || ''}
                    onChange={v => update(song.id, 'youtube_url', v)}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <AdminInput
                    label="Spotify URL (optional)"
                    value={song.spotify_url || ''}
                    onChange={v => update(song.id, 'spotify_url', v)}
                    placeholder="https://open.spotify.com/track/..."
                  />
                  <AdminTextarea
                    label="Memory / Note"
                    value={song.description || ''}
                    onChange={v => update(song.id, 'description', v)}
                    rows={2}
                    placeholder="This song always reminds me of us..."
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
          className="px-7 py-3 rounded-xl font-semibold text-sm shadow-lg transition-all disabled:opacity-50"
          style={{ background: isDirty ? '#D94F73' : '#10b981', color: 'white' }}
        >
          {isSaving ? 'Saving...' : isDirty ? 'Save Songs' : '✓ All Saved!'}
        </motion.button>
      </div>
    </div>
  );
}
