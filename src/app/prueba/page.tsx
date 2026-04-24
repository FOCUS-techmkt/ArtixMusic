'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, Check, Camera, Eye, Zap, X, Music2, Globe, LayoutGrid, Sparkles } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Track { title: string; label: string; year: string }
interface PresKit {
  artistName: string; tagline: string; role: string; genres: string[]
  location: string; bio: string; email: string
  spotifyUrl: string; soundcloudUrl: string; instagramUrl: string
  raUrl: string; beatportUrl: string
  tracks: Track[]
  monthlyListeners: string; totalShows: string; countries: string; djMagRanking: string
  photo: string
  primaryColor: string; secondaryColor: string
  bgEffect: string; fontStyle: string; animationStyle: string; heroVariant: string
  sections: string[]
}

// ─── Constants ────────────────────────────────────────────────────────────────
const DEFAULT_KIT: PresKit = {
  artistName: '', tagline: '', role: 'DJ', genres: [], location: '', bio: '', email: '',
  spotifyUrl: '', soundcloudUrl: '', instagramUrl: '', raUrl: '', beatportUrl: '',
  tracks: [{ title: '', label: '', year: '' }, { title: '', label: '', year: '' }, { title: '', label: '', year: '' }],
  monthlyListeners: '', totalShows: '', countries: '', djMagRanking: '',
  photo: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600&q=80',
  primaryColor: '#C026D3', secondaryColor: '#7C3AED',
  bgEffect: 'dark', fontStyle: 'grotesk', animationStyle: 'elegant', heroVariant: 'bottom-left',
  sections: ['bio', 'music', 'gallery', 'stats', 'booking'],
}

