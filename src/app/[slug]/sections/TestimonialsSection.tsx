'use client'
import { motion } from 'framer-motion'
import type { ArtistPalette } from '@/types'
import type { TestimonialsConfig } from '@/types/sections'
import { SectionWrapper, Reveal, StaggerParent, StaggerChild } from './_shared'

interface Props { config: TestimonialsConfig; palette: ArtistPalette }

export default function TestimonialsSection({ config, palette }: Props) {
  const testimonials = config.testimonials ?? []
  if (testimonials.length === 0) return null

  return (
    <SectionWrapper id="testimonials" bgImage={config.bg_image} overlay={config.overlay_opacity} palette={palette} className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight mb-12"
            style={{ color: palette.text }}>
            {config.section_title ?? 'Lo que dicen'}
          </h2>
        </Reveal>

        <StaggerParent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <StaggerChild key={t.id}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-4 p-6 rounded-2xl h-full"
                style={{ background: palette.surface, border: `1px solid ${palette.border}` }}>

                {/* Quote mark */}
                <span className="text-4xl font-serif leading-none" style={{ color: palette.primary + '60' }}>"</span>

                <p className="flex-1 text-sm leading-relaxed" style={{ color: palette.text }}>
                  {t.text}
                </p>

                <div className="flex items-center gap-3 pt-3"
                  style={{ borderTop: `1px solid ${palette.border}` }}>
                  {t.photo ? (
                    <img src={t.photo} alt={t.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                      style={{ border: `2px solid ${palette.primary}40` }} />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                      style={{ background: palette.primary + '20', color: palette.primary }}>
                      {t.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: palette.text }}>{t.name}</p>
                    {t.role && (
                      <p className="text-xs font-mono truncate" style={{ color: palette.textMuted }}>{t.role}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </StaggerChild>
          ))}
        </StaggerParent>
      </div>
    </SectionWrapper>
  )
}
