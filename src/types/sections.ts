// ═══════════════════════════════════════════════
// Section config schemas — one per section type
// Stored in sections.config JSONB column
// ═══════════════════════════════════════════════

export interface HeroCtaButton {
  text:  string
  url:   string
  style: 'filled' | 'outline' | 'ghost'
  color: string | null  // null = use palette.primary
}

export interface HeroSocialLink {
  id:         string
  platform:   string   // 'instagram' | 'soundcloud' | 'spotify' | 'youtube' | 'beatport' | 'ra' | 'tiktok' | 'twitter' | 'bandcamp'
  url:        string
  enabled:    boolean
  sort_order: number
}

export interface HeroConfig {
  // Content
  tagline:            string
  sub_tagline:        string
  supporters:         string[]

  // Background
  bg_image:           string | null
  logo_url:           string | null
  video_url:          string | null
  video_type:         'youtube' | 'vimeo' | 'direct' | null

  // Layout
  layout:             'centered' | 'left' | 'right' | 'split'

  // Text animation
  text_animation:     'fade' | 'slide' | 'glitch' | 'typewriter' | 'reveal'

  // CTA buttons
  cta_text:           string         // legacy fallback
  cta_url:            string         // legacy fallback
  cta_primary:        HeroCtaButton
  cta_secondary:      HeroCtaButton & { enabled: boolean }

  // Social links (ordered, per-link toggle)
  socials:            HeroSocialLink[]

  // Ticker
  ticker_speed:       number         // 1–10 (10 = fastest)
  ticker_separator:   string         // '·' '/' '—' '★' etc.

  // Design
  overlay_opacity:    number         // 0–1
  overlay_color:      string
  parallax_bg:        boolean
  gradient_animated:  boolean
  ken_burns:          boolean

  // Effects & visibility
  show_socials:       boolean
  show_scroll:        boolean
  particles:          boolean        // legacy canvas particles
  particles_density:  number
  three_bg:           boolean
  three_effect:       'particles' | 'waves' | 'volumetric'
  three_intensity:    number         // 0–100
  text_glitch:        boolean        // legacy, use text_animation='glitch'
}

export interface BioConfig {
  text:            string           // HTML from Tiptap
  city:            string
  country:         string
  genres:          string[]
  badges:          string[]
  bg_image:        string | null
  overlay_opacity: number
  overlay_color:   string
  stats:           { label: string; value: string }[]
  parallax:        boolean
}

export interface MusicConfig {
  tracks: {
    id:       string
    platform: 'youtube' | 'soundcloud' | 'spotify' | 'bandcamp'
    url:      string
    title:    string
    cover:    string | null
  }[]
  layout:         '2col' | '3col' | 'list'
  section_title:  string
  bg_image:       string | null
  overlay_opacity: number
  overlay_color:  string
  audio_visualizer: boolean
}

export interface CommunityConfig {
  section_title:   string
  total_reach:     string
  bg_image:        string | null
  overlay_opacity: number
  overlay_color:   string
  platforms: {
    id:       string
    name:     string
    handle:   string
    count:    string
    url:      string
    icon:     string
  }[]
  count_up_animation: boolean
}

export interface SupportersConfig {
  section_title:   string
  ticker_names:    string[]
  featured: {
    id:    string
    name:  string
    photo: string | null
    url:   string
  }[]
  bg_image:        string | null
  overlay_opacity: number
  overlay_color:   string
}

export interface ReleasesConfig {
  section_title:   string
  bg_image:        string | null
  overlay_opacity: number
  overlay_color:   string
  releases: {
    id:          string
    title:       string
    label:       string
    cover:       string | null
    spotify_url: string
    beatport_url: string
    year:        string
  }[]
}

export interface LiveConfig {
  section_title:  string
  cta_text:       string
  cta_url:        string
  total_shows:    string
  countries_count: string
  venues: {
    id:        string
    name:      string
    city:      string
    country:   string
    lat:       number | null
    lng:       number | null
    instagram: string
    date:      string
  }[]
}

export interface ContactConfig {
  section_title:     string
  response_time:     string
  availability:      string
  cta_text:          string
  cta_url:           string
  show_rider:        boolean
  bg_image:          string | null
  overlay_opacity:   number
  overlay_color:     string
}

export interface FanCaptureConfig {
  section_title:  string
  subtitle:       string
  button_text:    string
  privacy_text:   string
  bg_image:       string | null
  overlay_opacity: number
  overlay_color:  string
}

export interface GalleryConfig {
  section_title:   string
  images: {
    id:      string
    url:     string
    caption: string
  }[]
  columns:         2 | 3 | 4
  bg_image:        string | null
  overlay_opacity: number
  overlay_color:   string
}

// Union type for all section configs
export type SectionConfig =
  | HeroConfig
  | BioConfig
  | MusicConfig
  | CommunityConfig
  | SupportersConfig
  | ReleasesConfig
  | LiveConfig
  | ContactConfig
  | FanCaptureConfig
  | GalleryConfig

