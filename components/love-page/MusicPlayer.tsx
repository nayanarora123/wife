'use client';

import { useEffect, useRef } from 'react';

interface Props {
  url: string;
  autoplay: boolean;
  loop: boolean;
  shouldStart: boolean;
  onAudioReady?: (audio: HTMLAudioElement) => void;
}

export default function MusicPlayer({ url, autoplay, loop, shouldStart, onAudioReady }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!url) return;
    const audio = new Audio(url);
    audio.loop = loop;
    audio.volume = 0.3;
    audioRef.current = audio;
    onAudioReady?.(audio);
    return () => { audio.pause(); audio.src = ''; };
  }, [url, loop]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !shouldStart) return;
    audio.play().catch(() => {/* autoplay blocked, user hasn't interacted */});
  }, [shouldStart]);

  return null; // Invisible component
}
