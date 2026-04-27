'use client'
import { motion } from 'framer-motion'
import type { ArtistPalette } from '@/types'
import type { LiveConfig } from '@/types/sections'
import { Reveal, SectionWrapper, CountUp } from './_shared'

interface Props { config: LiveConfig; palette: ArtistPalette }

export default function LiveSection({ config, palette }: Props) {
  const venues = config.venues ?? []

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    } catch { return d }
  }

  return (
    <SectionWrapper id="live" palette={palette} className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">

        <Reveal className="mb-12">
          <div className="flex items-end gap-4 mb-8">
            <h2 className="font-display font-black text-4xl md:text-5xl" style={{ color: palette.text }}>
              {config.section_title ?? 'En Vivo'}
            </h2>
            <div className="flex-1 h-px mb-3" style={{ background: `linear-gradient(to right, ${palette.primary}50, transparent)` }} />
          </div>

          {/* Stats */}
          {(config.total_shows || config.countries_count) && (
            <div className="flex flex-wrap gap-6">
              {config.total_shows && (
                <div>
                  <p className="text-4xl font-display font-black" style={{ color: palette.primary }}>
                    <CountUp target={config.total_shows} />
                  </p>
                  <p className="text-xs font-mono uppercase tracking-wider mt-1" style={{ color: palette.textMuted }}>shows</p>
                </div>
              )}
              {config.countries_count && (
                <div>
                  <p className="text-4xl font-display font-black" style={{ color: palette.primary }}>
                    <CountUp target={config.countries_count} />
                  </p>
                  <p className="text-xs font-mono uppercase tracking-wider mt-1" style={{ color: palette.textMuted }}>países</p>
                </div>
              )}
            </div>
          )}
        </Reveal>

        {venues.length > 0 ? (
          <div className="flex flex-col" style={{ borderTop: `1px solid ${palette.border}` }}>
            {venues.map((v, i) => (
              <motion.div
                key={v.id ?? i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ x: 6 }}
                className="flex items-center justify-between py-5 border-b transition-all"
                style={{ borderColor: palette.border }}>
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-lg"
                      style={{ background: palette.primary + '15', border: `1px solid ${palette.primary}25` }}>
                      🎤
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm md:text-base truncate" style={{ color: palette.text }}>{v.name}</p>
                      <p className="text-xs font-mono mt-0.5" style={{ color: palette.textMuted }}>
                        {[v.city, v.country].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>
                  {v.date && (
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-sm font-mono" style={{ color: palette.primary }}>{formatDate(v.date)}</p>
                    </div>
                  )}
              </motion.div>
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="flex flex-col items-center justify-center py-20 rounded-2xl"
              style={{ border: `1px dashed ${palette.border}`, color: palette.textMuted }}>
              <span className="text-4xl mb-4">🎤</span>
              <p className="text-sm">Próximas fechas disponibles</p>
            </div>
          </Reveal>
        )}

        {/* CTA */}
        {config.cta_text && (
          <Reveal delay={0.2} className="mt-10">
            <motion.a
              href={config.cta_url || '#contact'}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})` }}>
              {config.cta_text}
            </motion.a>
          </Reveal>
        )}
      </div>
    </SectionWrapper>
  )
}
