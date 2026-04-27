'use client'
import { motion } from 'framer-motion'
import type { ArtistPalette, Artist } from '@/types'
import type { ContactConfig } from '@/types/sections'
import { Reveal, SectionWrapper } from './_shared'

interface Props { config: ContactConfig; artist: Artist; palette: ArtistPalette }

export default function ContactSection({ config, artist, palette }: Props) {
  const email   = artist.booking_email
  const bookUrl = config.cta_url || artist.booking_url

  return (
    <SectionWrapper id="contact" bgImage={config.bg_image} overlay={config.overlay_opacity} palette={palette} className="py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-6 text-center">

        <Reveal>
          <h2 className="font-display font-black text-4xl md:text-6xl mb-4" style={{ color: palette.text }}>
            {config.section_title ?? 'Contacto'}
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {config.response_time && (
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl">⚡</span>
                <p className="text-xs font-mono uppercase tracking-wider" style={{ color: palette.textMuted }}>Respuesta</p>
                <p className="text-sm font-semibold" style={{ color: palette.text }}>{config.response_time}</p>
              </div>
            )}
            {config.availability && (
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl">📅</span>
                <p className="text-xs font-mono uppercase tracking-wider" style={{ color: palette.textMuted }}>Disponibilidad</p>
                <p className="text-sm font-semibold" style={{ color: palette.text }}>{config.availability}</p>
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.2} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {bookUrl && (
            <motion.a
              href={bookUrl}
              target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.05, boxShadow: `0 0 40px ${palette.primary}50` }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-full font-bold text-white text-sm tracking-wider uppercase"
              style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})` }}>
              {config.cta_text || 'Solicitar Booking'}
            </motion.a>
          )}
          {email && (
            <motion.a
              href={`mailto:${email}`}
              whileHover={{ scale: 1.03 }}
              className="px-8 py-4 rounded-full font-medium text-sm border transition-all"
              style={{ borderColor: palette.border, color: palette.text }}>
              {email}
            </motion.a>
          )}
        </Reveal>
      </div>
    </SectionWrapper>
  )
}
