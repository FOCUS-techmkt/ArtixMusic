import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Artist } from '@/types'
import type { KpiItem, TrackItem, ShowItem, ChecklistItem, ActivityItem } from '@/lib/dashboard-mocks'
import DashboardContent from './_components/DashboardContent'
import DashboardClient  from '@/components/panel/DashboardClient'

// ── helpers ──────────────────────────────────────────────────

function pct(current: number, prev: number) {
  if (prev === 0) return current > 0 ? 100 : 0
  return Math.round(((current - prev) / prev) * 100)
}

function dailyBuckets(events: { created_at: string }[], days: number, since: Date) {
  return Array.from({ length: days }, (_, i) => {
    const day  = new Date(since.getTime() + i * 86_400_000)
    const next = new Date(day.getTime() + 86_400_000)
    return events.filter(e => {
      const t = new Date(e.created_at).getTime()
      return t >= day.getTime() && t < next.getTime()
    }).length
  })
}

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return n >= 10_000 ? `${(n / 1_000).toFixed(0)}K` : `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

const PANEL_TABS = ['editor', 'analytics', 'content', 'fans', 'email', 'booker', 'ai']

// ── page ─────────────────────────────────────────────────────

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { tab?: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: artist } = await supabase
    .from('artists').select('*').eq('user_id', user.id).single()

  if (!artist) redirect('/onboarding')
  if (artist.onboarding_step !== 'complete') redirect('/onboarding')

  const tab = searchParams.tab

  // ── Panel tabs: render DashboardClient ───────────────────
  if (tab && PANEL_TABS.includes(tab)) {
    const [
      { data: sections },
      { data: analytics },
      { data: fans },
    ] = await Promise.all([
      supabase.from('sections').select('*').eq('artist_id', artist.id).order('sort_order'),
      supabase.from('analytics').select('event_type, created_at, country, referrer')
        .eq('artist_id', artist.id).order('created_at', { ascending: false }).limit(1000),
      supabase.from('fan_subscribers').select('*')
        .eq('artist_slug', artist.slug).order('created_at', { ascending: false }).limit(500),
    ])
    return (
      <DashboardClient
        initialArtist={artist}
        initialSections={sections ?? []}
        analytics={analytics ?? []}
        fans={fans ?? []}
      />
    )
  }

  // ── Editorial overview (default, no tab) ──────────────────
  const now   = new Date()
  const d14   = new Date(now.getTime() - 14 * 86_400_000)
  const d28   = new Date(now.getTime() - 28 * 86_400_000)

  const [
    { data: analyticsRaw },
    { data: liveEventsRaw },
    { data: sections },
    { data: fans },
  ] = await Promise.all([
    supabase.from('analytics').select('*')
      .eq('artist_id', artist.id)
      .gte('created_at', d28.toISOString())
      .order('created_at', { ascending: false })
      .limit(1000),
    supabase.from('live_events').select('*')
      .eq('artist_id', artist.id)
      .gte('event_date', now.toISOString().split('T')[0])
      .order('event_date').limit(5),
    supabase.from('sections').select('*')
      .eq('artist_id', artist.id).order('sort_order'),
    supabase.from('fan_subscribers').select('id')
      .eq('artist_slug', artist.slug),
  ])

  const analytics  = analyticsRaw  ?? []
  const liveEvents = liveEventsRaw ?? []
  const secs       = sections      ?? []
  const fanCount   = fans?.length  ?? 0

  const current  = analytics.filter(e => new Date(e.created_at) >= d14)
  const previous = analytics.filter(e => new Date(e.created_at) < d14)

  const views    = (arr: typeof analytics) => arr.filter(e => e.event_type === 'page_view')
  const contacts = (arr: typeof analytics) => arr.filter(e => e.event_type === 'contact_click')
  const plays    = (arr: typeof analytics) => arr.filter(e => e.event_type === 'music_play')
  const links    = (arr: typeof analytics) => arr.filter(e => e.event_type === 'link_click')

  const curViews   = views(current).length
  const prevViews  = views(previous).length
  const curContact = contacts(current).length
  const prevContact = contacts(previous).length
  const curPlays   = plays(current).length
  const prevPlays  = plays(previous).length
  const curLinks   = links(current).length
  const prevLinks  = links(previous).length

  const kpis: KpiItem[] = [
    {
      id:        'visits',
      label:     'Visitas · 14 días',
      display:   fmtNum(curViews),
      value:     curViews,
      change:    pct(curViews, prevViews),
      positive:  curViews >= prevViews,
      sub:       `${curViews - prevViews >= 0 ? '+' : ''}${curViews - prevViews} vs período anterior`,
      sparkData: dailyBuckets(views(analytics), 14, d14).length > 0 ? dailyBuckets(views(analytics), 14, d14) : [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    },
    {
      id:        'contact',
      label:     'Clics Booking',
      display:   String(curContact),
      value:     curContact,
      change:    pct(curContact, prevContact),
      positive:  curContact >= prevContact,
      sub:       prevContact > 0 ? `${prevContact} período anterior` : 'primer período',
      sparkData: dailyBuckets(contacts(analytics), 14, d14),
    },
    {
      id:        'plays',
      label:     'Reproducciones',
      display:   fmtNum(curPlays),
      value:     curPlays,
      change:    pct(curPlays, prevPlays),
      positive:  curPlays >= prevPlays,
      sub:       `${fmtNum(curLinks)} clics en links`,
      sparkData: dailyBuckets(plays(analytics), 14, d14),
    },
    {
      id:        'fans',
      label:     'Fan Database',
      display:   fmtNum(fanCount),
      value:     fanCount,
      change:    0,
      positive:  true,
      sub:       'suscriptores totales',
      sparkData: [0,0,0,0,0,0,0,0,0,0,0,0,0,fanCount],
    },
  ]

  // Tracks from music section config
  const musicCfg  = secs.find(s => s.name === 'music')?.config as Record<string, unknown> | null
  const rawTracks = (musicCfg?.tracks as { id: string; title: string; platform: string; url: string }[] | undefined) ?? []
  const tracks: TrackItem[] = rawTracks.map((t, i) => ({
    id:       t.id ?? String(i),
    title:    t.title || 'Sin título',
    label:    t.platform,
    platform: (t.platform as TrackItem['platform']) || 'spotify',
    plays:    0, change: 0, positive: true, length: '',
    sparkData: [0,0,0,0,0,0,0],
  }))

  // Upcoming shows
  const MONTHS = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC']
  const upcoming: ShowItem[] = liveEvents.map(ev => {
    const d = new Date(ev.event_date + 'T12:00:00')
    return { id: ev.id, date: `${MONTHS[d.getMonth()]} ${d.getDate()}`, city: ev.city ?? '', venue: ev.venue_name, country: '', status: 'Confirmado' as const }
  })

  // Checklist
  const bioText   = (secs.find(s => s.name === 'bio')?.config as { text?: string } | null)?.text ?? artist.bio ?? ''
  const galImages = (secs.find(s => s.name === 'gallery')?.config as { images?: unknown[] } | null)?.images ?? []
  const checklist: ChecklistItem[] = [
    { id: 'photo',   label: 'Foto de artista',        done: !!artist.photo_url,                           href: '/dashboard?tab=editor' },
    { id: 'bio',     label: 'Biografía',               done: bioText.trim().length > 10,                   href: '/dashboard?tab=content' },
    { id: 'music',   label: 'Tracks de música',        done: rawTracks.length > 0,                         href: '/dashboard?tab=editor' },
    { id: 'gallery', label: 'Galería de fotos',        done: galImages.length > 0,                         href: '/dashboard?tab=editor' },
    { id: 'booking', label: 'Link / email de booking', done: !!(artist.booking_url || artist.booking_email), href: '/dashboard?tab=content' },
  ]

  // Activity feed
  const TAG_MAP: Record<string, { tag: string; color: string; text: (e: typeof analytics[0]) => string }> = {
    page_view:     { tag: 'VIEW', color: '#0EA5E9', text: e => `Visita${e.country ? ` desde ${e.country}` : ''}` },
    contact_click: { tag: 'BOOK', color: '#C026D3', text: () => 'Click en contacto / booking' },
    link_click:    { tag: 'LINK', color: '#7C3AED', text: () => 'Click en link externo' },
    music_play:    { tag: 'PLAY', color: '#F59E0B', text: () => 'Reproducción de música' },
  }
  const activity: ActivityItem[] = analytics.slice(0, 6).map((e, i) => {
    const m    = TAG_MAP[e.event_type] ?? { tag: 'EVT', color: '#6B7280', text: () => e.event_type }
    const mins = Math.round((now.getTime() - new Date(e.created_at).getTime()) / 60000)
    const source = e.referrer
      ? e.referrer.includes('instagram') ? 'Instagram'
        : e.referrer.includes('google')  ? 'Google'
        : e.referrer.includes('twitter') || e.referrer.includes('x.com') ? 'Twitter'
        : e.referrer.includes('facebook') ? 'Facebook'
        : 'Externo'
      : 'Directo'
    return {
      id: String(i), tag: m.tag, color: m.color, text: m.text(e),
      time: mins < 60 ? `${mins}m` : mins < 1440 ? `${Math.floor(mins/60)}h` : `${Math.floor(mins/1440)}d`,
      country: e.country ?? undefined,
      source,
    }
  })

  // Avoid localhost URL being embedded at build time — fall back to the production domain
  const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const appUrl = rawAppUrl && !rawAppUrl.includes('localhost') ? rawAppUrl : 'https://artix-music.vercel.app'
  const pressMeta = {
    url:          `${appUrl}/${artist.slug}`,
    artistName:   artist.artist_name,
    firstName:    artist.artist_name.split(' ')[0],
    initials:     artist.artist_name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2),
    genre:        artist.genre,
    photoUrl:     artist.photo_url,
    plan:         'PRO',
    planDaysLeft: 30,
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardContent
        artist={artist as Artist}
        pressMeta={pressMeta}
        kpis={kpis}
        tracks={tracks}
        upcoming={upcoming}
        checklist={checklist}
        activity={activity}
      />
    </div>
  )
}
