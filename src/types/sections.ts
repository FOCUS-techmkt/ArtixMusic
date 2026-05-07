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
  platform:   string
  url:        string
  enabled:    boolean
  sort_order: number
}

export type HeroLayoutVariant =
  | 'fullscreen-centered'
  | 'split'
  | 'minimal-dark'
  | 'cinematic'
  | 'overlay-portrait'
  | 'magazine'
  | 'immersive-3d'

export interface HeroConfig {
  // ── Content ─────────────────────────────────
  tagline:       string
  sub_tagline:   string
  supporters:    string[]
  cta_text:      string   // legacy fallback
  cta_url:       string   // legacy fallback
  cta_primary:   HeroCtaButton
  cta_secondary: HeroCtaButton & { enabled: boolean }
  socials:       HeroSocialLink[]
  ticker_speed:  number
  ticker_separator: string

  // ── Layout ──────────────────────────────────
  hero_layout:      HeroLayoutVariant   // NEW: 7 variants
  layout:           'centered' | 'left' | 'right' | 'split'  // legacy
  split_photo_side: 'left' | 'right'

  // ── Background ──────────────────────────────
  bg_type:               'none' | 'solid' | 'gradient' | 'image' | 'video'
  bg_color:              string
  bg_gradient_from:      string
  bg_gradient_to:        string
  bg_gradient_mid:       string | null
  bg_gradient_angle:     number   // 0–360
  bg_gradient_type:      'linear' | 'radial'
  bg_image:              string | null
  bg_image_blur:         number   // 0–20
  bg_image_filter:       'none' | 'bw' | 'sepia' | 'contrast' | 'duotone'
  bg_image_duotone_from: string
  bg_image_duotone_to:   string
  bg_grain:              boolean
  bg_grain_intensity:    number   // 1–3
  logo_url:              string | null
  video_url:             string | null
  video_type:            'youtube' | 'vimeo' | 'direct' | null

  // ── Overlay ─────────────────────────────────
  overlay_opacity:      number   // 0–1
  overlay_color:        string
  overlay_gradient:     boolean
  overlay_gradient_dir: 'to-top' | 'to-bottom' | 'to-left' | 'to-right' | 'radial'
  overlay_blend_mode:   'normal' | 'multiply' | 'screen' | 'overlay'

  // ── Portrait image ───────────────────────────
  img_vignette:           boolean
  img_vignette_intensity: number   // 0–100

  // ── Typography ──────────────────────────────
  name_size:            number          // 40–200 px
  tagline_size:         number          // 14–80 px
  text_color:           string | null   // null = palette.text
  text_gradient:        boolean
  text_gradient_from:   string
  text_gradient_to:     string
  text_effect:          'none' | 'outline' | 'shadow' | 'glow' | 'gradient'
  text_shadow_color:    string
  text_shadow_blur:     number   // 0–60
  text_shadow_offset_x: number   // -20–20
  text_shadow_offset_y: number   // -20–20
  text_glow_color:      string | null
  text_glow_intensity:  number   // 0–40
  letter_spacing:       number   // -5–20
  text_align:           'left' | 'center' | 'right'

  // ── Text animation ───────────────────────────
  text_animation: 'fade' | 'slide' | 'slide-down' | 'glitch' | 'typewriter' | 'reveal' | 'word-by-word' | 'scale-up'

  // ── Background animations ────────────────────
  parallax_bg:           boolean
  ken_burns:             boolean
  ken_burns_direction:   'in' | 'out'
  gradient_animated:     boolean
  oscillate:             boolean

  // ── Three.js ────────────────────────────────
  three_bg:        boolean
  three_effect:    'particles' | 'waves' | 'volumetric' | 'neural' | 'polygons'
  three_intensity: number          // 0–100
  three_color:     string | null   // null = palette.primary

  // ── Legacy effects ───────────────────────────
  particles:          boolean
  particles_density:  number
  text_glitch:        boolean

  // ── Visibility ──────────────────────────────
  show_socials:          boolean
  show_scroll:           boolean
  scroll_indicator_style: 'line' | 'arrow' | 'dot' | 'text'

  // ── Social links display ─────────────────────
  socials_position: 'default' | 'top' | 'lateral-left' | 'lateral-right'
  socials_style:    'icon' | 'icon-text' | 'button'

