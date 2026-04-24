'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Music2, Play } from 'lucide-react'
import type { Artist } from '@/types'

// Extract SoundCloud/Spotify embed URL from share URL
function getEmbedUrl(links: Artist['links']): { type: 'soundcloud' | 'spotify' | null; url: string } {
  if (links.soundcloud) {
    const encoded = encodeURIComponent(links.soundcloud)
    return {
      type: 'soundcloud',
      url: `https://w.soundcloud.com/player/?url=${encoded}&color=%23C026D3&auto_play=false&show_artwork=true&visual=true`,
    }
  }
  if (links.spotify) {
    // Convert open.spotify.com/artist/ID to embed URL
    const match = links.spotify.match(/spotify\.com\/(artist|album|track|playlist)\/([^?]+)/)
    if (match) {
      return { type: 'spotify', url: `https://open.spotify.com/embed/${match[1]}/${match[2]}` }
    }
  }
  return { type: null, url: '' }
}

interface TrackCardProps {
  title: string
  index: number
}

function TrackCard({ title, index }: TrackCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="group relative flex items-center gap-4 p-4 rounded-2xl border cursor-pointer overflow-hidden"
      style={{ borderColor: 'var(--color-border)', backgroundColor: 'color-mix(in srgb, var(--color-surface) 60%, transparent)' }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'radial-gradient(ellipse at center, color-mix(in srgb, var(--color-accent) 8%, transparent), transparent 70%)' }}
      />

      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
        style={{ backgroundColor: 'color-mix(in srgb, var(--color-accent) 15%, transparent)' }}
      >
        <Play className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate" style={{ color: 'var(--color-text)' }}>{title}</p>
        <p className="text-xs font-mono" style={{ color: 'var(--color-muted)' }}>Track {String(index + 1).padStart(2, '0')}</p>
      </div>

      {/* Shimmer on hover */}
      <div
        className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
        style={{ background: 'linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-glow) 10%, transparent), transparent)' }}
      />
    </motion.div>
  )
}

interface Props {
  artist: Artist
}

export default function MusicSection({ artist }: Props) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const embed = getEmbedUrl(artist.links)

  const fakeTracks = [
    `${artist.artist_name} - Void Walker`,
    `${artist.artist_name} - Depth Charge`,
    `${artist.artist_name} - Signal Lost`,
    `${artist.artist_name} - Subterranean`,
  ]

  return (
    <section className="py-24 px-6" style={{ backgroundColor: 'var(--color-surface)' }} ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          className="text-xs font-mono tracking-widest uppercase mb-4"
          style={{ color: 'var(--color-accent)' }}
        >
          // MUSIC
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
          className="font-display font-bold text-4xl md:text-5xl mb-12"
          style={{ color: 'var(--color-text)' }}
        >
          Escucha
        </motion.h2>

        {/* Embedded player */}
        {embed.type && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
            className="mb-10 rounded-3xl overflow-hidden border"
            style={{ borderColor: 'var(--color-border)' }}
          >
            {embed.type === 'soundcloud' ? (
              <iframe
                src={embed.url}
                width="100%"
                height="300"
                allow="autoplay"
                className="w-full block"
              />
            ) : (
              <iframe
                src={embed.url}
                width="100%"
                height="352"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="w-full block"
              />
            )}
          </motion.div>
        )}

        {/* Track cards */}
        {!embed.type && (
          <div className="mb-6 flex items-center gap-2 p-4 rounded-2xl border border-dashed" style={{ borderColor: 'var(--color-border)' }}>
            <Music2 className="w-5 h-5" style={{ color: 'var(--color-muted)' }} />
            <span className="text-sm" style={{ color: 'var(--color-muted)' }}>Conecta SoundCloud o Spotify para mostrar tu música</span>
          </div>
        )}

        <motion.div
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } } }}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {fakeTracks.map((track, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            >
              <TrackCard title={track} index={i} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