const ROLES = ['DJ', 'Producer', 'Live Act', 'DJ & Producer', 'Vocalist', 'Band']
const GENRES = ['House', 'Techno', 'Afro House', 'Tech House', 'Ambient', 'Drum & Bass', 'Hip-Hop', 'Electronic', 'Reggaeton', 'Afrobeats', 'Disco', 'Funk', 'Melodic Techno', 'Progressive']
const COLOR_PALETTES = [
  { name: 'Magenta', a: '#C026D3', b: '#7C3AED' },
  { name: 'Ice Blue', a: '#00C8FF', b: '#0047AB' },
  { name: 'Amber', a: '#F59E0B', b: '#D97706' },
  { name: 'Emerald', a: '#10B981', b: '#0D9488' },
  { name: 'Fire Red', a: '#EF4444', b: '#F97316' },
  { name: 'Violet', a: '#8B5CF6', b: '#6366F1' },
  { name: 'Sunset', a: '#F97316', b: '#FBBF24' },
  { name: 'Fuchsia', a: '#D946EF', b: '#A855F7' },
  { name: 'Acid', a: '#84CC16', b: '#22D3EE' },
  { name: 'Gold', a: '#EAB308', b: '#CA8A04' },
  { name: 'Coral', a: '#F43F5E', b: '#FB7185' },
  { name: 'Arctic', a: '#67E8F9', b: '#38BDF8' },
]
const FONTS = [
  { id: 'grotesk', label: 'Grotesk', desc: 'Potente y moderno' },
  { id: 'editorial', label: 'Editorial', desc: 'Elegante y refinado' },
  { id: 'mono', label: 'Técnico', desc: 'Minimal y preciso' },
  { id: 'display', label: 'Display', desc: 'Ultra impacto' },
]
const ANIMATIONS = [
  { id: 'elegant', label: 'Elegante', desc: 'Fades suaves', emoji: '◐' },
  { id: 'dynamic', label: 'Dinámico', desc: 'Slides con energía', emoji: '▶' },
  { id: 'minimal', label: 'Minimal', desc: 'Sin distracciones', emoji: '□' },
  { id: 'glitch', label: 'Glitch', desc: 'Techno distortion', emoji: '▨' },
]
const BG_EFFECTS = [
  { id: 'dark', label: 'Pure Dark', emoji: '◼' },
  { id: 'grain', label: 'Film Grain', emoji: '▦' },
  { id: 'glow', label: 'Neon Glow', emoji: '◉' },
  { id: 'stars', label: 'Particles', emoji: '✦' },
]
const HERO_VARIANTS = [
  { id: 'bottom-left', label: 'Power', desc: 'Texto abajo izq.', icon: '⌞' },
  { id: 'centered', label: 'Impact', desc: 'Nombre centrado', icon: '⊕' },
  { id: 'cinematic', label: 'Cinema', desc: 'Dramático full-bleed', icon: '▬' },
  { id: 'split', label: 'Split', desc: 'Foto + texto lado a lado', icon: '⊟' },
]
const SECTION_OPTIONS = [
  { id: 'bio', label: 'Biografía', desc: 'Historia + premios', required: true },
  { id: 'stats', label: 'Estadísticas', desc: 'Shows, países, streams' },
  { id: 'music', label: 'Discografía', desc: 'Tracks + plataformas' },
  { id: 'gallery', label: 'Galería', desc: 'Fotos del artista' },
  { id: 'press', label: 'Prensa', desc: 'Quotes de medios' },
  { id: 'rider', label: 'Rider Técnico', desc: 'Setup de stage' },
  { id: 'booking', label: 'Formulario Booking', desc: 'Contacto directo', required: true },
]
const SAMPLE_PHOTOS = [
  { url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=500&q=80', label: 'Techno Crowd' },
  { url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80', label: 'Festival Stage' },
  { url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&q=80', label: 'Crowd Energy' },
  { url: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=500&q=80', label: 'Studio' },
  { url: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=500&q=80', label: 'Stage Lights' },
  { url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&q=80', label: 'DJ Booth' },
]
const STEPS = [
  { id: 'bienvenida', label: 'Inicio' },
  { id: 'identidad', label: 'Identidad' },
  { id: 'historia', label: 'Historia' },
  { id: 'musica', label: 'Música' },
  { id: 'foto', label: 'Foto' },
  { id: 'diseno', label: 'Diseño' },
  { id: 'secciones', label: 'Secciones' },
  { id: 'preview', label: 'Preview' },
]

// ─── iPhone dimensions ────────────────────────────────────────────────────────
const PHONE_W = 270
const PHONE_H = 560
const SCREEN_W = 250
const SCREEN_H = 530

// ─── Input style ─────────────────────────────────────────────────────────────
const inputCls = "w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#C026D3]/50 focus:bg-white/[0.06] transition-all"

// ─── Mini Section Components ──────────────────────────────────────────────────
function MiniHero({ kit }: { kit: PresKit }) {
  const hasName = kit.artistName.trim().length > 0
  return (
    <div style={{ width: SCREEN_W, height: SCREEN_H, position: 'relative', overflow: 'hidden', background: '#07070B' }}>
      {/* Photo background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={kit.photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }} />
      {/* Gradient overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.85) 100%)' }} />

      {/* Top bar */}
      <div style={{ position: 'absolute', top: 8, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, textTransform: 'uppercase' }}>PRESSKIT.PRO/LIVE</span>
      </div>

      {/* Genre pill */}
      {kit.genres.length > 0 && (
        <div style={{ position: 'absolute', bottom: 96, left: 10, zIndex: 10 }}>
          <span style={{ background: kit.primaryColor, color: '#fff', fontSize: 7, fontFamily: 'monospace', padding: '2px 6px', borderRadius: 99, letterSpacing: 1, textTransform: 'uppercase' }}>
            {kit.genres[0]}
          </span>
        </div>
      )}

      {/* Artist name */}
      <div style={{ position: 'absolute', bottom: 60, left: 10, right: 10, zIndex: 10 }}>
        <div style={{ fontSize: hasName ? 28 : 16, fontWeight: 900, color: hasName ? '#fff' : 'rgba(255,255,255,0.3)', letterSpacing: -1, lineHeight: 1, fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase' }}>
          {hasName ? kit.artistName : 'TU NOMBRE'}
        </div>
        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.6)', marginTop: 3, fontFamily: 'monospace', letterSpacing: 1 }}>
          {kit.role}{kit.location ? ` · ${kit.location}` : ''}
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ position: 'absolute', bottom: 22, left: 10, right: 10, zIndex: 10, display: 'flex', gap: 4 }}>
        {[
          { v: kit.monthlyListeners || '—', l: 'LISTENERS' },
          { v: kit.countries || '—', l: 'PAÍSES' },
          { v: kit.totalShows || '—', l: 'SHOWS' },
        ].map((s) => (
          <div key={s.l} style={{ flex: 1, background: 'rgba(255,255,255,0.08)', borderRadius: 6, padding: '4px 4px', textAlign: 'center' }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#fff', fontFamily: 'system-ui, sans-serif' }}>{s.v}</div>
            <div style={{ fontSize: 5, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', letterSpacing: 0.5 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Booking button */}
      <div style={{ position: 'absolute', bottom: 6, left: 10, right: 10, zIndex: 10 }}>
        <div style={{ background: `linear-gradient(135deg, ${kit.primaryColor}, ${kit.secondaryColor})`, borderRadius: 8, padding: '5px 0', textAlign: 'center' }}>
          <span style={{ fontSize: 7, fontWeight: 700, color: '#fff', fontFamily: 'monospace', letterSpacing: 1 }}>BOOKING</span>
        </div>
      </div>
    </div>
  )
}

function MiniQuote({ kit }: { kit: PresKit }) {
  const quote = kit.bio.trim().length > 0 ? kit.bio.slice(0, 120) : '"La música es el lenguaje universal que conecta almas a través del ritmo..."'
  return (
    <div style={{ width: SCREEN_W, height: SCREEN_H, position: 'relative', overflow: 'hidden', background: '#0a0a0f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 16px' }}>
      {/* Radial glow */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 50%, ${kit.primaryColor}18 0%, transparent 70%)` }} />
      {/* Quote mark */}
      <div style={{ fontSize: 60, lineHeight: 1, color: kit.primaryColor, fontFamily: 'Georgia, serif', marginBottom: 8, opacity: 0.8 }}>&ldquo;</div>
      {/* Quote text */}
      <p style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.85)', fontFamily: 'Georgia, serif', fontStyle: 'italic', textAlign: 'center', lineHeight: 1.6, marginBottom: 16, position: 'relative', zIndex: 1 }}>
        {quote}
      </p>
      {/* Divider */}
      <div style={{ width: 40, height: 1, background: `linear-gradient(to right, transparent, ${kit.primaryColor}, transparent)`, marginBottom: 10 }} />
      {/* Source */}
      <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', letterSpacing: 2 }}>— MIXMAG</span>
    </div>
  )
}

function MiniBio({ kit }: { kit: PresKit }) {
  const bioText = kit.bio.trim().length > 0 ? kit.bio.slice(0, 200) : 'Un artista que redefine los límites de la música electrónica, fusionando texturas sonoras con energía pura de dancefloor...'
  return (
    <div style={{ width: SCREEN_W, height: SCREEN_H, background: '#07070B', padding: '14px 12px', overflow: 'hidden' }}>
      <div style={{ fontSize: 7, color: kit.primaryColor, fontFamily: 'monospace', letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase' }}>BIOGRAFÍA</div>
      <div style={{ fontSize: 14, fontWeight: 900, color: '#fff', fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase', marginBottom: 8, lineHeight: 1.1 }}>
        {kit.artistName || 'TU NOMBRE'}
      </div>
      <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: 14, fontFamily: 'system-ui, sans-serif' }}>
        {bioText}
      </p>
      {/* Award badges */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
        {['DJ Mag Top 100', 'Resident Advisor Pick', 'Beatport Bestseller'].map((award) => (
          <span key={award} style={{ fontSize: 7, color: kit.primaryColor, border: `1px solid ${kit.primaryColor}40`, borderRadius: 99, padding: '2px 8px', fontFamily: 'monospace', letterSpacing: 0.5, display: 'inline-block', width: 'fit-content' }}>
            ★ {award}
          </span>
        ))}
      </div>
      {/* CTA buttons */}
      <div style={{ display: 'flex', gap: 6 }}>
        <div style={{ flex: 1, background: `linear-gradient(135deg, ${kit.primaryColor}, ${kit.secondaryColor})`, borderRadius: 6, padding: '5px 0', textAlign: 'center' }}>
          <span style={{ fontSize: 7, fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>CONTACTAR</span>
        </div>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '5px 0', textAlign: 'center' }}>
          <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>EPK PDF</span>
        </div>
      </div>
    </div>
  )
}

function MiniMusic({ kit }: { kit: PresKit }) {
  const tracks = kit.tracks.some(t => t.title.trim()) ? kit.tracks : [
    { title: 'Midnight Protocol', label: 'Drumcode', year: '2024' },
    { title: 'Vortex Rising', label: 'Afterlife', year: '2023' },
    { title: 'Carbon Dreams', label: 'Innervisions', year: '2023' },
  ]
  return (
    <div style={{ width: SCREEN_W, height: SCREEN_H, background: '#07070B', padding: '14px 12px', overflow: 'hidden' }}>
      <div style={{ fontSize: 7, color: kit.primaryColor, fontFamily: 'monospace', letterSpacing: 2, marginBottom: 12, textTransform: 'uppercase' }}>DISCOGRAFÍA</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        {tracks.map((t, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Play button */}
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: `linear-gradient(135deg, ${kit.primaryColor}, ${kit.secondaryColor})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 7, color: '#fff' }}>▶</span>
            </div>
            {/* Track info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#fff', fontFamily: 'system-ui, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {t.title || `Track ${i + 1}`}
              </div>
              <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
                {t.label || 'Label'} · {t.year || '—'}
              </div>
            </div>
            {/* Waveform bars */}
            <div style={{ display: 'flex', gap: 1, alignItems: 'flex-end', height: 14, flexShrink: 0 }}>
              {[8, 12, 6, 14, 10, 8, 12].map((h, j) => (
                <div key={j} style={{ width: 2, height: h, background: `${kit.primaryColor}60`, borderRadius: 1 }} />
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Platform buttons */}
      <div style={{ display: 'flex', gap: 6 }}>
        <div style={{ flex: 1, background: '#1DB95420', border: '1px solid #1DB95440', borderRadius: 6, padding: '5px 0', textAlign: 'center' }}>
          <span style={{ fontSize: 7, color: '#1DB954', fontFamily: 'monospace' }}>♫ Spotify</span>
        </div>
        <div style={{ flex: 1, background: '#FF550020', border: '1px solid #FF550040', borderRadius: 6, padding: '5px 0', textAlign: 'center' }}>
          <span style={{ fontSize: 7, color: '#FF5500', fontFamily: 'monospace' }}>☁ SoundCloud</span>
        </div>
      </div>
    </div>
  )
}

function MiniBooking({ kit }: { kit: PresKit }) {
  return (
    <div style={{ width: SCREEN_W, height: SCREEN_H, background: '#07070B', padding: '14px 12px', overflow: 'hidden' }}>
      <div style={{ fontSize: 7, color: kit.primaryColor, fontFamily: 'monospace', letterSpacing: 2, marginBottom: 10, textTransform: 'uppercase' }}>BOOKING</div>
      <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', fontFamily: 'system-ui, sans-serif', marginBottom: 4, lineHeight: 1.1 }}>Solicitar show</div>
      <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', fontFamily: 'system-ui, sans-serif', marginBottom: 16, lineHeight: 1.5 }}>
        Respuesta garantizada en 24–48h
      </div>
      {/* Input placeholders */}
      {['Nombre / Promotor', 'Email de contacto', 'Nombre del evento', 'Presupuesto'].map((placeholder) => (
        <div key={placeholder} style={{ marginBottom: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '7px 10px' }}>
          <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)', fontFamily: 'system-ui, sans-serif' }}>{placeholder}</span>
        </div>
      ))}
      {/* Submit button */}
      <div style={{ background: `linear-gradient(135deg, ${kit.primaryColor}, ${kit.secondaryColor})`, borderRadius: 8, padding: '8px 0', textAlign: 'center', marginTop: 6 }}>
        <span style={{ fontSize: 8, fontWeight: 700, color: '#000', fontFamily: 'monospace', letterSpacing: 1 }}>ENVIAR SOLICITUD</span>
      </div>
      {/* URL */}
      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <span style={{ fontSize: 7, color: kit.primaryColor, fontFamily: 'monospace', letterSpacing: 1 }}>
          presskit.pro/{kit.artistName.toLowerCase().replace(/\s+/g, '-') || 'tu-nombre'}
        </span>
      </div>
    </div>
  )
}

// ─── IPhoneFrame ──────────────────────────────────────────────────────────────
const STEP_TO_SECTION: Record<number, number> = {
  0: 0, 1: 0, 2: 2, 3: 3, 4: 0, 5: 0, 6: 2, 7: 4
}

function IPhoneFrame({ kit, activeSection }: { kit: PresKit; activeSection: number }) {
  const [sectionIdx, setSectionIdx] = useState(0)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useTransform(mouseY, [-150, 150], [6, -6])
  const rotateY = useTransform(mouseX, [-150, 150], [-6, 6])

  useEffect(() => {
    setSectionIdx(activeSection)
  }, [activeSection])

  useEffect(() => {
    const interval = setInterval(() => {
      setSectionIdx((prev) => (prev + 1) % 5)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    mouseX.set(e.clientX - cx)
    mouseY.set(e.clientY - cy)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  const sections = [
    <MiniHero key="hero" kit={kit} />,
    <MiniQuote key="quote" kit={kit} />,
    <MiniBio key="bio" kit={kit} />,
    <MiniMusic key="music" kit={kit} />,
    <MiniBooking key="booking" kit={kit} />,
  ]

  const slug = kit.artistName.toLowerCase().replace(/\s+/g, '-') || 'tu-nombre'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, position: 'relative' }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', width: 200, height: 200, background: kit.primaryColor, borderRadius: '50%', filter: 'blur(60px)', opacity: 0.25, pointerEvents: 'none', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />

      {/* Perspective container */}
      <div
        style={{ perspective: 800 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          style={{
            width: PHONE_W,
            height: PHONE_H,
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
            borderRadius: 44,
            background: 'linear-gradient(160deg, #3a3a3a, #1a1a1a, #2a2a2a)',
            border: '1.5px solid rgba(255,255,255,0.15)',
            boxShadow: `0 0 0 1px rgba(0,0,0,0.5), 0 30px 80px rgba(0,0,0,0.8), 0 0 60px ${kit.primaryColor}20`,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 12,
          }}
          animate={{ y: [0, -8, 0] }}
          transition={{ y: { repeat: Infinity, duration: 5, ease: 'easeInOut' } }}
        >
          {/* Notch */}
          <div style={{ width: 80, height: 20, background: '#0a0a0a', borderRadius: 99, position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', zIndex: 30 }} />

          {/* Right power button */}
          <div style={{ position: 'absolute', right: -3, top: 120, width: 3, height: 40, background: '#2a2a2a', borderRadius: '0 3px 3px 0' }} />
          {/* Left volume buttons */}
          <div style={{ position: 'absolute', left: -3, top: 100, width: 3, height: 28, background: '#2a2a2a', borderRadius: '3px 0 0 3px' }} />
          <div style={{ position: 'absolute', left: -3, top: 138, width: 3, height: 28, background: '#2a2a2a', borderRadius: '3px 0 0 3px' }} />

          {/* Screen */}
          <div style={{
            width: SCREEN_W,
            height: SCREEN_H,
            borderRadius: 36,
            overflow: 'hidden',
            position: 'relative',
            marginTop: 16,
            background: '#000',
          }}>
            {/* Nav bar */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 28,
              zIndex: 20, backdropFilter: 'blur(8px)',
              background: 'rgba(0,0,0,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 10px',
            }}>
              <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace', letterSpacing: 1.5, fontWeight: 700 }}>PRESSKIT.PRO</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {['BIO', 'MUSIC', 'PRESS'].map((label) => (
                  <span key={label} style={{ fontSize: 6, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', letterSpacing: 1 }}>{label}</span>
                ))}
              </div>
            </div>

            {/* Scrolling inner div */}
            <motion.div
              animate={{ y: -sectionIdx * SCREEN_H }}
              transition={{ type: 'spring', stiffness: 55, damping: 16 }}
              style={{ paddingTop: 28 }}
            >
              {sections.map((section, i) => (
                <div key={i} style={{ height: SCREEN_H, overflow: 'hidden' }}>
                  {section}
                </div>
              ))}
            </motion.div>

            {/* Home bar */}
            <div style={{
              position: 'absolute', bottom: 5,
              left: '50%', transform: 'translateX(-50%)',
              width: 80, height: 4,
              background: 'rgba(255,255,255,0.3)',
              borderRadius: 99,
            }} />
          </div>
        </motion.div>
      </div>

      {/* Section dots */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setSectionIdx(i)}
            style={{
              height: 6,
              width: sectionIdx === i ? 20 : 6,
              borderRadius: 99,
              background: sectionIdx === i ? kit.primaryColor : 'rgba(255,255,255,0.15)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Label */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 }}>VISTA PREVIA EN VIVO</div>
        <div style={{ fontSize: 11, color: kit.primaryColor, fontFamily: 'monospace' }}>presskit.pro/{slug}</div>
      </div>
    </div>
  )
}

// ─── StepBar ──────────────────────────────────────────────────────────────────
function StepBar({ step, total, color }: { step: number; total: number; color: string }) {
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 4,
            flex: i === step ? 2 : 1,
            borderRadius: 99,
            background: i < step ? color : i === step ? color : 'rgba(255,255,255,0.1)',
            transition: 'all 0.3s ease',
            opacity: i > step ? 0.5 : 1,
          }}
        />
      ))}
    </div>
  )
}

// ─── Animation variant configs ────────────────────────────────────────────────
function getAnimVariants(style: string) {
  switch (style) {
    case 'elegant':
      return {
        initial: { opacity: 0, y: 28 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -12 },
        transition: { duration: 1.15, ease: [0.22, 1, 0.36, 1] },
      }
    case 'dynamic':
      return {
        initial: { opacity: 0, x: -32, scale: 0.93 },
        animate: { opacity: 1, x: 0, scale: 1 },
        exit: { opacity: 0, x: 24, scale: 0.96 },
        transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
      }
    case 'minimal':
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.12, ease: 'linear' },
      }
    case 'glitch':
      return {
        initial: { opacity: 0, x: 0, filter: 'blur(8px)' },
        animate: {
          opacity:  [0, 1, 0.6, 0, 1, 0.8, 0, 1],
          x:        [0, -6, 5, -4, 6, -2, 3, 0],
          filter: ['blur(8px)', 'blur(0px)', 'blur(4px)', 'blur(0px)', 'blur(3px)', 'blur(0px)', 'blur(1px)', 'blur(0px)'],
        },
        exit: { opacity: 0, filter: 'blur(6px)' },
        transition: { duration: 0.65, times: [0, 0.1, 0.25, 0.38, 0.52, 0.66, 0.82, 1] },
      }
    default:
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.5 },
      }
  }
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PruebaPage() {
  const [step, setStep] = useState(0)
  const [kit, setKit] = useState<PresKit>(DEFAULT_KIT)
  const [generated, setGenerated] = useState(false)
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    if (step !== 5) return
    const timer = setInterval(() => setAnimKey(k => k + 1), 2500)
    return () => clearInterval(timer)
  }, [step])

  function update(patch: Partial<PresKit>) {
    setKit((prev) => ({ ...prev, ...patch }))
  }

  function toggleGenre(g: string) {
    setKit((prev) => {
      if (prev.genres.includes(g)) {
        return { ...prev, genres: prev.genres.filter((x) => x !== g) }
      }
      if (prev.genres.length >= 3) return prev
      return { ...prev, genres: [...prev.genres, g] }
    })
  }

  function toggleSection(id: string) {
    setKit((prev) => {
      if (prev.sections.includes(id)) {
        return { ...prev, sections: prev.sections.filter((x) => x !== id) }
      }
      return { ...prev, sections: [...prev.sections, id] }
    })
  }

  function updateTrack(i: number, patch: Partial<Track>) {
    setKit((prev) => {
      const tracks = [...prev.tracks]
      tracks[i] = { ...tracks[i], ...patch }
      return { ...prev, tracks }
    })
  }

  async function generateKit() {
    const slug = kit.artistName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'my-presskit'
    const data = { ...kit, slug }

    // Guardar en localStorage (preview inmediato)
    if (typeof window !== 'undefined') {
      localStorage.setItem('presskit-preview', JSON.stringify(data))
    }

    // Guardar en Supabase (URL pública permanente)
    try {
      const supabase = createClient()
      await supabase.from('presskits').upsert({
        slug,
        artist_name: kit.artistName,
        genres: kit.genres,
        bio: kit.bio,
        quote: kit.bio?.slice(0, 180) ?? '',
        location: kit.location,
        photo_url: kit.photo,
        tracks: kit.tracks,
        monthly_listeners: kit.monthlyListeners,
        total_shows: kit.totalShows,
        countries: kit.countries,
        dj_mag_ranking: kit.djMagRanking,
        ra_url: kit.raUrl,
        beatport_url: kit.beatportUrl,
        primary_color: kit.primaryColor,
        secondary_color: kit.secondaryColor,
        bg_effect: kit.bgEffect,
        font_style: kit.fontStyle,
        animation_style: kit.animationStyle,
        hero_variant: kit.heroVariant,
        sections: kit.sections,
      }, { onConflict: 'slug' })
    } catch (err) {
      console.warn('Supabase save failed (non-blocking):', err)
    }

    setGenerated(true)
  }

  const slug = kit.artistName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'tu-nombre'

  return (
    <div className="min-h-screen bg-[#07070B] text-white">
      {/* Top nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-white/[0.05] backdrop-blur-xl bg-[#07070B]/80 flex items-center px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #C026D3, #7C3AED)' }}>
            <span className="text-white font-black text-[10px]">P</span>
          </div>
          <span className="font-bold text-sm tracking-tight">PRESSKIT.PRO</span>
        </div>

        {/* Breadcrumb */}
        <div className="hidden sm:flex items-center gap-1 mx-auto">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-1">
              {i > 0 && <span className="text-white/20 text-xs">›</span>}
              <button
                onClick={() => i < step && setStep(i)}
                className={`text-xs px-2 py-1 rounded-md transition-all flex items-center gap-1 ${i === step ? 'text-white font-semibold' : i < step ? 'text-white/40 hover:text-white/60 cursor-pointer' : 'text-white/20 cursor-default'}`}
              >
                {i < step && (
                  <span className="w-3 h-3 rounded-full flex items-center justify-center" style={{ background: kit.primaryColor }}>
                    <Check size={8} />
                  </span>
                )}
                {i === step && (
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: kit.primaryColor }} />
                )}
                {s.label}
              </button>
            </div>
          ))}
        </div>

        {/* Close */}
        <Link href="/" className="ml-auto flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors text-sm">
          <X size={16} />
        </Link>
      </nav>

      {/* Body */}
      <div className="flex min-h-screen pt-14">
        {/* Left column */}
        <div className="flex-1 max-w-[560px] mx-auto px-6 sm:px-10 py-10">
          {/* Progress */}
          <StepBar step={step} total={STEPS.length} color={kit.primaryColor} />
          <p className="text-xs text-white/30 font-mono mb-8 tracking-widest uppercase">{STEPS[step].label}</p>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {/* ── Step 0: Bienvenida ── */}
              {step === 0 && (
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-3 py-1 text-xs text-white/50 font-mono mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    DEMO GRATUITA · SIN TARJETA
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tighter leading-[1.05] mb-4">
                    Tu presskit en{' '}
                    <span style={{ background: `linear-gradient(135deg, ${kit.primaryColor}, ${kit.secondaryColor})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                      3 minutos.
                    </span>
                  </h1>
                  <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-md">
                    Crea un presskit profesional que represente tu identidad artística. Booking, bio, música y más — todo en una URL.
                  </p>
                  {/* Feature grid */}
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {[
                      { icon: <Zap size={16} />, title: 'En 3 minutos', desc: 'Wizard guiado paso a paso' },
                      { icon: <Eye size={16} />, title: 'Preview en vivo', desc: 'Ves tu presskit mientras lo creas' },
                      { icon: <Globe size={16} />, title: '100% tuyo', desc: 'Personalización total de diseño' },
                      { icon: <LayoutGrid size={16} />, title: 'URL propia', desc: 'presskit.pro/tu-nombre' },
                    ].map((f) => (
                      <div key={f.title} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
                        <div className="mb-2 opacity-60">{f.icon}</div>
                        <div className="text-sm font-semibold mb-1">{f.title}</div>
                        <div className="text-xs text-white/40">{f.desc}</div>
                      </div>
                    ))}
                  </div>
                  {/* Social proof */}
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[
                        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&q=80',
                        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&q=80',
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&q=80',
                      ].map((url, i) => (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img key={i} src={url} alt="" className="w-8 h-8 rounded-full border-2 border-[#07070B] object-cover" />
                      ))}
                    </div>
                    <p className="text-xs text-white/40">+2.400 artistas ya tienen su presskit</p>
                  </div>
                </div>
              )}

              {/* ── Step 1: Identidad ── */}
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-black tracking-tight mb-6">Tu identidad</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-white/40 font-mono uppercase tracking-widest mb-2 block">Nombre artístico *</label>
                      <input
                        autoFocus
                        value={kit.artistName}
                        onChange={(e) => update({ artistName: e.target.value.toUpperCase() })}
                        placeholder="DJ SHADOW"
                        className={`${inputCls} text-2xl font-black tracking-tight`}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/40 font-mono uppercase tracking-widest mb-2 block">Tagline</label>
                      <input
                        value={kit.tagline}
                        onChange={(e) => update({ tagline: e.target.value })}
                        placeholder="Underground techno desde Barcelona"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/40 font-mono uppercase tracking-widest mb-2 block">Ciudad / País</label>
                      <input
                        value={kit.location}
                        onChange={(e) => update({ location: e.target.value })}
                        placeholder="Barcelona, España"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/40 font-mono uppercase tracking-widest mb-2 block">Rol</label>
                      <div className="flex flex-wrap gap-2">
                        {ROLES.map((r) => (
                          <button
                            key={r}
                            onClick={() => update({ role: r })}
                            className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${kit.role === r ? 'border-[#C026D3] text-white' : 'border-white/10 text-white/40 hover:border-white/30'}`}
                            style={kit.role === r ? { background: `${kit.primaryColor}20` } : {}}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-white/40 font-mono uppercase tracking-widest mb-2 block">Géneros (máx. 3)</label>
                      <div className="flex flex-wrap gap-2">
                        {GENRES.map((g) => {
                          const active = kit.genres.includes(g)
                          return (
                            <button
                              key={g}
                              onClick={() => toggleGenre(g)}
                              className={`px-2.5 py-1 rounded-full text-xs font-mono border transition-all ${active ? 'text-white' : 'border-white/10 text-white/30 hover:border-white/30'}`}
                              style={active ? { background: `${kit.primaryColor}30`, borderColor: kit.primaryColor } : {}}
                            >
                              {g}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 2: Historia ── */}
              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-black tracking-tight mb-6">Tu historia</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-white/40 font-mono uppercase tracking-widest mb-2 block">Biografía</label>
                      <div className="relative">
                        <textarea
                          value={kit.bio}
                          onChange={(e) => update({ bio: e.target.value })}
                          maxLength={500}
                          rows={6}
                          placeholder="Cuéntanos tu historia como artista, tus influencias, logros y visión musical..."
                          className={`${inputCls} resize-none`}
                        />
                        <div className="flex items-center justify-between mt-1.5 px-1">
                          <div className="h-1 flex-1 bg-white/5 rounded-full mr-3 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${(kit.bio.length / 500) * 100}%`, background: `linear-gradient(to right, ${kit.primaryColor}, ${kit.secondaryColor})` }}
                            />
                          </div>
                          <span className="text-xs text-white/20 font-mono">{kit.bio.length}/500</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-white/40 font-mono uppercase tracking-widest mb-2 block">Email de booking</label>
                      <input
                        value={kit.email}
                        onChange={(e) => update({ email: e.target.value })}
                        placeholder="booking@tuartista.com"
                        type="email"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/40 font-mono uppercase tracking-widest mb-2 block">Estadísticas</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { key: 'monthlyListeners' as const, label: 'Oyentes mensuales', placeholder: '50K' },
                          { key: 'totalShows' as const, label: 'Shows/año', placeholder: '40' },
                          { key: 'countries' as const, label: 'Países', placeholder: '12' },
                          { key: 'djMagRanking' as const, label: 'DJ Mag ranking', placeholder: '#247' },
                        ].map(({ key, label, placeholder }) => (
                          <div key={key}>
                            <label className="text-xs text-white/30 mb-1.5 block">{label}</label>
                            <input
                              value={kit[key]}
                              onChange={(e) => update({ [key]: e.target.value })}
                              placeholder={placeholder}
                              className={inputCls}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 3: Música ── */}
              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-black tracking-tight mb-6">Tu música</h2>
                  <div className="space-y-4 mb-6">
                    {[
                      { key: 'spotifyUrl' as const, label: 'Spotify', icon: '♫', color: '#1DB954', placeholder: 'https://open.spotify.com/artist/...' },
                      { key: 'soundcloudUrl' as const, label: 'SoundCloud', icon: '☁', color: '#FF5500', placeholder: 'https://soundcloud.com/...' },
                      { key: 'instagramUrl' as const, label: 'Instagram', icon: '◎', color: '#C026D3', placeholder: 'https://instagram.com/...' },
                      { key: 'beatportUrl' as const, label: 'Beatport', icon: '◈', color: '#02FF7E', placeholder: 'https://beatport.com/artist/...' },
                      { key: 'raUrl' as const, label: 'Resident Advisor', icon: '▲', color: '#EF4444', placeholder: 'https://ra.co/dj/...' },
                    ].map(({ key, label, icon, color, placeholder }) => (
                      <div key={key} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ background: `${color}20`, color }}>
                          {icon}
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-white/30 mb-1 block">{label}</label>
                          <input
                            value={kit[key]}
                            onChange={(e) => update({ [key]: e.target.value })}
                            placeholder={placeholder}
                            className={inputCls}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="text-xs text-white/40 font-mono uppercase tracking-widest mb-3 block">Tus 3 tracks principales</label>
                    <div className="space-y-3">
                      {kit.tracks.map((track, i) => (
                        <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono flex-shrink-0" style={{ background: `linear-gradient(135deg, ${kit.primaryColor}, ${kit.secondaryColor})` }}>
                              {i + 1}
                            </div>
                            <span className="text-xs text-white/30 font-mono">TRACK {i + 1}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-3">
                              <input
                                value={track.title}
                                onChange={(e) => updateTrack(i, { title: e.target.value })}
                                placeholder="Nombre del track"
                                className={`${inputCls} text-sm`}
                              />
                            </div>
                            <div className="col-span-2">
                              <input
                                value={track.label}
                                onChange={(e) => updateTrack(i, { label: e.target.value })}
                                placeholder="Sello / Label"
                                className={inputCls}
                              />
                            </div>
                            <div>
                              <input
                                value={track.year}
                                onChange={(e) => updateTrack(i, { year: e.target.value })}
                                placeholder="Año"
                                className={inputCls}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 4: Foto ── */}
              {step === 4 && (
                <div>
                  <h2 className="text-2xl font-black tracking-tight mb-6">Tu foto principal</h2>

                  {/* Upload dropzone */}
                  <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center mb-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/[0.01]" />
                    <Camera size={28} className="mx-auto mb-3 text-white/20" />
                    <p className="text-sm text-white/30 mb-2">Arrastra tu foto aquí</p>
                    <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1 text-xs text-amber-400 font-mono">
                      <Sparkles size={10} />
                      Próximamente disponible
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-xs text-white/30 font-mono">o elige una foto de muestra</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {SAMPLE_PHOTOS.map((photo) => (
                      <button
                        key={photo.url}
                        onClick={() => update({ photo: photo.url })}
                        className="relative rounded-xl overflow-hidden aspect-[3/4] border-2 transition-all"
                        style={{
                          borderColor: kit.photo === photo.url ? kit.primaryColor : 'transparent',
                          transform: kit.photo === photo.url ? 'scale(1.02)' : 'scale(1)',
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photo.url} alt={photo.label} className="w-full h-full object-cover" />
                        {kit.photo === photo.url && (
                          <div className="absolute inset-0 flex items-center justify-center" style={{ background: `${kit.primaryColor}40` }}>
                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                              <Check size={12} style={{ color: kit.primaryColor }} />
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-0 inset-x-0 p-1.5 text-center" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                          <span className="text-xs text-white/70">{photo.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 5: Diseño ── */}
              {step === 5 && (
                <div>
                  <h2 className="text-2xl font-black tracking-tight mb-6">Identidad visual</h2>
                  <div className="space-y-6">
                    {/* Color palettes */}
                    <div>
                      <label className="text-xs text-white/40 font-mono uppercase tracking-widest mb-3 block">Paleta de color</label>
                      <div className="grid grid-cols-6 gap-2">
                        {COLOR_PALETTES.map((p) => {
                          const active = kit.primaryColor === p.a
                          return (
                            <button
                              key={p.name}
                              onClick={() => update({ primaryColor: p.a, secondaryColor: p.b })}
                              className="flex flex-col items-center gap-1 group"
                            >
                              <div
                                className="w-10 h-10 rounded-xl transition-all"
                                style={{
                                  background: `linear-gradient(135deg, ${p.a}, ${p.b})`,
                                  border: active ? '2px solid white' : '2px solid transparent',
                                  transform: active ? 'scale(1.1)' : 'scale(1)',
                                  boxShadow: active ? `0 0 12px ${p.a}60` : 'none',
                                }}
                              />
                              <span className="text-[9px] text-white/30 font-mono">{p.name}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Typography */}
                    <div>
                      <label className="text-xs text-white/40 font-mono uppercase tracking-widest mb-3 block">Tipografía</label>
                      <div className="grid grid-cols-2 gap-2">
                        {FONTS.map((f) => {
                          const active = kit.fontStyle === f.id
                          return (
                            <button
                              key={f.id}
                              onClick={() => update({ fontStyle: f.id })}
                              className={`p-3 rounded-xl border text-left transition-all ${active ? 'border-[#C026D3] bg-[#C026D3]/10' : 'border-white/[0.07] bg-white/[0.02] hover:border-white/20'}`}
                            >
                              <div className="text-sm font-bold mb-0.5">{f.label}</div>
                              <div className="text-xs text-white/40">{f.desc}</div>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Animation */}
                    <div>
                      <label className="text-xs text-white/40 font-mono uppercase tracking-widest mb-3 block">Estilo de animación</label>
                      <div className="grid grid-cols-4 gap-2">
                        {ANIMATIONS.map((a) => {
                          const active = kit.animationStyle === a.id
                          return (
                            <button
                              key={a.id}
                              onClick={() => update({ animationStyle: a.id })}
                              className={`p-3 rounded-xl border text-center transition-all ${active ? 'border-white/40 bg-white/[0.06]' : 'border-white/[0.07] bg-white/[0.02] hover:border-white/20'}`}
                            >
                              <div className="text-lg mb-1">{a.emoji}</div>
                              <div className="text-xs font-mono">{a.label}</div>
                            </button>
                          )
                        })}
                      </div>

                      {/* Live animation preview */}
                      <div className="mt-3 rounded-2xl overflow-hidden border border-white/[0.07] bg-black/40" style={{ height: 116 }}>
                        <div className="relative w-full h-full flex items-center px-5 gap-4 overflow-hidden">
                          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 25% 50%, ${kit.primaryColor}18, transparent 65%)` }} />
                          <div className="absolute top-2 right-3 text-[8px] font-mono text-white/15 uppercase tracking-widest">↺ auto-repeat</div>
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={`${animKey}-${kit.animationStyle}`}
                              {...getAnimVariants(kit.animationStyle)}
                              className="relative z-10 flex items-center gap-4 w-full"
                            >
                              <div className="w-1 h-14 rounded-full shrink-0" style={{ background: `linear-gradient(to bottom, ${kit.primaryColor}, ${kit.secondaryColor})` }} />
                              <div className="flex-1 min-w-0">
                                <span className="text-[9px] font-mono uppercase tracking-widest mb-1 block" style={{ color: kit.primaryColor }}>
                                  {kit.genres[0] || 'ELECTRONIC'}
                                </span>
                                <div className="text-xl font-black tracking-tight text-white leading-tight truncate mb-1">
                                  {kit.artistName || 'TU NOMBRE'}
                                </div>
                                <p className="text-[10px] text-white/40 leading-relaxed truncate">
                                  {kit.bio ? kit.bio.substring(0, 80) + '…' : 'DJ y productor electrónico con actuaciones en los mejores clubs del mundo...'}
                                </p>
                              </div>
                              <div className="shrink-0">
                                <div className="px-3 py-1.5 rounded-full text-[9px] font-mono font-bold text-black whitespace-nowrap" style={{ background: `linear-gradient(135deg, ${kit.primaryColor}, ${kit.secondaryColor})` }}>
                                  BOOKING →
                                </div>
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    {/* Background effect */}
                    <div>
                      <label className="text-xs text-white/40 font-mono uppercase tracking-widest mb-3 block">Fondo</label>
                      <div className="grid grid-cols-4 gap-2">
                        {BG_EFFECTS.map((b) => {
                          const active = kit.bgEffect === b.id
                          return (
                            <button
                              key={b.id}
                              onClick={() => update({ bgEffect: b.id })}
                              className={`p-3 rounded-xl border text-center transition-all ${active ? 'border-white/40 bg-white/[0.06]' : 'border-white/[0.07] bg-white/[0.02] hover:border-white/20'}`}
                            >
                              <div className="text-lg mb-1">{b.emoji}</div>
                              <div className="text-xs font-mono">{b.label}</div>
                            </button>
                          )
                        })}
                      </div>

                      {/* BG Effect live preview */}
                      <div className="mt-3 rounded-2xl overflow-hidden border border-white/[0.07]" style={{ height: 104 }}>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={kit.bgEffect}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.35 }}
                            className="relative w-full h-full"
                            style={{ background: '#000' }}
                          >
                            {/* dark — subtle grid */}
                            {kit.bgEffect === 'dark' && (
                              <>
                                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
                                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 120%, rgba(255,255,255,0.04), transparent 70%)' }} />
                              </>
                            )}
                            {/* grain — film noise */}
                            {kit.bgEffect === 'grain' && (
                              <>
                                <div className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E")`, backgroundSize: '128px 128px', opacity: 0.7 }} />
                                <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #111 0%, #000 60%, #0a0a0a 100%)' }} />
                                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)', backgroundSize: '4px 4px', opacity: 0.3 }} />
                              </>
                            )}
                            {/* glow — neon radials */}
                            {kit.bgEffect === 'glow' && (
                              <>
                                <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 25% 50%, ${kit.primaryColor}35 0%, transparent 55%), radial-gradient(ellipse at 75% 50%, ${kit.secondaryColor}25 0%, transparent 50%)` }} />
                                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.6) 100%)' }} />
                                <div className="absolute" style={{ left: '22%', top: '30%', width: 60, height: 60, borderRadius: '50%', background: kit.primaryColor, filter: 'blur(28px)', opacity: 0.45 }} />
                                <div className="absolute" style={{ right: '18%', top: '40%', width: 40, height: 40, borderRadius: '50%', background: kit.secondaryColor, filter: 'blur(22px)', opacity: 0.35 }} />
                              </>
                            )}
                            {/* stars — particles */}
                            {kit.bgEffect === 'stars' && (
                              <>
                                {[
                                  [8,15],[14,72],[22,88],[38,30],[50,55],[62,18],[68,82],[75,42],[82,65],[88,20],[92,78],[96,50],[18,50],[45,90],[70,10],
                                  [30,68],[55,35],[78,55],[10,40],[85,85],[40,15],[60,70],[20,25],[50,95],[90,35]
                                ].map(([x,y],i) => (
                                  <div key={i} className="absolute rounded-full" style={{ left:`${x}%`, top:`${y}%`, width: i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1, height: i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1, background: i % 7 === 0 ? kit.primaryColor : 'white', opacity: 0.15 + (i % 4) * 0.18, boxShadow: i % 5 === 0 ? `0 0 4px ${kit.primaryColor}` : 'none' }} />
                                ))}
                              </>
                            )}
                            {/* Label */}
                            <div className="absolute bottom-2.5 left-4 flex items-center gap-2">
                              <div className="w-1 h-3 rounded-full" style={{ background: kit.primaryColor }} />
                              <span className="text-[9px] font-mono text-white/35 uppercase tracking-widest">
                                {BG_EFFECTS.find(b => b.id === kit.bgEffect)?.label}
                              </span>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Hero variant */}
                    <div>
                      <label className="text-xs text-white/40 font-mono uppercase tracking-widest mb-3 block">Estructura Hero</label>
                      <div className="grid grid-cols-4 gap-2">
                        {HERO_VARIANTS.map((h) => {
                          const active = kit.heroVariant === h.id
                          return (
                            <button
                              key={h.id}
                              onClick={() => update({ heroVariant: h.id })}
                              className={`p-3 rounded-xl border text-center transition-all ${active ? 'border-white/40 bg-white/[0.06]' : 'border-white/[0.07] bg-white/[0.02] hover:border-white/20'}`}
                            >
                              <div className="text-lg mb-1">{h.icon}</div>
                              <div className="text-xs font-mono">{h.label}</div>
                            </button>
                          )
                        })}
                      </div>

                      {/* Hero variant live preview */}
                      <div className="mt-3 rounded-2xl overflow-hidden border border-white/[0.07]" style={{ height: 148 }}>
                        <AnimatePresence mode="wait">
                          {/* ── Power: texto abajo-izquierda ── */}
                          {kit.heroVariant === 'bottom-left' && (
                            <motion.div key="bottom-left" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="relative w-full h-full">
                              {/* photo bg */}
                              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, #111 0%, #1a1a1a 50%, #0d0d0d 100%)` }} />
                              <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 70% 40%, ${kit.primaryColor}22, transparent 60%)` }} />
                              {/* simulated photo silhouette right side */}
                              <div className="absolute right-0 top-0 bottom-0 w-2/5" style={{ background: 'linear-gradient(to left, rgba(255,255,255,0.04), transparent)', borderLeft: '1px solid rgba(255,255,255,0.04)' }}>
                                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                  <svg viewBox="0 0 60 80" width="40" height="55"><ellipse cx="30" cy="18" rx="12" ry="14" fill="white"/><path d="M6 80 Q6 45 30 42 Q54 45 54 80Z" fill="white"/></svg>
                                </div>
                              </div>
                              {/* bottom gradient */}
                              <div className="absolute bottom-0 left-0 right-0 h-3/4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.4), transparent)' }} />
                              {/* text bottom-left */}
                              <div className="absolute bottom-4 left-5">
                                <div className="text-[8px] font-mono mb-1" style={{ color: kit.primaryColor, letterSpacing: '0.15em' }}>DJ · PRODUCER</div>
                                <div className="text-xl font-black text-white leading-none mb-2" style={{ letterSpacing: '-0.02em' }}>{kit.artistName || 'TU NOMBRE'}</div>
                                <div className="px-2.5 py-1 rounded-full text-[8px] font-mono font-bold text-black inline-block" style={{ background: `linear-gradient(135deg, ${kit.primaryColor}, ${kit.secondaryColor})` }}>BOOKING →</div>
                              </div>
                            </motion.div>
                          )}
                          {/* ── Impact: centrado ── */}
                          {kit.heroVariant === 'centered' && (
                            <motion.div key="centered" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="relative w-full h-full flex items-center justify-center">
                              <div className="absolute inset-0" style={{ background: '#0a0a0a' }} />
                              <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 50%, ${kit.primaryColor}28, transparent 65%)` }} />
                              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                              {/* silhouette center */}
                              <div className="absolute inset-0 flex items-center justify-center opacity-[0.07]">
                                <svg viewBox="0 0 60 80" width="70" height="90"><ellipse cx="30" cy="18" rx="12" ry="14" fill="white"/><path d="M6 80 Q6 45 30 42 Q54 45 54 80Z" fill="white"/></svg>
                              </div>
                              <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 20%, rgba(0,0,0,0.7) 100%)' }} />
                              <div className="relative text-center z-10">
                                <div className="text-[8px] font-mono mb-1.5 tracking-widest" style={{ color: kit.primaryColor }}>DJ · PRODUCER · IBIZA</div>
                                <div className="text-2xl font-black text-white leading-none mb-2.5" style={{ letterSpacing: '-0.02em' }}>{kit.artistName || 'TU NOMBRE'}</div>
                                <div className="px-3 py-1 rounded-full text-[8px] font-mono font-bold text-black inline-block" style={{ background: `linear-gradient(135deg, ${kit.primaryColor}, ${kit.secondaryColor})` }}>BOOKING →</div>
                              </div>
                            </motion.div>
                          )}
                          {/* ── Cinema: full bleed dramático ── */}
                          {kit.heroVariant === 'cinematic' && (
                            <motion.div key="cinematic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="relative w-full h-full">
                              <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, #000 0%, #0d0d0d 30%, #111 70%, #000 100%)` }} />
                              {/* wide color wash */}
                              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${kit.primaryColor}1a 0%, transparent 40%, ${kit.secondaryColor}15 100%)` }} />
                              {/* letterbox bars */}
                              <div className="absolute top-0 left-0 right-0 h-5" style={{ background: '#000' }} />
                              <div className="absolute bottom-0 left-0 right-0 h-5" style={{ background: '#000' }} />
                              {/* center silhouette large */}
                              <div className="absolute inset-0 flex items-center justify-center opacity-[0.12]">
                                <svg viewBox="0 0 60 80" width="90" height="120"><ellipse cx="30" cy="18" rx="12" ry="14" fill="white"/><path d="M6 80 Q6 45 30 42 Q54 45 54 80Z" fill="white"/></svg>
                              </div>
                              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%, rgba(0,0,0,0.85) 100%)' }} />
                              {/* text bottom center */}
                              <div className="absolute bottom-7 left-0 right-0 flex flex-col items-center">
                                <div className="text-[7px] font-mono tracking-[0.25em] mb-1.5 opacity-50 uppercase">A Film By</div>
                                <div className="text-xl font-black text-white leading-none tracking-widest uppercase">{kit.artistName || 'TU NOMBRE'}</div>
                              </div>
                            </motion.div>
                          )}
                          {/* ── Split: foto izq + texto der ── */}
                          {kit.heroVariant === 'split' && (
                            <motion.div key="split" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="relative w-full h-full flex">
                              {/* Left: photo */}
                              <div className="relative w-2/5 h-full overflow-hidden" style={{ background: '#111' }}>
                                <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${kit.primaryColor}30, ${kit.secondaryColor}20)` }} />
                                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                  <svg viewBox="0 0 60 80" width="52" height="70"><ellipse cx="30" cy="18" rx="12" ry="14" fill="white"/><path d="M6 80 Q6 45 30 42 Q54 45 54 80Z" fill="white"/></svg>
                                </div>
                                <div className="absolute top-0 right-0 bottom-0 w-8" style={{ background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.95))' }} />
                              </div>
                              {/* divider line */}
                              <div className="absolute left-[40%] top-4 bottom-4 w-px" style={{ background: `linear-gradient(to bottom, transparent, ${kit.primaryColor}60, transparent)` }} />
                              {/* Right: text */}
                              <div className="flex-1 flex flex-col justify-center pl-6 pr-5" style={{ background: '#000' }}>
                                <div className="text-[7px] font-mono mb-2 tracking-[0.18em]" style={{ color: kit.primaryColor }}>DJ · PRODUCER</div>
                                <div className="text-lg font-black text-white leading-none mb-1" style={{ letterSpacing: '-0.02em' }}>{kit.artistName || 'TU NOMBRE'}</div>
                                <div className="text-[8px] text-white/30 mb-3 leading-relaxed">Electronic · Techno · House</div>
                                <div className="px-2.5 py-1 rounded-full text-[8px] font-mono font-bold text-black self-start" style={{ background: `linear-gradient(135deg, ${kit.primaryColor}, ${kit.secondaryColor})` }}>BOOKING →</div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 6: Secciones ── */}
              {step === 6 && (
                <div>
                  <h2 className="text-2xl font-black tracking-tight mb-6">Tu presskit</h2>
                  <div className="space-y-2 mb-6">
                    {SECTION_OPTIONS.map((s) => {
                      const isActive = s.required || kit.sections.includes(s.id)
                      return (
                        <button
                          key={s.id}
                          onClick={() => !s.required && toggleSection(s.id)}
                          disabled={s.required}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${isActive ? 'border-white/20 bg-white/[0.04]' : 'border-white/[0.06] bg-transparent hover:border-white/15'}`}
                        >
                          <div
                            className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 border transition-all"
                            style={{
                              background: isActive ? `linear-gradient(135deg, ${kit.primaryColor}, ${kit.secondaryColor})` : 'transparent',
                              borderColor: isActive ? kit.primaryColor : 'rgba(255,255,255,0.15)',
                            }}
                          >
                            {isActive && <Check size={11} className="text-white" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold">{s.label}</span>
                              {s.required && (
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full border" style={{ color: kit.primaryColor, borderColor: `${kit.primaryColor}40` }}>REQUERIDO</span>
                              )}
                            </div>
                            <span className="text-xs text-white/40">{s.desc}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex gap-3">
                    <Music2 size={16} className="text-white/30 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-white/40 leading-relaxed">
                      Las secciones seleccionadas aparecerán en tu presskit. Puedes cambiarlas en cualquier momento desde tu dashboard.
                    </p>
                  </div>
                </div>
              )}

              {/* ── Step 7: Preview ── */}
              {step === 7 && (
                <div>
                  {!generated ? (
                    <>
                      <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 text-xs text-emerald-400 font-mono mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        TODO LISTO
                      </div>
                      <h2 className="text-3xl font-black tracking-tight mb-2">
                        {kit.artistName || 'Tu nombre'}
                      </h2>
                      <div className="flex items-center gap-2 mb-6">
                        <span className="text-sm font-mono" style={{ color: kit.primaryColor }}>presskit.pro/{slug}</span>
                      </div>

                      {/* Summary grid */}
                      <div className="grid grid-cols-2 gap-3 mb-8">
                        {[
                          { label: 'Nombre', value: kit.artistName || '—' },
                          { label: 'Rol', value: kit.role },
                          { label: 'Géneros', value: kit.genres.join(', ') || '—' },
                          { label: 'Ciudad', value: kit.location || '—' },
                          { label: 'Secciones', value: `${kit.sections.length} seleccionadas` },
                          { label: 'Estilo', value: kit.fontStyle + ' · ' + kit.bgEffect },
                        ].map((item) => (
                          <div key={item.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                            <div className="text-xs text-white/30 font-mono uppercase tracking-wider mb-1">{item.label}</div>
                            <div className="text-sm font-semibold truncate">{item.value}</div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={generateKit}
                        className="w-full py-4 rounded-2xl text-base font-bold tracking-wide transition-all hover:opacity-90 active:scale-[0.98]"
                        style={{ background: `linear-gradient(135deg, ${kit.primaryColor}, ${kit.secondaryColor})`, color: '#fff' }}
                      >
                        Generar mi presskit
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 text-xs text-emerald-400 font-mono mb-6">
                        <Check size={12} />
                        PRESSKIT GENERADO
                      </div>
                      <h2 className="text-3xl font-black tracking-tight mb-6">
                        ¡Listo, {kit.artistName || 'artista'}!
                      </h2>

                      <Link
                        href="/preview"
                        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-base font-bold tracking-wide mb-4 transition-all hover:opacity-90"
                        style={{ background: `linear-gradient(135deg, ${kit.primaryColor}, ${kit.secondaryColor})`, color: '#fff' }}
                      >
                        <Eye size={18} />
                        Ver mi presskit completo
                      </Link>

                      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 mb-4">
                        <p className="text-xs text-white/40 font-mono uppercase tracking-widest mb-3">Lo que incluye tu presskit</p>
                        <div className="space-y-2">
                          {[
                            'URL propia presskit.pro/' + slug,
                            'Subida de foto real de artista',
                            'Galería de imágenes',
                            'Analytics de visitas',
                            'PDF rider técnico',
                          ].map((item) => (
                            <div key={item} className="flex items-center gap-2">
                              <Check size={12} style={{ color: kit.primaryColor }} />
                              <span className="text-xs text-white/60">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Link
                        href="/signup"
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold border border-white/10 hover:border-white/20 transition-all text-white/70 hover:text-white"
                      >
                        Crear cuenta gratis — 14 días PRO
                        <ArrowRight size={14} />
                      </Link>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          {step < 7 && (
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/[0.05]">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 text-sm font-medium text-white/50 disabled:opacity-30 hover:border-white/25 hover:text-white/70 transition-all"
              >
                <ArrowLeft size={14} />
                Atrás
              </button>
              <button
                onClick={() => setStep((s) => Math.min(7, s + 1))}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:opacity-90 active:scale-[0.97]"
                style={{ background: `linear-gradient(135deg, ${kit.primaryColor}, ${kit.secondaryColor})`, color: '#fff' }}
              >
                {step === 0 ? 'Comenzar' : 'Siguiente'}
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Right column — iPhone preview */}
        <div className="hidden lg:flex w-[460px] shrink-0 items-center justify-center border-l border-white/[0.05] bg-[#040408] sticky top-14 h-[calc(100vh-56px)]">
          <IPhoneFrame kit={kit} activeSection={STEP_TO_SECTION[step] ?? 0} />
        </div>
      </div>
    </div>
  )
}
