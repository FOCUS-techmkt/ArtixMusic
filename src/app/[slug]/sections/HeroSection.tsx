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
function InfiniteTicker({ items, speed = 5, separator = '·', accent, bgColor, textColor }: {
  items: string[]; speed?: number; separator?: string; accent: string
  bgColor?: string | null; textColor?: string | null
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
            style={{ color: textColor ?? (i % 2 === 0 ? accent : 'rgba(255,255,255,0.35)') }}>
            <span className="text-[10px]" style={{ color: textColor ?? accent, opacity: 0.6 }}>{separator}</span>
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

// ── Word-by-word animation ───────────────────────────────────────
function WordByWord({ text, delay = 0, className = '', style = {} }: {
  text: string; delay?: number; className?: string; style?: React.CSSProperties
}) {
  return (
    <span className={className} style={style}>
      {text.split(' ').map((word, i) => (
        <motion.span key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: delay + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block mr-[0.28em]">
          {word}
        </motion.span>
      ))}
    </span>
  )
}

// ── Text animation wrapper ───────────────────────────────────────
function AnimText({ text, animation = 'slide', delay = 0, className = '', style = {} }: {
  text: string; animation?: HeroConfig['text_animation']; delay?: number
  className?: string; style?: React.CSSProperties
}) {
  if (animation === 'typewriter') {
    return <TypewriterText text={text} delay={delay} className={className} style={style} />
  }
  if (animation === 'word-by-word') {
    return <WordByWord text={text} delay={delay} className={className} style={style} />
  }
  if (animation === 'reveal') {
    return (
      <div className="overflow-hidden">
        <motion.div className={className} style={style}
          initial={{ y: '110%', opacity: 0 }} animate={{ y: 0, opacity: 1 }}
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
  if (animation === 'scale-up') {
    return (
      <motion.div className={className} style={style}
        initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
        {text}
      </motion.div>
    )
  }
  if (animation === 'slide-down') {
    return (
      <motion.div className={className} style={style}
        initial={{ opacity: 0, y: -36 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}>
        {text}
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
function SocialButton({ link, accent, withText = false, asButton = false }: {
  link: HeroSocialLink; accent: string; withText?: boolean; asButton?: boolean
}) {
  const meta = SOCIAL_META[link.platform] ?? { abbr: link.platform.slice(0, 2).toUpperCase(), label: link.platform }
  return (
    <motion.a href={link.url} target="_blank" rel="noopener noreferrer"
      whileHover={{ scale: 1.1, y: -2, boxShadow: `0 8px 24px ${accent}40` }}
      whileTap={{ scale: 0.95 }}
      title={meta.label}
      className="flex items-center justify-center gap-2 rounded-full text-[11px] font-bold uppercase transition-all"
      style={{
        background:  asButton ? accent : accent + '14',
        border:      `1px solid ${accent}35`,
        color:       asButton ? '#fff' : accent,
        padding:     withText ? '6px 14px 6px 12px' : '0',
        width:       withText ? 'auto' : '40px',
        height:      '40px',
        minWidth:    '40px',
      }}>
      {meta.abbr}
      {withText && <span className="text-[10px] normal-case font-medium">{meta.label}</span>}
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
        className="absolute pointer-events-none"
        style={{ top: '-25%', left: '-25%', width: '150%', height: '150%' }}
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
        className="absolute pointer-events-none"
        style={{ top: '-25%', left: '-25%', width: '150%', height: '150%' }}
        src={`https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&background=1&transparent=0`}
        allow="autoplay"
        onError={() => setFailed(true)}
        title="Hero video"
      />
    )
  }
  return (
    <video className="absolute inset-0 w-full h-full object-cover"
      src={url} autoPlay muted loop playsInline onError={() => setFailed(true)} />
  )
}

// ── Gradient blobs ───────────────────────────────────────────────
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

// ── Canvas particles (legacy lightweight) ────────────────────────
function ParticlesCanvas({ density, primaryColor }: { density: number; primaryColor: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = window.innerWidth; canvas.height = window.innerHeight
    const count = Math.min(density ?? 60, 120)
    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.5 + 0.4, a: Math.random() * 0.45 + 0.1,
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
          const d = Math.sqrt(dx * dx + dy * dy)
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

// ── Glow orbs ────────────────────────────────────────────────────
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

// ── Scroll indicator ─────────────────────────────────────────────
function ScrollIndicator({ indicatorStyle, palette }: { indicatorStyle: string; palette: ArtistPalette }) {
  const base: React.CSSProperties = { position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: '2rem', zIndex: 10 }
  if (indicatorStyle === 'arrow') {
    return (
      <motion.div style={base} className="flex flex-col items-center"
        animate={{ y: [0, 8, 0] }} transition={{ duration: 2.2, repeat: Infinity }}>
        <span style={{ color: palette.textMuted, fontSize: '1.4rem', lineHeight: 1 }}>↓</span>
      </motion.div>
    )
  }
  if (indicatorStyle === 'dot') {
    return (
      <motion.div style={base} className="flex flex-col items-center"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        <div className="w-6 h-10 rounded-full flex items-start justify-center pt-1.5"
          style={{ border: `1.5px solid ${palette.textMuted}50` }}>
          <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: palette.primary }}
            animate={{ y: [0, 14, 0] }} transition={{ duration: 1.8, repeat: Infinity }} />
        </div>
      </motion.div>
    )
  }
  if (indicatorStyle === 'text') {
    return (
      <motion.div style={base} className="flex flex-col items-center gap-1"
        animate={{ y: [0, 4, 0] }} transition={{ duration: 2.2, repeat: Infinity }}>
        <span className="text-[9px] font-mono uppercase tracking-[0.3em]" style={{ color: palette.textMuted }}>scroll down</span>
      </motion.div>
    )
  }
  // default: line
  return (
    <motion.div style={base} className="flex flex-col items-center gap-2"
      animate={{ y: [0, 8, 0] }} transition={{ duration: 2.2, repeat: Infinity }}>
      <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: palette.textMuted }}>scroll</span>
      <div className="w-px h-8" style={{ background: `linear-gradient(to bottom, ${palette.primary}, transparent)` }} />
    </motion.div>
  )
}

// ── Availability badge ───────────────────────────────────────────
function AvailabilityBadge({ config, accent }: { config: HeroConfig; accent: string }) {
  if (!config.show_badge) return null
  const posStyles: Record<string, React.CSSProperties> = {
    'top-left':     { top: '1.5rem',   left: '1.5rem'  },
    'top-right':    { top: '1.5rem',   right: '1.5rem' },
    'bottom-left':  { bottom: '5rem',  left: '1.5rem'  },
    'bottom-right': { bottom: '5rem',  right: '1.5rem' },
  }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="absolute flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-mono"
      style={{ ...posStyles[config.badge_position ?? 'top-right'], zIndex: 20, background: config.badge_color ?? accent, color: config.badge_text_color ?? '#ffffff' }}>
      {config.badge_pulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
      {config.badge_text || 'Disponible Q2–Q3 2026'}
    </motion.div>
  )
}

// ── Text effect styles ───────────────────────────────────────────
function getTextStyle(config: HeroConfig, baseColor: string): React.CSSProperties {
  const effect = config.text_effect ?? 'none'
  const color  = config.text_color  ?? baseColor

  if (effect === 'outline') return { color: 'transparent', WebkitTextStroke: `2px ${color}` }
  if (effect === 'shadow') {
    const x = config.text_shadow_offset_x ?? 0, y = config.text_shadow_offset_y ?? 4
    const b = config.text_shadow_blur ?? 20, sc = config.text_shadow_color ?? '#000'
    return { color, textShadow: `${x}px ${y}px ${b}px ${sc}` }
  }
  if (effect === 'glow') {
    const gc = config.text_glow_color ?? baseColor, gi = config.text_glow_intensity ?? 20
    return { color: gc, textShadow: `0 0 ${gi}px ${gc}, 0 0 ${gi * 2}px ${gc}40` }
  }
  if (effect === 'gradient') {
    return {
      background: `linear-gradient(135deg, ${config.text_gradient_from ?? '#C026D3'}, ${config.text_gradient_to ?? '#7C3AED'})`,
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      backgroundClip: 'text', color: 'transparent',
    }
  }
  return { color }
}

// ── Section background style ─────────────────────────────────────
function buildSectionBg(config: HeroConfig, palette: ArtistPalette): React.CSSProperties {
  const t = config.bg_type ?? (config.video_url ? 'video' : config.bg_image ? 'image' : 'none')
  if (t === 'solid') return { background: config.bg_color ?? palette.bg }
  if (t === 'gradient') {
    const from = config.bg_gradient_from ?? palette.bg, to = config.bg_gradient_to ?? palette.bg
    const mid  = config.bg_gradient_mid, angle = config.bg_gradient_angle ?? 135
    if (config.bg_gradient_type === 'radial')
      return { background: mid ? `radial-gradient(circle, ${from}, ${mid}, ${to})` : `radial-gradient(circle, ${from}, ${to})` }
    return { background: mid ? `linear-gradient(${angle}deg, ${from}, ${mid}, ${to})` : `linear-gradient(${angle}deg, ${from}, ${to})` }
  }
  return { background: palette.bg }
}

// ── Image filter ─────────────────────────────────────────────────
function buildImageFilter(config: HeroConfig): string {
  const parts: string[] = []
  const blur = config.bg_image_blur ?? 0
  if (blur > 0) parts.push(`blur(${blur}px)`)
  const f = config.bg_image_filter ?? 'none'
  if (f === 'bw')       parts.push('grayscale(100%)')
  if (f === 'sepia')    parts.push('sepia(100%)')
  if (f === 'contrast') parts.push('contrast(1.6) brightness(0.75)')
  return parts.length ? parts.join(' ') : 'none'
}

// ── Overlay style ────────────────────────────────────────────────
function buildOverlay(config: HeroConfig): React.CSSProperties {
  const oc = config.overlay_color ?? '#000000'
  const oa = config.overlay_opacity ?? 0.5
  const alpha = Math.round(oa * 255).toString(16).padStart(2, '0')
  const mode = config.overlay_blend_mode ?? 'normal'

  if (config.overlay_gradient) {
    const dir = config.overlay_gradient_dir ?? 'to-top'
    if (dir === 'radial')
      return { background: `radial-gradient(circle at center, transparent 30%, ${oc}${alpha} 100%)`, mixBlendMode: mode as React.CSSProperties['mixBlendMode'] }
    return { background: `linear-gradient(${dir}, ${oc}${alpha}, transparent)`, mixBlendMode: mode as React.CSSProperties['mixBlendMode'] }
  }
  return { background: `${oc}${alpha}`, mixBlendMode: mode as React.CSSProperties['mixBlendMode'] }
}

// ═══════════════════════════════════════════════════════════════
// Main HeroSection
// ═══════════════════════════════════════════════════════════════
interface Props { config: HeroConfig; artist: Artist; palette: ArtistPalette }

export default function HeroSection({ config, artist, palette }: Props) {
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])

  // Resolve layout — prefer new hero_layout, fall back to legacy layout field
  const heroLayout = config.hero_layout ?? (config.layout === 'split' ? 'split' : 'fullscreen-centered')
  const textAnim   = config.text_animation ?? 'slide'
  const textAlign  = config.text_align ?? 'center'

  const bgType    = config.bg_type ?? (config.video_url ? 'video' : config.bg_image ? 'image' : 'none')
  const hasVideo  = bgType === 'video' && !!(config.video_url)
  const videoType = config.video_type ?? (config.video_url ? detectVideoType(config.video_url) : null)

  // Supporters for ticker
  const supporters = (config.supporters?.length ?? 0) > 0
    ? config.supporters
    : (Array.isArray(artist.supporters) ? artist.supporters.map((s: { name: string }) => s.name) : [])

  // Active social links
  const configSocials = (config.socials ?? []).filter(s => s.enabled && s.url).sort((a, b) => a.sort_order - b.sort_order)
  const legacySocials: HeroSocialLink[] = [
    { id: 'ig', platform: 'instagram',  url: artist.links?.instagram  ?? '', enabled: !!artist.links?.instagram,  sort_order: 0 },
    { id: 'sc', platform: 'soundcloud', url: artist.links?.soundcloud ?? '', enabled: !!artist.links?.soundcloud, sort_order: 1 },
    { id: 'sp', platform: 'spotify',    url: artist.links?.spotify    ?? '', enabled: !!artist.links?.spotify,    sort_order: 2 },
    { id: 'yt', platform: 'youtube',    url: artist.links?.youtube    ?? '', enabled: !!artist.links?.youtube,    sort_order: 3 },
  ].filter(s => s.enabled)
  const activeSocials  = configSocials.length > 0 ? configSocials : legacySocials
  const socialsPos     = config.socials_position ?? 'default'
  const socialsStyle   = config.socials_style ?? 'icon'
  const withText       = socialsStyle === 'icon-text'
  const asButton       = socialsStyle === 'button'

  const primaryCta   = config.cta_primary ?? { text: config.cta_text, url: config.cta_url, style: 'filled' as const, color: null }
  const secondaryCta = config.cta_secondary

  // Derived styles
  const sectionBg    = buildSectionBg(config, palette)
  const imageFilter  = buildImageFilter(config)
  const overlayStyle = buildOverlay(config)
  const nameStyle    = getTextStyle(config, palette.text)
  const taglineColor = config.text_color ?? palette.primary

  const alignItems   = textAlign === 'center' ? 'items-center' : textAlign === 'right' ? 'items-end' : 'items-start'
  const textAlignCSS = textAlign as React.CSSProperties['textAlign']
  const justifyContent = textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start'

  // ── Background layers shared across layouts ──────────────────
  const bgLayers = (
    <>
      {hasVideo && videoType && (
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
          <VideoBg url={config.video_url!} type={videoType} fallback={config.bg_image} />
          <div className="absolute inset-0" style={{ ...overlayStyle, zIndex: 1 }} />
        </div>
      )}

      {!hasVideo && config.bg_image && bgType !== 'solid' && bgType !== 'gradient' && (
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
          {config.parallax_bg ? (
            <motion.div className="absolute inset-0" style={{ y: bgY, scale: 1.15 }}>
              {config.ken_burns ? (
                <motion.img src={config.bg_image} alt="" className="w-full h-full object-cover"
                  style={{ filter: imageFilter }}
                  animate={{ scale: config.ken_burns_direction === 'out' ? [1.08, 1, 1.08] : [1, 1.08, 1] }}
                  transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }} />
              ) : (
                <img src={config.bg_image} alt="" className="w-full h-full object-cover" style={{ filter: imageFilter }} />
              )}
            </motion.div>
          ) : (
            config.ken_burns ? (
              <motion.img src={config.bg_image} alt="" className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: imageFilter }}
                animate={{ scale: config.ken_burns_direction === 'out' ? [1.08, 1, 1.08] : [1, 1.08, 1] }}
                transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }} />
            ) : (
              <img src={config.bg_image} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: imageFilter }} />
            )
          )}
          {config.img_vignette && (
            <div className="absolute inset-0" style={{
              background: `radial-gradient(ellipse at center, transparent ${100 - (config.img_vignette_intensity ?? 50)}%, rgba(0,0,0,0.9) 100%)`,
              zIndex: 1,
            }} />
          )}
          {config.bg_image_filter === 'duotone' && (
            <div className="absolute inset-0" style={{
              background: `linear-gradient(135deg, ${config.bg_image_duotone_from ?? '#C026D3'}80, ${config.bg_image_duotone_to ?? '#7C3AED'}80)`,
              mixBlendMode: 'color', zIndex: 1,
            }} />
          )}
          <div className="absolute inset-0" style={{ ...overlayStyle, zIndex: 2 }} />
        </div>
      )}

      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
        <GlowOrbs palette={palette} />
        {config.gradient_animated && <GradientBlobs palette={palette} />}
      </div>

      {config.three_bg && (
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          <HeroThreeCanvas
            effect={config.three_effect ?? 'particles'}
            intensity={config.three_intensity ?? 50}
            primaryColor={config.three_color ?? palette.primary}
          />
        </div>
      )}

      {config.particles && !config.three_bg && (
        <ParticlesCanvas density={config.particles_density ?? 60} primaryColor={palette.primary} />
      )}

      {config.bg_grain && (
        <div className="absolute inset-0 pointer-events-none" style={{
          zIndex: 4,
          opacity: config.bg_grain_intensity === 1 ? 0.03 : config.bg_grain_intensity === 3 ? 0.1 : 0.055,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }} />
      )}
    </>
  )

  // ── Photo panel (for split / magazine) ───────────────────────
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

  // ── Socials row (inline in text block) ───────────────────────
  const socialsRow = config.show_socials && activeSocials.length > 0 && (socialsPos === 'default' || socialsPos === 'top') ? (
    <motion.div className="flex items-center gap-2.5 mt-1 flex-wrap"
      style={{ justifyContent }}
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}>
      {activeSocials.map(link => (
        <SocialButton key={link.id} link={link} accent={palette.primary} withText={withText} asButton={asButton} />
      ))}
    </motion.div>
  ) : null

  // ── CTA row ──────────────────────────────────────────────────
  const ctaRow = (
    <div className="flex flex-wrap gap-3 mt-2" style={{ justifyContent }}>
      {primaryCta.text && (
        <CtaButton text={primaryCta.text} url={primaryCta.url} btnStyle={primaryCta.style}
          color={primaryCta.color} palette={palette} delay={0.5} />
      )}
      {secondaryCta?.enabled && secondaryCta.text && (
        <CtaButton text={secondaryCta.text} url={secondaryCta.url} btnStyle={secondaryCta.style}
          color={secondaryCta.color} palette={palette} delay={0.62} />
      )}
    </div>
  )

  // ── Main text block ──────────────────────────────────────────
  const textBlock = (forceAlign?: 'left' | 'center' | 'right') => {
    const align     = forceAlign ?? textAlign
    const aCls      = align === 'center' ? 'items-center' : align === 'right' ? 'items-end' : 'items-start'
    const tAlign    = align as React.CSSProperties['textAlign']
    const jContent  = align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start'

    return (
      <div className={`flex flex-col gap-4 ${aCls}`} style={{ textAlign: tAlign }}>
        {/* Artist avatar – centered layouts */}
        {(forceAlign ?? textAlign) === 'center' && artist.photo_url && heroLayout !== 'immersive-3d' && (
          <motion.div className="relative mb-2"
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

        <h1 className="font-display font-black"
          style={{ fontSize: `${config.name_size ?? 72}px`, lineHeight: 1, letterSpacing: `${config.letter_spacing ?? 0}px`, ...nameStyle }}>
          <AnimText text={artist.artist_name} animation={textAnim} delay={0.05} />
        </h1>

        {config.tagline && (
          <p className="font-light max-w-xl"
            style={{ fontSize: `${config.tagline_size ?? 20}px`, color: taglineColor }}>
            <AnimText text={config.tagline} animation={textAnim} delay={0.2} />
          </p>
        )}

        {config.sub_tagline && (
          <p className="text-xs font-mono uppercase tracking-[0.2em]" style={{ color: palette.textMuted }}>
            <AnimText text={config.sub_tagline} animation={textAnim} delay={0.3} />
          </p>
        )}

        <motion.div className="flex items-center gap-2.5 flex-wrap"
          style={{ justifyContent: jContent }}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}>
          {config.show_socials && activeSocials.length > 0 && (socialsPos === 'default' || socialsPos === 'top') &&
            activeSocials.map(link => (
              <SocialButton key={link.id} link={link} accent={palette.primary} withText={withText} asButton={asButton} />
            ))
          }
        </motion.div>

        <div className="flex flex-wrap gap-3 mt-1" style={{ justifyContent: jContent }}>
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
  }

  // ── Lateral socials ──────────────────────────────────────────
  const lateralSide = socialsPos === 'lateral-left' ? 'left' : socialsPos === 'lateral-right' ? 'right' : null
  const lateralSocials = lateralSide && config.show_socials && activeSocials.length > 0 ? (
    <motion.div className="absolute flex flex-col items-center gap-3"
      style={{ [lateralSide]: '1.25rem', top: '50%', transform: 'translateY(-50%)', zIndex: 20 }}
      initial={{ opacity: 0, x: lateralSide === 'left' ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}>
      {activeSocials.map(link => <SocialButton key={link.id} link={link} accent={palette.primary} />)}
    </motion.div>
  ) : null

  // ── Ticker ───────────────────────────────────────────────────
  const tickerPos = config.ticker_position ?? 'bottom'
  const tickerEl  = supporters.length > 0 ? (
    <div className="relative py-4 border-t shrink-0"
      style={{ borderColor: palette.border, zIndex: 10, background: config.ticker_bg_color ?? 'transparent' }}>
      <InfiniteTicker items={supporters} speed={config.ticker_speed ?? 5}
        separator={config.ticker_separator ?? '·'} accent={palette.primary}
        bgColor={config.ticker_bg_color} textColor={config.ticker_text_color} />
    </div>
  ) : null

  return (
    <section ref={heroRef} id="hero" className="relative flex flex-col overflow-hidden"
      style={{ ...sectionBg, color: palette.text, minHeight: '100svh' }}>

      {/* Badge */}
      <AvailabilityBadge config={config} accent={palette.primary} />

      {/* BG layers */}
      {bgLayers}

      {/* Lateral socials */}
      {lateralSocials}

      {/* Top socials (absolute position above content) */}
      {socialsPos === 'top' && config.show_socials && activeSocials.length > 0 && (
        <motion.div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20 flex-wrap"
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}>
          {activeSocials.map(link => <SocialButton key={link.id} link={link} accent={palette.primary} withText={withText} asButton={asButton} />)}
        </motion.div>
      )}

      {/* Ticker – top */}
      {tickerPos === 'top' && tickerEl}

      {/* ── Layout variants ─────────────────────────────────── */}

      {/* FULLSCREEN CENTERED + IMMERSIVE 3D */}
      {(heroLayout === 'fullscreen-centered' || heroLayout === 'immersive-3d') && (
        <div className="relative flex-1 flex flex-col justify-center px-6 md:px-12 py-24" style={{ zIndex: 10 }}>
          <div className={`max-w-4xl mx-auto w-full flex flex-col ${alignItems}`} style={{ textAlign: textAlignCSS }}>
            {textBlock('center')}
          </div>
        </div>
      )}

      {/* SPLIT */}
      {heroLayout === 'split' && (
        <div className="relative flex-1 flex flex-col justify-center px-6 md:px-12 py-24" style={{ zIndex: 10 }}>
          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {config.split_photo_side === 'right' ? (
              <>{textBlock('left')}{photoPanel}</>
            ) : (
              <>{photoPanel}{textBlock('left')}</>
            )}
          </div>
        </div>
      )}

      {/* MINIMAL DARK */}
      {heroLayout === 'minimal-dark' && (
        <div className="relative flex-1 flex flex-col justify-center px-8 md:px-20 py-24" style={{ zIndex: 10 }}>
          <div className={`max-w-5xl mx-auto w-full flex flex-col gap-6 ${alignItems}`} style={{ textAlign: textAlignCSS }}>
            <motion.div className="w-8 h-[2px] mb-2" style={{ background: palette.primary }}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6 }} />
            <h1 className="font-display font-black"
              style={{ fontSize: `${config.name_size ?? 80}px`, lineHeight: 1, letterSpacing: `${config.letter_spacing ?? 0}px`, ...nameStyle }}>
              <AnimText text={artist.artist_name} animation={textAnim} delay={0.05} />
            </h1>
            {config.tagline && (
              <p className="font-light max-w-xl" style={{ fontSize: `${config.tagline_size ?? 16}px`, color: palette.primary, opacity: 0.85 }}>
                <AnimText text={config.tagline} animation={textAnim} delay={0.2} />
              </p>
            )}
            {config.sub_tagline && (
              <p className="text-[11px] font-mono uppercase tracking-[0.25em]" style={{ color: palette.textMuted }}>
                {config.sub_tagline}
              </p>
            )}
            <div className="w-px h-8 my-2" style={{ background: palette.primary + '40', alignSelf: 'flex-start' }} />
            {socialsRow}
            {ctaRow}
          </div>
        </div>
      )}

      {/* CINEMATIC */}
      {heroLayout === 'cinematic' && (
        <>
          <div className="absolute top-0 left-0 right-0 bg-black" style={{ height: '8%', zIndex: 11 }} />
          <div className="absolute bottom-0 left-0 right-0 bg-black" style={{ height: '8%', zIndex: 11 }} />
          <div className="relative flex-1 flex flex-col justify-center px-6 md:px-12 py-24" style={{ zIndex: 10 }}>
            <div className={`max-w-4xl mx-auto w-full flex flex-col ${alignItems}`} style={{ textAlign: textAlignCSS }}>
              {textBlock('center')}
            </div>
          </div>
        </>
      )}

      {/* OVERLAY PORTRAIT */}
      {heroLayout === 'overlay-portrait' && (
        <>
          {artist.photo_url && (
            <div className="absolute inset-0" style={{ zIndex: 0 }}>
              <img src={artist.photo_url} alt={artist.artist_name} className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.05) 100%)' }} />
            </div>
          )}
          <div className="relative flex-1" style={{ zIndex: 12 }}>
            <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-16 pt-8">
              <div className="max-w-2xl">
                {textBlock('left')}
              </div>
            </div>
          </div>
        </>
      )}

      {/* MAGAZINE */}
      {heroLayout === 'magazine' && (
        <div className="absolute inset-0 flex" style={{ zIndex: 10 }}>
          {/* Photo column */}
          <div className="w-[45%] shrink-0 relative overflow-hidden">
            {artist.photo_url ? (
              <img src={artist.photo_url} alt={artist.artist_name}
                className="absolute inset-0 w-full h-full object-cover object-top" />
            ) : (
              <div className="absolute inset-0" style={{ background: palette.primary + '18' }} />
            )}
            <div className="absolute inset-0"
              style={{ background: `linear-gradient(to right, transparent 60%, ${palette.bg}30)` }} />
          </div>
          {/* Text column */}
          <div className="flex-1 flex flex-col justify-center px-10 md:px-16 py-16"
            style={{ borderLeft: `1px solid ${palette.primary}18` }}>
            <motion.p className="text-[9px] font-mono uppercase tracking-[0.3em] mb-6"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 0.45, x: 0 }} transition={{ delay: 0.1 }}
              style={{ color: palette.primary }}>
              Press Kit — {new Date().getFullYear()}
            </motion.p>
            <h1 className="font-display font-black mb-4"
              style={{ fontSize: `${config.name_size ?? 64}px`, lineHeight: 1, letterSpacing: `${config.letter_spacing ?? 0}px`, ...nameStyle }}>
              <AnimText text={artist.artist_name} animation={textAnim} delay={0.1} />
            </h1>
            {config.tagline && (
              <p className="font-light mb-2"
                style={{ fontSize: `${config.tagline_size ?? 18}px`, color: palette.primary, opacity: 0.85 }}>
                <AnimText text={config.tagline} animation={textAnim} delay={0.22} />
              </p>
            )}
            {config.sub_tagline && (
              <p className="text-[11px] font-mono uppercase tracking-widest mb-6" style={{ color: palette.textMuted }}>
                {config.sub_tagline}
              </p>
            )}
            <div className="w-12 h-px mb-8" style={{ background: palette.primary + '50' }} />
            {config.show_socials && activeSocials.length > 0 && (
              <div className="flex items-center gap-2.5 mb-6 flex-wrap">
                {activeSocials.map(link => <SocialButton key={link.id} link={link} accent={palette.primary} withText={withText} asButton={asButton} />)}
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              {primaryCta.text && <CtaButton text={primaryCta.text} url={primaryCta.url} btnStyle={primaryCta.style} color={primaryCta.color} palette={palette} delay={0.4} />}
              {secondaryCta?.enabled && secondaryCta.text && <CtaButton text={secondaryCta.text} url={secondaryCta.url} btnStyle={secondaryCta.style} color={secondaryCta.color} palette={palette} delay={0.52} />}
            </div>
          </div>
        </div>
      )}

      {/* Ticker – bottom */}
      {tickerPos === 'bottom' && tickerEl}

      {/* Scroll indicator */}
      {config.show_scroll && heroLayout !== 'magazine' && (
        <ScrollIndicator indicatorStyle={config.scroll_indicator_style ?? 'line'} palette={palette} />
      )}
    </section>
  )
}
