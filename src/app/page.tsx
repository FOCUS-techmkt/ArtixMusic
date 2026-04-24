'use client'
import { useState, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Check, ChevronDown, Play, Star, Zap, Globe, BarChart3, Palette, Layout, Lock, X } from 'lucide-react'

// ─── Logo Mark ────────────────────────────────────────────────────────────────
function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#C026D3"/>
      <rect x="8" y="8" width="3.5" height="16" rx="1.75" fill="white"/>
      <path d="M11.5 8H16.5C19.5 8 21.5 10.2 21.5 13C21.5 15.8 19.5 18 16.5 18H11.5" stroke="white" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <rect x="24" y="11" width="2" height="3" rx="1" fill="white" opacity="0.5"/>
      <rect x="24" y="16" width="2" height="5.5" rx="1" fill="white"/>
      <rect x="24" y="23" width="2" height="2" rx="1" fill="white" opacity="0.35"/>
    </svg>
  )
}

// ─── iPhone Frame ─────────────────────────────────────────────────────────────
function IPhoneFrame({ children, className = '', scale = 1 }: { children: React.ReactNode; className?: string; scale?: number }) {
  const s = scale
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: 220 * s,
        height: 460 * s,
        borderRadius: 44 * s,
        background: 'linear-gradient(160deg, #2e2e2e 0%, #1a1a1a 100%)',
        border: `${1.5 * s}px solid rgba(255,255,255,0.13)`,
        boxShadow: `0 0 0 ${1 * s}px rgba(0,0,0,0.7), 0 ${40 * s}px ${80 * s}px rgba(0,0,0,0.75), inset 0 ${1 * s}px 0 rgba(255,255,255,0.1)`,
        padding: 9 * s,
        flexShrink: 0,
      }}
    >
      {/* Dynamic Island */}
      <div style={{ position: 'absolute', top: 13 * s, left: '50%', transform: 'translateX(-50%)', width: 78 * s, height: 19 * s, borderRadius: 100, background: '#000', zIndex: 30 }} />
      {/* Power button R */}
      <div style={{ position: 'absolute', right: -2, top: 100 * s, width: 3 * s, height: 56 * s, borderRadius: '0 3px 3px 0', background: '#252525' }} />
      {/* Silent switch L */}
      <div style={{ position: 'absolute', left: -2, top: 62 * s, width: 3 * s, height: 22 * s, borderRadius: '3px 0 0 3px', background: '#252525' }} />
      {/* Volume up L */}
      <div style={{ position: 'absolute', left: -2, top: 90 * s, width: 3 * s, height: 30 * s, borderRadius: '3px 0 0 3px', background: '#252525' }} />
      {/* Volume down L */}
      <div style={{ position: 'absolute', left: -2, top: 126 * s, width: 3 * s, height: 30 * s, borderRadius: '3px 0 0 3px', background: '#252525' }} />
      {/* Screen */}
      <div style={{ width: '100%', height: '100%', borderRadius: 37 * s, overflow: 'hidden', position: 'relative', background: '#000' }}>
        {children}
      </div>
    </div>
  )
}

// ─── Demo Artists ─────────────────────────────────────────────────────────────
const DEMO_ARTISTS = [
  {
    slug: 'charlotte-de-witte',
    name: 'C. DE WITTE',
    role: 'DJ & Producer',
    genre: 'Techno',
    location: 'Ghent · Belgium',
    accentColor: '#00C8FF',
    bgColor: '#030810',
    photo: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600&q=80',
    stats: [{ v: '4.2M', l: 'Monthly' }, { v: '72', l: 'Países' }, { v: '#4', l: 'DJ Mag' }],
    wave: [5, 9, 14, 8, 11, 6, 15, 10, 7, 13, 9, 5, 12, 8, 4, 10, 14, 7, 11, 6, 13, 9, 5, 8],
  },
  {
    slug: 'fisher',
    name: 'FISHER',
    role: 'DJ & Producer',
    genre: 'Tech House',
    location: 'Sydney · Australia',
    accentColor: '#F59E0B',
    bgColor: '#080400',
    photo: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
    stats: [{ v: '8.1M', l: 'Monthly' }, { v: '58', l: 'Países' }, { v: '110M', l: 'Streams' }],
    wave: [6, 11, 8, 14, 5, 9, 12, 7, 15, 10, 6, 13, 8, 5, 11, 9, 4, 12, 7, 10, 6, 14, 9, 5],
  },
  {
    slug: 'black-coffee',
    name: 'BLACK COFFEE',
    role: 'DJ & Producer',
    genre: 'Afro House',
    location: 'Johannesburg · ZA',
    accentColor: '#D97706',
    bgColor: '#050200',
    photo: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80',
    stats: [{ v: '62M', l: 'Streams' }, { v: '63', l: 'Países' }, { v: 'Grammy', l: 'Award' }],
    wave: [4, 9, 6, 12, 7, 4, 10, 14, 8, 5, 9, 13, 7, 4, 8, 12, 9, 6, 11, 8, 5, 10, 7, 4],
  },
]

