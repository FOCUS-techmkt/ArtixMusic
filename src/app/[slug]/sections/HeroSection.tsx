'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { ArtistPalette, Artist } from '@/types'
import type { HeroConfig, HeroSocialLink } from '@/types/sections'
import { GlitchText } from './_shared'
import HeroThreeCanvas from './HeroThreeCanvas'

// ── Social platform labels ──────────────────────────────────────
const SOCIAL_META: Record<string, { abbr: string; label: string }> = {
  instagram:  { abbr: 'IG', label: 'Instagram'       },
  soundcloud: { abbr: 'SC', label: 'SoundCloud'       },
  spotify:    { abbr: 'SP', label: 'Spotify'          },
  youtube:    { abbr: 'YT', label: 'YouTube'          },
  beatport:   { abbr: 'BP', label: 'Beatport'         },
  ra:         { abbr: 'RA', label: 'Resident Advisor' },
  tiktok:     { abbr: 'TK', label: 'TikTok'           },
  twitter:    { abbr: 'X',  label: 'X / Twitter'      },
  facebook:   { abbr: 'FB', label: 'Facebook'         },
  bandcamp:   { abbr: 'BC', label: 'Bandcamp'         },
}

// ── Video URL helpers ───────────────────────────────────────────
function getYoutubeId(url: string): string | null {
  return url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1] ?? null
}
function getVimeoId(url: string): string | null {
  return url.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1] ?? null
}
function detectVideoType(url: string): 'youtube' | 'vimeo' | 'direct' {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
  if (url.includes('vimeo.com')) return 'vimeo'
  return 'direct'
}

// ── Ticker ──────────────────────────────────────────────────────
function InfiniteTicker({
  items, speed = 5, separator = '·', accent,
}: {
  items: string[]; speed?: number; separator?: string; accent: string
}) {
  const duration = Math.max(6, 80 - speed * 7)
  const doubled  = [...items, ...items]
  return (
    <div className="overflow-hidden whitespace-nowrap"
      style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
        className="inline-flex gap-6">
        {doubled.map((item, i) => (
          <span key={i} className="text-[11px] font-mono uppercase tracking-widest flex items-center gap-2.5"
            style={{ color: i % 2 === 0 ? accent : 'rgba(255,255,255,0.35)' }}>
            <span className="text-[10px]" style={{ color: accent, opacity: 0.6 }}>{separator}</span>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ── Typewriter text ──────────────────────────────────────────────
function TypewriterText({ text, delay = 0, className = '', style = {} }: {
  text: string; delay?: number; className?: string; style?: React.CSSProperties
}) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    const t0 = setTimeout(() => {
      let i = 0
      const iv = setInterval(() => {
        setDisplayed(text.slice(0, ++i))
        if (i >= text.length) clearInterval(iv)
      }, 55)
      return () => clearInterval(iv)
    }, delay * 1000)
    return () => clearTimeout(t0)
  }, [text, delay])

  return (
    <span className={className} style={style}>
      {displayed}
      {displayed.length < text.length && (
        <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.45, repeat: Infinity }}>▌</motion.span>
      )}
    </span>
  )
}

// ── Text animation wrapper ───────────────────────────────────────
function AnimText({
  text, animation = 'slide', delay = 0, className = '', style = {},
}: {
  text: string; animation?: HeroConfig['text_animation']; delay?: number
  className?: string; style?: React.CSSProperties
}) {
  if (animation === 'typewriter') {
    return <TypewriterText text={text} delay={delay} className={className} style={style} />
  }
  if (animation === 'reveal') {
    return (
      <div className="overflow-hidden">
        <motion.div className={className} style={style}
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}>
          {text}
        </motion.div>
      </div>
    )
  }
  if (animation === 'glitch') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }} className={className} style={style}>
        <GlitchText text={text} />
      </motion.div>
    )
  }
  const variants = {
    fade:  { initial: { opacity: 0 },        animate: { opacity: 1 } },
    slide: { initial: { opacity: 0, y: 36 }, animate: { opacity: 1, y: 0 } },
  }
  const v = variants[animation as 'fade' | 'slide'] ?? variants.slide
  return (
    <motion.div className={className} style={style}
      initial={v.initial} animate={v.animate}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}>
      {text}
    </motion.div>
  )
}