  // ── Ticker ──────────────────────────────────
  ticker_position:   'top' | 'bottom'
  ticker_bg_color:   string | null
  ticker_text_color: string | null

  // ── Availability badge ───────────────────────
  show_badge:       boolean
  badge_text:       string
  badge_color:      string
  badge_text_color: string
  badge_position:   'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  badge_pulse:      boolean
}

export interface BioConfig {
  text:            string
  city:            string
  country:         string
  genres:          string[]
  badges:          string[]
  photo_position:  'left' | 'right' | 'none'
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
  layout:           '2col' | '3col' | 'list'
  section_title:    string
  bg_image:         string | null
  overlay_opacity:  number
  overlay_color:    string
  audio_visualizer: boolean
}

export interface CommunityConfig {
  section_title:   string
  total_reach:     string
  bg_image:        string | null
  overlay_opacity: number
  overlay_color:   string
  platforms: {
    id:     string
    name:   string
    handle: string
    count:  string
    url:    string
    icon:   string
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
  section_title:   string
  cta_text:        string
  cta_url:         string
  total_shows:     string
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
  section_title:   string
  response_time:   string
  availability:    string
  cta_text:        string
  cta_url:         string
  show_rider:      boolean
  bg_image:        string | null
  overlay_opacity: number
  overlay_color:   string
}

export interface FanCaptureConfig {
  section_title:   string
  subtitle:        string
  button_text:     string
  privacy_text:    string
  bg_image:        string | null
  overlay_opacity: number
  overlay_color:   string
}

export interface GalleryConfig {
  section_title:   string
  images: {
    id:      string
    url:     string
    caption: string
  }[]
  columns:         2 | 3 | 4
  layout:          'grid' | 'masonry'
  bg_image:        string | null
  overlay_opacity: number
  overlay_color:   string
}

export interface LinksConfig {
  section_title:   string
  links: {
    id:      string
    label:   string
    url:     string
    icon:    string
    enabled: boolean
  }[]
  bg_image:        string | null
  overlay_opacity: number
  overlay_color:   string
}

export interface TestimonialsConfig {
  section_title:   string
  testimonials: {
    id:    string
    name:  string
    role:  string
    text:  string
    photo: string | null
  }[]
  bg_image:        string | null
  overlay_opacity: number
  overlay_color:   string
}

export type SectionConfig =
  | HeroConfig | BioConfig | MusicConfig | CommunityConfig | SupportersConfig
  | ReleasesConfig | LiveConfig | ContactConfig | FanCaptureConfig
  | GalleryConfig | LinksConfig | TestimonialsConfig

export const DEFAULT_CONFIGS: Record<string, SectionConfig> = {
  hero: {
    tagline:       'Tu música. Tu mundo.',
    sub_tagline:   'DJ · Productor · Live Act',
    supporters:    ['Maceo Plex', 'Tale Of Us', 'Amelie Lens', 'Solomun', 'Dixon', 'Peggy Gou'],
    cta_text:      'Solicitar Booking',
    cta_url:       '#contact',
    cta_primary:   { text: 'Solicitar Booking', url: '#contact', style: 'filled', color: null },
    cta_secondary: { enabled: false, text: 'Ver Música', url: '#music', style: 'outline', color: null },
    socials: [
      { id: '1', platform: 'instagram',  url: '', enabled: false, sort_order: 0 },
      { id: '2', platform: 'soundcloud', url: '', enabled: false, sort_order: 1 },
      { id: '3', platform: 'spotify',    url: '', enabled: false, sort_order: 2 },
      { id: '4', platform: 'youtube',    url: '', enabled: false, sort_order: 3 },
      { id: '5', platform: 'beatport',   url: '', enabled: false, sort_order: 4 },
      { id: '6', platform: 'ra',         url: '', enabled: false, sort_order: 5 },
    ],
    ticker_speed:     5,
    ticker_separator: '·',
    // Layout
    hero_layout:      'fullscreen-centered',
    layout:           'centered',
    split_photo_side: 'left',
    // Background
    bg_type:               'none',
    bg_color:              '#0A0A0E',
    bg_gradient_from:      '#0A0A0E',
    bg_gradient_to:        '#1A0A2E',
    bg_gradient_mid:       null,
    bg_gradient_angle:     135,
    bg_gradient_type:      'linear',
    bg_image:              null,
    bg_image_blur:         0,
    bg_image_filter:       'none',
    bg_image_duotone_from: '#C026D3',
    bg_image_duotone_to:   '#7C3AED',
    bg_grain:              false,
    bg_grain_intensity:    2,
    logo_url:              null,
    video_url:             null,
    video_type:            null,
    // Overlay
    overlay_opacity:      0.5,
    overlay_color:        '#000000',
    overlay_gradient:     false,
    overlay_gradient_dir: 'to-top',
    overlay_blend_mode:   'normal',
    // Portrait
    img_vignette:           false,
    img_vignette_intensity: 50,
    // Typography
    name_size:            72,
    tagline_size:         20,
    text_color:           null,
    text_gradient:        false,
    text_gradient_from:   '#C026D3',
    text_gradient_to:     '#7C3AED',
    text_effect:          'none',
    text_shadow_color:    '#000000',
    text_shadow_blur:     20,
    text_shadow_offset_x: 0,
    text_shadow_offset_y: 4,
    text_glow_color:      null,
    text_glow_intensity:  20,
    letter_spacing:       0,
    text_align:           'center',
    // Animations
    text_animation:      'slide',
    parallax_bg:         true,
    ken_burns:           false,
    ken_burns_direction: 'in',
    gradient_animated:   true,
    oscillate:           false,
    // Three.js
    three_bg:        false,
    three_effect:    'particles',
    three_intensity: 50,
    three_color:     null,
    // Legacy
    particles:         true,
    particles_density: 60,
    text_glitch:       false,
    // Visibility
    show_socials:           true,
    show_scroll:            true,
    scroll_indicator_style: 'line',
    // Social display
    socials_position: 'default',
    socials_style:    'icon',
    // Ticker
    ticker_position:   'bottom',
    ticker_bg_color:   null,
    ticker_text_color: null,
    // Badge
    show_badge:       false,
    badge_text:       'Fechas disponibles Q2–Q3 2026',
    badge_color:      '#C026D3',
    badge_text_color: '#ffffff',
    badge_position:   'top-right',
    badge_pulse:      false,
  } as HeroConfig,

  bio: {
    text:            '<p>Escribe aquí tu biografía...</p>',
    city:            'Madrid',
    country:         'España',
    genres:          ['Techno', 'House'],
    badges:          ['Independent', 'International'],
    photo_position:  'right',
    bg_image:        null,
    overlay_opacity: 0.7,
    overlay_color:   '#000000',
    stats: [
      { label: 'Shows',     value: '50+' },
      { label: 'Países',    value: '8'   },
      { label: 'Seguidores',value: '10K' },
    ],
    parallax: true,
  } as BioConfig,

  music: {
    tracks:           [],
    layout:           '2col',
    section_title:    'Música',
    bg_image:         null,
    overlay_opacity:  0.6,
    overlay_color:    '#000000',
    audio_visualizer: true,
  } as MusicConfig,

  community: {
    section_title:      'Comunidad',
    total_reach:        '50K',
    bg_image:           null,
    overlay_opacity:    0.7,
    overlay_color:      '#000000',
    platforms: [
      { id: '1', name: 'Instagram',  handle: '@tuartista', count: '10K', url: '', icon: 'instagram'  },
      { id: '2', name: 'SoundCloud', handle: 'tuartista',  count: '5K',  url: '', icon: 'soundcloud' },
      { id: '3', name: 'Spotify',    handle: 'tuartista',  count: '2K',  url: '', icon: 'spotify'    },
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
    layout:          'grid',
    bg_image:        null,
    overlay_opacity: 0.6,
    overlay_color:   '#000000',
  } as GalleryConfig,

  links: {
    section_title:   'Links',
    links:           [],
    bg_image:        null,
    overlay_opacity: 0.5,
    overlay_color:   '#000000',
  } as LinksConfig,

  testimonials: {
    section_title:   'Lo que dicen',
    testimonials:    [],
    bg_image:        null,
    overlay_opacity: 0.6,
    overlay_color:   '#000000',
  } as TestimonialsConfig,
}