// ─── Phone Presskit Content ───────────────────────────────────────────────────
function PhonePreskit({ artist, scale = 1 }: { artist: typeof DEMO_ARTISTS[0]; scale?: number }) {
  const s = scale
  return (
    <div style={{ width: '100%', height: '100%', background: artist.bgColor, position: 'relative', overflow: 'hidden' }}>
      {/* Background photo */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={artist.photo} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }} />
      </div>
      {/* Gradient overlay */}
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, ${artist.bgColor}33 0%, transparent 28%, ${artist.bgColor}CC 56%, ${artist.bgColor}F5 78%, ${artist.bgColor} 100%)` }} />
      {/* Color glow */}
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '220%', height: '55%', background: `radial-gradient(ellipse at bottom, ${artist.accentColor}1A, transparent 70%)` }} />

      {/* Top bar */}
      <div style={{ position: 'absolute', top: 28 * s, left: 14 * s, right: 14 * s, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 7 * s, fontFamily: 'monospace', color: 'rgba(255,255,255,0.35)', letterSpacing: 1.5 }}>PRESSKIT.PRO</span>
        <span style={{ fontSize: 7 * s, fontFamily: 'monospace', color: artist.accentColor, padding: `${2 * s}px ${5 * s}px`, borderRadius: 100, border: `1px solid ${artist.accentColor}44`, background: `${artist.accentColor}15` }}>● LIVE</span>
      </div>

      {/* Main content */}
      <div style={{ position: 'absolute', bottom: 20 * s, left: 14 * s, right: 14 * s }}>
        {/* Genre tag */}
        <span style={{ display: 'inline-block', fontSize: 7 * s, fontFamily: 'monospace', color: artist.accentColor, letterSpacing: 1.5, textTransform: 'uppercase' as const, padding: `${2 * s}px ${8 * s}px`, borderRadius: 100, border: `1px solid ${artist.accentColor}30`, background: `${artist.accentColor}12`, marginBottom: 7 * s }}>{artist.genre}</span>

        {/* Name */}
        <div style={{ fontSize: 22 * s, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, color: '#fff', marginBottom: 3 * s, fontFamily: 'system-ui, sans-serif' }}>{artist.name}</div>
        <div style={{ fontSize: 9 * s, color: 'rgba(255,255,255,0.45)', marginBottom: 10 * s, fontFamily: 'monospace' }}>{artist.role} · {artist.location}</div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 14 * s, marginBottom: 10 * s }}>
          {artist.stats.map(st => (
            <div key={st.l}>
              <div style={{ fontSize: 11 * s, fontWeight: 700, color: '#fff', fontFamily: 'system-ui, sans-serif', lineHeight: 1 }}>{st.v}</div>
              <div style={{ fontSize: 7 * s, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', marginTop: 1 * s }}>{st.l}</div>
            </div>
          ))}
        </div>

        {/* Waveform */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1.5 * s, marginBottom: 10 * s, height: 14 * s }}>
          {artist.wave.map((h, i) => (
            <div key={i} style={{ width: 2.5 * s, height: h * s, borderRadius: 2, background: i < 14 ? artist.accentColor : `${artist.accentColor}40` }} />
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 5 * s }}>
          <div style={{ flex: 1, padding: `${6 * s}px ${12 * s}px`, borderRadius: 100, background: artist.accentColor, textAlign: 'center' as const, fontSize: 9 * s, fontWeight: 700, color: '#000', fontFamily: 'system-ui, sans-serif' }}>Booking →</div>
          <div style={{ padding: `${6 * s}px ${10 * s}px`, borderRadius: 100, border: '1px solid rgba(255,255,255,0.15)', fontSize: 9 * s, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>♫</div>
        </div>
      </div>
    </div>
  )
}

// ─── Fade-in wrapper ──────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = '', y = 20 }: { children: React.ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Example artists for marquee ─────────────────────────────────────────────
const EXAMPLES = [
  { slug: 'charlotte-de-witte', name: 'C. DE WITTE', genre: 'Techno', role: 'DJ & Producer', location: 'Ghent · Belgium', plays: '4.2M', shows: '200+', primary: '#00C8FF', secondary: '#0047AB', bg: '#030810', text: '#E0F7FF', photo: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600&q=80' },
  { slug: 'fisher', name: 'FISHER', genre: 'Tech House', role: 'DJ & Producer', location: 'Sydney · Australia', plays: '8.1M', shows: '150+', primary: '#F59E0B', secondary: '#DC2626', bg: '#080400', text: '#FFF7ED', photo: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80' },
  { slug: 'black-coffee', name: 'BLACK COFFEE', genre: 'Afro House', role: 'DJ & Producer', location: 'Johannesburg · ZA', plays: '62M', shows: '500+', primary: '#D97706', secondary: '#92400E', bg: '#050200', text: '#FFFBEB', photo: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80' },
  { slug: 'francisco-allendes', name: 'F. ALLENDES', genre: 'Tech House', role: 'DJ & Producer', location: 'Barcelona · Miami', plays: '1.2M', shows: '320+', primary: '#F97316', secondary: '#C2410C', bg: '#040108', text: '#FFF7ED', photo: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80' },
  { slug: 'nina-k', name: 'NINA K.', genre: 'Techno', role: 'DJ', location: 'Moscow · Berlin', plays: '8.2M', shows: '340+', primary: '#DC2626', secondary: '#7F1D1D', bg: '#080808', text: '#F5F5F5', photo: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80' },
  { slug: 'marika', name: 'MARIKA', genre: 'Melodic Techno', role: 'DJ · Live', location: 'Barcelona', plays: '3.1M', shows: '120+', primary: '#8B5CF6', secondary: '#6366F1', bg: '#07050F', text: '#EDE9FE', photo: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=600&q=80' },
  { slug: 'kaytro', name: 'KAYTRO', genre: 'House', role: 'Producer', location: 'Montreal', plays: '14M', shows: '290+', primary: '#14B8A6', secondary: '#0D9488', bg: '#020D0C', text: '#CCFBF1', photo: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600&q=80' },
  { slug: 'liora', name: 'LIORA', genre: 'Afro House', role: 'DJ · Vocalist', location: 'Lagos · London', plays: '5.5M', shows: '190+', primary: '#F59E0B', secondary: '#D97706', bg: '#0A0600', text: '#FFFBEB', photo: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600&q=80' },
  { slug: 'honey-d', name: 'HONEY D.', genre: 'House · Disco', role: 'DJ', location: 'Chicago · NYC', plays: '9.3M', shows: '400+', primary: '#EAB308', secondary: '#CA8A04', bg: '#09090B', text: '#FAFAFA', photo: 'https://images.unsplash.com/photo-1501386761578-eaa54b616f8a?w=600&q=80' },
  { slug: 'mali-g', name: 'MALI G.', genre: 'House', role: 'DJ', location: 'Melbourne', plays: '4.2M', shows: '180+', primary: '#A78BFA', secondary: '#7C3AED', bg: '#08071A', text: '#EDE9FE', photo: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=600&q=80' },
  { slug: 'marco-v', name: 'MARCO V.', genre: 'Electronic', role: 'Producer', location: 'Amsterdam', plays: '6.8M', shows: '210+', primary: '#10B981', secondary: '#059669', bg: '#030F09', text: '#D1FAE5', photo: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80' },
  { slug: 'jamie-x', name: 'JAMIE X.', genre: 'House', role: 'DJ · Producer', location: 'London', plays: '12M', shows: '420+', primary: '#F43F5E', secondary: '#E11D48', bg: '#0A0204', text: '#FFE4E6', photo: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&q=80' },
]

function MarqueeCard({ ex }: { ex: typeof EXAMPLES[0] }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex-shrink-0 w-52 h-72 rounded-2xl overflow-hidden cursor-pointer group"
      style={{ backgroundColor: ex.bg }}
    >
      <div className="absolute inset-0 transition-transform duration-700 ease-out" style={{ transform: hovered ? 'scale(1.07)' : 'scale(1)' }}>
        <Image src={ex.photo} alt={ex.name} fill className="object-cover" sizes="210px" />
      </div>
      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 20%, ${ex.bg}CC 55%, ${ex.bg}F5 80%, ${ex.bg} 100%)` }} />
      <div className="absolute inset-0 opacity-25" style={{ background: `radial-gradient(ellipse at top right, ${ex.primary}88, transparent 60%)` }} />
      {/* Top: URL */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
        <span className="text-[8px] font-mono opacity-30" style={{ color: ex.text }}>presskit.pro/{ex.slug}</span>
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: ex.primary }} />
      </div>
      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col gap-1.5">
        <span className="inline-flex self-start px-2 py-0.5 rounded-full text-[8px] font-mono" style={{ backgroundColor: ex.primary + '22', color: ex.primary, border: `1px solid ${ex.primary}40` }}>{ex.genre.toUpperCase()}</span>
        <p className="font-sans font-black text-lg leading-tight tracking-tight" style={{ color: ex.text, textShadow: `0 0 20px ${ex.primary}55` }}>{ex.name}</p>
        <p className="text-[9px] font-mono opacity-40" style={{ color: ex.text }}>{ex.role} · {ex.location}</p>
        {/* Stats */}
        <div className="flex gap-4 mt-0.5">
          <div>
            <p className="text-xs font-bold" style={{ color: ex.primary }}>{ex.plays}</p>
            <p className="text-[8px] font-mono opacity-30" style={{ color: ex.text }}>plays</p>
          </div>
          <div>
            <p className="text-xs font-bold" style={{ color: ex.primary }}>{ex.shows}</p>
            <p className="text-[8px] font-mono opacity-30" style={{ color: ex.text }}>shows</p>
          </div>
        </div>
      </div>
      {/* Hover overlay */}
      <div className="absolute inset-0 flex items-center justify-center transition-all duration-200" style={{ opacity: hovered ? 1 : 0, backgroundColor: ex.bg + 'BB', backdropFilter: hovered ? 'blur(4px)' : 'none' }}>
        <div className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-xs font-semibold" style={{ backgroundColor: ex.primary }}>
          Ver presskit <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  )
}

