import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import SlugClient from './SlugClient'
import type { ArtistProfile } from './SlugClient'
import type { Section } from '@/types'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  // Try artists table first
  const { data: artist } = await supabase
    .from('artists')
    .select('artist_name, bio, photo_url, tagline')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()

  if (artist) {
    return {
      title: `${artist.artist_name} — Press Kit | Artist Pulse`,
      description: artist.bio?.slice(0, 160) ?? `Press kit oficial de ${artist.artist_name}`,
      openGraph: {
        title: `${artist.artist_name} — Press Kit`,
        description: artist.tagline ?? artist.bio?.slice(0, 100),
        images: artist.photo_url ? [artist.photo_url] : [],
      },
    }
  }

  // Fall back to presskits table
  const { data: presskit } = await supabase
    .from('presskits')
    .select('artist_name, bio, photo_url')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()

  if (!presskit) return { title: 'Artista no encontrado' }

  return {
    title: `${presskit.artist_name} — Press Kit | Artist Pulse`,
    description: presskit.bio?.slice(0, 160) ?? `Press kit oficial de ${presskit.artist_name}`,
    openGraph: {
      title: `${presskit.artist_name} — Press Kit`,
      images: presskit.photo_url ? [presskit.photo_url] : [],
    },
  }
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  // ── 1. Try artists table (new architecture) ───────────────────────────────
  const { data: artist } = await supabase
    .from('artists')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()

  if (artist) {
    // Fetch sections with configs
    const { data: sectionsData } = await supabase
      .from('sections')
      .select('*')
      .eq('artist_id', artist.id)
      .order('sort_order')

    // Fire-and-forget analytics
    supabase.from('analytics').insert({
      artist_id: artist.id,
      event_type: 'page_view',
    }).then(() => {})

    return <SlugClient artist={artist} sections={(sectionsData ?? []) as Section[]} />
  }

  // ── 2. Fall back to presskits table (wizard / old data) ───────────────────
  const { data: presskit } = await supabase
    .from('presskits')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()

  if (!presskit) notFound()

  // Fire-and-forget view counter
  supabase
    .from('presskits')
    .update({ views: (presskit.views ?? 0) + 1 })
    .eq('slug', slug)
    .then(() => {})

  // Build a minimal Artist-compatible object from the legacy presskit row
  const legacyArtist = {
    id:              presskit.id     ?? '',
    user_id:         presskit.user_id ?? '',
    slug:            presskit.slug,
    artist_name:     presskit.artist_name,
    role:            'DJ' as const,
    genre:           (presskit.genres?.[0] ?? 'Other') as import('@/types').GenreType,
    sound_words:     presskit.genres ?? [],
    bio:             presskit.bio ?? '',
    achievements:    [],
    links:           {},
    photo_url:       presskit.photo_url ?? null,
    logo_url:        null,
    primary_color:   presskit.primary_color  ?? '#C026D3',
    secondary_color: presskit.secondary_color ?? '#EC4899',
    bg_dark:         true,
    layout_variant:  'centered' as const,
    booking_email:   null,
    booking_url:     presskit.booking_url ?? null,
    is_published:    true,
    onboarding_step: 'complete' as const,
    tagline:         presskit.tagline ?? null,
    spotify_playlist_url: presskit.spotify_playlist_url ?? null,
    supporters:      Array.isArray(presskit.supporters) ? presskit.supporters : [],
    available_dates: presskit.available_dates ?? null,
    monthly_listeners: presskit.monthly_listeners ?? null,
    total_shows:     presskit.total_shows ?? null,
    countries_count: presskit.countries ?? null,
    instagram_url:   null,
    ra_url:          presskit.ra_url ?? null,
    beatport_url:    presskit.beatport_url ?? null,
    created_at:      '',
    updated_at:      '',
  }

  // Build legacy sections from presskit data
  const legacySections: Section[] = [
    { id: 'hero',    artist_id: presskit.id ?? '', name: 'hero',    is_enabled: true,  sort_order: 0, config: { tagline: presskit.tagline ?? '', sub_tagline: presskit.genres?.join(' · ') ?? '', cta_text: 'Contactar', cta_url: '#contact', show_socials: false, show_scroll: true, particles: true, particles_density: 60, three_bg: false, text_glitch: false, overlay_opacity: 0.5, overlay_color: '#000', bg_image: null, logo_url: null, supporters: Array.isArray(presskit.supporters) ? presskit.supporters.map((s: { name: string }) => s.name) : [] } },
    { id: 'bio',     artist_id: presskit.id ?? '', name: 'bio',     is_enabled: true,  sort_order: 1, config: { text: `<p>${presskit.bio ?? ''}</p>`, city: presskit.location ?? '', country: '', genres: presskit.genres ?? [], badges: [], stats: [{ label: 'Shows', value: presskit.total_shows ?? '' }, { label: 'Países', value: presskit.countries ?? '' }].filter(s => s.value), parallax: false, bg_image: null, overlay_opacity: 0.6, overlay_color: '#000' } },
    { id: 'contact', artist_id: presskit.id ?? '', name: 'contact', is_enabled: true,  sort_order: 2, config: { section_title: 'Contacto', response_time: '', availability: presskit.available_dates ?? '', cta_text: 'Booking', cta_url: presskit.booking_url ?? '', show_rider: false, bg_image: null, overlay_opacity: 0.7, overlay_color: '#000' } },
  ]

  return <SlugClient artist={legacyArtist as import('@/types').Artist} sections={legacySections} />
}
