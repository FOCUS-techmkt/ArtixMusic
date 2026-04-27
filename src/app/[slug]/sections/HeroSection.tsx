'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { ArtistPalette, Artist } from '@/types'
import type { HeroConfig } from '@/types/sections'
import { GlitchText, Ticker } from './_shared'

interface Props {
  config:  HeroConfig
  artist:  Artist
  palette: ArtistPalette
}

export default function HeroSection({ config, artist, palette }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // tsparticles-lite via canvas — no heavy lib import needed
  useEffect(() => {
    if (!config.particles || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    const particles: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = []
    const count = Math.min(config.particles_density ?? 60, 120)

    for (let i = 0; i < count; i++) {
      particles.push({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r:  Math.random() * 1.5 + 0.5,
        a:  Math.random() * 0.5 + 0.1,
      })
    }

    let raf: number
    const primary = palette.primary

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = primary + Math.round(p.a * 255).toString(16).padStart(2, '0')
        ctx.fill()
      })

      // Draw lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = primary + Math.round((1 - dist / 100) * 40).toString(16).padStart(2, '0')
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()

    const onResize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [config.particles, config.particles_density, palette.primary])

  const supporters = config.supporters?.length
    ? config.supporters
    : Array.isArray(artist.supporters) ? artist.supporters.map((s: { name: string }) => s.name) : []

  const links = artist.links ?? {}
  const socialLinks = [
    { key: 'instagram', url: links.instagram, label: 'IG' },
    { key: 'soundcloud', url: links.soundcloud, label: 'SC' },
    { key: 'spotify', url: links.spotify, label: 'SP' },
    { key: 'youtube', url: links.youtube, label: 'YT' },
  ].filter(l => l.url)

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden" style={{ background: palette.bg }}>

      {/* Background image */}
      {config.bg_image && (
        <div className="absolute inset-0">
          <img src={config.bg_image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0"
            style={{ background: `rgba(${palette.bg === '#FAF9F6' ? '250,249,246' : '8,8,8'},${config.overlay_opacity ?? 0.55})` }} />
        </div>
      )}

      {/* Particles canvas */}
      {config.particles && (
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />
      )}

      {/* Glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full blur-[120px]"
          style={{ background: palette.primary + '30' }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full blur-[100px]"
          style={{ background: palette.secondary + '25' }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">

        {/* Artist photo */}
        {artist.photo_url && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-8">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden mx-auto"
              style={{ border: `3px solid ${palette.primary}50`, boxShadow: `0 0 40px ${palette.primary}40` }}>
              <img src={artist.photo_url} alt={artist.artist_name} className="w-full h-full object-cover" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full"
              style={{ border: `1px dashed ${palette.primary}30` }}
            />
          </motion.div>
        )}

        {/* Name */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}>
          <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl leading-none mb-4"
            style={{ color: palette.text }}>
            {config.text_glitch
              ? <GlitchText text={artist.artist_name} />
              : artist.artist_name}
          </h1>
        </motion.div>

        {/* Tagline */}
        {config.tagline && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-lg md:text-2xl font-light mb-2 max-w-xl"
            style={{ color: palette.primary }}>
            {config.tagline}
          </motion.p>
        )}

        {/* Sub tagline */}
        {config.sub_tagline && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-sm md:text-base font-mono uppercase tracking-widest mb-10"
            style={{ color: palette.textMuted }}>
            {config.sub_tagline}
          </motion.p>
        )}

        {/* Social links */}
        {config.show_socials && socialLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center gap-3 mb-8">
            {socialLinks.map(l => (
              <a key={l.key} href={l.url} target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider border transition-all hover:scale-105"
                style={{
                  borderColor: palette.primary + '40',
                  color:       palette.primary,
                  background:  palette.primary + '10',
                }}>
                {l.label}
              </a>
            ))}
          </motion.div>
        )}

        {/* CTA */}
        {config.cta_text && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}>
            <motion.a
              href={config.cta_url || '#contact'}
              whileHover={{ scale: 1.05, boxShadow: `0 0 30px ${palette.primary}60` }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-bold tracking-wider uppercase text-white"
              style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})` }}>
              {config.cta_text}
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
            </motion.a>
          </motion.div>
        )}
      </div>

      {/* Ticker */}
      {supporters.length > 0 && (
        <div className="relative z-10 py-4 border-t" style={{ borderColor: palette.border }}>
          <Ticker items={supporters} accent={palette.primary} />
        </div>
      )}

      {/* Scroll indicator */}
      {config.show_scroll && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}>
          <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: palette.textMuted }}>Scroll</span>
          <div className="w-px h-8" style={{ background: `linear-gradient(to bottom, ${palette.primary}, transparent)` }} />
        </motion.div>
      )}
    </section>
  )
}