function MarqueeRow({ items, reverse = false }: { items: typeof EXAMPLES; reverse?: boolean }) {
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden w-full" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)' }}>
      <motion.div
        className="flex gap-3"
        animate={{ x: reverse ? [-((items.length * 204)), 0] : [0, -((items.length * 204))] }}
        transition={{ repeat: Infinity, duration: items.length * 5, ease: 'linear' }}
        style={{ width: 'max-content' }}
      >
        {doubled.map((ex, i) => <MarqueeCard key={`${ex.slug}-${i}`} ex={ex} />)}
      </motion.div>
    </div>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: 'Mandé mi presskit a 3 festivales la misma semana y en dos días ya tenía respuesta. Antes eso me tomaba un mes armar todo.',
    name: 'Valentina M.',
    role: 'DJ · Buenos Aires',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80',
    color: '#C026D3',
  },
  {
    quote: 'Los booking agents ahora me escriben ellos. Tener una URL profesional marca una diferencia enorme — ya no parezco un artista amateur.',
    name: 'Rodrigo K.',
    role: 'Producer · Ciudad de México',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
    color: '#06B6D4',
  },
  {
    quote: 'En 5 minutos tuve algo que se ve mejor que el presskit de artistas con sello discográfico. Completamente alucinante.',
    name: 'Daniela V.',
    role: 'Live Act · Barcelona',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80',
    color: '#F59E0B',
  },
]

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: '¿Necesito saber diseño o código?', a: 'Para nada. Respondes unas preguntas, eliges tus colores y listo. El sistema genera el kit animado automáticamente.' },
  { q: '¿Cuánto tarda en estar listo?', a: 'El onboarding toma entre 3 y 7 minutos. Puedes completarlo en menos tiempo si ya tienes tu bio y links a mano.' },
  { q: '¿Mi presskit es único o todos se ven igual?', a: 'Cada kit usa tus propios colores, fotos y layout. Combinando colores, fondo (oscuro/claro) y las 4 estructuras hay miles de combinaciones posibles. Nadie más tendrá exactamente el tuyo.' },
  { q: '¿Puedo actualizar el kit después?', a: 'Sí, cuantas veces quieras. Cambias colores, logros, fotos, links — y la URL sigue siendo la misma.' },
  { q: '¿Qué pasa después de los 14 días gratuitos del plan Pro?', a: 'Si no haces nada, pasas automáticamente al plan Starter (gratuito para siempre). Sin cargos sorpresa.' },
  { q: '¿Puedo usar mi propio dominio?', a: 'Sí, en el plan Pro puedes conectar tu propio dominio (ej: press.tunombre.com) con unos pasos simples.' },
  { q: '¿Es seguro? ¿Quién puede ver mi presskit?', a: 'Tú controlas si el kit es público o privado. Puedes compartirlo con un link y mantenerlo oculto del buscador si prefieres.' },
  { q: '¿Funciona para agencias con varios artistas?', a: 'Sí, el plan Agency te da hasta 10 presskits bajo un solo dashboard, ideal para managers y sello discográficos.' },
]

