'use client'
import type { ArtistPalette } from '@/types'
import type { RiderConfig } from '@/types/sections'
import { Reveal, SectionWrapper, StaggerParent, StaggerChild } from './_shared'

interface Props { config: RiderConfig; palette: ArtistPalette }

// Convierte **negrita** en <strong> resaltado con el color de acento
function renderIntro(text: string, accent: string) {
  const parts = (text ?? '').split(/(\*\*[^*]+\*\*)/g)
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i} style={{ color: accent, fontWeight: 700 }}>{p.slice(2, -2)}</strong>
      : <span key={i}>{p}</span>
  )
}

export default function RiderSection({ config, palette }: Props) {
  const items = config.items ?? []
  const notes = config.notes ?? []

  return (
    <SectionWrapper id="rider" bgImage={config.bg_image} overlay={config.overlay_opacity} palette={palette} className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">

        <Reveal className="mb-10">
          <div className="flex items-end gap-4">
            <h2 className="font-display font-black text-4xl md:text-5xl uppercase tracking-tight" style={{ color: palette.text }}>
              {config.section_title ?? 'Rider'}
            </h2>
            <div className="flex-1 h-px mb-3" style={{ background: `linear-gradient(to right, ${palette.primary}50, transparent)` }} />
          </div>
          {config.intro && (
            <p className="mt-5 max-w-2xl text-base md:text-lg leading-relaxed" style={{ color: palette.textMuted }}>
              {renderIntro(config.intro, palette.primary)}
            </p>
          )}
        </Reveal>

        {items.length > 0 ? (
          <StaggerParent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {items.map((it) => (
              <StaggerChild key={it.id}>
                <div className="group relative overflow-hidden rounded-2xl p-6 h-full flex flex-col transition-transform hover:-translate-y-1"
                  style={{ background: palette.surface, border: `1px solid ${palette.border}` }}>
                  {it.image && (
                    <div className="mb-5 rounded-xl overflow-hidden aspect-[4/3]" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <img src={it.image} alt={it.name} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  )}
                  {it.role && (
                    <span className="text-[11px] font-mono uppercase tracking-[2px] mb-1" style={{ color: palette.primary }}>
                      {it.role}
                    </span>
                  )}
                  <span className="font-display font-bold text-lg md:text-xl leading-tight" style={{ color: palette.text }}>
                    {it.name}
                  </span>
                </div>
              </StaggerChild>
            ))}
          </StaggerParent>
        ) : (
          <Reveal>
            <div className="flex flex-col items-center justify-center py-20 rounded-2xl"
              style={{ border: `1px dashed ${palette.border}`, color: palette.textMuted }}>
              <span className="text-4xl mb-4">🎛️</span>
              <p className="text-sm">Añade tu equipamiento técnico</p>
            </div>
          </Reveal>
        )}

        {notes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6">
            {notes.map((n) => (
              <Reveal key={n.id}>
                <div className="rounded-2xl p-6 h-full" style={{ background: palette.surface, border: `1px solid ${palette.border}` }}>
                  <h3 className="font-mono text-[12px] uppercase tracking-[2px] mb-2" style={{ color: palette.primary }}>{n.title}</h3>
                  <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: palette.textMuted }}>{n.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {config.cta_text && config.cta_url && (
          <Reveal className="mt-10">
            <a href={config.cta_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-transform hover:scale-105"
              style={{ background: palette.primary, color: '#fff' }}>
              {config.cta_text} ↓
            </a>
          </Reveal>
        )}
      </div>
    </SectionWrapper>
  )
}
