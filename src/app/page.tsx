'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Check, ChevronDown, Play, Star, Zap, Globe, BarChart3, Palette, Layout, Lock, X, Mail, Music, Ticket, Database, TrendingUp } from 'lucide-react'

// ─── Design tokens ─────────────────────────────────────────────────────────────
const A1 = '#a855f7'
const A2 = '#c084fc'
const A3 = '#7c3aed'
const BG = '#05050a'

// ─── Logo Mark (triangle A) ────────────────────────────────────────────────────
function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="lgm" x1="0" y1="0" x2="24" y2="24">
          <stop offset="0" stopColor="#e8ddff" />
          <stop offset="0.5" stopColor={A2} />
          <stop offset="1" stopColor={A3} />
        </linearGradient>
      </defs>
      <path d="M12 2 L22 20 L17 20 L12 11 L7 20 L2 20 Z" fill="url(#lgm)" />
      <circle cx="12" cy="17" r="1.5" fill={BG} />
    </svg>
  )
}

// ─── Aurora background ─────────────────────────────────────────────────────────
function Aurora() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute -top-40 left-1/4 w-[700px] h-[500px] rounded-full opacity-[0.07]"
        style={{ background: `radial-gradient(ellipse, ${A1}, transparent 70%)`, filter: 'blur(60px)' }} />
      <div className="absolute top-1/3 right-0 w-[500px] h-[400px] rounded-full opacity-[0.05]"
        style={{ background: `radial-gradient(ellipse, #06b6d4, transparent 70%)`, filter: 'blur(80px)' }} />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[300px] rounded-full opacity-[0.04]"
        style={{ background: `radial-gradient(ellipse, ${A2}, transparent 70%)`, filter: 'blur(80px)' }} />
    </div>
  )
}

