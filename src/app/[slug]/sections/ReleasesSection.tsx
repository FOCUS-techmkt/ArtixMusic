'use client'
import { motion } from 'framer-motion'
import type { ArtistPalette } from '@/types'
import type { ReleasesConfig } from '@/types/sections'
import { Reveal, SectionWrapper, StaggerParent, StaggerChild } from './_shared'

interface Props { config: ReleasesConfig; palette: ArtistPalette }

export default function ReleasesSection({ config, palette }: Props) {
  const releases = config.releases ?? []

  return (
    <SectionWrapper id="releases" bgImage={config.bg_image} overlay={config.overlay_opacity} palette={palette} className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">

        <Reveal className="mb-12">
          <div className="flex items-end gap-4">
            <h2 className="font-display font-black text-4xl md:text-5xl" style={{ color: palette.text }}>
              {config.section_title ?? 'Discografía'}
            </h2>
            <div className="flex-1 h-px mb-3" style={{ background: `linear-gradient(to right, ${palette.primary}50, transparent)` }} />
          </div>
        </Reveal>

        {releases.length > 0 ? (
          <StaggerParent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {releases.map((r, i) => (
              <StaggerChild key={r.id ?? i}>
                <div className="group relative overflow-hidden rounded-xl aspect-square cursor-pointer"
                  style={{ background: palette.surface }}>
                  {r.cover
                    ? <img src={r.cover} alt={r.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    : (
                      <div className="w-full h-full flex items-center justify-center text-5xl"
                        style={{ background: `linear-gradient(135deg, ${palette.primary}20, ${palette.secondary}20)` }}>
                        💿
                      </div>
                    )
                  }
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center"
                    style={{ background: 'rgba(0,0,0,0.85)' }}>
                    <p className="font-display font-bold text-white text-sm leading-tight">{r.title}</p>
                    {r.label && <p className="text-xs font-mono text-white/50">{r.label} · {r.year}</p>}
                    <div className="flex gap-2">
                      {r.spotify_url && (
                        <a href={r.spotify_url} target="_blank" rel="noopener noreferrer"
                          className="px-3 py-1 rounded-full text-xs font-mono transition-all hover:scale-105"
                          style={{ background: '#1DB954', color: '#000' }}>
                          Spotify
                        </a>
                      )}
                      {r.beatport_url && (
                        <a href={r.beatport_url} target="_blank" rel="noopener noreferrer"
                          className="px-3 py-1 rounded-full text-xs font-mono transition-all hover:scale-105"
                          style={{ background: '#0E6E4C', color: '#fff' }}>
                          Beatport
                        </a>
                      )}
                    </div>
                  </motion.div>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-semibold truncate" style={{ color: palette.text }}>{r.title}</p>
                  {r.label && <p className="text-xs font-mono" style={{ color: palette.textMuted }}>{r.label} · {r.year}</p>}
                </div>
              </StaggerChild>
            ))}
          </StaggerParent>
        ) : (
          <Reveal>
            <div className="flex flex-col items-center justify-center py-20 rounded-2xl"
              style={{ border: `1px dashed ${palette.border}`, color: palette.textMuted }}>
              <span className="text-4xl mb-4">💿</span>
              <p className="text-sm">Próximamente</p>
            </div>
          </Reveal>
        )}
      </div>
    </SectionWrapper>
  )
}