// ── CTA button ───────────────────────────────────────────────────
function CtaButton({ text, url, btnStyle, color, palette, delay }: {
  text: string; url: string; btnStyle: 'filled' | 'outline' | 'ghost'
  color: string | null; palette: ArtistPalette; delay: number
}) {
  const accent = color ?? palette.primary
  const styleMap = {
    filled:  { background: `linear-gradient(135deg, ${accent}, ${palette.secondary})`, color: '#fff', border: 'none' },
    outline: { background: 'transparent', color: accent, border: `1.5px solid ${accent}60` },
    ghost:   { background: accent + '12', color: accent, border: `1px solid ${accent}20` },
  }
  const s = styleMap[btnStyle] ?? styleMap.filled
  return (
    <motion.a href={url || '#'}
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay }}
      whileHover={{ scale: 1.04, boxShadow: `0 0 28px ${accent}50` }}
      whileTap={{ scale: 0.97 }}
      className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-bold tracking-wider"
      style={s}>
      {text}
      <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>→</motion.span>
    </motion.a>
  )
}

// ── Social link button ───────────────────────────────────────────
function SocialButton({ link, accent }: { link: HeroSocialLink; accent: string }) {
  const meta = SOCIAL_META[link.platform] ?? { abbr: link.platform.slice(0, 2).toUpperCase(), label: link.platform }
  return (
    <motion.a href={link.url} target="_blank" rel="noopener noreferrer"
      whileHover={{ scale: 1.12, y: -3, boxShadow: `0 8px 24px ${accent}45` }}
      whileTap={{ scale: 0.95 }}
      title={meta.label}
      className="w-10 h-10 flex items-center justify-center rounded-full text-[11px] font-bold uppercase transition-colors"
      style={{ background: accent + '14', border: `1px solid ${accent}35`, color: accent }}>
      {meta.abbr}
    </motion.a>
  )
}

