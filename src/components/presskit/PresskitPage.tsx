'use client'
import type { Artist, Section, LiveEvent, MediaItem } from '@/types'
import HeroSection from './HeroSection'
import BioSection from './BioSection'
import MusicSection from './MusicSection'
import LiveHistorySection from './LiveHistorySection'
import GallerySection from './GallerySection'
import ContactSection from './ContactSection'
import BookingCTA from './BookingCTA'

interface Props {
  artist: Artist
  sections: Section[]
  events: LiveEvent[]
  media: MediaItem[]
}

const sectionEnabled = (sections: Section[], name: string) =>
  sections.length === 0 || sections.some((s) => s.name === name && s.is_enabled)

export default function PresskitPage({ artist, sections, events, media }: Props) {
  return (
    <main
      className="relative min-h-screen"
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      {sectionEnabled(sections, 'hero') && <HeroSection artist={artist} />}
      {sectionEnabled(sections, 'bio') && <BioSection artist={artist} />}
      {sectionEnabled(sections, 'music') && <MusicSection artist={artist} />}
      {sectionEnabled(sections, 'live') && events.length > 0 && (
        <LiveHistorySection events={events} />
      )}
      {sectionEnabled(sections, 'gallery') && media.length > 0 && (
        <GallerySection media={media} />
      )}
      {sectionEnabled(sections, 'contact') && <ContactSection artist={artist} />}

      {/* Fixed pulsing booking CTA */}
      {artist.booking_email && <BookingCTA email={artist.booking_email} />}
    </main>
  )
}
