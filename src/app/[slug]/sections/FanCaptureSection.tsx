'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import type { ArtistPalette, Artist } from '@/types'
import type { FanCaptureConfig } from '@/types/sections'
import { Reveal, SectionWrapper } from './_shared'

interface Props { config: FanCaptureConfig; artist: Artist; palette: ArtistPalette }

export default function FanCaptureSection({ config, artist, palette }: Props) {
  const [email, setEmail]   = useState('')
  const [name,  setName]    = useState('')
  const [state, setState]   = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setState('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, artist_slug: artist.slug, source: 'presskit' }),
      })
      setState(res.ok ? 'done' : 'error')
    } catch { setState('error') }
  }

  return (
    <SectionWrapper id="fan-capture" bgImage={config.bg_image} overlay={config.overlay_opacity} palette={palette} className="py-24 md:py-32">
      <div className="max-w-xl mx-auto px-6 text-center">

        {/* Glow bg */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[80px] opacity-20"
            style={{ background: palette.primary }} />
        </div>

        <Reveal>
          <h2 className="font-display font-black text-3xl md:text-5xl mb-3" style={{ color: palette.text }}>
            {config.section_title ?? 'Únete a mi comunidad'}
          </h2>
          {config.subtitle && (
            <p className="text-sm md:text-base mb-8" style={{ color: palette.textMuted }}>{config.subtitle}</p>
          )}
        </Reveal>

        <Reveal delay={0.1}>
          {state === 'done' ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-8">
              <div className="text-5xl mb-4">🎉</div>
              <p className="font-semibold text-lg" style={{ color: palette.text }}>¡Ya eres parte de la familia!</p>
              <p className="text-sm mt-2" style={{ color: palette.textMuted }}>Prepárate para las novedades</p>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-3">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Tu nombre (opcional)"
                className="w-full px-5 py-4 rounded-2xl text-sm focus:outline-none transition-all"
                style={{
                  background:  palette.surface,
                  border:      `1px solid ${palette.border}`,
                  color:       palette.text,
                }}
              />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full px-5 py-4 rounded-2xl text-sm focus:outline-none transition-all"
                style={{
                  background:  palette.surface,
                  border:      `1px solid ${palette.border}`,
                  color:       palette.text,
                }}
              />
              <motion.button
                type="submit"
                disabled={state === 'loading'}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-2xl font-bold text-sm text-white tracking-wider uppercase disabled:opacity-60"
                style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})` }}>
                {state === 'loading' ? '...' : (config.button_text ?? 'Quiero entrar')}
              </motion.button>
              {state === 'error' && (
                <p className="text-xs text-red-400 text-center">Algo salió mal. Intenta de nuevo.</p>
              )}
              {config.privacy_text && (
                <p className="text-[11px] text-center mt-1" style={{ color: palette.textMuted }}>{config.privacy_text}</p>
              )}
            </form>
          )}
        </Reveal>
      </div>
    </SectionWrapper>
  )
}
