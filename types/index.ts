// ============================================================
// Central TypeScript types for the Love Story Platform
// ============================================================

export type PageStatus = 'draft' | 'published';

export type SectionType =
  | 'hero'
  | 'secretReveal'
  | 'loveLetter'
  | 'timeline'
  | 'timeTogether'
  | 'reasons'
  | 'quiz'
  | 'marriageGame'
  | 'gallery'
  | 'spinWheel'
  | 'compatibility'
  | 'songs'
  | 'slideshow'
  | 'moonPhase'
  | 'finalMessage';

export interface LovePage {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  subtitle: string;
  status: PageStatus;
  hero_name: string;
  partner_name: string;
  author_name: string;
  relationship_start_date: string; // ISO date string YYYY-MM-DD
  relationship_start_time: string; // HH:MM
  timezone: string;
  browser_title: string;
  og_title: string;
  og_description: string;
  og_image_url: string | null;
  favicon_url: string | null;
  hero_message: string;
  footer_text: string;
  music_url: string | null;
  music_autoplay: boolean;
  music_loop: boolean;
  bg_effects_enabled: boolean;
  bg_effects_type: 'hearts' | 'dots' | 'sparkles' | 'petals';
  bg_effects_density: number; // 1-10
  bg_effects_speed: number; // 1-10
  created_at: string;
  updated_at: string;
}

export interface PageTheme {
  id: string;
  page_id: string;
  bg_color: string;
  primary_color: string;
  secondary_color: string;
  card_color: string;
  text_color: string;
  muted_text_color: string;
  border_color: string;
  button_color: string;
  button_text_color: string;
  heading_font: string;
  body_font: string;
  border_radius: string; // e.g. '16px'
  shadow_intensity: string; // 'none' | 'sm' | 'md' | 'lg'
  preset_name: string | null;
}

export interface Section {
  id: string;
  page_id: string;
  type: SectionType;
  title: string;
  enabled: boolean;
  order_index: number;
  config: SectionConfig;
  created_at: string;
}

// ---- Section Configs ----
export interface HeroConfig {
  heading: string;
  subheading: string;
  message: string;
  background_image_url?: string;
  show_scroll_indicator: boolean;
}

export interface SecretRevealConfig {
  title: string;
  description: string;
  image_url: string;
  reveal_text: string;
  post_reveal_message: string;
}

export interface LoveLetterConfig {
  salutation: string;
  body: string; // HTML rich text
  closing: string;
  signature: string;
}

export interface TimelineConfig {
  heading: string;
  subtitle: string;
}

export interface TimeTogetherConfig {
  heading: string;
  subtitle: string;
  start_date: string;
  start_time: string;
  timezone: string;
}

export interface ReasonsConfig {
  heading: string;
  subtitle: string;
  footer_note: string;
}

export interface QuizConfig {
  heading: string;
  subtitle: string;
  completion_message: string;
}

export interface MarriageGameConfig {
  heading: string;
  question: string;
  yes_button_text: string;
  no_button_texts: string[]; // array of escalating messages
  yes_celebration_title: string;
  yes_celebration_subtitle: string;
  yes_celebration_body: string;
}

export interface GalleryConfig {
  heading: string;
  subtitle: string;
  layout: 'polaroid' | 'masonry' | 'carousel';
}

export interface SpinWheelConfig {
  heading: string;
  subtitle: string;
  spin_button_text: string;
  result_prefix: string;
}

export interface CompatibilityConfig {
  heading: string;
  subtitle: string;
  name1: string;
  name2: string;
}

export interface SongsConfig {
  heading: string;
  subtitle: string;
}

export interface SlideshowConfig {
  heading: string;
  subtitle: string;
  autoplay: boolean;
  interval: number; // seconds
  transition: 'fade' | 'slide';
}

export interface MoonPhaseConfig {
  heading: string;
  subtitle: string;
  date_mode: 'relationship' | 'custom';
  custom_date?: string;
}

export interface FinalMessageConfig {
  heading: string;
  body: string; // HTML rich text
  signature: string;
  show_hearts: boolean;
}

export type SectionConfig =
  | HeroConfig
  | SecretRevealConfig
  | LoveLetterConfig
  | TimelineConfig
  | TimeTogetherConfig
  | ReasonsConfig
  | QuizConfig
  | MarriageGameConfig
  | GalleryConfig
  | SpinWheelConfig
  | CompatibilityConfig
  | SongsConfig
  | SlideshowConfig
  | MoonPhaseConfig
  | FinalMessageConfig;

// ---- Content Models ----
export interface TimelineItem {
  id: string;
  page_id: string;
  date: string;
  title: string;
  description: string;
  location?: string;
  image_url?: string;
  emoji: string;
  order_index: number;
}

export interface Reason {
  id: string;
  page_id: string;
  emoji: string;
  title: string;
  description: string;
  image_url?: string;
  order_index: number;
}

export interface Memory {
  id: string;
  page_id: string;
  image_url: string;
  caption?: string;
  date?: string;
  location?: string;
  order_index: number;
}

export interface Song {
  id: string;
  page_id: string;
  title: string;
  artist: string;
  cover_url?: string;
  description?: string;
  youtube_url?: string;
  spotify_url?: string;
  order_index: number;
}

export interface GameQuestion {
  id: string;
  page_id: string;
  question: string;
  image_url?: string;
  order_index: number;
  type: 'quiz';
  answers: GameAnswer[];
}

export interface GameAnswer {
  id: string;
  question_id: string;
  text: string;
  is_correct: boolean;
  response_message: string;
  order_index: number;
}

export interface WheelItem {
  id: string;
  page_id: string;
  text: string;
  emoji: string;
  weight: number;
  result_message: string;
  color: string;
  order_index: number;
}

export interface CompatibilityItem {
  id: string;
  page_id: string;
  label: string;
  percentage: number;
  order_index: number;
}

export interface MediaFile {
  id: string;
  page_id: string;
  url: string;
  file_name: string;
  file_size: number;
  file_type: string;
  created_at: string;
}

// ---- Full page data assembled for public rendering ----
export interface FullPageData {
  page: LovePage;
  theme: PageTheme;
  sections: Section[];
  timeline_items: TimelineItem[];
  reasons: Reason[];
  memories: Memory[];
  songs: Song[];
  game_questions: GameQuestion[];
  wheel_items: WheelItem[];
  compatibility_items: CompatibilityItem[];
}

// ---- Theme presets ----
export interface ThemePreset {
  name: string;
  label: string;
  theme: Omit<PageTheme, 'id' | 'page_id'>;
}