// ─── Plans ────────────────────────────────────────────────────────────────────
const PLANS = [
  {
    name: 'Starter',
    price: 'Gratis',
    period: 'para siempre',
    desc: 'Para empezar y probar.',
    color: '#6B7280',
    features: ['1 press kit', 'URL presskit.pro/tu-nombre', 'Colores y layout personalizados', '4 estructuras de diseño', 'Secciones bio, música y contacto'],
    cta: 'Crear kit gratis',
    href: '/signup',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/ mes',
    desc: '14 días gratis, sin tarjeta.',
    color: '#C026D3',
    features: ['Todo de Starter', 'Analíticas en tiempo real', 'Dominio personalizado', 'Galería ilimitada', 'Soporte prioritario', 'Badge "Artista Verificado"'],
    cta: 'Empezar 14 días gratis',
    href: '/signup?plan=pro',
    highlight: true,
  },
  {
    name: 'Agency',
    price: '$29',
    period: '/ mes',
    desc: 'Para managers y agencias.',
    color: '#06B6D4',
    features: ['Hasta 10 artistas', 'Todo de Pro', 'Dashboard de agencia', 'Facturación unificada', 'API access', 'SLA garantizado'],
    cta: 'Hablar con ventas',
    href: 'mailto:hola@presskit.pro',
    highlight: false,
  },
]

// ─── Recent signups for social proof ─────────────────────────────────────────
const RECENT_SIGNUPS = [
  { initials: 'VM', color: '#C026D3' },
  { initials: 'KT', color: '#06B6D4' },
  { initials: 'DV', color: '#F59E0B' },
  { initials: 'AL', color: '#10B981' },
  { initials: 'JM', color: '#8B5CF6' },
  { initials: 'RS', color: '#EF4444' },
]