// ─── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <>
      <nav className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-5 md:px-8 py-4 transition-all duration-300 ${
        scrolled ? 'border-b border-white/[0.07] bg-[#05050a]/90 backdrop-blur-xl' : 'bg-transparent'
      }`}>
        <div className="flex items-center gap-2.5">
          <LogoMark size={26} />
          <span className="font-display font-bold text-base tracking-[0.2em] text-white">
            ARTIX
          </span>
        </div>
        <div className="hidden md:flex items-center gap-7 text-sm text-white/45 font-display">
          <a href="#ejemplos" className="hover:text-white transition-colors">Ejemplos</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#precios" className="hover:text-white transition-colors">Precios</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm text-white/45 hover:text-white transition-colors font-display">
            Iniciar sesión
          </Link>
          <Link href="/signup"
            className="text-sm px-5 py-2 rounded-full font-display font-semibold text-white transition-all hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${A3}, ${A1})`, boxShadow: `0 0 20px ${A1}30` }}>
            Early access →
          </Link>
        </div>
        {/* Mobile hamburger */}
        <button
          className="md:hidden w-9 h-9 flex flex-col justify-center items-center gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`w-5 h-px bg-white/60 transition-all ${menuOpen ? 'rotate-45 translate-y-[3px]' : ''}`} />
          <span className={`w-5 h-px bg-white/60 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-5 h-px bg-white/60 transition-all ${menuOpen ? '-rotate-45 -translate-y-[3px]' : ''}`} />
        </button>
      </nav>
      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[60px] inset-x-0 z-40 bg-[#05050a]/95 backdrop-blur-xl border-b border-white/[0.07] px-5 py-5 flex flex-col gap-4 md:hidden"
          >
            {['#ejemplos','#features','#precios','#faq'].map((href, i) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}
                className="text-sm text-white/60 hover:text-white font-display transition-colors py-1">
                {['Ejemplos','Features','Precios','FAQ'][i]}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.07]">
              <Link href="/login" onClick={() => setMenuOpen(false)} className="text-sm text-white/50 text-center py-2 font-display">Iniciar sesión</Link>
              <Link href="/signup" onClick={() => setMenuOpen(false)}
                className="text-sm py-3 rounded-full font-display font-semibold text-white text-center"
                style={{ background: `linear-gradient(135deg, ${A3}, ${A1})` }}>
                Crear kit gratis →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Fade-in wrapper ───────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = '', y = 24, style }: { children: React.ReactNode; delay?: number; className?: string; y?: number; style?: React.CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

// ─── iPhone Frame ──────────────────────────────────────────────────────────────
function IPhoneFrame({ children, scale = 1 }: { children: React.ReactNode; scale?: number }) {
  const s = scale
  return (
    <div style={{
      position: 'relative', width: 220 * s, height: 460 * s, borderRadius: 44 * s,
      background: 'linear-gradient(160deg, #2a1f3d 0%, #150f24 100%)',
      border: `${1.5 * s}px solid rgba(168,85,247,0.25)`,
      boxShadow: `0 0 0 ${1 * s}px rgba(0,0,0,0.7), 0 ${40 * s}px ${80 * s}px rgba(0,0,0,0.75), inset 0 ${1 * s}px 0 rgba(255,255,255,0.08)`,
      padding: 9 * s, flexShrink: 0,
    }}>
      <div style={{ position: 'absolute', top: 13 * s, left: '50%', transform: 'translateX(-50%)', width: 78 * s, height: 19 * s, borderRadius: 100, background: '#000', zIndex: 30 }} />
      <div style={{ position: 'absolute', right: -2, top: 100 * s, width: 3 * s, height: 56 * s, borderRadius: '0 3px 3px 0', background: '#1a0f2e' }} />
      <div style={{ position: 'absolute', left: -2, top: 62 * s, width: 3 * s, height: 22 * s, borderRadius: '3px 0 0 3px', background: '#1a0f2e' }} />
      <div style={{ position: 'absolute', left: -2, top: 90 * s, width: 3 * s, height: 30 * s, borderRadius: '3px 0 0 3px', background: '#1a0f2e' }} />
      <div style={{ position: 'absolute', left: -2, top: 126 * s, width: 3 * s, height: 30 * s, borderRadius: '3px 0 0 3px', background: '#1a0f2e' }} />
      <div style={{ width: '100%', height: '100%', borderRadius: 37 * s, overflow: 'hidden', position: 'relative', background: '#000' }}>
        {children}
      </div>
    </div>
  )
}

// ─── Demo Artists ──────────────────────────────────────────────────────────────
const DEMO_ARTISTS = [
  {
    slug: 'charlotte-de-witte',
    name: 'C. DE WITTE',
    role: 'DJ & Producer',
    genre: 'Techno',
    location: 'Ghent · Belgium',
    accentColor: '#a855f7',
    bgColor: '#07030f',
    photo: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600&q=80',
    stats: [{ v: '4.2M', l: 'Monthly' }, { v: '72', l: 'Países' }, { v: '#4', l: 'DJ Mag' }],
    wave: [5, 9, 14, 8, 11, 6, 15, 10, 7, 13, 9, 5, 12, 8, 4, 10, 14, 7, 11, 6, 13, 9, 5, 8],
  },
  {
    slug: 'solen',
    name: 'SOLEN.',
    role: 'DJ & Live Act',
    genre: 'Melodic Techno',
    location: 'Berlin · Barcelona',
    accentColor: '#06b6d4',
    bgColor: '#020d10',
    photo: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80',
    stats: [{ v: '8.1M', l: 'Monthly' }, { v: '58', l: 'Países' }, { v: '110M', l: 'Streams' }],
    wave: [6, 11, 8, 14, 5, 9, 12, 7, 15, 10, 6, 13, 8, 5, 11, 9, 4, 12, 7, 10, 6, 14, 9, 5],
  },
  {
    slug: 'vela-drift',
    name: 'VELA DRIFT',
    role: 'Producer · DJ',
    genre: 'Afro House',
    location: 'Nairobi · Amsterdam',
    accentColor: '#f59e0b',
    bgColor: '#080400',
    photo: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80',
    stats: [{ v: '62M', l: 'Streams' }, { v: '63', l: 'Países' }, { v: 'Grammy', l: 'Award' }],
    wave: [4, 9, 6, 12, 7, 4, 10, 14, 8, 5, 9, 13, 7, 4, 8, 12, 9, 6, 11, 8, 5, 10, 7, 4],
  },
]

// ─── Phone Presskit ────────────────────────────────────────────────────────────
function PhonePreskit({ artist, scale = 1 }: { artist: typeof DEMO_ARTISTS[0]; scale?: number }) {
  const s = scale
  return (
    <div style={{ width: '100%', height: '100%', background: artist.bgColor, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={artist.photo} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, ${artist.bgColor}22 0%, transparent 25%, ${artist.bgColor}BB 55%, ${artist.bgColor}F5 78%, ${artist.bgColor} 100%)` }} />
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '200%', height: '50%', background: `radial-gradient(ellipse at bottom, ${artist.accentColor}1A, transparent 70%)` }} />
      <div style={{ position: 'absolute', top: 28 * s, left: 14 * s, right: 14 * s, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 7 * s, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', letterSpacing: 1.5 }}>ARTIX</span>
        <span style={{ fontSize: 7 * s, fontFamily: 'monospace', color: artist.accentColor, padding: `${2 * s}px ${5 * s}px`, borderRadius: 100, border: `1px solid ${artist.accentColor}44`, background: `${artist.accentColor}15` }}>● LIVE</span>
      </div>
      <div style={{ position: 'absolute', bottom: 18 * s, left: 14 * s, right: 14 * s }}>
        <span style={{ display: 'inline-block', fontSize: 7 * s, fontFamily: 'monospace', color: artist.accentColor, letterSpacing: 1.5, textTransform: 'uppercase' as const, padding: `${2 * s}px ${8 * s}px`, borderRadius: 100, border: `1px solid ${artist.accentColor}30`, background: `${artist.accentColor}12`, marginBottom: 7 * s }}>{artist.genre}</span>
        <div style={{ fontSize: 22 * s, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, color: '#fff', marginBottom: 3 * s, fontFamily: 'system-ui, sans-serif' }}>{artist.name}</div>
        <div style={{ fontSize: 9 * s, color: 'rgba(255,255,255,0.4)', marginBottom: 10 * s, fontFamily: 'monospace' }}>{artist.role} · {artist.location}</div>
        <div style={{ display: 'flex', gap: 14 * s, marginBottom: 10 * s }}>
          {artist.stats.map(st => (
            <div key={st.l}>
              <div style={{ fontSize: 11 * s, fontWeight: 700, color: '#fff', fontFamily: 'system-ui, sans-serif', lineHeight: 1 }}>{st.v}</div>
              <div style={{ fontSize: 7 * s, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', marginTop: 1 * s }}>{st.l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1.5 * s, marginBottom: 10 * s, height: 14 * s }}>
          {artist.wave.map((h, i) => (
            <div key={i} style={{ width: 2.5 * s, height: h * s, borderRadius: 2, background: i < 14 ? artist.accentColor : `${artist.accentColor}40` }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 5 * s }}>
          <div style={{ flex: 1, padding: `${6 * s}px ${12 * s}px`, borderRadius: 100, background: artist.accentColor, textAlign: 'center' as const, fontSize: 9 * s, fontWeight: 700, color: '#000', fontFamily: 'system-ui, sans-serif' }}>Booking →</div>
          <div style={{ padding: `${6 * s}px ${10 * s}px`, borderRadius: 100, border: '1px solid rgba(255,255,255,0.15)', fontSize: 9 * s, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>♫</div>
        </div>
      </div>
    </div>
  )
}

// ─── Example artists for marquee ──────────────────────────────────────────────
const EXAMPLES = [
  { slug: 'francisco-allendes', name: 'F. ALLENDES', genre: 'Tech House', role: 'DJ & Producer', location: 'Barcelona · Miami', plays: '1.2M', shows: '320+', primary: '#a855f7', secondary: '#7c3aed', bg: '#07030f', text: '#f3e8ff', photo: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80' },
  { slug: 'nina-k', name: 'NINA K.', genre: 'Techno', role: 'DJ', location: 'Moscow · Berlin', plays: '8.2M', shows: '340+', primary: '#ec4899', secondary: '#be185d', bg: '#0a010a', text: '#fce7f3', photo: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80' },
  { slug: 'okara', name: 'OKARA', genre: 'Melodic Techno', role: 'DJ · Live', location: 'Barcelona', plays: '3.1M', shows: '120+', primary: '#06b6d4', secondary: '#0891b2', bg: '#020d10', text: '#e0f2fe', photo: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=600&q=80' },
  { slug: 'kaytro', name: 'KAYTRO', genre: 'House', role: 'Producer', location: 'Montreal', plays: '14M', shows: '290+', primary: '#10b981', secondary: '#059669', bg: '#020d09', text: '#d1fae5', photo: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600&q=80' },
  { slug: 'liora', name: 'LIORA', genre: 'Afro House', role: 'DJ · Vocalist', location: 'Lagos · London', plays: '5.5M', shows: '190+', primary: '#f59e0b', secondary: '#d97706', bg: '#0a0600', text: '#fffbeb', photo: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600&q=80' },
  { slug: 'honey-d', name: 'HONEY D.', genre: 'House · Disco', role: 'DJ', location: 'Chicago · NYC', plays: '9.3M', shows: '400+', primary: '#eab308', secondary: '#ca8a04', bg: '#09090b', text: '#fafafa', photo: 'https://images.unsplash.com/photo-1501386761578-eaa54b616f8a?w=600&q=80' },
  { slug: 'mali-g', name: 'MALI G.', genre: 'House', role: 'DJ', location: 'Melbourne', plays: '4.2M', shows: '180+', primary: '#c084fc', secondary: '#7c3aed', bg: '#08071a', text: '#ede9fe', photo: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=600&q=80' },
  { slug: 'marco-v', name: 'MARCO V.', genre: 'Electronic', role: 'Producer', location: 'Amsterdam', plays: '6.8M', shows: '210+', primary: '#f97316', secondary: '#ea580c', bg: '#0a0400', text: '#ffedd5', photo: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80' },
  { slug: 'vela-drift', name: 'VELA DRIFT', genre: 'Afro House', role: 'Producer', location: 'Nairobi', plays: '62M', shows: '500+', primary: '#f59e0b', secondary: '#d97706', bg: '#080400', text: '#fffbeb', photo: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80' },
  { slug: 'solen', name: 'SOLEN.', genre: 'Melodic Techno', role: 'DJ · Live', location: 'Berlin', plays: '8.1M', shows: '150+', primary: '#a855f7', secondary: '#7c3aed', bg: '#07030f', text: '#f3e8ff', photo: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80' },
  { slug: 'jamie-x', name: 'JAMIE X.', genre: 'House', role: 'DJ · Producer', location: 'London', plays: '12M', shows: '420+', primary: '#f43f5e', secondary: '#e11d48', bg: '#0a0204', text: '#ffe4e6', photo: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&q=80' },
  { slug: 'anais', name: 'ANAÏS', genre: 'Deep House', role: 'DJ · Producer', location: 'Paris · Ibiza', plays: '7.1M', shows: '260+', primary: '#8b5cf6', secondary: '#6d28d9', bg: '#060310', text: '#ede9fe', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80' },
]

function MarqueeCard({ ex }: { ex: typeof EXAMPLES[0] }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex-shrink-0 w-48 h-64 rounded-2xl overflow-hidden cursor-pointer"
      style={{ backgroundColor: ex.bg }}
    >
      <div className="absolute inset-0 transition-transform duration-700 ease-out" style={{ transform: hovered ? 'scale(1.07)' : 'scale(1)' }}>
        <Image src={ex.photo} alt={ex.name} fill className="object-cover" sizes="192px" />
      </div>
      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 20%, ${ex.bg}CC 55%, ${ex.bg}F5 80%, ${ex.bg} 100%)` }} />
      <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(ellipse at top right, ${ex.primary}99, transparent 60%)` }} />
      <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
        <span className="text-[8px] font-mono opacity-25" style={{ color: ex.text }}>artix/{ex.slug}</span>
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: ex.primary }} />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-3.5 flex flex-col gap-1">
        <span className="inline-flex self-start px-2 py-0.5 rounded-full text-[7px] font-mono" style={{ backgroundColor: ex.primary + '22', color: ex.primary, border: `1px solid ${ex.primary}40` }}>{ex.genre.toUpperCase()}</span>
        <p className="font-display font-black text-base leading-tight tracking-tight" style={{ color: ex.text }}>{ex.name}</p>
        <p className="text-[8px] font-mono opacity-35" style={{ color: ex.text }}>{ex.role} · {ex.location}</p>
        <div className="flex gap-3 mt-0.5">
          <div>
            <p className="text-[11px] font-bold" style={{ color: ex.primary }}>{ex.plays}</p>
            <p className="text-[7px] font-mono opacity-25" style={{ color: ex.text }}>plays/mo</p>
          </div>
          <div>
            <p className="text-[11px] font-bold" style={{ color: ex.primary }}>{ex.shows}</p>
            <p className="text-[7px] font-mono opacity-25" style={{ color: ex.text }}>shows/yr</p>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center transition-all duration-200" style={{ opacity: hovered ? 1 : 0, backgroundColor: ex.bg + 'BB', backdropFilter: hovered ? 'blur(4px)' : 'none' }}>
        <div className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-xs font-semibold" style={{ background: `linear-gradient(135deg, ${ex.secondary}, ${ex.primary})` }}>
          Ver presskit <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  )
}

function MarqueeRow({ items, reverse = false }: { items: typeof EXAMPLES; reverse?: boolean }) {
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden w-full" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)' }}>
      <motion.div
        className="flex gap-3"
        animate={{ x: reverse ? [-(items.length * 198), 0] : [0, -(items.length * 198)] }}
        transition={{ repeat: Infinity, duration: items.length * 4.5, ease: 'linear' }}
        style={{ width: 'max-content' }}
      >
        {doubled.map((ex, i) => <MarqueeCard key={`${ex.slug}-${i}`} ex={ex} />)}
      </motion.div>
    </div>
  )
}

// ─── Testimonials ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: 'Mandé mi presskit a 3 festivales la misma semana y en dos días ya tenía respuesta. Antes eso me tomaba un mes armar todo.',
    name: 'Valentina M.',
    role: 'DJ · Buenos Aires',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80',
    color: A1,
  },
  {
    quote: 'Los booking agents ahora me escriben ellos. Tener una URL profesional marca una diferencia enorme — ya no parezco un artista amateur.',
    name: 'Rodrigo K.',
    role: 'Producer · Ciudad de México',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
    color: '#06b6d4',
  },
  {
    quote: 'En 5 minutos tuve algo que se ve mejor que el presskit de artistas con sello discográfico. Completamente alucinante.',
    name: 'Daniela V.',
    role: 'Live Act · Barcelona',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80',
    color: '#f59e0b',
  },
]

// ─── FAQ ───────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: '¿Necesito saber diseño o código?', a: 'Para nada. Respondes unas preguntas, eliges tus colores y listo. El sistema genera el kit animado automáticamente.' },
  { q: '¿Cuánto tarda en estar listo?', a: 'El onboarding toma entre 3 y 7 minutos. Puedes completarlo en menos tiempo si ya tienes tu bio y links a mano.' },
  { q: '¿Mi presskit es único o todos se ven igual?', a: 'Cada kit usa tus propios colores, fotos y layout. Combinando colores, fondo y las 4 estructuras hay miles de combinaciones. Nadie más tendrá exactamente el tuyo.' },
  { q: '¿Puedo actualizar el kit después?', a: 'Sí, cuantas veces quieras. Cambias colores, logros, fotos, links — y la URL sigue siendo la misma.' },
  { q: '¿Puedo capturar leads y hacer email marketing?', a: 'Sí, ARTIX incluye formularios de captura de fans, segmentación por tipo (fans/VIP/bookers/media) y envío de campañas. Lanza música, vende entradas directamente a tu base.' },
  { q: '¿Puedo usar mi propio dominio?', a: 'Sí, en el plan Pro puedes conectar tu propio dominio (ej: press.tunombre.com) con unos pasos simples.' },
  { q: '¿Es seguro? ¿Quién puede ver mi presskit?', a: 'Tú controlas si el kit es público o privado. Puedes compartirlo con un link y mantenerlo oculto del buscador si prefieres.' },
  { q: '¿Funciona para agencias con varios artistas?', a: 'Sí, el plan Agency te da hasta 10 presskits bajo un solo dashboard, ideal para managers y sellos.' },
]

// ─── Plans ─────────────────────────────────────────────────────────────────────
const PLANS = [
  {
    name: 'Starter',
    price: 'Gratis',
    period: 'para siempre',
    desc: 'Para empezar.',
    color: '#6b7280',
    features: ['1 press kit', 'URL artix/tu-nombre', 'Colores y layout personalizados', '4 estructuras de diseño', 'Secciones bio, música y contacto'],
    cta: 'Crear kit gratis',
    href: '/signup',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/ mes',
    desc: '14 días gratis, sin tarjeta.',
    color: A1,
    features: ['Todo de Starter', 'Analíticas en tiempo real', 'Dominio personalizado', 'Fan database + email marketing', 'Venta de entradas directa', 'Badge "Artista Verificado"'],
    cta: 'Empezar 14 días gratis',
    href: '/signup?plan=pro',
    highlight: true,
  },
  {
    name: 'Agency',
    price: '$29',
    period: '/ mes',
    desc: 'Para managers y agencias.',
    color: '#06b6d4',
    features: ['Hasta 10 artistas', 'Todo de Pro', 'Dashboard de agencia', 'Facturación unificada', 'API access', 'SLA garantizado'],
    cta: 'Hablar con ventas',
    href: 'mailto:hola@artix.pro',
    highlight: false,
  },
]

// ─── Recent signups ────────────────────────────────────────────────────────────
const RECENT_SIGNUPS = [
  { initials: 'VM', color: A1 },
  { initials: 'KT', color: '#06b6d4' },
  { initials: 'DV', color: '#f59e0b' },
  { initials: 'AL', color: '#10b981' },
  { initials: 'JM', color: A2 },
  { initials: 'RS', color: '#ef4444' },
]

// ─── Main landing ──────────────────────────────────────────────────────────────
export default function LandingPage() {
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80])

  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showDemo, setShowDemo] = useState(false)
  const [demoIdx, setDemoIdx] = useState(0)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <main className="min-h-screen text-white overflow-x-hidden" style={{ background: BG }}>
      <Aurora />
      <Nav />

      {/* ── HERO ──────────────────────────────────────────── */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative min-h-screen px-5 md:px-8 pt-28 flex flex-col overflow-hidden"
      >
        {/* Grid dots */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle, rgba(168,85,247,0.12) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
        }} />

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-5xl mx-auto text-center flex-1 justify-center pb-8 w-full">
          {/* Badge */}
          <FadeIn delay={0}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono tracking-widest"
              style={{ borderColor: `${A1}40`, color: A2, background: `${A1}0e` }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: A1 }} />
              LA PLATAFORMA DE DJS Y PRODUCTORES
            </div>
          </FadeIn>

          {/* Headline */}
          <FadeIn delay={0.1} y={30}>
            <h1 className="font-display font-black text-[clamp(2.4rem,8vw,5.5rem)] leading-[0.9] tracking-tight">
              Tu presencia digital<br />
              <span className="italic" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                background: `linear-gradient(135deg, #e8ddff 0%, ${A2} 40%, ${A1} 70%, ${A3} 100%)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                al nivel de tu música.
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-base md:text-lg text-white/45 max-w-xl leading-relaxed font-display">
              Web profesional animada, fan database, email marketing y venta directa de entradas.
              Todo en un solo link.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link href="/signup"
                className="group inline-flex items-center gap-2 px-7 py-4 rounded-full font-display font-bold text-base text-white transition-all duration-300 hover:scale-105 w-full sm:w-auto justify-center"
                style={{ background: `linear-gradient(135deg, ${A3}, ${A1})`, boxShadow: `0 0 40px ${A1}40` }}>
                Crear mi kit gratis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => { setDemoIdx(0); setShowDemo(true) }}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/20 text-sm font-display font-medium transition-all duration-300 bg-transparent w-full sm:w-auto justify-center cursor-pointer"
              >
                <Play className="w-4 h-4" /> Ver ejemplos
              </button>
            </div>
          </FadeIn>

          {/* Trust bar */}
          <FadeIn delay={0.4}>
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-5 text-xs text-white/30 font-mono mt-1">
              <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400" /> Sin tarjeta</span>
              <span className="hidden sm:block w-px h-3 bg-white/10" />
              <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400" /> 14 días Pro gratis</span>
              <span className="hidden sm:block w-px h-3 bg-white/10" />
              <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400" /> Listo en 5 min</span>
            </div>
          </FadeIn>
        </div>

        {/* Hero iPhones */}
        <div className="relative z-10 flex justify-center items-start gap-6 md:gap-16 pb-0 mt-4">
          <FadeIn delay={0.5} y={60} className="hidden sm:block">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }} style={{ rotate: -6 }}>
              <IPhoneFrame scale={0.78}>
                <PhonePreskit artist={DEMO_ARTISTS[0]} scale={0.78} />
              </IPhoneFrame>
            </motion.div>
          </FadeIn>
          <FadeIn delay={0.65} y={60}>
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.8 }} style={{ rotate: 0 }}>
              <IPhoneFrame scale={0.92}>
                <PhonePreskit artist={DEMO_ARTISTS[1]} scale={0.92} />
              </IPhoneFrame>
            </motion.div>
          </FadeIn>
          <FadeIn delay={0.5} y={60} className="hidden sm:block">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut', delay: 1.5 }} style={{ rotate: 6 }}>
              <IPhoneFrame scale={0.78}>
                <PhonePreskit artist={DEMO_ARTISTS[2]} scale={0.78} />
              </IPhoneFrame>
            </motion.div>
          </FadeIn>
        </div>
      </motion.section>

      {/* ── SOCIAL PROOF BAR ────────────────────────────────── */}
      <section className="py-10 px-5 md:px-8 border-y border-white/[0.06]">
        <FadeIn>
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-5">
            <div className="flex items-center gap-3">
              <div className="flex">
                {RECENT_SIGNUPS.map((u, i) => (
                  <div key={i} style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${u.color}, ${u.color}88)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 800, color: '#fff',
                    border: `2px solid ${BG}`, marginLeft: i === 0 ? 0 : -8, zIndex: 6 - i, position: 'relative',
                  }}>{u.initials}</div>
                ))}
              </div>
              <p className="text-sm text-white/50 font-display">
                <span className="text-white font-semibold">847 artistas</span> ya tienen su kit publicado
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]" />)}
              </div>
              <span className="text-white font-semibold text-sm">4.9</span>
              <span className="text-white/30 text-xs font-mono">· 312 reseñas verificadas</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {['🌍 Artistas en 23 países', '⚡ Kit listo en ~4 min', '📈 +160 kits nuevos este mes', '🎧 3 de cada 4 reciben respuesta de booking'].map((m) => (
                <span key={m} className="px-3 py-1.5 rounded-full text-xs text-white/45 border border-white/[0.07] font-mono" style={{ background: 'rgba(255,255,255,0.025)' }}>{m}</span>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── PROBLEM — Linktree vs ARTIX ──────────────────────── */}
      <section className="py-20 md:py-28 px-5 md:px-8 border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-4">
            <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: A1 }}>// EL PROBLEMA</p>
            <h2 className="font-display font-black text-[clamp(1.8rem,5vw,3.2rem)] tracking-tight">
              Así se ve la presencia digital<br className="hidden md:block" />
              <span className="text-white/30"> de un artista hoy.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.05} className="text-center mb-14">
            <p className="text-sm text-white/35 font-display">Así debería verse.</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
            {/* Linktree side */}
            <FadeIn delay={0} className="rounded-2xl border border-white/[0.06] overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="p-4 border-b border-white/[0.05] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  </div>
                  <span className="text-[10px] font-mono text-white/25 ml-2">linktr.ee/djfulano</span>
                </div>
                <span className="text-[9px] font-mono text-red-400/70 border border-red-400/25 px-2 py-0.5 rounded-full">GENÉRICO</span>
              </div>
              <div className="p-6 flex flex-col gap-3">
                <div className="w-14 h-14 rounded-full bg-white/10 mx-auto mb-2" />
                <div className="h-3 bg-white/10 rounded w-24 mx-auto" />
                <div className="h-2 bg-white/5 rounded w-16 mx-auto mb-2" />
                {['SoundCloud', 'Instagram', 'Spotify', 'Booking', 'YouTube'].map((l) => (
                  <div key={l} className="w-full h-10 rounded-xl bg-white/[0.06] border border-white/[0.06] flex items-center justify-center">
                    <span className="text-xs text-white/25 font-mono">{l}</span>
                  </div>
                ))}
                <div className="mt-3 pt-3 border-t border-white/[0.05] flex flex-col gap-2">
                  {['✕ Sin foto real ni identidad', '✕ Sin stats de artista', '✕ Sin reproductor de música', '✕ Sin formulario de booking', '✕ Sin analíticas propias', '✕ 0% tus datos — son de Linktree'].map((item) => (
                    <p key={item} className="text-xs text-white/30 font-mono">{item}</p>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* ARTIX side */}
            <FadeIn delay={0.1} className="rounded-2xl overflow-hidden relative" style={{ border: `1px solid ${A1}35`, background: `${A1}06` }}>
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none" style={{ background: `radial-gradient(ellipse, ${A1}15, transparent 70%)`, filter: 'blur(30px)' }} />
              <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: `${A1}20` }}>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  </div>
                  <span className="text-[10px] font-mono ml-2" style={{ color: `${A2}80` }}>artix/djfulano</span>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full" style={{ color: A2, borderColor: `${A1}40`, border: `1px solid ${A1}40`, background: `${A1}15` }}>★ PREMIUM</span>
              </div>
              <div className="p-6 flex flex-col gap-3">
                {/* Mini artist card */}
                <div className="rounded-xl overflow-hidden h-32 relative mb-1" style={{ background: '#07030f' }}>
                  <Image src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80" alt="Artist" fill className="object-cover opacity-50" sizes="400px" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to right, #07030fCC, transparent)` }} />
                  <div className="absolute inset-0 p-4 flex items-end">
                    <div>
                      <div className="font-display font-black text-lg text-white leading-none">SOLEN.</div>
                      <div className="text-[10px] font-mono text-white/40 mt-0.5">DJ & Live Act · Berlin</div>
                    </div>
                    <div className="ml-auto flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: `${A1}20`, border: `1px solid ${A1}40` }}>
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: A1 }} />
                      <span className="text-[9px] font-mono" style={{ color: A1 }}>LIVE</span>
                    </div>
                  </div>
                </div>
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2">
                  {[['8.1M', 'Monthly'], ['58', 'Países'], ['#12', 'DJ Mag']].map(([v, l]) => (
                    <div key={l} className="rounded-lg p-2.5 text-center" style={{ background: `${A1}10`, border: `1px solid ${A1}20` }}>
                      <div className="font-display font-black text-sm text-white">{v}</div>
                      <div className="text-[9px] font-mono text-white/35">{l}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  {['✓ Foto editorial + identidad visual única', '✓ Stats en vivo de tus plataformas', '✓ Reproductor embebido', '✓ Formulario de booking integrado', '✓ Analíticas en tiempo real', '✓ 100% tus datos — para siempre'].map((item) => (
                    <p key={item} className="text-xs font-mono" style={{ color: `${A2}CC` }}>{item}</p>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Metrics row */}
          <FadeIn delay={0.2} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[['×3', 'más bookings', A1], ['×7', 'conversión vs linktree', '#06b6d4'], ['0%', 'dependencia de terceros', '#10b981'], ['100%', 'tus datos, siempre', '#f59e0b']].map(([v, l, c]) => (
              <div key={l} className="rounded-xl p-4 text-center border border-white/[0.05]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="font-display font-black text-2xl md:text-3xl" style={{ color: c as string }}>{v}</div>
                <div className="text-[11px] font-mono text-white/35 mt-1">{l}</div>
              </div>
            ))}
          </FadeIn>
        </div>
      </section>

      {/* ── TRANSFORMATION — Artist profiles ─────────────────── */}
      <section id="ejemplos" className="py-20 md:py-28 px-5 md:px-8 border-b border-white/[0.06] overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-4">
            <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: A1 }}>// PRESETS EN VIVO</p>
            <h2 className="font-display font-black text-[clamp(1.8rem,5vw,3.2rem)] tracking-tight">
              Así se ve un presskit<br />
              <span className="text-white/30">hecho con ARTIX.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.05} className="text-center mb-14">
            <p className="text-sm text-white/35 font-display">Cada uno, único. Click para ver el presskit completo.</p>
          </FadeIn>

          <div className="flex items-end justify-center gap-4 md:gap-10" style={{ perspective: '1400px' }}>
            <FadeIn delay={0.1} y={40} className="hidden sm:block">
              <a href="/francisco-allendes" className="group block" style={{ transform: 'rotateY(16deg) translateZ(-50px)', transformStyle: 'preserve-3d' }}>
                <div className="mb-3 text-center opacity-60 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-mono tracking-widest" style={{ color: A2 }}>F. ALLENDES · Tech House</span>
                </div>
                <motion.div whileHover={{ scale: 1.04, rotateY: 8 }} transition={{ duration: 0.3 }} style={{ transformStyle: 'preserve-3d' }}>
                  <IPhoneFrame scale={0.8}>
                    <PhonePreskit artist={DEMO_ARTISTS[0]} scale={0.8} />
                  </IPhoneFrame>
                </motion.div>
                <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-mono text-white/40 border border-white/10 px-3 py-1 rounded-full">Ver presskit →</span>
                </div>
              </a>
            </FadeIn>

            <FadeIn delay={0.05} y={20}>
              <a href="/francisco-allendes" className="group block relative" style={{ transform: 'translateZ(40px)', transformStyle: 'preserve-3d', zIndex: 10 }}>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full text-[10px] font-mono font-black text-black tracking-wider" style={{ background: A1 }}>
                  ⭐ FEATURED
                </div>
                <div className="mb-3 text-center">
                  <span className="text-[10px] font-mono tracking-widest" style={{ color: A2 }}>SOLEN. · Melodic Techno</span>
                </div>
                <motion.div whileHover={{ scale: 1.04, y: -6 }} transition={{ duration: 0.3 }}
                  style={{ filter: `drop-shadow(0 0 40px ${A1}55)` }}>
                  <IPhoneFrame scale={0.95}>
                    <PhonePreskit artist={DEMO_ARTISTS[1]} scale={0.95} />
                  </IPhoneFrame>
                </motion.div>
                <div className="mt-4 text-center">
                  <span className="text-xs font-mono border px-3 py-1 rounded-full group-hover:opacity-80 transition-colors" style={{ color: A1, borderColor: `${A1}40` }}>Ver presskit →</span>
                </div>
              </a>
            </FadeIn>

            <FadeIn delay={0.15} y={40} className="hidden sm:block">
              <a href="/francisco-allendes" className="group block" style={{ transform: 'rotateY(-16deg) translateZ(-50px)', transformStyle: 'preserve-3d' }}>
                <div className="mb-3 text-center opacity-60 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-mono tracking-widest" style={{ color: '#f59e0b' }}>VELA DRIFT · Afro House</span>
                </div>
                <motion.div whileHover={{ scale: 1.04, rotateY: -8 }} transition={{ duration: 0.3 }} style={{ transformStyle: 'preserve-3d' }}>
                  <IPhoneFrame scale={0.8}>
                    <PhonePreskit artist={DEMO_ARTISTS[2]} scale={0.8} />
                  </IPhoneFrame>
                </motion.div>
                <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-mono text-white/40 border border-white/10 px-3 py-1 rounded-full">Ver presskit →</span>
                </div>
              </a>
            </FadeIn>
          </div>

          <FadeIn delay={0.3} className="flex justify-center mt-12">
            <Link href="/signup"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full border text-sm font-display font-semibold hover:scale-105 transition-all"
              style={{ borderColor: `${A1}40`, color: A2, background: `${A1}0e` }}>
              Crear el mío — es gratis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── MARQUEE GALLERY ───────────────────────────────────── */}
      <section className="py-20 border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-5 md:px-8 mb-10">
          <FadeIn>
            <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: A1 }}>// cada kit es único</p>
          </FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <FadeIn delay={0.05}>
              <h2 className="font-display font-black text-[clamp(2rem,5vw,3rem)] tracking-tight leading-none">
                Ninguno igual<br />
                <span className="text-white/25">al tuyo.</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-white/35 text-sm max-w-xs leading-relaxed font-display">
                Colores propios, foto real, layout elegido por ti. El sistema genera una identidad que no puede tener nadie más.
              </p>
            </FadeIn>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <MarqueeRow items={EXAMPLES} />
          <MarqueeRow items={[...EXAMPLES.slice(6), ...EXAMPLES.slice(0, 6)]} reverse />
        </div>
      </section>

      {/* ── MONETIZE — De un email a un sold out ─────────────── */}
      <section className="py-20 md:py-28 px-5 md:px-8 border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-4">
            <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: A1 }}>// MONETIZA CON TUS FANS</p>
            <h2 className="font-display font-black text-[clamp(1.8rem,5vw,3.2rem)] tracking-tight">
              De un email<br />
              <span className="italic" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                background: `linear-gradient(135deg, ${A2}, ${A1})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                a un sold out.
              </span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.05} className="text-center mb-14">
            <p className="text-sm text-white/35 font-display max-w-lg mx-auto">
              Captura leads en tu presskit, segmenta tu audiencia con IA y lanza directamente a quienes sí van a comprar.
            </p>
          </FadeIn>

          {/* Flow steps */}
          <FadeIn delay={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            {[
              { n: '01', icon: Mail, label: 'Captura', desc: 'Fans dejan su email en tu presskit', color: A1 },
              { n: '02', icon: Database, label: 'Segmenta', desc: 'IA clasifica: fans / VIP / bookers / media', color: '#06b6d4' },
              { n: '03', icon: Music, label: 'Lanza', desc: 'Envía música, entradas o contenido exclusivo', color: '#10b981' },
              { n: '04', icon: TrendingUp, label: 'Convierte', desc: 'Venta directa, 0% comisión', color: '#f59e0b' },
            ].map((step, i) => (
              <div key={step.n} className="relative">
                {i < 3 && <div className="absolute top-8 left-[calc(100%+8px)] w-4 h-px hidden md:block" style={{ background: `linear-gradient(to right, ${step.color}60, transparent)` }} />}
                <div className="rounded-2xl p-5 border border-white/[0.06] h-full" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${step.color}15`, border: `1px solid ${step.color}30` }}>
                    <step.icon className="w-5 h-5" style={{ color: step.color }} />
                  </div>
                  <span className="text-[10px] font-mono text-white/20">{step.n}</span>
                  <h3 className="font-display font-black text-base text-white mt-0.5 mb-1">{step.label}</h3>
                  <p className="text-xs text-white/40 leading-relaxed font-display">{step.desc}</p>
                </div>
              </div>
            ))}
          </FadeIn>

          {/* Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Ticket,
                title: 'Venta directa de entradas',
                color: A1,
                visual: (
                  <div className="rounded-xl overflow-hidden border mt-3" style={{ borderColor: `${A1}25`, background: `${A1}08` }}>
                    <div className="p-3 flex items-center justify-between border-b" style={{ borderColor: `${A1}15` }}>
                      <span className="text-[9px] font-mono" style={{ color: A2 }}>Berghain · 28 Jun</span>
                      <span className="text-[9px] font-mono text-green-400">740 vendidas</span>
                    </div>
                    <div className="p-3 flex gap-2 items-center">
                      <div className="w-8 h-14 rounded border border-dashed flex items-center justify-center" style={{ borderColor: `${A1}40` }}>
                        <span style={{ fontSize: 10, color: A2 }}>QR</span>
                      </div>
                      <div className="flex-1">
                        <div className="h-2 rounded mb-1.5" style={{ background: `${A1}40`, width: '80%' }} />
                        <div className="h-1.5 rounded mb-1" style={{ background: `${A1}20`, width: '60%' }} />
                        <div className="h-1.5 rounded" style={{ background: `${A1}20`, width: '45%' }} />
                      </div>
                    </div>
                    <div className="px-3 pb-3">
                      <div className="text-[9px] font-mono text-white/25">0% comisión · €18,240 generados</div>
                    </div>
                  </div>
                ),
              },
              {
                icon: Music,
                title: 'Lanzamiento de música',
                color: '#06b6d4',
                visual: (
                  <div className="rounded-xl overflow-hidden border mt-3" style={{ borderColor: '#06b6d420', background: '#06b6d408' }}>
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: '#06b6d415' }}>🎵</div>
                        <div>
                          <div className="text-[9px] font-mono text-white/60">EP · Early Access</div>
                          <div className="text-[9px] font-mono" style={{ color: '#06b6d4' }}>2,340 pre-saves</div>
                        </div>
                      </div>
                      {[['Pre-saves', 84], ['Early access', 62], ['Bundle', 38]].map(([l, v]) => (
                        <div key={l as string} className="mb-1.5">
                          <div className="flex justify-between text-[8px] font-mono text-white/30 mb-0.5">
                            <span>{l}</span><span>{v}%</span>
                          </div>
                          <div className="h-1 rounded-full bg-white/10">
                            <div className="h-full rounded-full" style={{ width: `${v}%`, background: '#06b6d4' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                icon: Database,
                title: 'Base de datos 100% tuya',
                color: '#10b981',
                visual: (
                  <div className="rounded-xl overflow-hidden border mt-3" style={{ borderColor: '#10b98120', background: '#10b98108' }}>
                    <div className="p-3">
                      <div className="text-[8px] font-mono text-white/25 mb-2">fans_database.csv</div>
                      {['fans (1,240)', 'VIP (89)', 'bookers (34)', 'media (12)'].map((row, i) => (
                        <div key={row} className="flex items-center justify-between py-1 border-b border-white/[0.05]">
                          <span className="text-[9px] font-mono text-white/40">{row}</span>
                          <span className="text-[8px] px-1.5 py-0.5 rounded font-mono" style={{ background: '#10b98115', color: '#10b981' }}>{['GDPR', 'CSV', 'API', 'API'][i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                icon: TrendingUp,
                title: 'Re-engagement IA',
                color: '#f59e0b',
                visual: (
                  <div className="rounded-xl overflow-hidden border mt-3" style={{ borderColor: '#f59e0b20', background: '#f59e0b08' }}>
                    <div className="p-3">
                      <svg viewBox="0 0 80 40" className="w-full" style={{ height: 40 }}>
                        <polyline points="0,35 15,30 30,25 45,15 60,10 80,5" fill="none" stroke="#f59e0b" strokeWidth="2" />
                        <polyline points="0,35 15,30 30,25 45,15 60,10 80,5" fill="url(#gf)" strokeWidth="0" />
                        <defs>
                          <linearGradient id="gf" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" stopColor="#f59e0b" stopOpacity="0.3" />
                            <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <polygon points="0,35 15,30 30,25 45,15 60,10 80,5 80,40 0,40" fill="url(#gf)" />
                      </svg>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[8px] font-mono text-white/25">inactivos → activos</span>
                        <span className="text-[9px] font-mono" style={{ color: '#f59e0b' }}>+67%</span>
                      </div>
                    </div>
                  </div>
                ),
              },
            ].map((pillar) => (
              <FadeIn key={pillar.title} className="rounded-2xl p-5 border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${pillar.color}15`, border: `1px solid ${pillar.color}30` }}>
                  <pillar.icon className="w-4.5 h-4.5" style={{ color: pillar.color }} />
                </div>
                <h3 className="font-display font-black text-sm text-white mt-3 mb-0">{pillar.title}</h3>
                {pillar.visual}
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-5 md:px-8 border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-14">
            <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: A1 }}>// CÓMO FUNCIONA</p>
            <h2 className="font-display font-black text-[clamp(1.8rem,5vw,3.2rem)] tracking-tight">
              5 minutos. Un kit que<br />nadie más puede tener.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { n: '01', title: 'Cuéntanos quién eres', desc: 'Nombre artístico, rol, género, bio y logros. Las preguntas guían — no necesitas saber qué escribir.', icon: '🎤' },
              { n: '02', title: 'Elige tu estilo', desc: 'Color picker libre o paletas de inspiración. Fondo oscuro o claro. 4 estructuras visuales distintas.', icon: '🎨' },
              { n: '03', title: 'Publica y comparte', desc: 'Tu kit queda en artix/tu-nombre con animaciones, reproductor y botón de booking.', icon: '🚀' },
            ].map((s, i) => (
              <FadeIn key={s.n} delay={i * 0.08}
                className="group p-6 rounded-2xl border border-white/[0.06] hover:-translate-y-1 transition-all duration-300 cursor-default"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="text-3xl mb-4">{s.icon}</div>
                <span className="font-mono text-xs text-white/20 tracking-widest">{s.n}</span>
                <h3 className="font-display font-black text-base tracking-tight mt-1 mb-2 text-white">{s.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed font-display">{s.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section id="features" className="py-20 md:py-28 px-5 md:px-8 border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-14">
            <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: A1 }}>// CARACTERÍSTICAS</p>
            <h2 className="font-display font-black text-[clamp(1.8rem,5vw,3.2rem)] tracking-tight">
              Todo lo que un booking agent<br />quiere ver.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Palette, title: 'Colores 100% tuyos', desc: 'Color picker libre + 10 paletas de inspiración. Tu marca, no una plantilla.' },
              { icon: Layout, title: '4 layouts distintos', desc: 'Centrado, Editorial, Split y Raw. Cada uno crea una jerarquía visual completamente diferente.' },
              { icon: Globe, title: 'URL permanente', desc: 'artix/tu-nombre — comparte en una línea con booking agents, festivales y prensa.' },
              { icon: BarChart3, title: 'Analíticas reales', desc: 'Visitas, clics en contacto, reproducciones de música. Sabes quién revisa tu kit.' },
              { icon: Zap, title: 'Animaciones incluidas', desc: 'Waveform, count-up de stats, parallax, galería y lightbox. Sin configurar nada.' },
              { icon: Lock, title: 'Siempre editable', desc: 'Cambia colores, fotos o logros cuando quieras. La URL nunca cambia.' },
            ].map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.05}
                className="group p-5 rounded-2xl border border-white/[0.06] hover:-translate-y-0.5 transition-all duration-200 cursor-default"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ background: `${A1}12`, border: `1px solid ${A1}25` }}>
                  <f.icon className="w-4 h-4" style={{ color: A1 }} />
                </div>
                <h3 className="font-display font-bold text-sm text-white mb-1.5">{f.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed font-display">{f.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-5 md:px-8 border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-14">
            <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: A1 }}>// LO QUE DICEN</p>
            <h2 className="font-display font-black text-[clamp(1.8rem,5vw,3.2rem)] tracking-tight">
              Artistas que ya usan<br />ARTIX.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.1}
                className="group p-6 rounded-2xl border border-white/[0.06] hover:border-white/[0.12] hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-current" style={{ color: t.color }} />)}
                </div>
                <p className="text-sm text-white/65 leading-relaxed flex-1 font-display">&quot;{t.quote}&quot;</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
                  <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border" style={{ borderColor: t.color + '44' }}>
                    <Image src={t.avatar} alt={t.name} width={36} height={36} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <p className="text-sm font-display font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/35 font-mono">{t.role}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR WHO ────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-5 md:px-8 border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-14">
            <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: A1 }}>// PARA QUIÉN</p>
            <h2 className="font-display font-black text-[clamp(1.8rem,5vw,3.2rem)] tracking-tight">
              Si eres artista,<br />
              <span className="text-white/30">ARTIX es para ti.</span>
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'DJs', emoji: '🎧', metric: '×3', metricLabel: 'más bookings', bullets: ['Press kit de nivel mundial en 5 min', 'Rider técnico incluido', 'Formulario de booking directo', 'Gestión de shows con leads'], color: A1 },
              { label: 'Productores', emoji: '🎛️', metric: '+61%', metricLabel: 'más pre-saves', bullets: ['Releases con countdown y pre-save', 'Player embebido de tus tracks', 'Campaña de lanzamiento a tu base', 'Press release con IA'], color: '#06b6d4' },
              { label: 'Emergentes', emoji: '🚀', metric: '3 min', metricLabel: 'para estar live', bullets: ['Onboarding guiado paso a paso', 'Plantillas para artistas sin fotos aún', 'Plan gratis para empezar', 'Primeros fans con formulario integrado'], color: '#10b981' },
              { label: 'Managers / Agencias', emoji: '🏢', metric: '10', metricLabel: 'artistas bajo uno', bullets: ['Dashboard unificado de artistas', 'Kits diferenciados por artista', 'Analíticas cruzadas', 'Facturación unificada'], color: '#f59e0b' },
            ].map((who, i) => (
              <FadeIn key={who.label} delay={i * 0.08}
                className="p-6 rounded-2xl border border-white/[0.06] hover:-translate-y-0.5 transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{who.emoji}</span>
                    <h3 className="font-display font-black text-lg text-white">{who.label}</h3>
                  </div>
                  <div className="text-right">
                    <div className="font-display font-black text-xl" style={{ color: who.color }}>{who.metric}</div>
                    <div className="text-[10px] font-mono text-white/30">{who.metricLabel}</div>
                  </div>
                </div>
                <ul className="flex flex-col gap-2">
                  {who.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-white/50 font-display">
                      <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: who.color }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────── */}
      <section id="precios" className="py-20 md:py-28 px-5 md:px-8 border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-4">
            <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: A1 }}>// PRECIOS</p>
            <h2 className="font-display font-black text-[clamp(1.8rem,5vw,3.2rem)] tracking-tight">Simple y transparente.</h2>
          </FadeIn>
          <FadeIn delay={0.05} className="text-center mb-12">
            <p className="text-sm text-white/35 font-display">Un diseñador te cobra $300–$800 por un PDF estático.{' '}
              <span className="text-white/60">Aquí lo tienes por $12/mes — animado, con fan database y analíticas.</span>
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 0.08}
                className={`relative flex flex-col p-6 rounded-2xl border transition-all hover:-translate-y-1 duration-300 ${
                  plan.highlight ? '' : 'border-white/[0.06]'
                }`}
                style={plan.highlight ? { borderColor: `${A1}50`, background: `${A1}06` } : { background: 'rgba(255,255,255,0.02)' }}>
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-white tracking-wider uppercase" style={{ background: `linear-gradient(135deg, ${A3}, ${A1})` }}>
                    Más popular
                  </div>
                )}
                <div className="mb-5">
                  <p className="text-[10px] font-mono tracking-widest uppercase mb-1.5" style={{ color: plan.color }}>{plan.name}</p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="font-display font-black text-4xl tracking-tighter text-white">{plan.price}</span>
                    <span className="text-sm text-white/30">{plan.period}</span>
                  </div>
                  <p className="text-xs text-white/35 font-mono">{plan.desc}</p>
                </div>
                <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/60 font-display">
                      <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: plan.color }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}
                  className="w-full py-3 rounded-xl text-center text-sm font-display font-bold transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    background: plan.highlight ? `linear-gradient(135deg, ${A3}, ${A1})` : 'transparent',
                    color: plan.highlight ? '#fff' : plan.color,
                    border: plan.highlight ? 'none' : `1px solid ${plan.color}50`,
                  }}>
                  {plan.cta}
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section id="faq" className="py-20 md:py-28 px-5 md:px-8 border-b border-white/[0.06]">
        <div className="max-w-2xl mx-auto">
          <FadeIn className="text-center mb-12">
            <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: A1 }}>// PREGUNTAS</p>
            <h2 className="font-display font-black text-[clamp(1.8rem,5vw,3.2rem)] tracking-tight">Preguntas frecuentes.</h2>
          </FadeIn>
          <div className="flex flex-col gap-2">
            {FAQS.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.03}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 rounded-2xl border border-white/[0.06] hover:border-white/[0.10] hover:bg-white/[0.03] transition-all duration-200 text-left cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <span className="font-display font-semibold text-sm text-white/80">{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
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
                      className="overflow-hidden">
                      <p className="px-5 pb-5 pt-1 text-sm text-white/45 leading-relaxed font-display">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ──────────────────────────────────────────── */}
      <section className="py-28 md:py-40 px-5 md:px-8 text-center">
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
            style={{ background: `radial-gradient(ellipse, ${A1}12, transparent 70%)`, filter: 'blur(60px)' }} />
          <FadeIn className="relative z-10">
            <p className="text-xs font-mono tracking-widest uppercase mb-5" style={{ color: A1 }}>// EMPIEZA HOY</p>
            <h2 className="font-display font-black text-[clamp(2.2rem,6vw,4rem)] tracking-tight mb-4 leading-tight">
              Tu sonido merece<br />
              <span className="italic" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                background: `linear-gradient(135deg, #e8ddff, ${A2}, ${A1})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                un kit a su altura.
              </span>
            </h2>
            <p className="text-white/40 mb-8 text-base font-display">Gratis para empezar. Sin tarjeta. Listo en 5 minutos.</p>

            {/* Email form */}
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-5">
                  <input
                    type="email" required placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-full bg-white/[0.06] border border-white/[0.12] text-white placeholder-white/25 text-sm font-mono outline-none focus:border-white/25 transition-colors"
                  />
                  <button type="submit"
                    className="px-7 py-3 rounded-full font-display font-bold text-sm text-white transition-all duration-300 hover:scale-105 shrink-0"
                    style={{ background: `linear-gradient(135deg, ${A3}, ${A1})`, boxShadow: `0 0 30px ${A1}40` }}>
                    Unirse al early access →
                  </button>
                </motion.form>
              ) : (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-3 px-6 py-4 rounded-full border mb-5 max-w-md mx-auto"
                  style={{ borderColor: `${A1}40`, background: `${A1}10` }}>
                  <Check className="w-4 h-4" style={{ color: A1 }} />
                  <span className="text-sm font-display font-semibold" style={{ color: A2 }}>¡Listo! Te avisamos cuando tengas acceso.</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-5 text-xs text-white/25 font-mono">
              <span className="flex items-center gap-1"><Check className="w-3 h-3 text-emerald-400" /> Sin tarjeta</span>
              <span className="flex items-center gap-1"><Check className="w-3 h-3 text-emerald-400" /> 14 días Pro gratis</span>
              <span className="flex items-center gap-1"><Check className="w-3 h-3 text-emerald-400" /> Cancela cuando quieras</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="py-8 px-5 md:px-8 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <LogoMark size={20} />
            <span className="font-display font-bold text-sm tracking-[0.2em] text-white/30">ARTIX</span>
          </div>
          <p className="text-white/20 text-xs font-mono text-center">© 2026 ARTIX — Cada artista, un kit único</p>
          <div className="flex gap-4 text-xs text-white/20 font-mono">
            <a href="#" className="hover:text-white/50 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white/50 transition-colors">Términos</a>
            <Link href="/login" className="hover:text-white/50 transition-colors">Login</Link>
          </div>
        </div>
      </footer>

      {/* ── DEMO MODAL ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-5"
            style={{ background: 'rgba(2,1,8,0.95)', backdropFilter: 'blur(30px)' }}
            onClick={() => setShowDemo(false)}>
            <button onClick={() => setShowDemo(false)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full border border-white/[0.1] flex items-center justify-center transition-all hover:bg-white/[0.08]">
              <X className="w-4 h-4 text-white/60" />
            </button>
            <motion.div
              initial={{ scale: 0.88, y: 28, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.88, y: 28, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={e => e.stopPropagation()}
              className="flex flex-col items-center gap-5">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.10]" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-white/40">artix/{DEMO_ARTISTS[demoIdx].slug}</span>
              </div>
              <motion.div key={demoIdx} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }}>
                <IPhoneFrame scale={1.25}>
                  <PhonePreskit artist={DEMO_ARTISTS[demoIdx]} scale={1.25} />
                </IPhoneFrame>
              </motion.div>
              <div className="flex items-center gap-3">
                {DEMO_ARTISTS.map((a, i) => (
                  <button key={a.slug} onClick={() => setDemoIdx(i)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
                    style={{
                      background: demoIdx === i ? `${a.accentColor}20` : 'transparent',
                      border: `1px solid ${demoIdx === i ? a.accentColor + '55' : 'rgba(255,255,255,0.1)'}`,
                    }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: a.accentColor }} />
                    <span className="text-xs font-mono" style={{ color: demoIdx === i ? a.accentColor : 'rgba(255,255,255,0.3)' }}>{a.name}</span>
                  </button>
                ))}
              </div>
              <Link href="/signup" onClick={() => setShowDemo(false)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-display font-bold text-sm text-white transition-all hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${A3}, ${A1})`, boxShadow: `0 0 30px ${A1}40` }}>
                Crear el mío gratis <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
