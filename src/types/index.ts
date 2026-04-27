// ═══════════════════════════════════════════
// PRESSKIT.PRO — Shared TypeScript Types
// ═══════════════════════════════════════════

export type ArtistRole = 'DJ' | 'Producer' | 'Both' | 'Live Act'
export type GenreType = 'Techno' | 'House' | 'Trap' | 'Reggaeton' | 'Afrobeats' | 'Ambient' | 'Other'
export type MediaType = 'image' | 'video'
export type AnalyticsEvent = 'page_view' | 'contact_click' | 'link_click' | 'music_play'
export type OnboardingStatus = 'identity' | 'sound' | 'achievements' | 'links' | 'colors' | 'layout' | 'complete'

/** Layout/typographic style — separate from color scheme */
export type LayoutVariant = 'centered' | 'editorial' | 'split' | 'raw'

export interface Achievement {
  title: string
  description: string
}

export interface ArtistLinks {
  soundcloud?: string
  spotify?: string
  instagram?: string
  youtube?: string
}

/** The dynamic color palette derived from the artist's chosen colors */
export interface ArtistPalette {
  primary: string       // main accent (e.g. brand color)
  secondary: string     // supporting accent
  bg: string            // background
  surface: string       // card/surface
  text: string          // primary text
  textMuted: string     // secondary text
  border: string        // borders
}

export interface Artist {
  id: string
  user_id: string
  slug: string
  artist_name: string
  role: ArtistRole
  genre: GenreType
  sound_words: string[]
  bio: string
  achievements: Achievement[]
  links: ArtistLinks
  photo_url: string | null
  logo_url: string | null
  // ── Custom color identity ──────────────────
  primary_color: string        // hex, e.g. "#C026D3"
  secondary_color: string      // hex, e.g. "#7C3AED"
  bg_dark: boolean             // dark or light background
  layout_variant: LayoutVariant
  // ──────────────────────────────────────────
  booking_email:        string | null
  booking_url:          string | null
  is_published:         boolean
  onboarding_step:      OnboardingStatus
  // ── Growth OS fields (migration-v3) ──────────
  tagline:              string | null
  spotify_playlist_url: string | null
  supporters:           { name: string }[]
  available_dates:      string | null
  monthly_listeners:    string | null
  total_shows:          string | null
  countries_count:      string | null
  instagram_url:        string | null
  ra_url:               string | null
  beatport_url:         string | null
  created_at:           string
  updated_at:           string
}

// ── Fan subscriber (fan database) ────────────────
export interface FanSubscriber {
  id:          string
  artist_slug: string
  email:       string
  name:        string | null
  source:      string
  created_at:  string
}

export interface Section {
  id:         string
  artist_id:  string
  name:       string
  is_enabled: boolean
  sort_order: number
  config:     Record<string, unknown>
}

export interface LiveEvent {
  id: string
  artist_id: string
  venue_name: string
  event_name: string | null
  event_date: string
  city: string | null
  logo_url: string | null
  created_at: string
}

export interface MediaItem {
  id: string
  artist_id: string
  url: string
  type: MediaType
  caption: string | null
  sort_order: number
  created_at: string
}

export interface AnalyticsRow {
  id: string
  artist_id: string
  event_type: AnalyticsEvent
  referrer: string | null
  country: string | null
  created_at: string
}

// ── Onboarding wizard state ─────────────────────
export interface OnboardingData {
  // Step 1 — Identity
  artist_name: string
  role: ArtistRole
  // Step 2 — Sound
  sound_words: string[]
  genre: GenreType
  // Step 3 — Achievements + Bio
  achievements: Achievement[]
  bio: string
  // Step 4 — Links + Media
  photo_url: string | null
  logo_url: string | null
  links: ArtistLinks
  booking_email: string
  // Step 5 — Color identity
  primary_color: string
  secondary_color: string
  bg_dark: boolean
  // Step 6 — Layout
  layout_variant: LayoutVariant
}

// ── Derive a full palette from artist's chosen colors ──
export function deriveArtistPalette(
  primary: string,
  secondary: string,
  bgDark: boolean
): ArtistPalette {
  if (bgDark) {
    return {
      primary,
      secondary,
      bg: '#080808',
      surface: '#111111',
      text: '#F5F5F5',
      textMuted: '#9CA3AF',
      border: '#1F1F1F',
    }
  } else {
    return {
      primary,
      secondary,
      bg: '#FAF9F6',
      surface: '#FFFFFF',
      text: '#1A1A1A',
      textMuted: '#6B7280',
      border: '#E5E7EB',
    }
  }
}

/** Convert ArtistPalette to CSS custom property map */
export function paletteToCSSVars(p: ArtistPalette): Record<string, string> {
  return {
    '--color-bg':      p.bg,
    '--color-surface': p.surface,
    '--color-text':    p.text,
    '--color-muted':   p.textMuted,
    '--color-accent':  p.primary,
    '--color-glow':    p.secondary,
    '--color-border':  p.border,
  }
}

// ── Layout metadata ─────────────────────────────
export const LAYOUT_META: Record<LayoutVariant, { label: string; desc: string }> = {
  centered:  { label: 'Centrado',   desc: 'Nombre al centro, foto de fondo — clásico y poderoso' },
  editorial: { label: 'Editorial',  desc: 'Tipografía dominante, foto como elemento secundario' },
  split:     { label: 'Dividido',   desc: 'Foto a la derecha, texto a la izquierda — estilo revista' },
  raw:       { label: 'Raw',        desc: 'Foto inmersiva al borde, energía sin filtros' },
}

export const ONBOARDING_STEPS: OnboardingStatus[] = [
  'identity', 'sound', 'achievements', 'links', 'colors', 'layout',
]

// ── Preset color palettes for inspiration ────────
export const COLOR_PRESETS = [
  { name: 'Ultra Violet',  primary: '#7C3AED', secondary: '#C026D3' },
  { name: 'Cyber Cyan',    primary: '#06B6D4', secondary: '#6366F1' },
  { name: 'Neon Coral',    primary: '#F43F5E', secondary: '#FB923C' },
  { name: 'Gold Rush',     primary: '#F59E0B', secondary: '#78350F' },
  { name: 'Matrix Green',  primary: '#22C55E', secondary: '#065F46' },
  { name: 'Arctic White',  primary: '#E2E8F0', secondary: '#94A3B8' },
  { name: 'Deep Ocean',    primary: '#1D4ED8', secondary: '#7C3AED' },
  { name: 'Sunset',        primary: '#F97316', secondary: '#EC4899' },
  { name: 'Monochrome',    primary: '#F5F5F5', secondary: '#A3A3A3' },
  { name: 'Blood Red',     primary: '#EF4444', secondary: '#991B1B' },
]