// Default configs — used when section is first enabled
export const DEFAULT_CONFIGS: Record<string, SectionConfig> = {
  hero: {
    tagline:            'Tu música. Tu mundo.',
    sub_tagline:        'DJ · Productor · Live Act',
    supporters:         ['Maceo Plex', 'Tale Of Us', 'Amelie Lens', 'Solomun', 'Dixon', 'Peggy Gou'],
    bg_image:           null,
    logo_url:           null,
    video_url:          null,
    video_type:         null,
    layout:             'centered',
    text_animation:     'slide',
    cta_text:           'Solicitar Booking',
    cta_url:            '#contact',
    cta_primary:        { text: 'Solicitar Booking', url: '#contact', style: 'filled', color: null },
    cta_secondary:      { enabled: false, text: 'Ver Música', url: '#music', style: 'outline', color: null },
    socials: [
      { id: '1', platform: 'instagram',  url: '', enabled: false, sort_order: 0 },
      { id: '2', platform: 'soundcloud', url: '', enabled: false, sort_order: 1 },
      { id: '3', platform: 'spotify',    url: '', enabled: false, sort_order: 2 },
      { id: '4', platform: 'youtube',    url: '', enabled: false, sort_order: 3 },
      { id: '5', platform: 'beatport',   url: '', enabled: false, sort_order: 4 },
      { id: '6', platform: 'ra',         url: '', enabled: false, sort_order: 5 },
    ],
    ticker_speed:       5,
    ticker_separator:   '·',
    overlay_opacity:    0.5,
    overlay_color:      '#000000',
    parallax_bg:        true,
    gradient_animated:  true,
    ken_burns:          false,
    show_socials:       true,
    show_scroll:        true,
    particles:          true,
    particles_density:  60,
    three_bg:           false,
    three_effect:       'particles',
    three_intensity:    50,
    text_glitch:        false,
  } as HeroConfig,

  bio: {
    text:            '<p>Escribe aquí tu biografía...</p>',
    city:            'Madrid',
    country:         'España',
    genres:          ['Techno', 'House'],
    badges:          ['Independent', 'International'],
    bg_image:        null,
    overlay_opacity: 0.7,
    overlay_color:   '#000000',
    stats:           [
      { label: 'Shows', value: '50+' },
      { label: 'Países', value: '8' },
      { label: 'Seguidores', value: '10K' },
    ],
    parallax:        true,
  } as BioConfig,

  music: {
    tracks:          [],
    layout:          '2col',
    section_title:   'Música',
    bg_image:        null,
    overlay_opacity: 0.6,
    overlay_color:   '#000000',
    audio_visualizer: true,
  } as MusicConfig,

  community: {
    section_title:      'Comunidad',
    total_reach:        '50K',
    bg_image:           null,
    overlay_opacity:    0.7,
    overlay_color:      '#000000',
    platforms:          [
      { id: '1', name: 'Instagram',   handle: '@tuartista', count: '10K', url: '', icon: 'instagram' },
      { id: '2', name: 'SoundCloud',  handle: 'tuartista',  count: '5K',  url: '', icon: 'soundcloud' },
      { id: '3', name: 'Spotify',     handle: 'tuartista',  count: '2K',  url: '', icon: 'spotify' },
    ],
    count_up_animation: true,
  } as CommunityConfig,

  supporters: {
    section_title:   'Apoyado por',
    ticker_names:    ['Maceo Plex', 'Tale Of Us', 'Amelie Lens', 'Solomun', 'Dixon'],
    featured:        [],
    bg_image:        null,
    overlay_opacity: 0.6,
    overlay_color:   '#000000',
  } as SupportersConfig,

  releases: {
    section_title:   'Discografía',
    bg_image:        null,
    overlay_opacity: 0.6,
    overlay_color:   '#000000',
    releases:        [],
  } as ReleasesConfig,

  live: {
    section_title:   'En vivo',
    cta_text:        'Sé el próximo',
    cta_url:         '#contact',
    total_shows:     '50+',
    countries_count: '8',
    venues:          [],
  } as LiveConfig,

  contact: {
    section_title:   'Contacto',
    response_time:   '24-48 horas',
    availability:    'Fechas disponibles Q2–Q3 2026',
    cta_text:        'Solicitar Booking',
    cta_url:         '',
    show_rider:      true,
    bg_image:        null,
    overlay_opacity: 0.7,
    overlay_color:   '#000000',
  } as ContactConfig,

  'fan-capture': {
    section_title:   'Únete a mi comunidad',
    subtitle:        'Música exclusiva, primeras escuchas y fechas antes que nadie.',
    button_text:     'Quiero entrar',
    privacy_text:    'Sin spam. Solo buena música.',
    bg_image:        null,
    overlay_opacity: 0.5,
    overlay_color:   '#000000',
  } as FanCaptureConfig,

  gallery: {
    section_title:   'Galería',
    images:          [],
    columns:         3,
    bg_image:        null,
    overlay_opacity: 0.6,
    overlay_color:   '#000000',
  } as GalleryConfig,
}
