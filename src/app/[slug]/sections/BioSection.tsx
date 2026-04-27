'use client'
import type { ArtistPalette } from '@/types'
import type { BioConfig } from '@/types/sections'
import { Reveal, SectionWrapper, CountUp, StaggerParent, StaggerChild } from './_shared'

interface Props { config: BioConfig; palette: ArtistPalette }

export default function BioSection({ config, palette }: Props) {
  return (
    <SectionWrapper id="bio" bgImage={config.bg_image} overlay={config.overlay_opacity} parallax={config.parallax} palette={palette} className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">

        {/* City / Country / Genres */}
        <Reveal>
          <div className="flex flex-wrap items-center gap-3 mb-10">
            {config.city && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border"
                style={{ borderColor: palette.border, color: palette.textMuted }}>
                📍 {config.city}{config.country ? `, ${config.country}` : ''}
              </span>
            )}
            {config.genres?.map(g => (
              <span key={g} className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider"
                style={{ background: palette.primary + '18', color: palette.primary, border: `1px solid ${palette.primary}30` }}>
                {g}
              </span>
            ))}
            {config.badges?.map(b => (
              <span key={b} className="px-3 py-1 rounded-full text-xs font-mono border"
                style={{ borderColor: palette.border, color: palette.textMuted }}>
                {b}
              </span>
            ))}
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-12 items-start">

          {/* Bio text */}
          <div className="md:col-span-2">
            <Reveal>
              <div
                className="prose prose-lg max-w-none leading-relaxed"
                style={{ color: palette.text }}
                dangerouslySetInnerHTML={{ __html: config.text ?? '' }}
              />
            </Reveal>
          </div>

          {/* Stats */}
          {config.stats?.length > 0 && (
            <StaggerParent className="flex flex-col gap-6">
              {config.stats.map((s, i) => (
                <StaggerChild key={i}>
                  <div className="p-5 rounded-2xl" style={{ background: palette.surface, border: `1px solid ${palette.border}` }}>
                    <p className="text-3xl font-display font-black mb-1" style={{ color: palette.primary }}>
                      <CountUp target={s.value} />
                    </p>
                    <p className="text-xs font-mono uppercase tracking-wider" style={{ color: palette.textMuted }}>{s.label}</p>
                  </div>
                </StaggerChild>
              ))}
            </StaggerParent>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}
