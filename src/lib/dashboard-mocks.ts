export const ARTIST = {
  name: 'Valentina M.',
  fullName: 'Valentina Moretti',
  firstName: 'Valentina',
  slug: 'valentina-m',
  genre: 'House DJ',
  location: 'Buenos Aires, AR',
  initials: 'VM',
  plan: 'PRO' as const,
  planDaysLeft: 12,
  url: 'presskit.pro/valentina-m',
}

export interface KpiItem {
  id: string
  label: string
  display: string
  value: number
  change: number
  positive: boolean
  sub: string
  sparkData: number[]
}

export const KPIS: KpiItem[] = [
  {
    id: 'visits',
    label: 'Visitas · 14 días',
    display: '1,247',
    value: 1247,
    change: 12,
    positive: true,
    sub: '134 nuevas · 1,113 período anterior',
    sparkData: [62, 81, 73, 102, 87, 143, 210, 168, 195, 247, 197, 178, 211, 247],
  },
  {
    id: 'booking',
    label: 'Clics Booking',
    display: '38',
    value: 38,
    change: 34,
    positive: true,
    sub: '12 únicos',
    sparkData: [8, 12, 6, 18, 24, 31, 38],
  },
  {
    id: 'downloads',
    label: 'Descargas EPK',
    display: '12',
    value: 12,
    change: 8,
    positive: true,
    sub: '4 esta semana',
    sparkData: [2, 4, 3, 7, 9, 11, 12],
  },
  {
    id: 'listeners',
    label: 'Oyentes Spotify',
    display: '24.8K',
    value: 24800,
    change: 6,
    positive: true,
    sub: 'mensuales',
    sparkData: [21000, 22000, 21500, 23000, 23500, 24000, 24800],
  },
]

export const SPARK_VISITS = KPIS[0].sparkData
export const SPARK_BOOKING = KPIS[1].sparkData

export interface ActivityItem {
  id: string
  tag: string
  color: string
  text: string
  time: string
}

export const ACTIVITY: ActivityItem[] = [
  { id: '1', tag: 'EPK',   color: '#C026D3', text: 'Pablo Vera (booker, Madrid) descargó tu EPK',   time: '5 min'  },
  { id: '2', tag: 'BOOK',  color: '#7C3AED', text: 'Click en Booking desde Instagram Stories',      time: '1h'    },
  { id: '3', tag: 'SHARE', color: '#10B981', text: 'Compartido en grupo de WhatsApp (12 vistas)',   time: '2h'    },
  { id: '4', tag: 'VIEW',  color: '#0EA5E9', text: 'Nuevo visitante repetido desde México',         time: '3h'    },
  { id: '5', tag: 'PLAY',  color: '#F59E0B', text: '"Solar Drift" reproducción completa',           time: '5h'    },
  { id: '6', tag: 'LEAD',  color: '#EC4899', text: 'Email capturado: bruno@boilerroom.tv',          time: '8h'    },
]

export interface TrackItem {
  id: string
  title: string
  label: string
  platform: 'spotify' | 'soundcloud' | 'youtube'
  plays: number
  change: number
  positive: boolean
  length: string
  sparkData: number[]
}

export const TRACKS: TrackItem[] = [
  { id: '1', title: 'Solar Drift',       label: 'Sublime Records', platform: 'spotify',    plays: 14820, change: 12, positive: true,  length: '6:12', sparkData: [62, 81, 120, 95, 143, 180, 210] },
  { id: '2', title: 'Midnight Echo',     label: 'Self-released',   platform: 'soundcloud', plays: 8730,  change: 4,  positive: true,  length: '5:48', sparkData: [40, 55, 48, 70, 68, 80, 87]   },
  { id: '3', title: 'Glass Tower',       label: 'Sublime Records', platform: 'spotify',    plays: 6210,  change: -2, positive: false, length: '7:02', sparkData: [80, 75, 68, 72, 66, 65, 62]   },
  { id: '4', title: 'Volcán',            label: 'Innervisions',    platform: 'spotify',    plays: 3940,  change: 28, positive: true,  length: '6:30', sparkData: [10, 18, 22, 30, 35, 38, 39]   },
]

export interface ShowItem {
  id: string
  date: string
  city: string
  venue: string
  country: string
  status: 'Confirmado' | 'Negociando'
}

export const UPCOMING: ShowItem[] = [
  { id: '1', date: 'MAY 12', city: 'Buenos Aires',     venue: 'Crobar',         country: 'AR', status: 'Confirmado' },
  { id: '2', date: 'MAY 24', city: 'Madrid',           venue: 'Mondo Disko',    country: 'ES', status: 'Confirmado' },
  { id: '3', date: 'JUN 07', city: 'Berlín',           venue: 'Watergate',      country: 'DE', status: 'Negociando' },
]

export interface ChecklistItem {
  id: string
  label: string
  done: boolean
  href: string
}

export const CHECKLIST: ChecklistItem[] = [
  { id: 'photo',   label: 'Foto de perfil',          done: true,  href: '/panel' },
  { id: 'bio',     label: 'Biografía',               done: true,  href: '/panel' },
  { id: 'music',   label: 'Plataformas de música',   done: true,  href: '/panel' },
  { id: 'gallery', label: 'Galería de fotos',        done: false, href: '/panel' },
  { id: 'booking', label: 'Link de booking',         done: false, href: '/panel' },
]