// ─── Main landing ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showDemo, setShowDemo] = useState(false)
  const [demoIdx, setDemoIdx] = useState(0)

  return (
    <main className="min-h-screen bg-[#07070B] text-white overflow-x-hidden">

      {/* ── NAV ─────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-[#07070B]/85 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <LogoMark size={28} />
          <span className="font-display font-bold text-lg tracking-widest">
            PRESSKIT<span className="text-[#C026D3]">.PRO</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-white/50">
          <a href="#ejemplos" className="hover:text-white transition-colors">Ejemplos</a>
          <a href="#como-funciona" className="hover:text-white transition-colors">Cómo funciona</a>
          <a href="#precios" className="hover:text-white transition-colors">Precios</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-white/50 hover:text-white transition-colors hidden sm:block">
            Iniciar sesión
          </Link>
          <Link
            href="/signup"
            className="text-sm px-4 py-2 rounded-full bg-[#C026D3] hover:bg-[#A21CAF] text-white font-semibold transition-all hover:shadow-[0_0_20px_rgba(192,38,211,0.4)] hover:scale-105"
          >
            Crear kit gratis
          </Link>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────── */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity }}
        className="relative min-h-screen px-6 pt-28 flex flex-col overflow-hidden"
      >
        {/* Glow blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[600px] h-[400px] rounded-full bg-[#C026D3]/[0.07] blur-[120px]" />
          <div className="absolute top-1/2 right-1/5 w-[500px] h-[300px] rounded-full bg-[#00E5FF]/[0.04] blur-[100px]" />
          <div className="absolute bottom-0 left-1/3 w-[500px] h-[300px] rounded-full bg-[#F59E0B]/[0.03] blur-[100px]" />
        </div>

        {/* Text content */}
        <div className="relative z-10 flex flex-col items-center gap-5 max-w-4xl mx-auto text-center flex-1 justify-center pb-6">
          {/* Badge */}
          <FadeIn delay={0}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C026D3]/30 text-[#E879F9] text-xs font-mono tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C026D3] animate-pulse" />
              PRESS KIT ANIMADO EN 5 MINUTOS — SIN DISEÑADOR
            </div>
          </FadeIn>

          {/* Hero headline */}
          <FadeIn delay={0.1} y={30}>
            <h1 className="font-sans font-black text-5xl md:text-7xl lg:text-[84px] leading-[0.92] tracking-tighter">
              El presskit que<br />
              <span style={{ background: 'linear-gradient(135deg, #C026D3 0%, #A855F7 50%, #7C3AED 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>consigue el booking.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl text-white/50 max-w-lg leading-relaxed">
              Elige tus colores de marca, sube tus fotos y responde algunas preguntas.
              En minutos tienes un kit animado que ningún otro artista puede tener.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#C026D3] hover:bg-[#A21CAF] text-white font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(192,38,211,0.5)]"
              >
                Crear mi kit gratis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => { setDemoIdx(0); setShowDemo(true) }}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-sm font-medium transition-all duration-300 cursor-pointer bg-transparent"
              >
                <Play className="w-4 h-4" /> Ver ejemplos
              </button>
            </div>
          </FadeIn>

          {/* Trust bar */}
          <FadeIn delay={0.4}>
            <div className="flex items-center gap-5 text-xs text-white/30 font-mono mt-2">
              <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400" /> Sin tarjeta</span>
              <span className="w-px h-3 bg-white/10" />
              <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400" /> 14 días Pro gratis</span>
              <span className="w-px h-3 bg-white/10" />
              <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400" /> Listo en 5 min</span>
            </div>
          </FadeIn>
        </div>

        {/* ── Two Hero iPhones ── */}
        <div className="relative z-10 flex justify-center items-start gap-10 md:gap-20 pb-0">
          <FadeIn delay={0.55} y={60}>
            <div className="flex flex-col items-center gap-3">
              <span className="text-[10px] font-mono text-white/25 tracking-widest">presskit.pro/charlotte-de-witte</span>
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                style={{ rotate: -7 }}
              >
                <IPhoneFrame scale={0.86}>
                  <PhonePreskit artist={DEMO_ARTISTS[0]} scale={0.86} />
                </IPhoneFrame>
              </motion.div>
            </div>
          </FadeIn>

          <FadeIn delay={0.72} y={60}>
            <div className="flex flex-col items-center gap-3">
              <span className="text-[10px] font-mono text-white/25 tracking-widest">presskit.pro/fisher</span>
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1.3 }}
                style={{ rotate: 7 }}
              >
                <IPhoneFrame scale={0.86}>
                  <PhonePreskit artist={DEMO_ARTISTS[1]} scale={0.86} />
                </IPhoneFrame>
              </motion.div>
            </div>
          </FadeIn>
        </div>

        {/* Scroll line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-[1px] h-10 bg-gradient-to-b from-white/30 to-transparent"
          />
        </motion.div>
      </motion.section>

      {/* ── SOCIAL PROOF BAR ─────────────────────────────── */}
      <section className="py-10 px-6 border-y border-white/[0.06]">
        <FadeIn>
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-5">

            {/* Avatar stack + headline */}
            <div className="flex items-center gap-3">
              <div className="flex">
                {RECENT_SIGNUPS.map((u, i) => (
                  <div
                    key={i}
                    style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${u.color}, ${u.color}88)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 800, color: '#fff',
                      border: '2.5px solid #07070B',
                      marginLeft: i === 0 ? 0 : -9,
                      zIndex: 6 - i,
                      position: 'relative',
                      fontFamily: 'system-ui, sans-serif',
                    }}
                  >
                    {u.initials}
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/55">
                <span className="text-white font-semibold">847 artistas</span> ya tienen su kit publicado
              </p>
            </div>

            {/* Stars + rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                ))}
              </div>
              <span className="text-white font-semibold text-sm">4.9</span>
              <span className="text-white/30 text-xs">de 5 · 312 reseñas verificadas</span>
            </div>

            {/* Metric pills */}
            <div className="flex flex-wrap justify-center gap-2">
              {[
                '🌍 Artistas en 23 países',
                '⚡ Kit listo en ~4 min de media',
                '📈 +160 kits nuevos este mes',
                '🎧 3 de cada 4 reciben respuesta de booking',
              ].map((m) => (
                <span key={m} className="px-3 py-1.5 rounded-full text-xs text-white/50 bg-white/[0.04] border border-white/[0.07] font-mono">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── 3D PRESETS SHOWCASE ──────────────────────────── */}
      <section id="ejemplos" className="py-24 px-6 border-t border-white/[0.06] overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-4">
            <p className="text-xs font-mono text-[#C026D3] tracking-widest uppercase mb-3">// PRESETS EN VIVO</p>
            <h2 className="font-sans font-black text-4xl md:text-5xl tracking-tighter">
              Así se ve un presskit<br />
              <span className="text-white/30">hecho con PRESSKIT.PRO</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.05} className="text-center mb-16">
            <p className="text-sm text-white/35">Haz click en cualquiera para ver el presskit completo</p>
          </FadeIn>

          {/* 3D iPhone trio */}
          <div className="flex items-end justify-center gap-6 md:gap-10" style={{ perspective: '1400px' }}>

            {/* Left — CHARLOTTE DE WITTE */}
            <FadeIn delay={0.1} y={40}>
              <a href="/demo/charlotte-de-witte" target="_blank" className="group block" style={{ transform: 'rotateY(18deg) translateZ(-60px)', transformStyle: 'preserve-3d' }}>
                <div className="mb-3 text-center opacity-60 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-mono tracking-widest" style={{ color: '#00C8FF' }}>C. DE WITTE · Techno</span>
                </div>
                <motion.div whileHover={{ scale: 1.04, rotateY: 8 }} transition={{ duration: 0.3 }} style={{ transformStyle: 'preserve-3d' }}>
                  <IPhoneFrame scale={0.82}>
                    <PhonePreskit artist={DEMO_ARTISTS[0]} scale={0.82} />
                  </IPhoneFrame>
                </motion.div>
                <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-mono text-white/40 border border-white/10 px-3 py-1 rounded-full">Ver presskit →</span>
                </div>
              </a>
            </FadeIn>

            {/* Center — FISHER (featured) */}
            <FadeIn delay={0.05} y={20}>
              <a href="/demo/fisher" target="_blank" className="group block relative" style={{ transform: 'translateZ(40px)', transformStyle: 'preserve-3d', zIndex: 10 }}>
                {/* Featured badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full text-[10px] font-mono bg-[#F59E0B] text-black tracking-wider font-black">
                  ⭐ TOP DJ
                </div>
                <div className="mb-3 text-center">
                  <span className="text-[10px] font-mono tracking-widest" style={{ color: '#F59E0B' }}>FISHER · Tech House</span>
                </div>
                <motion.div
                  whileHover={{ scale: 1.04, y: -6 }}
                  transition={{ duration: 0.3 }}
                  style={{ filter: 'drop-shadow(0 0 40px rgba(245,158,11,0.35))' }}
                >
                  <IPhoneFrame scale={0.98}>
                    <PhonePreskit artist={DEMO_ARTISTS[1]} scale={0.98} />
                  </IPhoneFrame>
                </motion.div>
                <div className="mt-4 text-center">
                  <span className="text-xs font-mono border px-3 py-1 rounded-full group-hover:opacity-80 transition-colors" style={{ color: '#F59E0B', borderColor: '#F59E0B40' }}>Ver presskit →</span>
                </div>
              </a>
            </FadeIn>

            {/* Right — BLACK COFFEE */}
            <FadeIn delay={0.15} y={40}>
              <a href="/demo/black-coffee" target="_blank" className="group block" style={{ transform: 'rotateY(-18deg) translateZ(-60px)', transformStyle: 'preserve-3d' }}>
                <div className="mb-3 text-center opacity-60 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-mono tracking-widest" style={{ color: '#D97706' }}>BLACK COFFEE · Afro House</span>
                </div>
                <motion.div whileHover={{ scale: 1.04, rotateY: -8 }} transition={{ duration: 0.3 }} style={{ transformStyle: 'preserve-3d' }}>
                  <IPhoneFrame scale={0.82}>
                    <PhonePreskit artist={DEMO_ARTISTS[2]} scale={0.82} />
                  </IPhoneFrame>
                </motion.div>
                <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-mono text-white/40 border border-white/10 px-3 py-1 rounded-full">Ver presskit →</span>
                </div>
              </a>
            </FadeIn>
          </div>

          {/* Bottom CTA row */}
          <FadeIn delay={0.3} className="flex justify-center mt-14">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-[#C026D3]/30 text-[#E879F9] text-sm font-semibold hover:bg-[#C026D3]/10 transition-all"
            >
              Crear el mío — es gratis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── MARQUEE GALLERY ──────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 mb-10">
          <FadeIn>
            <p className="text-xs font-mono text-[#C026D3] tracking-widest uppercase mb-3">// cada kit es único</p>
          </FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <FadeIn delay={0.05}>
              <h2 className="font-sans font-black text-4xl md:text-5xl tracking-tighter leading-none">
                Ninguno igual<br />
                <span className="text-white/25">al tuyo.</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-white/40 text-sm max-w-xs leading-relaxed">
                Colores propios, foto real, layout elegido por ti. El sistema genera una identidad que no puede tener nadie más.
              </p>
            </FadeIn>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <MarqueeRow items={EXAMPLES} />
          <MarqueeRow items={[...EXAMPLES.slice(5), ...EXAMPLES.slice(0, 5)]} reverse />
        </div>
      </section>

      {/* ── COMPARISON HOOK ──────────────────────────────── */}
      <section className="py-20 px-6 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FadeIn delay={0} className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-4">// Sin PRESSKIT.PRO</p>
              <ul className="flex flex-col gap-3">
                {[
                  'Diseñador freelance: $300–$800 por kit',
                  'Se demora 2–3 semanas',
                  'Actualizarlo cuesta más dinero',
                  'PDF estático sin animaciones',
                  'Sin analíticas ni tracking',
                  'Nadie puede encontrarlo online',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-white/40">
                    <span className="text-red-400 mt-0.5 shrink-0">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </FadeIn>
            <FadeIn delay={0.1} className="p-6 rounded-2xl border border-[#C026D3]/30 bg-[#C026D3]/[0.04] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#C026D3]/10 blur-[60px] rounded-full pointer-events-none" />
              <p className="text-xs font-mono text-[#C026D3] uppercase tracking-widest mb-4">// Con PRESSKIT.PRO</p>
              <ul className="flex flex-col gap-3">
                {[
                  'Desde $0 — Gratis para empezar',
                  'Listo en menos de 5 minutos',
                  'Actualizable en cualquier momento',
                  'Animado, responsivo y con colores propios',
                  'Analíticas: quién lo vio, desde dónde',
                  'URL permanente compartible',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-white/80">
                    <Check className="w-4 h-4 text-[#C026D3] mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section id="como-funciona" className="py-20 px-6 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-14">
            <p className="text-xs font-mono text-[#C026D3] tracking-widest uppercase mb-3">// CÓMO FUNCIONA</p>
            <h2 className="font-sans font-black text-4xl md:text-5xl tracking-tighter">
              5 minutos. Un kit que<br />nadie más puede tener.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { n: '01', title: 'Cuéntanos quién eres', desc: 'Nombre artístico, rol, género, bio y logros. Las preguntas guían — no necesitas saber qué escribir.', icon: '🎤' },
              { n: '02', title: 'Elige tus colores y estilo', desc: 'Color picker libre o paletas de inspiración. Fondo oscuro o claro. 4 estructuras visuales distintas.', icon: '🎨' },
              { n: '03', title: 'Publica y comparte', desc: 'Tu kit queda en presskit.pro/tu-nombre con animaciones, galería, player y botón de booking.', icon: '🚀' },
            ].map((s, i) => (
              <FadeIn key={s.n} delay={i * 0.08}
                className="group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-[#C026D3]/30 hover:bg-[#C026D3]/[0.03] hover:-translate-y-1 transition-all duration-300 cursor-default"
              >
                <div className="text-3xl mb-4">{s.icon}</div>
                <span className="font-mono text-xs text-white/20 tracking-widest">{s.n}</span>
                <h3 className="font-sans font-black text-lg tracking-tight mt-1 mb-2 text-white">{s.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{s.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-14">
            <p className="text-xs font-mono text-[#C026D3] tracking-widest uppercase mb-3">// CARACTERÍSTICAS</p>
            <h2 className="font-sans font-black text-4xl md:text-5xl tracking-tighter">
              Todo lo que un booking agent<br />quiere ver.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Palette, title: 'Colores 100% tuyos', desc: 'Color picker libre + 10 paletas de inspiración. Tu marca, no una plantilla.' },
              { icon: Layout, title: '4 layouts distintos', desc: 'Centrado, Editorial, Split y Raw. Cada uno crea una jerarquía visual completamente diferente.' },
              { icon: Globe, title: 'URL permanente', desc: 'presskit.pro/tu-nombre — comparte en una línea con booking agents, festivales y prensa.' },
              { icon: BarChart3, title: 'Analíticas reales', desc: 'Visitas, clics en contacto, reproducciones de música. Sabes quién revisa tu kit.' },
              { icon: Zap, title: 'Animaciones incluidas', desc: 'Waveform, count-up de stats, parallax, galería masonry y lightbox. Sin configurar nada.' },
              { icon: Lock, title: 'Siempre editable', desc: 'Cambia colores, fotos o logros cuando quieras. La URL nunca cambia.' },
            ].map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.05}
                className="group p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-[#C026D3]/25 hover:bg-[#C026D3]/[0.03] hover:-translate-y-0.5 transition-all duration-200 cursor-default"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 bg-[#C026D3]/10 group-hover:bg-[#C026D3]/20 transition-colors">
                  <f.icon className="w-4 h-4 text-[#C026D3]" />
                </div>
                <h3 className="font-sans font-bold text-sm text-white mb-1.5">{f.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-14">
            <p className="text-xs font-mono text-[#C026D3] tracking-widest uppercase mb-3">// LO QUE DICEN</p>
            <h2 className="font-sans font-black text-4xl md:text-5xl tracking-tighter">
              Artistas que ya usan<br />PRESSKIT.PRO
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.1}
                className="group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-current" style={{ color: t.color }} />
                  ))}
                </div>
                <p className="text-sm text-white/70 leading-relaxed flex-1">&quot;{t.quote}&quot;</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
                  <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border" style={{ borderColor: t.color + '44' }}>
                    <Image src={t.avatar} alt={t.name} width={36} height={36} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/35 font-mono">{t.role}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────── */}
      <section id="precios" className="py-20 px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-4">
            <p className="text-xs font-mono text-[#C026D3] tracking-widest uppercase mb-3">// PRECIOS</p>
            <h2 className="font-sans font-black text-4xl md:text-5xl tracking-tighter">Simple y transparente.</h2>
          </FadeIn>
          <FadeIn delay={0.05} className="text-center mb-12">
            <p className="text-sm text-white/40">Un diseñador te cobra $300–$800 por un PDF estático. <span className="text-white/70">Aquí lo tienes por $12/mes — animado, editable y con analíticas.</span></p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 0.08}
                className={`relative flex flex-col p-6 rounded-2xl border transition-all hover:-translate-y-1 duration-300 ${
                  plan.highlight
                    ? 'border-[#C026D3]/50 bg-[#C026D3]/[0.05]'
                    : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-white bg-[#C026D3] tracking-wider uppercase">
                    Más popular
                  </div>
                )}
                <div className="mb-5">
                  <p className="text-[10px] font-mono tracking-widest uppercase mb-1.5" style={{ color: plan.color }}>{plan.name}</p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="font-sans font-black text-4xl tracking-tighter text-white">{plan.price}</span>
                    <span className="text-sm text-white/35">{plan.period}</span>
                  </div>
                  <p className="text-xs text-white/40 font-mono">{plan.desc}</p>
                </div>
                <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/65">
                      <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: plan.color }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className="w-full py-3 rounded-xl text-center text-sm font-bold transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    backgroundColor: plan.highlight ? plan.color : 'transparent',
                    color: plan.highlight ? '#fff' : plan.color,
                    border: plan.highlight ? 'none' : `1px solid ${plan.color}50`,
                  }}
                >
                  {plan.cta}
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section id="faq" className="py-20 px-6 border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto">
          <FadeIn className="text-center mb-12">
            <p className="text-xs font-mono text-[#C026D3] tracking-widest uppercase mb-3">// PREGUNTAS</p>
            <h2 className="font-sans font-black text-4xl md:text-5xl tracking-tighter">Preguntas frecuentes.</h2>
          </FadeIn>
          <div className="flex flex-col gap-2">
            {FAQS.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.03}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.10] hover:bg-white/[0.04] transition-all duration-200 text-left"
                >
                  <span className="font-sans font-semibold text-sm text-white/80">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0"
                  >
                    <ChevronDown className="w-4 h-4 text-white/30" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 pt-1 text-sm text-white/45 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────── */}
      <section className="py-32 px-6 text-center border-t border-white/[0.06]">
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-[#C026D3]/[0.08] blur-[100px] pointer-events-none" />
          <FadeIn className="relative z-10">
            <p className="text-xs font-mono text-[#C026D3] tracking-widest uppercase mb-4">// EMPIEZA HOY</p>
            <h2 className="font-sans font-black text-5xl md:text-6xl tracking-tighter mb-4 leading-tight">
              Tu sonido merece<br />un kit a su altura.
            </h2>
            <p className="text-white/40 mb-8 text-base">Gratis para empezar. Sin tarjeta. Listo en 5 minutos.</p>
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 px-10 py-5 rounded-full bg-[#C026D3] hover:bg-[#A21CAF] text-white font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(192,38,211,0.5)]"
            >
              Crear mi press kit
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center justify-center gap-5 mt-6 text-xs text-white/25 font-mono">
              <span className="flex items-center gap-1"><Check className="w-3 h-3 text-emerald-400" /> Sin tarjeta</span>
              <span className="flex items-center gap-1"><Check className="w-3 h-3 text-emerald-400" /> 14 días Pro gratis</span>
              <span className="flex items-center gap-1"><Check className="w-3 h-3 text-emerald-400" /> Cancela cuando quieras</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="py-8 px-6 border-t border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LogoMark size={20} />
          <span className="font-display font-bold text-sm tracking-widest text-white/30">
            PRESSKIT<span className="text-[#C026D3]/50">.PRO</span>
          </span>
        </div>
        <p className="text-white/20 text-xs font-mono">© 2026 — Cada artista, un kit único</p>
        <div className="flex gap-4 text-xs text-white/20 font-mono">
          <a href="#" className="hover:text-white/50 transition-colors">Privacidad</a>
          <a href="#" className="hover:text-white/50 transition-colors">Términos</a>
        </div>
      </footer>

      {/* ── DEMO MODAL ───────────────────────────────────── */}
      <AnimatePresence>
        {showDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
            style={{ background: 'rgba(2,2,6,0.94)', backdropFilter: 'blur(28px)' }}
            onClick={() => setShowDemo(false)}
          >
            {/* Close */}
            <button
              onClick={() => setShowDemo(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/[0.1] flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4 text-white/70" />
            </button>

            <motion.div
              initial={{ scale: 0.88, y: 28, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.88, y: 28, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center gap-5"
            >
              {/* URL bar */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.10]">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-white/45">presskit.pro/{DEMO_ARTISTS[demoIdx].slug}</span>
              </div>

              {/* iPhone — larger for modal */}
              <motion.div
                key={demoIdx}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
              >
                <IPhoneFrame scale={1.28}>
                  <PhonePreskit artist={DEMO_ARTISTS[demoIdx]} scale={1.28} />
                </IPhoneFrame>
              </motion.div>

              {/* Artist switcher */}
              <div className="flex items-center gap-3">
                {DEMO_ARTISTS.map((a, i) => (
                  <button
                    key={a.slug}
                    onClick={() => setDemoIdx(i)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
                    style={{
                      background: demoIdx === i ? `${a.accentColor}20` : 'transparent',
                      border: `1px solid ${demoIdx === i ? a.accentColor + '55' : 'rgba(255,255,255,0.1)'}`,
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: a.accentColor }} />
                    <span className="text-xs font-mono" style={{ color: demoIdx === i ? a.accentColor : 'rgba(255,255,255,0.35)' }}>
                      {a.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* CTA */}
              <Link
                href="/signup"
                onClick={() => setShowDemo(false)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C026D3] hover:bg-[#A21CAF] text-white font-bold text-sm transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(192,38,211,0.5)]"
              >
                Crear el mío gratis <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  )
}
