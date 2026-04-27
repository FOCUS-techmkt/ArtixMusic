'use client'
import { motion } from 'framer-motion'
import type { ArtistPalette } from '@/types'
import type { MusicConfig } from '@/types/sections'
import { Reveal, SectionWrapper, StaggerParent, StaggerChild } from './_shared'

interface Props { config: MusicConfig; palette: ArtistPalette }

function getEmbedUrl(platform: string, url: string): string | null {
  try {
    if (platform === 'youtube') {
      const id = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)?.[1]
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (platform === 'soundcloud') {
      return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23${''}&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`
    }
    if (platform === 'spotify') {
      const id = url.match(/track\/([A-Za-z0-9]+)/)?.[1]
      return id ? `https://open.spotify.com/embed/track/${id}?utm_source=generator` : null
    }
    return null
  } catch { return null }
}

function TrackCard({ track, palette, layout }: { track: MusicConfig['tracks'][0]; palette: ArtistPalette; layout: string }) {
  const embed = getEmbedUrl(track.platform, track.url)
  const isCompact = track.platform === 'spotify' || track.platform === 'soundcloud'

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: palette.surface, border: `1px solid ${palette.border}` }}>
      {embed ? (
        <iframe
          src={embed}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="w-full"
          style={{ height: isCompact ? 152 : layout === 'list' ? 200 : 280, border: 'none' }}
        />
      ) : (
        <div className="flex items-center justify-center py-12" style={{ color: palette.textMuted }}>
          <div className="text-center">
            <div className="text-4xl mb-3">🎵</div>
            <p className="text-sm">{track.title || 'Track'}</p>
          </div>
        </div>
      )}
      {track.title && (
        <div className="px-4 py-3">
          <p className="text-sm font-semibold truncate" style={{ color: palette.text }}>{track.title}</p>
          <p className="text-xs font-mono mt-0.5" style={{ color: palette.textMuted }}>{track.platform}</p>
        </div>
      )}
    </div>
  )
}

export default function MusicSection({ config, palette }: Props) {
  const tracks = config.tracks ?? []
  const layout = config.layout ?? '2col'

  const gridClass = layout === '3col'
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
    : layout === 'list'
      ? 'flex flex-col gap-4'
      : 'grid grid-cols-1 md:grid-cols-2 gap-5'

  return (
    <SectionWrapper id="music" bgImage={config.bg_image} overlay={config.overlay_opacity} palette={palette} className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="mb-12">
          <div className="flex items-end gap-4">
            <h2 className="font-display font-black text-4xl md:text-5xl" style={{ color: palette.text }}>
              {config.section_title ?? 'Música'}
            </h2>
            <div className="flex-1 h-px mb-3" style={{ background: `linear-gradient(to right, ${palette.primary}50, transparent)` }} />
          </div>
        </Reveal>

        {tracks.length > 0 ? (
          <StaggerParent className={gridClass}>
            {tracks.map((track, i) => (
              <StaggerChild key={track.id ?? i}>
                <TrackCard track={track} palette={palette} layout={layout} />
              </StaggerChild>
            ))}
          </StaggerParent>
        ) : (
          <Reveal>
            <div className="flex flex-col items-center justify-center py-20 rounded-2xl"
              style={{ border: `1px dashed ${palette.border}`, color: palette.textMuted }}>
              <span className="text-4xl mb-4">🎵</span>
              <p className="text-sm">Próximamente</p>
            </div>
          </Reveal>
        )}

        {/* Audio visualizer decoration */}
        {config.audio_visualizer && (
          <div className="flex items-end justify-center gap-1 mt-12 h-12">
            {Array.from({ length: 32 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 rounded-full"
                style={{ background: palette.primary }}
                animate={{ height: ['8px', `${Math.random() * 36 + 8}px`, '8px'] }}
                transition={{ duration: 0.8 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.04, ease: 'easeInOut' }}
              />
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
