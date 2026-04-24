'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useParallax } from '@/hooks/useParallax'
import type { Artist, LayoutVariant } from '@/types'

// ── Animated name ─────────────────────────────────────────────────────────────
function AnimatedName({ name, color }: { name: string; color: string }) {
  return (
    <span className="inline-block" aria-label={name}>
      {name.split('').map((letter, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.6 + i * 0.055, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
          style={{ transformOrigin: 'bottom center', textShadow: `0 0 40px ${color}88` }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </span>
  )
}

// ── Waveform canvas ───────────────────────────────────────────────────────────
function AudioWaveform({ accentColor }: { accentColor: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let frame: number, t = 0

    const resize = () => {
      canvas.width  = canvas.offsetWidth  * devicePixelRatio
      canvas.height = canvas.offsetHeight * devicePixelRatio
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)
      const grad = ctx.createLinearGradient(0, 0, w, 0)
      grad.addColorStop(0, 'transparent')
      grad.addColorStop(0.3, accentColor + '70')
      grad.addColorStop(0.7, accentColor + '70')
      grad.addColorStop(1, 'transparent')
      ctx.strokeStyle = grad
      ctx.lineWidth   = 1.5
      ctx.beginPath()
      for (let i = 0; i <= 100; i++) {
        const x = i * (w / 100)
        const y = h / 2 + Math.sin(i * .22 + t) * 22 + Math.sin(i * .38 + t * 1.3 + 1) * 14 + Math.sin(i * .1 + t * .7) * 8
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()
      t += 0.016
      frame = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize) }
  }, [accentColor])

  return <canvas ref={canvasRef} className="absolute bottom-0 left-0 w-full h-24 pointer-events-none" />
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT: CENTERED — name center screen, full-bleed photo
// ─────────────────────────────────────────────────────────────────────────────
function LayoutCentered({ artist }: { artist: Artist }) {
  const parallaxRef = useParallax(0.35)
  const tags = [artist.genre, artist.role, ...artist.sound_words.slice(0, 2)].filter(Boolean)

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {artist.photo_url && (
        <div ref={parallaxRef} className="absolute inset-[-20%] z-0">
          <Image src={artist.photo_url} alt={artist.artist_name} fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,.55), rgba(0,0,0,.2) 40%, var(--color-bg))` }} />
        </div>
      )}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl">
        <h1 className="font-display font-extrabold text-6xl md:text-8xl lg:text-[10rem] leading-none tracking-tighter" style={{ color: 'var(--color-text)', perspective: '600px' }}>
          <AnimatedName name={artist.artist_name} color={artist.primary_color} />
        </h1>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {tags.map((tag, i) => (
            <motion.span key={tag} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.12, duration: 0.5, ease: 'easeOut' }}
              className="px-3 py-1 rounded-full text-xs font-mono tracking-wider border"
              style={{ borderColor: artist.primary_color, color: artist.secondary_color, backgroundColor: artist.primary_color + '15' }}
            >
              {tag.toUpperCase()}
            </motion.span>
          ))}
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          className="mt-16 flex flex-col items-center gap-1"
        >
          <span className="text-xs font-mono tracking-widest" style={{ color: 'var(--color-muted)' }}>SCROLL</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-[1px] h-10" style={{ backgroundColor: artist.primary_color }} />
        </motion.div>
      </div>
      <AudioWaveform accentColor={artist.primary_color} />
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT: EDITORIAL — big typography dominates, photo is secondary
// ─────────────────────────────────────────────────────────────────────────────
function LayoutEditorial({ artist }: { artist: Artist }) {
  const tags = [artist.genre, artist.role].filter(Boolean)

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col justify-end pb-20 px-8 md:px-16">
      {/* Photo — upper right quadrant */}
      {artist.photo_url && (
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute top-0 right-0 w-1/2 h-3/5 overflow-hidden"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 15% 100%)' }}
        >
          <Image src={artist.photo_url} alt={artist.artist_name} fill className="object-cover" sizes="50vw" priority />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom left, transparent 40%, var(--color-bg) 100%)` }} />
        </motion.div>
      )}

      {/* Accent line */}
      <motion.div
        initial={{ width: 0 }} animate={{ width: '4rem' }}
        transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
        className="h-0.5 mb-8"
        style={{ backgroundColor: artist.primary_color }}
      />

      {/* Tags */}
      <div className="flex gap-2 mb-6">
        {tags.map((tag, i) => (
          <motion.span key={tag} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: artist.primary_color }}
          >
            {tag}
            {i < tags.length - 1 && <span className="ml-2 opacity-30">·</span>}
          </motion.span>
        ))}
      </div>

      {/* Giant name — bottom left */}
      <h1
        className="font-display font-extrabold leading-none tracking-tighter relative z-10"
        style={{
          fontSize: 'clamp(4rem, 12vw, 10rem)',
          color: 'var(--color-text)',
        }}
      >
        {artist.artist_name.split(' ').map((word, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="block"
          >
            {word}
          </motion.div>
        ))}
      </h1>

      <AudioWaveform accentColor={artist.primary_color} />
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT: SPLIT — photo right, name+info left
// ─────────────────────────────────────────────────────────────────────────────
function LayoutSplit({ artist }: { artist: Artist }) {
  const tags = [artist.genre, artist.role, ...artist.sound_words.slice(0, 1)].filter(Boolean)

  return (
    <section className="relative min-h-screen w-full overflow-hidden grid md:grid-cols-2">
      {/* Left — text */}
      <div className="relative z-10 flex flex-col justify-center px-8 md:px-16 py-24" style={{ backgroundColor: 'var(--color-bg)' }}>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}>
          <div className="flex gap-2 mb-8 flex-wrap">
            {tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full text-xs font-mono tracking-wider border"
                style={{ borderColor: artist.primary_color + '55', color: artist.primary_color, backgroundColor: artist.primary_color + '12' }}
              >
                {tag.toUpperCase()}
              </span>
            ))}
          </div>
          <h1 className="font-display font-extrabold leading-none tracking-tighter mb-8"
            style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', color: 'var(--color-text)' }}
          >
            <AnimatedName name={artist.artist_name} color={artist.primary_color} />
          </h1>
          {artist.bio && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.6 }}
              className="text-base leading-relaxed max-w-sm" style={{ color: 'var(--color-muted)' }}
            >
              {artist.bio.slice(0, 120)}…
            </motion.p>
          )}
          {/* Accent divider */}
          <motion.div initial={{ width: 0 }} animate={{ width: '3rem' }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-8 h-0.5" style={{ backgroundColor: artist.primary_color }}
          />
        </motion.div>
      </div>

      {/* Right — photo */}
      {artist.photo_url && (
        <motion.div initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative overflow-hidden order-first md:order-last" style={{ minHeight: '50vh' }}
        >
          <Image src={artist.photo_url} alt={artist.artist_name} fill className="object-cover" sizes="50vw" priority />
          <div className="absolute inset-0"
            style={{ background: `linear-gradient(to right, var(--color-bg) 0%, transparent 20%, transparent 80%, var(--color-bg) 100%)` }}
          />
          {/* Color tint overlay */}
          <div className="absolute inset-0 mix-blend-color opacity-15"
            style={{ backgroundColor: artist.primary_color }} />
        </motion.div>
      )}
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT: RAW — full bleed, immersive, name at bottom edge
// ─────────────────────────────────────────────────────────────────────────────
function LayoutRaw({ artist }: { artist: Artist }) {
  const parallaxRef = useParallax(0.25)

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {artist.photo_url && (
        <div ref={parallaxRef} className="absolute inset-[-15%]">
          <Image src={artist.photo_url} alt={artist.artist_name} fill className="object-cover" sizes="100vw" priority />
        </div>
      )}
      {/* Heavy vignette from bottom */}
      <div className="absolute inset-0"
        style={{ background: `linear-gradient(to top, ${artist.bg_dark ? '#080808' : '#FAF9F6'} 0%, rgba(0,0,0,.4) 50%, rgba(0,0,0,.15) 100%)` }}
      />
      {/* Color accent corner */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-30 blur-3xl"
        style={{ background: `radial-gradient(circle, ${artist.primary_color}, transparent 70%)` }}
      />

      {/* Name — bottom aligned, huge */}
      <div className="absolute bottom-0 inset-x-0 px-6 md:px-12 pb-12">
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-xs font-mono tracking-widest uppercase mb-4"
          style={{ color: artist.primary_color }}
        >
          {artist.genre} · {artist.role}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-extrabold leading-none tracking-tighter"
          style={{
            fontSize: 'clamp(5rem, 15vw, 13rem)',
            color: 'var(--color-text)',
            textShadow: `0 0 60px ${artist.primary_color}55`,
          }}
        >
          {artist.artist_name}
        </motion.h1>
        {/* Accent bar under name */}
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
          className="h-1 mt-4 origin-left rounded-full"
          style={{ background: `linear-gradient(90deg, ${artist.primary_color}, ${artist.secondary_color}, transparent)` }}
        />
      </div>

      <AudioWaveform accentColor={artist.primary_color} />
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTER — picks the right hero layout
// ─────────────────────────────────────────────────────────────────────────────
export default function HeroSection({ artist }: { artist: Artist }) {
  const layout: LayoutVariant = (artist as any).layout_variant ?? 'centered'

  switch (layout) {
    case 'editorial': return <LayoutEditorial artist={artist} />
    case 'split':     return <LayoutSplit     artist={artist} />
    case 'raw':       return <LayoutRaw       artist={artist} />
    default:          return <LayoutCentered  artist={artist} />
  }
}
