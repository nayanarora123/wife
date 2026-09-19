'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FullPageData, SectionType } from '@/types';
import TapToEnter from './TapToEnter';
import BackgroundEffects from './BackgroundEffects';
import MusicPlayer from './MusicPlayer';
import Hero from './Hero';
import SecretReveal from './SecretReveal';
import LoveLetter from './LoveLetter';
import Timeline from './Timeline';
import TimeTogether from './TimeTogether';
import Reasons from './Reasons';
import LoveQuiz from './LoveQuiz';
import MarriageGame from './MarriageGame';
import MemoryGallery from './MemoryGallery';
import SpinWheel from './SpinWheel';
import Compatibility from './Compatibility';
import Songs from './Songs';
import MoonPhase from './MoonPhase';
import FinalMessage from './FinalMessage';

interface Props {
  data: FullPageData;
  isPreview?: boolean;
}

export default function LovePageClient({ data, isPreview = false }: Props) {
  const [entered, setEntered] = useState(isPreview);
  const [musicStarted, setMusicStarted] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  const handleEnter = () => {
    setEntered(true);
    setMusicStarted(true);
  };

  const enabledSections = data.sections
    .filter(s => s.enabled)
    .sort((a, b) => a.order_index - b.order_index);

  const renderSection = (section: typeof data.sections[0]) => {
    switch (section.type as SectionType) {
      case 'hero':
        return <Hero key={section.id} section={section} page={data.page} />;
      case 'secretReveal':
        return <SecretReveal key={section.id} section={section} />;
      case 'loveLetter':
        return <LoveLetter key={section.id} section={section} />;
      case 'timeline':
        return <Timeline key={section.id} section={section} items={data.timeline_items} />;
      case 'timeTogether':
        return <TimeTogether key={section.id} section={section} />;
      case 'reasons':
        return <Reasons key={section.id} section={section} reasons={data.reasons} />;
      case 'quiz':
        return <LoveQuiz key={section.id} section={section} questions={data.game_questions} />;
      case 'marriageGame':
        return <MarriageGame key={section.id} section={section} />;
      case 'gallery':
        return <MemoryGallery key={section.id} section={section} memories={data.memories} />;
      case 'spinWheel':
        return <SpinWheel key={section.id} section={section} items={data.wheel_items} />;
      case 'compatibility':
        return <Compatibility key={section.id} section={section} items={data.compatibility_items} />;
      case 'songs':
        return <Songs key={section.id} section={section} songs={data.songs} />;
      case 'moonPhase':
        return <MoonPhase key={section.id} section={section} page={data.page} />;
      case 'finalMessage':
        return <FinalMessage key={section.id} section={section} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Background effects */}
      {data.page.bg_effects_enabled && (
        <BackgroundEffects
          type={data.page.bg_effects_type}
          density={data.page.bg_effects_density}
          speed={data.page.bg_effects_speed}
        />
      )}

      {/* Music player */}
      {data.page.music_url && (
        <MusicPlayer
          url={data.page.music_url}
          autoplay={data.page.music_autoplay}
          loop={data.page.music_loop}
          shouldStart={musicStarted}
          onAudioReady={setAudioRef}
        />
      )}

      {/* Tap to Enter overlay */}
      <AnimatePresence>
        {!entered && (
          <TapToEnter
            page={data.page}
            onEnter={handleEnter}
          />
        )}
      </AnimatePresence>

      {/* Main content - rendered in DOM with smooth reveal */}
      <main
        className="relative z-10 transition-opacity duration-700"
        style={{ opacity: entered ? 1 : 0.05 }}
      >
        {enabledSections.map(renderSection)}

        {/* Footer */}
        <footer className="text-center py-8 pb-16">
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
            {data.page.footer_text}
          </p>
        </footer>
      </main>
    </div>
  );
}