// ── Video background ─────────────────────────────────────────────
function VideoBg({ url, type, fallback }: { url: string; type: string; fallback?: string | null }) {
  const [failed, setFailed] = useState(false)

  if (failed && fallback) {
    return <img src={fallback} alt="" className="absolute inset-0 w-full h-full object-cover" />
  }

  if (type === 'youtube') {
    const id = getYoutubeId(url)
    if (!id) return null
    return (
      <iframe
        className="absolute scale-150 w-full h-full pointer-events-none"
        style={{ top: '-25%', left: '-25%', width: '150%', height: '150%', objectFit: 'cover' }}
        src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playsinline=1`}
        allow="autoplay; encrypted-media"
        onError={() => setFailed(true)}
        title="Hero video"
      />
    )
  }
  if (type === 'vimeo') {
    const id = getVimeoId(url)
    if (!id) return null
    return (
      <iframe
        className="absolute"
        style={{ top: '-25%', left: '-25%', width: '150%', height: '150%', pointerEvents: 'none' }}
        src={`https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&background=1&transparent=0`}
        allow="autoplay"
        onError={() => setFailed(true)}
        title="Hero video"
      />
    )
  }
  return (
    <video
      className="absolute inset-0 w-full h-full object-cover"
      src={url} autoPlay muted loop playsInline
      onError={() => setFailed(true)}
    />
  )
}

// ── Animated gradient blobs ──────────────────────────────────────
function GradientBlobs({ palette }: { palette: ArtistPalette }) {
  return (
    <>
      <motion.div className="absolute rounded-full blur-[100px] pointer-events-none"
        style={{ width: '55%', height: '55%', background: palette.primary + '16', left: '-5%', top: '-10%' }}
        animate={{ x: [0, 80, 0], y: [0, 50, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute rounded-full blur-[80px] pointer-events-none"
        style={{ width: '45%', height: '45%', background: palette.secondary + '12', right: '-5%', bottom: '-10%' }}
        animate={{ x: [0, -60, 0], y: [0, -40, 0] }}
        transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut', delay: 3 }} />
    </>
  )
}

// ── Canvas particles (legacy) ─────────────────────────────────────
function ParticlesCanvas({ density, primaryColor }: { density: number; primaryColor: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    const count = Math.min(density ?? 60, 120)
    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,  y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.5 + 0.4,     a: Math.random() * 0.45 + 0.1,
    }))
    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = primaryColor + Math.round(p.a * 255).toString(16).padStart(2, '0')
        ctx.fill()
      })
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < 100) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = primaryColor + Math.round((1 - d / 100) * 35).toString(16).padStart(2, '0')
            ctx.lineWidth = 0.4; ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [density, primaryColor])
  return <canvas ref={ref} className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }} />
}

// ═══════════════════════════════════════════════════════════════
// Main HeroSection
// ═══════════════════════════════════════════════════════════════

interface Props { config: HeroConfig; artist: Artist; palette: ArtistPalette }

export default function HeroSection({ config, artist, palette }: Props) {
  const heroRef = useRef<HTMLElement>(null)

  // Parallax for background image
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])

  const layout    = config.layout     ?? 'centered'
  const textAnim  = config.text_animation ?? 'slide'
  const hasVideo  = !!(config.video_url)
  const videoType = config.video_type ?? (config.video_url ? detectVideoType(config.video_url) : null)

  // Supporters for ticker
  const supporters = (config.supporters?.length ?? 0) > 0
    ? config.supporters
    : (Array.isArray(artist.supporters) ? artist.supporters.map((s: { name: string }) => s.name) : [])

  // Social links: read from config.socials (new) or fall back to artist.links (legacy)
  const configSocials = (config.socials ?? [])
    .filter(s => s.enabled && s.url)
    .sort((a, b) => a.sort_order - b.sort_order)

  const legacySocials: HeroSocialLink[] = [
    { id: 'ig', platform: 'instagram',  url: artist.links?.instagram  ?? '', enabled: !!artist.links?.instagram,  sort_order: 0 },
    { id: 'sc', platform: 'soundcloud', url: artist.links?.soundcloud ?? '', enabled: !!artist.links?.soundcloud, sort_order: 1 },
    { id: 'sp', platform: 'spotify',    url: artist.links?.spotify    ?? '', enabled: !!artist.links?.spotify,    sort_order: 2 },
    { id: 'yt', platform: 'youtube',    url: artist.links?.youtube    ?? '', enabled: !!artist.links?.youtube,    sort_order: 3 },
  ].filter(s => s.enabled)

  const activeSocials = configSocials.length > 0 ? configSocials : legacySocials

  // CTA — prefer new cta_primary, fall back to legacy cta_text/cta_url
  const primaryCta = config.cta_primary ?? { text: config.cta_text, url: config.cta_url, style: 'filled' as const, color: null }
  const secondaryCta = config.cta_secondary

  // ── BG layer ────────────────────────────────────────────────
  const bgContent = (
    <>
      {/* Video */}
      {hasVideo && videoType && (
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
          <VideoBg url={config.video_url!} type={videoType} fallback={config.bg_image} />
          <div className="absolute inset-0" style={{ background: `${config.overlay_color ?? '#000'}${Math.round((config.overlay_opacity ?? 0.45) * 255).toString(16).padStart(2, '0')}` }} />
        </div>
      )}

      {/* Image (no video) */}
      {!hasVideo && config.bg_image && (
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
          {config.parallax_bg ? (
            <motion.div className="absolute inset-0" style={{ y: bgY, scale: 1.15 }}>
              {config.ken_burns ? (
                <motion.img src={config.bg_image} alt=""
                  className="w-full h-full object-cover"
                  animate={{ scale: [1, 1.09, 1] }}
                  transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }} />
              ) : (
                <img src={config.bg_image} alt="" className="w-full h-full object-cover" />
              )}
            </motion.div>
          ) : (
            config.ken_burns ? (
              <motion.img src={config.bg_image} alt=""
                className="absolute inset-0 w-full h-full object-cover"
                animate={{ scale: [1, 1.09, 1] }}
                transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }} />
            ) : (
              <img src={config.bg_image} alt="" className="absolute inset-0 w-full h-full object-cover" />
            )
          )}
          <div className="absolute inset-0"
            style={{ background: `${config.overlay_color ?? '#000'}${Math.round((config.overlay_opacity ?? 0.5) * 255).toString(16).padStart(2, '0')}` }} />
        </div>
      )}

      {/* Gradient blobs (always visible) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
        <GlowOrbs palette={palette} />
        {config.gradient_animated && <GradientBlobs palette={palette} />}
      </div>

      {/* Three.js */}
      {config.three_bg && (
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          <HeroThreeCanvas
            effect={config.three_effect ?? 'particles'}
            intensity={config.three_intensity ?? 50}
            primaryColor={palette.primary}
          />
        </div>
      )}

      {/* Legacy canvas particles */}
      {config.particles && !config.three_bg && (
        <ParticlesCanvas density={config.particles_density ?? 60} primaryColor={palette.primary} />
      )}
    </>
  )

  // ── Text block ───────────────────────────────────────────────
  const textBlock = (
    <div className={`flex flex-col gap-4 ${layout === 'centered' ? 'items-center' : layout === 'right' ? 'items-end' : 'items-start'}`}>
      {/* Artist photo — centered only */}
      {layout === 'centered' && artist.photo_url && (
        <motion.div className="relative mb-4"
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden mx-auto"
            style={{ border: `3px solid ${palette.primary}50`, boxShadow: `0 0 40px ${palette.primary}40` }}>
            <img src={artist.photo_url} alt={artist.artist_name} className="w-full h-full object-cover" />
          </div>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full"
            style={{ border: `1px dashed ${palette.primary}30` }} />
        </motion.div>
      )}

      {/* Artist name */}
      <h1 className={`font-display font-black leading-none ${layout === 'centered' ? 'text-5xl md:text-7xl lg:text-8xl text-center' : 'text-4xl md:text-6xl lg:text-7xl'}`}
        style={{ color: palette.text }}>
        <AnimText text={artist.artist_name} animation={textAnim} delay={0.05} />
      </h1>

      {/* Tagline */}
      {config.tagline && (
        <p className={`text-lg md:text-xl font-light max-w-xl ${layout === 'centered' ? 'text-center' : ''}`}
          style={{ color: palette.primary }}>
          <AnimText text={config.tagline} animation={textAnim} delay={0.2} />
        </p>
      )}

      {/* Sub tagline */}
      {config.sub_tagline && (
        <p className={`text-xs md:text-sm font-mono uppercase tracking-[0.2em] ${layout === 'centered' ? 'text-center' : ''}`}
          style={{ color: palette.textMuted }}>
          <AnimText text={config.sub_tagline} animation={textAnim} delay={0.3} />
        </p>
      )}

      {/* Social links */}
      {config.show_socials && activeSocials.length > 0 && (
        <motion.div className="flex items-center gap-2.5 mt-2"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}>
          {activeSocials.map(link => (
            <SocialButton key={link.id} link={link} accent={palette.primary} />
          ))}
        </motion.div>
      )}

      {/* CTA buttons */}
      <div className={`flex flex-wrap gap-3 mt-2 ${layout === 'centered' ? 'justify-center' : ''}`}>
        {primaryCta.text && (
          <CtaButton text={primaryCta.text} url={primaryCta.url} btnStyle={primaryCta.style}
            color={primaryCta.color} palette={palette} delay={0.5} />
        )}
        {secondaryCta?.enabled && secondaryCta.text && (
          <CtaButton text={secondaryCta.text} url={secondaryCta.url} btnStyle={secondaryCta.style}
            color={secondaryCta.color} palette={palette} delay={0.62} />
        )}
      </div>
    </div>
  )

  // ── Split photo panel ────────────────────────────────────────
  const photoPanel = artist.photo_url ? (
    <motion.div className="relative flex items-center justify-center"
      initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}>
      <div className="relative w-full max-w-sm">
        <div className="absolute inset-0 rounded-3xl blur-2xl" style={{ background: palette.primary + '25', transform: 'scale(0.9)' }} />
        <img src={artist.photo_url} alt={artist.artist_name}
          className="relative w-full aspect-[3/4] object-cover rounded-3xl"
          style={{ border: `1px solid ${palette.primary}30`, boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 80px ${palette.primary}20` }} />
      </div>
    </motion.div>
  ) : null

  return (
    <section ref={heroRef} id="hero" className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: palette.bg }}>

      {/* Background layers */}
      {bgContent}

      {/* Main content */}
      <div className="relative flex-1 flex flex-col justify-center px-6 md:px-12 py-24"
        style={{ zIndex: 10 }}>

        {layout === 'split' ? (
          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {textBlock}
            {photoPanel}
          </div>
        ) : layout === 'left' ? (
          <div className="max-w-3xl">
            {textBlock}
          </div>
        ) : layout === 'right' ? (
          <div className="max-w-3xl ml-auto">
            {textBlock}
          </div>
        ) : (
          // centered
          <div className="max-w-4xl mx-auto w-full text-center flex flex-col items-center">
            {textBlock}
          </div>
        )}
      </div>

      {/* Ticker */}
      {supporters.length > 0 && (
        <div className="relative py-4 border-t shrink-0" style={{ borderColor: palette.border, zIndex: 10 }}>
          <InfiniteTicker
            items={supporters}
            speed={config.ticker_speed ?? 5}
            separator={config.ticker_separator ?? '·'}
            accent={palette.primary}
          />
        </div>
      )}

      {/* Scroll indicator */}
      {config.show_scroll && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ zIndex: 10 }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity }}>
          <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: palette.textMuted }}>scroll</span>
          <div className="w-px h-8" style={{ background: `linear-gradient(to bottom, ${palette.primary}, transparent)` }} />
        </motion.div>
      )}
    </section>
  )
}

// ── Glow orbs (static, always present) ──────────────────────────
function GlowOrbs({ palette }: { palette: ArtistPalette }) {
  return (
    <>
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: palette.primary + '2A' }} />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
        className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: palette.secondary + '20' }} />
    </>
  )
}
