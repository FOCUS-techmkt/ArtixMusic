'use client'
import type { ArtistPalette } from '@/types'
import type { SupportersConfig } from '@/types/sections'
import { Reveal, SectionWrapper, Ticker } from './_shared'

interface Props { config: SupportersConfig; palette: ArtistPalette }

export default function SupportersSection({ config, palette }: Props) {
  const names = config.ticker_names ?? []
  if (names.length === 0) return null

  return (
    <SectionWrapper id="supporters" palette={palette} className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <Reveal>
          <p className="text-xs font-mono uppercase tracking-[0.3em] mb-2" style={{ color: palette.textMuted }}>
            {config.section_title ?? 'Apoyado por'}
          </p>
          <div className="h-px w-16" style={{ background: palette.primary }} />
        </Reveal>
      </div>
      <div className="py-4" style={{ borderTop: `1px solid ${palette.border}`, borderBottom: `1px solid ${palette.border}` }}>
        <Ticker items={names} accent={palette.primary} speed={40} />
      </div>
    </SectionWrapper>
  )
}
