import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import SlugClient from './SlugClient'
import type { ArtistProfile } from './SlugClient'

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
      title: `${artist.artist_name} — Press Kit | PRESSKIT.PRO`,
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
    title: `${presskit.artist_name} — Press Kit | PRESSKIT.PRO`,
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
    // Fetch gallery media
    const { data: media } = await supabase
      .from('media')
      .select('url, type')
      .eq('artist_id', artist.id)
      .eq('type', 'image')
      .order('sort_order')
      .limit(6)

    // Fire-and-forget analytics
    supabase.from('analytics').insert({
      artist_id: artist.id,
      event_type: 'page_view',
    }).then(() => {})

    const profile: ArtistProfile = {
      artistName:        artist.artist_name,
      slug:              artist.slug,
      tagline:           artist.tagline        ?? undefined,
      genres:            artist.genre ? [artist.genre] : (artist.sound_words ?? []).slice(0, 3),
      bio:               artist.bio            ?? '',
      location:          artist.location       ?? undefined,
      photo:             artist.photo_url      ?? undefined,
      monthlyListeners:  artist.monthly_listeners ?? undefined,
      totalShows:        artist.total_shows    ?? undefined,
      countries:         artist.countries_count ?? undefined,
      tracks:            [],
      spotifyPlaylistUrl: artist.spotify_playlist_url ?? undefined,
      raUrl:             artist.ra_url         ?? artist.links?.soundcloud ?? undefined,
      beatportUrl:       artist.beatport_url   ?? artist.links?.beatport   ?? undefined,
      instagramUrl:      artist.instagram_url  ?? artist.links?.instagram  ?? undefined,
      galleryPhotos:     media?.map((m: { url: string }) => m.url) ?? [],
      bookingEmail:      artist.booking_email  ?? undefined,
      bookingUrl:        artist.booking_url    ?? undefined,
      availableDates:    artist.available_dates ?? undefined,
      supporters:        Array.isArray(artist.supporters) ? artist.supporters : [],
      primaryColor:      artist.primary_color   ?? '#C026D3',
      secondaryColor:    artist.secondary_color ?? '#7C3AED',
    }

    return <SlugClient profile={profile} />
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

  const profile: ArtistProfile = {
    artistName:        presskit.artist_name,
    slug:              presskit.slug,
    tagline:           presskit.tagline        ?? undefined,
    genres:            presskit.genres         ?? [],
    bio:               presskit.bio            ?? '',
    location:          presskit.location       ?? undefined,
    photo:             presskit.photo_url      ?? undefined,
    monthlyListeners:  presskit.monthly_listeners ?? undefined,
    totalShows:        presskit.total_shows    ?? undefined,
    countries:         presskit.countries      ?? undefined,
    tracks:            presskit.tracks         ?? [],
    spotifyPlaylistUrl: presskit.spotify_playlist_url ?? undefined,
    raUrl:             presskit.ra_url         ?? undefined,
    beatportUrl:       presskit.beatport_url   ?? undefined,
    bookingEmail:      undefined,
    bookingUrl:        presskit.booking_url    ?? undefined,
    availableDates:    presskit.available_dates ?? undefined,
    supporters:        Array.isArray(presskit.supporters) ? presskit.supporters : [],
    primaryColor:      presskit.primary_color  ?? '#C026D3',
    secondaryColor:    presskit.secondary_color ?? '#EC4899',
    views:             presskit.views          ?? 0,
  }

  return <SlugClient profile={profile} />
}
