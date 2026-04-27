// ═══════════════════════════════════════════════
// Section config schemas — one per section type
// Stored in sections.config JSONB column
// ═══════════════════════════════════════════════

export interface HeroConfig {
  bg_image:           string | null
  logo_url:           string | null
  tagline:            string
  sub_tagline:        string
  cta_text:           string
  cta_url:            string
  show_socials:       boolean
  show_scroll:        boolean
  supporters:         string[]      // for ticker
  overlay_opacity:    number        // 0-1
  overlay_color:      string        // hex
  particles:          boolean
  particles_density:  number        // 20-200
  three_bg:           boolean       // Three.js animated bg
  text_glitch:        boolean
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
    bg_image:           null,
    logo_url:           null,
    tagline:            'Tu música. Tu mundo.',
    sub_tagline:        'DJ · Productor · Live Act',
    cta_text:           'Solicitar Booking',
    cta_url:            '#contact',
    show_socials:       true,
    show_scroll:        true,
    supporters:         ['Maceo Plex', 'Tale Of Us', 'Amelie Lens', 'Solomun', 'Dixon', 'Peggy Gou'],
    overlay_opacity:    0.5,
    overlay_color:      '#000000',
    particles:          true,
    particles_density:  60,
    three_bg:           false,
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
