import { type PageTheme, type ThemePreset } from '@/types';

// ============================================================
// Theme Presets
// ============================================================
export const THEME_PRESETS: ThemePreset[] = [
  {
    name: 'romantic-pink',
    label: 'Romantic Pink',
    theme: {
      bg_color: '#FFF1F4',
      primary_color: '#D94F73',
      secondary_color: '#9E2F50',
      card_color: '#FFFFFF',
      text_color: '#6B263C',
      muted_text_color: '#A76A7D',
      border_color: '#F3C8D3',
      button_color: '#D94F73',
      button_text_color: '#FFFFFF',
      heading_font: 'Playfair Display',
      body_font: 'Inter',
      border_radius: '16px',
      shadow_intensity: 'md',
      preset_name: 'Romantic Pink',
    },
  },
  {
    name: 'rose',
    label: 'Rose',
    theme: {
      bg_color: '#FFF5F5',
      primary_color: '#C0392B',
      secondary_color: '#7B241C',
      card_color: '#FFFFFF',
      text_color: '#5D1A1A',
      muted_text_color: '#9B6565',
      border_color: '#FADADD',
      button_color: '#C0392B',
      button_text_color: '#FFFFFF',
      heading_font: 'Playfair Display',
      body_font: 'Inter',
      border_radius: '16px',
      shadow_intensity: 'md',
      preset_name: 'Rose',
    },
  },
  {
    name: 'blush',
    label: 'Blush',
    theme: {
      bg_color: '#FFF0F6',
      primary_color: '#E91E8C',
      secondary_color: '#AD1457',
      card_color: '#FFFFFF',
      text_color: '#6B1E4B',
      muted_text_color: '#B06090',
      border_color: '#F9C5E0',
      button_color: '#E91E8C',
      button_text_color: '#FFFFFF',
      heading_font: 'Playfair Display',
      body_font: 'Inter',
      border_radius: '20px',
      shadow_intensity: 'md',
      preset_name: 'Blush',
    },
  },
  {
    name: 'lavender',
    label: 'Lavender',
    theme: {
      bg_color: '#F5F0FF',
      primary_color: '#7B2FBE',
      secondary_color: '#4A1A8E',
      card_color: '#FFFFFF',
      text_color: '#3B1A6B',
      muted_text_color: '#8070A0',
      border_color: '#DDD0F5',
      button_color: '#7B2FBE',
      button_text_color: '#FFFFFF',
      heading_font: 'Playfair Display',
      body_font: 'Inter',
      border_radius: '16px',
      shadow_intensity: 'md',
      preset_name: 'Lavender',
    },
  },
  {
    name: 'sunset',
    label: 'Sunset',
    theme: {
      bg_color: '#FFF5F0',
      primary_color: '#FF6B35',
      secondary_color: '#C0392B',
      card_color: '#FFFFFF',
      text_color: '#5D2A1A',
      muted_text_color: '#A06050',
      border_color: '#FFD8C8',
      button_color: '#FF6B35',
      button_text_color: '#FFFFFF',
      heading_font: 'Playfair Display',
      body_font: 'Inter',
      border_radius: '16px',
      shadow_intensity: 'md',
      preset_name: 'Sunset',
    },
  },
  {
    name: 'minimal-white',
    label: 'Minimal White',
    theme: {
      bg_color: '#FFFFFF',
      primary_color: '#1A1A2E',
      secondary_color: '#16213E',
      card_color: '#F8F8F8',
      text_color: '#1A1A2E',
      muted_text_color: '#6B7280',
      border_color: '#E5E7EB',
      button_color: '#1A1A2E',
      button_text_color: '#FFFFFF',
      heading_font: 'Playfair Display',
      body_font: 'Inter',
      border_radius: '12px',
      shadow_intensity: 'sm',
      preset_name: 'Minimal White',
    },
  },
];

// ============================================================
// Generate CSS variables string from theme
// ============================================================
export function generateThemeCSS(theme: PageTheme): string {
  return `
    --color-bg: ${theme.bg_color};
    --color-primary: ${theme.primary_color};
    --color-secondary: ${theme.secondary_color};
    --color-card: ${theme.card_color};
    --color-text: ${theme.text_color};
    --color-muted: ${theme.muted_text_color};
    --color-border: ${theme.border_color};
    --color-button: ${theme.button_color};
    --color-button-text: ${theme.button_text_color};
    --font-heading: '${theme.heading_font}', serif;
    --font-body: '${theme.body_font}', sans-serif;
    --border-radius: ${theme.border_radius};
    --shadow-intensity: ${theme.shadow_intensity};
  `.trim();
}

// ============================================================
// Shadow intensity map
// ============================================================
export const SHADOW_MAP: Record<string, string> = {
  none: 'none',
  sm: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
  md: '0 4px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
  lg: '0 10px 40px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)',
};
