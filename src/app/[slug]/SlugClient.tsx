'use client'
import type { Artist, Section, ArtistPalette } from '@/types'
import { deriveArtistPalette } from '@/types'
import type { HeroConfig, BioConfig, MusicConfig, CommunityConfig, SupportersConfig, ReleasesConfig, LiveConfig, ContactConfig, FanCaptureConfig, GalleryConfig } from '@/types/sections'
import HeroSection       from './sections/HeroSection'
import BioSection        from './sections/BioSection'
import MusicSection      from './sections/MusicSection'
import CommunitySection  from './sections/CommunitySection'
import SupportersSection from './sections/SupportersSection'
import ReleasesSection   from './sections/ReleasesSection'
import LiveSection       from './sections/LiveSection'
import GallerySection    from './sections/GallerySection'
import ContactSection    from './sections/ContactSection'
import FanCaptureSection from './sections/FanCaptureSection'

// Legacy — kept for presskit fallback (page.tsx still exports this type)
export interface ArtistProfile {
  artistName: string; slug: string; tagline?: string; genres?: string[]
  bio?: string; location?: string; photo?: string; monthlyListeners?: string
  totalShows?: string; countries?: string
  tracks?: { title: string; label?: string; year?: string; bpm?: number; key?: string }[]
  spotifyPlaylistUrl?: string; raUrl?: string; beatportUrl?: string; instagramUrl?: string
  galleryPhotos?: string[]; bookingEmail?: string; bookingUrl?: string
  availableDates?: string; supporters?: { name: string }[]
  primaryColor: string; secondaryColor: string; views?: number
}

interface Props {
  artist:   Artist
  sections: Section[]
}

export default function SlugClient({ artist, sections }: Props) {
  const palette = deriveArtistPalette(
    artist.primary_color   ?? '#C026D3',
    artist.secondary_color ?? '#7C3AED',
    artist.bg_dark         ?? true,
  )

  const sorted = [...sections]
    .filter(s => s.is_enabled)
    .sort((a, b) => a.sort_order - b.sort_order)

  return (
    <main style={{ background: palette.bg, color: palette.text, fontFamily: 'var(--font-inter)' }}>
      {sorted.map(section => (
        <SectionRenderer key={section.id} section={section} artist={artist} palette={palette} />
      ))}
      <footer className="py-6 text-center border-t" style={{ borderColor: palette.border }}>
        <p className="text-[11px] font-mono" style={{ color: palette.textMuted }}>
          Creado con{' '}
          <a href="https://artistpulse.io" className="hover:underline" style={{ color: palette.primary }}>Artist Pulse</a>
        </p>
      </footer>
    </main>
  )
}

function SectionRenderer({ section, artist, palette }: { section: Section; artist: Artist; palette: ArtistPalette }) {
  const c = (section.config ?? {}) as Record<string, unknown>
  switch (section.name) {
    case 'hero':        return <HeroSection       config={c as unknown as HeroConfig}       artist={artist} palette={palette} />
    case 'bio':         return <BioSection        config={c as unknown as BioConfig}        palette={palette} />
    case 'music':       return <MusicSection      config={c as unknown as MusicConfig}      palette={palette} />
    case 'community':   return <CommunitySection  config={c as unknown as CommunityConfig}  palette={palette} />
    case 'supporters':  return <SupportersSection config={c as unknown as SupportersConfig} palette={palette} />
    case 'releases':    return <ReleasesSection   config={c as unknown as ReleasesConfig}   palette={palette} />
    case 'live':        return <LiveSection       config={c as unknown as LiveConfig}       palette={palette} />
    case 'gallery':     return <GallerySection    config={c as unknown as GalleryConfig}    palette={palette} />
    case 'contact':     return <ContactSection    config={c as unknown as ContactConfig}    artist={artist} palette={palette} />
    case 'fan-capture': return <FanCaptureSection config={c as unknown as FanCaptureConfig} artist={artist} palette={palette} />
    default:            return null
  }
}
