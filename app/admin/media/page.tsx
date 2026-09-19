'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAdminData } from '@/components/admin/AdminDataContext';

interface MediaItem {
  id: string;
  url: string;
  name: string;
  size: string;
  type: string;
}

const DEFAULT_MEDIA: MediaItem[] = [
  {
    id: 'm-1',
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400',
    name: 'together.jpg',
    size: '1.2 MB',
    type: 'image/jpeg',
  },
  {
    id: 'm-2',
    url: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400',
    name: 'laughing.jpg',
    size: '0.9 MB',
    type: 'image/jpeg',
  },
  {
    id: 'm-3',
    url: 'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=400',
    name: 'ordinary_day.jpg',
    size: '1.5 MB',
    type: 'image/jpeg',
  },
];

export default function MediaPage() {
  const { data, updateMemories, saveChanges } = useAdminData();
  const [media, setMedia] = useState<MediaItem[]>(DEFAULT_MEDIA);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('love_story_media_library');
      if (saved) {
        setMedia(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const saveMediaList = (newItems: MediaItem[]) => {
    setMedia(newItems);
    try {
      localStorage.setItem('love_story_media_library', JSON.stringify(newItems));
    } catch {}
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const deleteMedia = (id: string) => {
    const updated = media.filter(m => m.id !== id);
    saveMediaList(updated);
  };

  const addToGallery = async (url: string, name: string) => {
    const newMemory = {
      id: `memory-${Date.now()}`,
      page_id: data.page.id || 'mock-page-1',
      image_url: url,
      caption: name.replace(/\.[^/.]+$/, ''),
      date: new Date().toISOString().split('T')[0],
      location: '',
      order_index: (data.memories || []).length,
    };
    updateMemories([...(data.memories || []), newMemory]);
    await saveChanges();
    alert('Added to Photo Gallery & Saved!');
  };

  const uploadFiles = async (files: File[]) => {
    if (!files.length) return;
    setUploading(true);

    const uploadedItems: MediaItem[] = [];

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const result = await res.json();
          uploadedItems.push({
            id: `up-${Date.now()}-${Math.random()}`,
            url: result.url,
            name: result.name,
            size: result.size,
            type: result.type,
          });
        }
      } catch (err) {
        console.error('Upload failed:', err);
      }
    }

    if (uploadedItems.length) {
      saveMediaList([...uploadedItems, ...media]);
    }
    setUploading(false);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    uploadFiles(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      uploadFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold" style={{ color: '#f9d8e1' }}>Media Library</h2>
          <p className="text-sm" style={{ color: '#c7889a' }}>
            Upload photos and audio files to use anywhere in your love story
          </p>
        </div>
      </div>

      {/* Upload zone */}
      <motion.div
        onDragOver={e => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleFileDrop}
        onClick={() => fileInput.current?.click()}
        animate={{ scale: dragOver ? 1.01 : 1 }}
        className="rounded-2xl p-8 text-center cursor-pointer transition-all"
        style={{
          border: `2px dashed ${dragOver ? '#D94F73' : '#3d2030'}`,
          background: dragOver ? 'rgba(217, 79, 115, 0.08)' : '#1a0a0f',
        }}
      >
        <input
          ref={fileInput}
          type="file"
          multiple
          accept="image/*,audio/*"
          className="hidden"
          onChange={handleFileInputChange}
        />
        <div className="text-4xl mb-3">{uploading ? '⏳' : '📁'}</div>
        <p className="text-sm font-semibold mb-1" style={{ color: '#f9d8e1' }}>
          {uploading ? 'Uploading files to server...' : 'Drop files here or click to browse'}
        </p>
        <p className="text-xs" style={{ color: '#5d3040' }}>
          Supports JPG, PNG, WEBP, GIF, MP3 files (saved into /public/uploads/)
        </p>
      </motion.div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {media.map(item => (
          <div
            key={item.id}
            className="rounded-2xl overflow-hidden group transition-all"
            style={{ background: '#1a0a0f', border: '1px solid #2d1520' }}
          >
            {/* Image preview */}
            <div
              className="h-36 bg-cover bg-center relative"
              style={{ backgroundImage: `url(${item.url})` }}
            >
              <button
                type="button"
                onClick={() => deleteMedia(item.id)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 flex items-center justify-center text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>

            {/* Info and actions */}
            <div className="p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold truncate flex-1" style={{ color: '#f9d8e1' }}>
                  {item.name}
                </p>
                <span className="text-xs font-mono ml-2" style={{ color: '#5d3040' }}>
                  {item.size}
                </span>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => copyUrl(item.url, item.id)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: copied === item.id ? '#22c55e' : '#2d1520',
                    color: copied === item.id ? 'white' : '#c7889a',
                  }}
                >
                  {copied === item.id ? '✓ Copied!' : 'Copy URL'}
                </button>
                <button
                  type="button"
                  onClick={() => addToGallery(item.url, item.name)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                  style={{ background: '#3d1d28', color: '#f9d8e1' }}
                  title="Add directly to photo gallery"
                >
                  + Gallery
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
