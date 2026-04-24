'use client'
import { useState, useRef } from 'react'
import {
  Camera, GripVertical, Check, Save, Upload, Play, Pause,
  Image as ImageIcon, Film, Music, Trash2, Plus, Eye, EyeOff,
  Sparkles, Zap, Layers, Type, Palette, LayoutGrid, Settings2,
  Move, RefreshCw, ChevronDown
} from 'lucide-react'

type Tab = 'identidad' | 'medios' | 'colores' | 'animaciones' | 'efectos' | 'layout' | 'secciones' | 'tipografia'

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'identidad', label: 'Identidad', icon: Settings2 },
  { id: 'medios', label: 'Medios', icon: ImageIcon },
  { id: 'colores', label: 'Colores', icon: Palette },
  { id: 'animaciones', label: 'Animaciones', icon: Sparkles },
  { id: 'efectos', label: 'Efectos', icon: Layers },
  { id: 'layout', label: 'Layout', icon: LayoutGrid },
  { id: 'secciones', label: 'Secciones', icon: GripVertical },
  { id: 'tipografia', label: 'Tipografía', icon: Type },
]

const ROLES = ['DJ', 'Producer', 'Live Act', 'Band', 'Vocalist', 'Duo', 'Collective']
const GENRES = [
  'Techno', 'House', 'Melodic Techno', 'Afro House', 'Minimal',
  'Ambient', 'Drum & Bass', 'Jungle', 'Afrobeats', 'Reggaeton',
  'Hip-Hop', 'Electronic', 'Disco', 'Funk', 'Soul', 'Industrial',
]

const COLOR_PRESETS = [
  { name: 'Magenta', a: '#C026D3', b: '#7C3AED' },
  { name: 'Neon Cyan', a: '#00E5FF', b: '#0EA5E9' },
  { name: 'Amber Fire', a: '#F59E0B', b: '#EA580C' },
  { name: 'Emerald', a: '#10B981', b: '#0D9488' },
  { name: 'Red Hot', a: '#EF4444', b: '#EC4899' },
  { name: 'Arctic', a: '#F8FAFC', b: '#94A3B8' },
  { name: 'Ultraviolet', a: '#8B5CF6', b: '#6366F1' },
  { name: 'Sunset', a: '#F97316', b: '#FBBF24' },
  { name: 'Teal', a: '#06B6D4', b: '#14B8A6' },
  { name: 'Fuchsia', a: '#D946EF', b: '#A855F7' },
  { name: 'Lime', a: '#84CC16', b: '#22C55E' },
  { name: 'Coral', a: '#FB923C', b: '#F43F5E' },
  { name: 'Gold', a: '#EAB308', b: '#F59E0B' },
  { name: 'Lavender', a: '#A78BFA', b: '#818CF8' },
  { name: 'Rose', a: '#F43F5E', b: '#FB7185' },
  { name: 'Mint', a: '#34D399', b: '#6EE7B7' },
]

const LAYOUTS = [
  { id: 'centrado', label: 'Centrado', desc: 'Todo centrado, máximo impacto' },
  { id: 'editorial', label: 'Editorial', desc: 'Estilo revista de lujo' },
  { id: 'split', label: 'Split', desc: 'Foto a la izquierda, contenido derecho' },
  { id: 'raw', label: 'Raw', desc: 'Tipografía grande y cruda' },
  { id: 'minimal', label: 'Minimal', desc: 'Clean, espacio en blanco' },
  { id: 'cinematic', label: 'Cinematic', desc: 'Full-bleed foto con overlay' },
]

const SECTIONS = [
  { id: 'bio', label: 'Biografía', desc: 'Tu historia artística' },
  { id: 'musica', label: 'Música', desc: 'Tracks y discografía' },
  { id: 'galeria', label: 'Galería', desc: 'Fotos en vivo y promo' },
  { id: 'stats', label: 'Estadísticas', desc: 'Plays, shows, países' },
  { id: 'logros', label: 'Logros', desc: 'Premios y menciones' },
  { id: 'prensa', label: 'Prensa', desc: 'Artículos y reviews' },
  { id: 'rider', label: 'Rider técnico', desc: 'Equipo y requerimientos' },
  { id: 'contacto', label: 'Contacto', desc: 'Formulario de booking' },
  { id: 'booking', label: 'Booking CTA', desc: 'Botón de acción principal' },
  { id: 'videos', label: 'Videos', desc: 'YouTube / mixtapes' },
]

const FONTS = [
  { id: 'inter', name: 'Inter', sample: 'Aa' },
  { id: 'space-grotesk', name: 'Space Grotesk', sample: 'Aa' },
  { id: 'syne', name: 'Syne', sample: 'Aa' },
  { id: 'dm-sans', name: 'DM Sans', sample: 'Aa' },
  { id: 'clash', name: 'Clash Display', sample: 'Aa' },
  { id: 'cabinet', name: 'Cabinet Grotesk', sample: 'Aa' },
  { id: 'satoshi', name: 'Satoshi', sample: 'Aa' },
]

const ENTRANCE_ANIMATIONS = [
  { id: 'fade', label: 'Fade In', icon: '○' },
  { id: 'slide-up', label: 'Slide Up', icon: '↑' },
  { id: 'slide-left', label: 'Slide Left', icon: '←' },
  { id: 'zoom', label: 'Zoom In', icon: '⊕' },
  { id: 'blur', label: 'Blur In', icon: '◎' },
  { id: 'bounce', label: 'Bounce', icon: '⇅' },
]

const SCROLL_EFFECTS = [
  { id: 'none', label: 'Ninguno' },
  { id: 'parallax', label: 'Parallax' },
  { id: 'reveal', label: 'Reveal' },
  { id: 'sticky', label: 'Sticky' },
  { id: 'fade-out', label: 'Fade Out' },
]

const HOVER_EFFECTS = [
  { id: 'none', label: 'Ninguno' },
  { id: 'glow', label: 'Glow' },
  { id: 'lift', label: 'Lift' },
  { id: 'scale', label: 'Scale' },
  { id: 'tilt', label: 'Tilt 3D' },
  { id: 'ripple', label: 'Ripple' },
]

const BG_EFFECTS = [
  { id: 'none', label: 'Ninguno', desc: 'Fondo liso' },
  { id: 'particles', label: 'Partículas', desc: 'Puntos flotantes' },
  { id: 'gradient-flow', label: 'Gradiente Vivo', desc: 'Colores que fluyen' },
  { id: 'aurora', label: 'Aurora', desc: 'Efecto aurora boreal' },
  { id: 'grid', label: 'Grid', desc: 'Cuadrícula sutil' },
  { id: 'noise', label: 'Noise', desc: 'Textura granulada' },
  { id: 'bokeh', label: 'Bokeh', desc: 'Luces desenfocadas' },
  { id: 'dots', label: 'Puntos', desc: 'Patrón de puntos' },
]

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-all duration-200 ${value ? 'bg-[#C026D3]' : 'bg-white/10'}`}
    >
      <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}

function SliderInput({ value, onChange, min = 0, max = 100, label }: { value: number; onChange: (v: number) => void; min?: number; max?: number; label?: string }) {
  return (
    <div className="flex items-center gap-3">
      {label && <span className="text-xs text-white/40 font-mono w-24 shrink-0">{label}</span>}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 h-1.5 rounded-full appearance-none bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C026D3] [&::-webkit-slider-thumb]:cursor-pointer accent-[#C026D3]"
      />
      <span className="text-xs font-mono text-white/40 w-8 text-right">{value}</span>
    </div>
  )
}

function SectionCard({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="border border-white/[0.06] bg-white/[0.02] rounded-2xl p-5 flex flex-col gap-4">
      {title && <h3 className="font-black tracking-tighter text-sm text-white/80 uppercase tracking-widest">{title}</h3>}
      {children}
    </div>
  )
}

// ─── Live iPhone Preview ──────────────────────────────────────────────────────
function LiveIPhonePreview({ primary, secondary, darkBg, font, bgEffect, grain }: {
  primary: string; secondary: string; darkBg: boolean; font: string; bgEffect: string; grain: number
}) {
  const bg = darkBg ? '#07070B' : '#F0F0F5'
  const textColor = darkBg ? '#ffffff' : '#0D0D12'
  const s = 0.78

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      {/* iPhone shell */}
      <div style={{
        position: 'relative',
        width: 220 * s,
        height: 460 * s,
        borderRadius: 44 * s,
        background: 'linear-gradient(160deg, #2e2e2e 0%, #1a1a1a 100%)',
        border: `${1.5 * s}px solid rgba(255,255,255,0.13)`,
        boxShadow: `0 0 0 ${1 * s}px rgba(0,0,0,0.7), 0 ${40 * s}px ${80 * s}px rgba(0,0,0,0.75), inset 0 ${1 * s}px 0 rgba(255,255,255,0.1)`,
        padding: 9 * s,
        flexShrink: 0,
      }}>
        {/* Dynamic Island */}
        <div style={{ position: 'absolute', top: 13 * s, left: '50%', transform: 'translateX(-50%)', width: 78 * s, height: 19 * s, borderRadius: 100, background: '#000', zIndex: 30 }} />
        {/* Buttons */}
        <div style={{ position: 'absolute', right: -2, top: 100 * s, width: 3 * s, height: 56 * s, borderRadius: '0 3px 3px 0', background: '#252525' }} />
        <div style={{ position: 'absolute', left: -2, top: 90 * s, width: 3 * s, height: 30 * s, borderRadius: '3px 0 0 3px', background: '#252525' }} />
        {/* Screen */}
        <div style={{ width: '100%', height: '100%', borderRadius: 37 * s, overflow: 'hidden', position: 'relative', background: bg }}>
          {/* BG Effect layer */}
          {bgEffect === 'gradient-flow' && (
            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 30% 20%, ${primary}30, transparent 60%), radial-gradient(ellipse at 70% 80%, ${secondary}25, transparent 60%)` }} />
          )}
          {bgEffect === 'aurora' && (
            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 0%, ${primary}40 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, ${secondary}30 0%, transparent 50%)` }} />
          )}
          {bgEffect === 'grid' && (
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${primary}08 1px, transparent 1px), linear-gradient(90deg, ${primary}08 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
          )}
          {/* Grain overlay */}
          {grain > 0 && (
            <div style={{ position: 'absolute', inset: 0, opacity: grain / 200, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', mixBlendMode: 'overlay' as any }} />
          )}
          {/* Top bar */}
          <div style={{ position: 'absolute', top: 28 * s, left: 14 * s, right: 14 * s, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
            <span style={{ fontSize: 6 * s, fontFamily: 'monospace', color: darkBg ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', letterSpacing: 1.5 }}>PRESSKIT.PRO</span>
            <span style={{ fontSize: 6 * s, fontFamily: 'monospace', color: primary, padding: `${2 * s}px ${5 * s}px`, borderRadius: 100, border: `1px solid ${primary}44`, background: `${primary}15` }}>● LIVE</span>
          </div>
          {/* Color glow */}
          <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '200%', height: '50%', background: `radial-gradient(ellipse at bottom, ${primary}20, transparent 70%)` }} />
          {/* Content */}
          <div style={{ position: 'absolute', bottom: 16 * s, left: 14 * s, right: 14 * s, zIndex: 10 }}>
            <span style={{ display: 'inline-block', fontSize: 6 * s, fontFamily: 'monospace', color: primary, letterSpacing: 1.5, textTransform: 'uppercase', padding: `${2 * s}px ${7 * s}px`, borderRadius: 100, border: `1px solid ${primary}30`, background: `${primary}12`, marginBottom: 6 * s }}>HOUSE DJ</span>
            <div style={{ fontSize: 20 * s, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, color: textColor, marginBottom: 3 * s, fontFamily: 'system-ui, sans-serif' }}>VALENTINA M.</div>
            <div style={{ fontSize: 8 * s, color: darkBg ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', marginBottom: 10 * s, fontFamily: 'monospace' }}>Producer · Buenos Aires · AR</div>
            <div style={{ display: 'flex', gap: 14 * s, marginBottom: 10 * s }}>
              {[['1.2M', 'Plays'], ['14', 'Países'], ['48+', 'Shows']].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 10 * s, fontWeight: 700, color: textColor, lineHeight: 1 }}>{v}</div>
                  <div style={{ fontSize: 6 * s, color: darkBg ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', fontFamily: 'monospace', marginTop: 1 * s }}>{l}</div>
                </div>
              ))}
            </div>
            {/* Waveform */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1.5 * s, marginBottom: 10 * s, height: 12 * s }}>
              {[4, 7, 10, 6, 4, 8, 12, 9, 6, 4, 7, 11, 8, 5, 4, 9, 7, 5, 8, 11, 6, 4, 7, 4].map((h, i) => (
                <div key={i} style={{ width: 2 * s, height: h * s, borderRadius: 2, background: i < 13 ? primary : `${primary}35` }} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 5 * s }}>
              <div style={{ flex: 1, padding: `${6 * s}px`, borderRadius: 100, background: `linear-gradient(135deg, ${primary}, ${secondary})`, textAlign: 'center', fontSize: 8 * s, fontWeight: 700, color: '#000', fontFamily: 'system-ui, sans-serif' }}>Booking →</div>
            </div>
          </div>
        </div>
      </div>
      <p style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)', letterSpacing: 1 }}>VISTA PREVIA EN VIVO</p>
    </div>
  )
}

// ─── Layout thumb ─────────────────────────────────────────────────────────────
function LayoutThumb({ id }: { id: string }) {
  const base = 'bg-white/10 rounded'
  if (id === 'centrado') return (
    <div className="w-full h-20 flex flex-col items-center justify-center gap-1 p-2">
      <div className={`${base} w-8 h-8 rounded-full`} />
      <div className={`${base} w-16 h-1.5`} />
      <div className={`${base} w-10 h-1`} />
    </div>
  )
  if (id === 'editorial') return (
    <div className="w-full h-20 p-2 flex flex-col gap-1">
      <div className={`${base} w-full h-8`} />
      <div className="flex gap-1 flex-1">
        <div className={`${base} flex-1`} />
        <div className={`${base} w-12`} />
      </div>
    </div>
  )
  if (id === 'split') return (
    <div className="w-full h-20 p-2 flex gap-1.5">
      <div className={`${base} w-1/2 flex flex-col justify-center items-center`}>
        <div className="w-8 h-8 rounded-full bg-white/10" />
      </div>
      <div className="w-1/2 flex flex-col gap-1 justify-center">
        <div className={`${base} w-full h-1.5`} />
        <div className={`${base} w-3/4 h-1`} />
        <div className={`${base} w-full h-3`} />
      </div>
    </div>
  )
  if (id === 'raw') return (
    <div className="w-full h-20 p-2 flex flex-col gap-1">
      <div className={`${base} w-12 h-3`} />
      <div className={`${base} w-full h-1.5 mt-1`} />
      <div className={`${base} w-5/6 h-1`} />
      <div className="flex gap-1 mt-auto"><div className={`${base} w-1/3 h-4`} /><div className={`${base} w-1/3 h-4`} /></div>
    </div>
  )
  if (id === 'minimal') return (
    <div className="w-full h-20 p-3 flex flex-col gap-2">
      <div className={`${base} w-10 h-1.5`} />
      <div className={`${base} w-full h-1`} />
      <div className={`${base} w-3/4 h-1`} />
      <div className="mt-auto flex gap-2"><div className={`${base} w-8 h-3 rounded-full`} /></div>
    </div>
  )
  if (id === 'cinematic') return (
    <div className="w-full h-20 relative overflow-hidden rounded-lg">
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
      <div className="absolute bottom-2 left-2 flex flex-col gap-0.5">
        <div className="bg-white/15 rounded w-12 h-1.5" />
        <div className="bg-white/10 rounded w-8 h-1" />
      </div>
    </div>
  )
  return null
}

// ─── Upload Zone ──────────────────────────────────────────────────────────────
function UploadZone({ label, hint, icon: Icon = Upload, accent = false }: {
  label: string; hint: string; icon?: React.ElementType; accent?: boolean
}) {
  return (
    <div className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-all duration-200 ${
      accent
        ? 'border-[#C026D3]/30 hover:border-[#C026D3]/60 hover:bg-[#C026D3]/[0.04]'
        : 'border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02]'
    }`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${accent ? 'bg-[#C026D3]/10' : 'bg-white/[0.04]'}`}>
        <Icon className={`w-5 h-5 ${accent ? 'text-[#C026D3]' : 'text-white/30'}`} />
      </div>
      <div className="text-center">
        <p className="text-sm text-white/60 font-semibold">{label}</p>
        <p className="text-xs text-white/25 font-mono mt-1">{hint}</p>
      </div>
    </div>
  )
}

// ─── Gallery Item ─────────────────────────────────────────────────────────────
function GalleryItem({ label, src }: { label: string; src: string }) {
  return (
    <div className="relative group rounded-xl overflow-hidden aspect-square bg-white/[0.04] border border-white/[0.06]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={label} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"><Move className="w-3 h-3" /></button>
        <button className="p-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-lg transition-colors"><Trash2 className="w-3 h-3 text-red-400" /></button>
      </div>
      <p className="absolute bottom-0 inset-x-0 text-[9px] font-mono text-white/50 bg-black/50 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">{label}</p>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CustomizePage() {
  const [activeTab, setActiveTab] = useState<Tab>('identidad')
  const [hasChanges, setHasChanges] = useState(false)
  const [saved, setSaved] = useState(false)

  // Identidad
  const [artistName, setArtistName] = useState('VALENTINA M.')
  const [tagline, setTagline] = useState('House DJ · Buenos Aires')
  const [role, setRole] = useState('DJ')
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['House', 'Electronic'])
  const [bio, setBio] = useState('Productora y DJ radicada en Buenos Aires. 10 años de trayectoria en la escena electrónica latinoamericana. Residente en Club Niceto y La Fábrica.')
  const [location, setLocation] = useState('Buenos Aires, Argentina')
  const [bookingEmail, setBookingEmail] = useState('booking@valentinaDJ.com')
  const [fee, setFee] = useState('USD 800 – 2,500')

  // Colores
  const [primary, setPrimary] = useState('#C026D3')
  const [secondary, setSecondary] = useState('#7C3AED')
  const [accentText, setAccentText] = useState('#E879F9')
  const [cardBg, setCardBg] = useState('#0D0009')
  const [darkBg, setDarkBg] = useState(true)
  const [colorMode, setColorMode] = useState<'mono' | 'duo' | 'gradient'>('gradient')
  const [buttonStyle, setButtonStyle] = useState<'filled' | 'outline' | 'ghost'>('filled')

  // Animaciones
  const [entranceAnim, setEntranceAnim] = useState('slide-up')
  const [scrollEffect, setScrollEffect] = useState('parallax')
  const [hoverEffect, setHoverEffect] = useState('glow')
  const [animSpeed, setAnimSpeed] = useState(50)
  const [floatingElements, setFloatingElements] = useState(true)
  const [pulseGlow, setPulseGlow] = useState(true)
  const [waveAnimation, setWaveAnimation] = useState(true)
  const [staggerDelay, setStaggerDelay] = useState(30)

  // Efectos
  const [bgEffect, setBgEffect] = useState('aurora')
  const [grain, setGrain] = useState(18)
  const [glowIntensity, setGlowIntensity] = useState(60)
  const [blurOverlay, setBlurOverlay] = useState(false)
  const [scanlines, setScanlines] = useState(false)
  const [vignetteOn, setVignetteOn] = useState(true)
  const [glassCards, setGlassCards] = useState(true)
  const [neonBorders, setNeonBorders] = useState(false)

  // Layout
  const [selectedLayout, setSelectedLayout] = useState('centrado')
  const [heroHeight, setHeroHeight] = useState(70)
  const [sectionSpacing, setSectionSpacing] = useState(50)
  const [borderRadius, setBorderRadius] = useState(50)
  const [maxWidth, setMaxWidth] = useState(60)

  // Secciones
  const [sections, setSections] = useState<Record<string, boolean>>(
    Object.fromEntries(SECTIONS.map(s => [s.id, true]))
  )

  // Tipografía
  const [font, setFont] = useState('Space Grotesk')
  const [bodyFont, setBodyFont] = useState('Inter')
  const [fontWeight, setFontWeight] = useState('Black')
  const [fontScale, setFontScale] = useState('Normal')
  const [letterSpacing, setLetterSpacing] = useState(30)
  const [lineHeight, setLineHeight] = useState(50)
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center')
  const [allCaps, setAllCaps] = useState(true)

  function mark() { setHasChanges(true); setSaved(false) }
  function handleSave() { setHasChanges(false); setSaved(true); setTimeout(() => setSaved(false), 3000) }
  function toggleGenre(g: string) {
    setSelectedGenres(p => p.includes(g) ? p.filter(x => x !== g) : [...p, g])
    mark()
  }

  return (
    <div className="p-8 max-w-7xl mx-auto pb-32">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tighter text-white">Personalizar</h1>
        <p className="text-white/40 text-sm mt-1 font-mono">Diseña tu presskit en tiempo real — los cambios se aplican instantáneamente.</p>
      </div>

      <div className="flex gap-7">
        {/* Sidebar tabs */}
        <div className="w-44 shrink-0">
          <nav className="flex flex-col gap-1 sticky top-8">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left transition-all ${
                  activeTab === id
                    ? 'bg-[#C026D3]/10 text-[#E879F9] border border-[#C026D3]/20'
                    : 'text-white/45 hover:text-white/80 hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main panel */}
        <div className="flex-1 min-w-0 flex gap-6">
          {/* Controls */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

            {/* ── IDENTIDAD ── */}
            {activeTab === 'identidad' && (
              <>
                <SectionCard title="Nombre artístico">
                  <input value={artistName} onChange={e => { setArtistName(e.target.value); mark() }}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C026D3]/50 transition-colors font-bold tracking-wide"
                    placeholder="Tu nombre artístico..." />
                  <div>
                    <label className="block text-xs text-white/40 mb-1.5 font-mono">Tagline / Subtítulo</label>
                    <input value={tagline} onChange={e => { setTagline(e.target.value); mark() }}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C026D3]/50 transition-colors"
                      placeholder="DJ · Ciudad · País" />
                  </div>
                </SectionCard>

                <SectionCard title="Rol">
                  <div className="flex gap-2 flex-wrap">
                    {ROLES.map(r => (
                      <button key={r} onClick={() => { setRole(r); mark() }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${role === r ? 'bg-[#C026D3] text-white' : 'bg-white/[0.04] border border-white/[0.08] text-white/50 hover:text-white/80'}`}>
                        {r}
                      </button>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Géneros musicales">
                  <div className="flex gap-2 flex-wrap">
                    {GENRES.map(g => (
                      <button key={g} onClick={() => toggleGenre(g)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono tracking-wider transition-all ${selectedGenres.includes(g) ? 'bg-[#C026D3]/20 border border-[#C026D3]/40 text-[#E879F9]' : 'bg-white/[0.03] border border-white/[0.08] text-white/40 hover:text-white/60'}`}>
                        {g}
                      </button>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Biografía">
                  <textarea value={bio} maxLength={500} onChange={e => { setBio(e.target.value); mark() }}
                    rows={5}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C026D3]/50 transition-colors resize-none leading-relaxed"
                    placeholder="Cuéntanos tu historia..." />
                  <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#C026D3] to-[#7C3AED] transition-all" style={{ width: `${(bio.length / 500) * 100}%` }} />
                  </div>
                  <p className="text-xs font-mono text-white/25 text-right">{bio.length}/500</p>
                </SectionCard>

                <SectionCard title="Detalles de contacto">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Ciudad / País', key: 'location', val: location, set: setLocation },
                      { label: 'Email de booking', key: 'email', val: bookingEmail, set: setBookingEmail },
                      { label: 'Fee estimado', key: 'fee', val: fee, set: setFee },
                    ].map(({ label, key, val, set }) => (
                      <div key={key} className={key === 'email' ? 'col-span-2' : ''}>
                        <label className="block text-xs text-white/40 mb-1.5 font-mono">{label}</label>
                        <input value={val} onChange={e => { set(e.target.value); mark() }}
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#C026D3]/50 transition-colors" />
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </>
            )}

            {/* ── MEDIOS ── */}
            {activeTab === 'medios' && (
              <>
                <SectionCard title="Foto de perfil / Hero">
                  <UploadZone label="Arrastra tu foto principal o haz clic" hint="JPG, PNG, WebP · Mín 1200×1200px · Máx 15MB" icon={Camera} accent />
                </SectionCard>

                <SectionCard title="Video de fondo (Hero)">
                  <UploadZone label="Video loop para el fondo del hero" hint="MP4, WebM · Máx 60s · Resolución 1080p recomendada" icon={Film} />
                  <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                    <span className="text-sm text-white/50">Autoplay silenciado</span>
                    <Toggle value={true} onChange={() => mark()} />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                    <span className="text-sm text-white/50">Loop continuo</span>
                    <Toggle value={true} onChange={() => mark()} />
                  </div>
                </SectionCard>

                <SectionCard title="Galería de fotos">
                  <p className="text-xs text-white/30 font-mono">Arrastra para reordenar · Máx 12 fotos</p>
                  <div className="grid grid-cols-3 gap-2">
                    <GalleryItem label="Foto en vivo 1" src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200&q=70" />
                    <GalleryItem label="Foto promo" src="https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=200&q=70" />
                    <GalleryItem label="Behind scenes" src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=200&q=70" />
                    <GalleryItem label="Festival set" src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&q=70" />
                    <GalleryItem label="Studio session" src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=200&q=70" />
                    <button className="aspect-square rounded-xl border-2 border-dashed border-white/[0.08] hover:border-[#C026D3]/30 flex flex-col items-center justify-center gap-2 transition-all hover:bg-[#C026D3]/[0.03]">
                      <Plus className="w-5 h-5 text-white/20" />
                      <span className="text-[9px] font-mono text-white/20">Agregar</span>
                    </button>
                  </div>
                </SectionCard>

                <SectionCard title="Música / Tracks">
                  <div className="space-y-2">
                    {[
                      { name: 'Midnight Protocol', duration: '6:42', plays: '180K' },
                      { name: 'Neon Ruins', duration: '7:15', plays: '94K' },
                      { name: 'Orbital Drift', duration: '8:03', plays: '210K' },
                    ].map((t, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                        <div className="w-7 h-7 rounded-lg bg-[#C026D3]/20 flex items-center justify-center">
                          <Music className="w-3 h-3 text-[#C026D3]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{t.name}</p>
                          <p className="text-[9px] font-mono text-white/30">{t.duration} · {t.plays} plays</p>
                        </div>
                        <button className="text-white/20 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                    <button onClick={() => mark()} className="w-full p-3 border-2 border-dashed border-white/[0.06] hover:border-[#C026D3]/30 rounded-xl text-xs font-mono text-white/30 hover:text-[#C026D3] transition-all flex items-center justify-center gap-2">
                      <Plus className="w-3.5 h-3.5" /> Agregar track
                    </button>
                  </div>
                </SectionCard>

                <SectionCard title="Rider técnico (PDF)">
                  <UploadZone label="Sube tu rider técnico en PDF" hint="PDF · Máx 10MB · Visible solo con contraseña opcional" icon={Upload} />
                </SectionCard>
              </>
            )}

            {/* ── COLORES ── */}
            {activeTab === 'colores' && (
              <>
                <SectionCard title="Colores principales">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Color principal', val: primary, set: setPrimary },
                      { label: 'Color secundario', val: secondary, set: setSecondary },
                      { label: 'Texto de acento', val: accentText, set: setAccentText },
                      { label: 'Fondo de tarjetas', val: cardBg, set: setCardBg },
                    ].map(({ label, val, set }) => (
                      <div key={label}>
                        <label className="block text-xs text-white/40 mb-2 font-mono">{label}</label>
                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer">
                            <div className="w-10 h-10 rounded-xl border border-white/10 cursor-pointer shrink-0" style={{ background: val, boxShadow: `0 0 12px ${val}60` }} />
                            <input type="color" value={val} onChange={e => { set(e.target.value); mark() }} className="sr-only" />
                          </label>
                          <input value={val} onChange={e => { set(e.target.value); mark() }}
                            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-[#C026D3]/50 transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Fondo y modo">
                  <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-white">Modo oscuro</p>
                      <p className="text-xs text-white/30 font-mono">{darkBg ? 'Fondo #07070B' : 'Fondo #F8FAFC'}</p>
                    </div>
                    <Toggle value={darkBg} onChange={v => { setDarkBg(v); mark() }} />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-2 font-mono">Modo de color</p>
                    <div className="flex gap-2">
                      {(['mono', 'duo', 'gradient'] as const).map(m => (
                        <button key={m} onClick={() => { setColorMode(m); mark() }}
                          className={`flex-1 py-2 rounded-xl text-xs font-mono tracking-wider transition-all ${colorMode === m ? 'bg-[#C026D3] text-white' : 'bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white/60'}`}>
                          {m === 'mono' ? 'Mono' : m === 'duo' ? 'Duo' : 'Gradiente'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-2 font-mono">Estilo de botón</p>
                    <div className="flex gap-2">
                      {(['filled', 'outline', 'ghost'] as const).map(b => (
                        <button key={b} onClick={() => { setButtonStyle(b); mark() }}
                          className={`flex-1 py-2 rounded-xl text-xs font-mono transition-all capitalize ${buttonStyle === b ? 'bg-[#C026D3] text-white' : 'bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white/60'}`}>
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Paletas predefinidas">
                  <div className="grid grid-cols-4 gap-2">
                    {COLOR_PRESETS.map((preset, i) => (
                      <button key={i} onClick={() => { setPrimary(preset.a); setSecondary(preset.b); mark() }}
                        className="group flex flex-col items-center gap-1.5">
                        <div className={`w-full h-10 rounded-xl border-2 transition-all ${primary === preset.a && secondary === preset.b ? 'border-white scale-105' : 'border-transparent hover:scale-105'}`}
                          style={{ background: `linear-gradient(135deg, ${preset.a} 0%, ${preset.b} 100%)` }} />
                        <span className="text-[8px] font-mono text-white/30 group-hover:text-white/60 transition-colors">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </SectionCard>
              </>
            )}

            {/* ── ANIMACIONES ── */}
            {activeTab === 'animaciones' && (
              <>
                <SectionCard title="Animación de entrada">
                  <p className="text-xs text-white/30 font-mono">Cómo aparecen los elementos al cargar la página</p>
                  <div className="grid grid-cols-3 gap-2">
                    {ENTRANCE_ANIMATIONS.map(a => (
                      <button key={a.id} onClick={() => { setEntranceAnim(a.id); mark() }}
                        className={`p-3 rounded-xl border text-center transition-all ${entranceAnim === a.id ? 'border-[#C026D3] bg-[#C026D3]/10 text-[#E879F9]' : 'border-white/[0.08] text-white/40 hover:text-white/70 hover:border-white/20'}`}>
                        <div className="text-xl mb-1">{a.icon}</div>
                        <p className="text-[10px] font-mono">{a.label}</p>
                      </button>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Efecto al hacer scroll">
                  <div className="flex flex-col gap-2">
                    {SCROLL_EFFECTS.map(e => (
                      <button key={e.id} onClick={() => { setScrollEffect(e.id); mark() }}
                        className={`flex items-center justify-between p-3 rounded-xl border text-sm transition-all ${scrollEffect === e.id ? 'border-[#C026D3]/40 bg-[#C026D3]/10 text-[#E879F9]' : 'border-white/[0.06] text-white/50 hover:text-white/80 hover:bg-white/[0.03]'}`}>
                        {e.label}
                        {scrollEffect === e.id && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Efecto hover en tarjetas">
                  <div className="grid grid-cols-3 gap-2">
                    {HOVER_EFFECTS.map(e => (
                      <button key={e.id} onClick={() => { setHoverEffect(e.id); mark() }}
                        className={`py-2.5 rounded-xl text-xs font-mono border transition-all ${hoverEffect === e.id ? 'border-[#C026D3] bg-[#C026D3]/10 text-[#E879F9]' : 'border-white/[0.08] text-white/40 hover:text-white/60'}`}>
                        {e.label}
                      </button>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Velocidad y timing">
                  <SliderInput label="Velocidad" value={animSpeed} onChange={v => { setAnimSpeed(v); mark() }} />
                  <SliderInput label="Stagger delay" value={staggerDelay} onChange={v => { setStaggerDelay(v); mark() }} />
                </SectionCard>

                <SectionCard title="Efectos decorativos">
                  {[
                    { label: 'Elementos flotantes', desc: 'Partículas o iconos que flotan suavemente', val: floatingElements, set: setFloatingElements },
                    { label: 'Glow pulsante', desc: 'El color de acento pulsa como luz', val: pulseGlow, set: setPulseGlow },
                    { label: 'Waveform animado', desc: 'Barras de audio que se mueven', val: waveAnimation, set: setWaveAnimation },
                  ].map(({ label, desc, val, set }) => (
                    <div key={label} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
                      <div>
                        <p className="text-sm text-white font-medium">{label}</p>
                        <p className="text-xs text-white/30 mt-0.5">{desc}</p>
                      </div>
                      <Toggle value={val} onChange={v => { set(v); mark() }} />
                    </div>
                  ))}
                </SectionCard>
              </>
            )}

            {/* ── EFECTOS ── */}
            {activeTab === 'efectos' && (
              <>
                <SectionCard title="Efecto de fondo">
                  <div className="grid grid-cols-2 gap-2">
                    {BG_EFFECTS.map(e => (
                      <button key={e.id} onClick={() => { setBgEffect(e.id); mark() }}
                        className={`p-3 rounded-xl border text-left transition-all ${bgEffect === e.id ? 'border-[#C026D3]/40 bg-[#C026D3]/10' : 'border-white/[0.06] hover:border-white/20 hover:bg-white/[0.02]'}`}>
                        <p className={`text-xs font-semibold mb-0.5 ${bgEffect === e.id ? 'text-[#E879F9]' : 'text-white/70'}`}>{e.label}</p>
                        <p className="text-[9px] font-mono text-white/30">{e.desc}</p>
                      </button>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Textura y ruido">
                  <SliderInput label="Grain / Ruido" value={grain} onChange={v => { setGrain(v); mark() }} min={0} max={80} />
                  <SliderInput label="Intensidad glow" value={glowIntensity} onChange={v => { setGlowIntensity(v); mark() }} />
                </SectionCard>

                <SectionCard title="Efectos de capa">
                  {[
                    { label: 'Tarjetas de vidrio (glassmorphism)', desc: 'Blur + transparencia en tarjetas', val: glassCards, set: setGlassCards },
                    { label: 'Bordes neón', desc: 'Glow en los bordes de sección', val: neonBorders, set: setNeonBorders },
                    { label: 'Vignette', desc: 'Oscurece los bordes de la pantalla', val: vignetteOn, set: setVignetteOn },
                    { label: 'Blur overlay en hero', desc: 'Efecto de desenfoque sobre la foto', val: blurOverlay, set: setBlurOverlay },
                    { label: 'Scanlines retro', desc: 'Líneas horizontales sutiles', val: scanlines, set: setScanlines },
                  ].map(({ label, desc, val, set }) => (
                    <div key={label} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
                      <div>
                        <p className="text-sm text-white font-medium">{label}</p>
                        <p className="text-xs text-white/30 mt-0.5">{desc}</p>
                      </div>
                      <Toggle value={val} onChange={v => { set(v); mark() }} />
                    </div>
                  ))}
                </SectionCard>
              </>
            )}

            {/* ── LAYOUT ── */}
            {activeTab === 'layout' && (
              <>
                <SectionCard title="Estructura de página">
                  <div className="grid grid-cols-2 gap-3">
                    {LAYOUTS.map(({ id, label, desc }) => (
                      <button key={id} onClick={() => { setSelectedLayout(id); mark() }}
                        className={`border rounded-2xl overflow-hidden transition-all text-left ${selectedLayout === id ? 'border-[#C026D3] shadow-[0_0_20px_#C026D330]' : 'border-white/[0.08] hover:border-white/20'}`}>
                        <div className="bg-white/[0.02] p-1"><LayoutThumb id={id} /></div>
                        <div className={`py-2 px-3 border-t border-white/[0.06] ${selectedLayout === id ? 'text-[#E879F9]' : 'text-white/40'}`}>
                          <p className="text-xs font-mono tracking-widest">{label.toUpperCase()}</p>
                          <p className="text-[9px] text-white/25 mt-0.5">{desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Proporciones">
                  <SliderInput label="Altura hero" value={heroHeight} onChange={v => { setHeroHeight(v); mark() }} />
                  <SliderInput label="Espaciado secciones" value={sectionSpacing} onChange={v => { setSectionSpacing(v); mark() }} />
                  <SliderInput label="Border radius" value={borderRadius} onChange={v => { setBorderRadius(v); mark() }} />
                  <SliderInput label="Max width" value={maxWidth} onChange={v => { setMaxWidth(v); mark() }} />
                </SectionCard>
              </>
            )}

            {/* ── SECCIONES ── */}
            {activeTab === 'secciones' && (
              <SectionCard title="Secciones visibles">
                <p className="text-xs text-white/30 font-mono">Activa/desactiva secciones · Arrastra para reordenar</p>
                <div className="flex flex-col gap-2">
                  {SECTIONS.map(({ id, label, desc }) => (
                    <div key={id} className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
                      <GripVertical className="w-4 h-4 text-white/20 cursor-grab shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/70">{label}</p>
                        <p className="text-[10px] font-mono text-white/25">{desc}</p>
                      </div>
                      <Toggle value={sections[id]} onChange={v => { setSections(p => ({ ...p, [id]: v })); mark() }} />
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* ── TIPOGRAFÍA ── */}
            {activeTab === 'tipografia' && (
              <>
                <SectionCard title="Fuente de títulos">
                  <div className="flex flex-col gap-2">
                    {FONTS.map(f => (
                      <button key={f.id} onClick={() => { setFont(f.name); mark() }}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left ${font === f.name ? 'border-[#C026D3]/40 bg-[#C026D3]/10 text-[#E879F9]' : 'border-white/[0.06] bg-white/[0.02] text-white/50 hover:text-white/80 hover:bg-white/[0.04]'}`}>
                        <span className="font-semibold">{f.name}</span>
                        <span className="text-lg opacity-50">{f.sample}</span>
                      </button>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Fuente de cuerpo">
                  <div className="grid grid-cols-2 gap-2">
                    {['Inter', 'DM Sans', 'Space Mono', 'IBM Plex Mono'].map(f => (
                      <button key={f} onClick={() => { setBodyFont(f); mark() }}
                        className={`py-2.5 px-3 rounded-xl text-xs border transition-all text-left ${bodyFont === f ? 'border-[#C026D3]/40 bg-[#C026D3]/10 text-[#E879F9]' : 'border-white/[0.06] text-white/40 hover:text-white/70'}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Opciones de texto">
                  <div>
                    <p className="text-xs text-white/40 mb-2 font-mono">Peso de títulos</p>
                    <div className="flex gap-2">
                      {['Black', 'Bold', 'Medium'].map(w => (
                        <button key={w} onClick={() => { setFontWeight(w); mark() }}
                          className={`flex-1 py-2 rounded-xl text-xs transition-all ${fontWeight === w ? 'bg-[#C026D3] text-white font-black' : 'bg-white/[0.04] border border-white/[0.08] text-white/40'}`}>
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-2 font-mono">Escala tipográfica</p>
                    <div className="flex gap-2">
                      {['S', 'M', 'L', 'XL'].map(s => (
                        <button key={s} onClick={() => { setFontScale(s); mark() }}
                          className={`flex-1 py-2 rounded-xl text-xs transition-all ${fontScale === s ? 'bg-[#C026D3] text-white' : 'bg-white/[0.04] border border-white/[0.08] text-white/40'}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <SliderInput label="Letter spacing" value={letterSpacing} onChange={v => { setLetterSpacing(v); mark() }} />
                  <SliderInput label="Line height" value={lineHeight} onChange={v => { setLineHeight(v); mark() }} />
                  <div>
                    <p className="text-xs text-white/40 mb-2 font-mono">Alineación</p>
                    <div className="flex gap-2">
                      {(['left', 'center', 'right'] as const).map(a => (
                        <button key={a} onClick={() => { setTextAlign(a); mark() }}
                          className={`flex-1 py-2 rounded-xl text-xs transition-all capitalize ${textAlign === a ? 'bg-[#C026D3] text-white' : 'bg-white/[0.04] border border-white/[0.08] text-white/40'}`}>
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                    <span className="text-sm text-white/50">Todo en mayúsculas (ALL CAPS)</span>
                    <Toggle value={allCaps} onChange={v => { setAllCaps(v); mark() }} />
                  </div>
                </SectionCard>
              </>
            )}

          </div>

          {/* Right: iPhone live preview */}
          <div className="w-52 shrink-0">
            <div className="sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Vista previa</p>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  LIVE
                </span>
              </div>
              <LiveIPhonePreview
                primary={primary}
                secondary={secondary}
                darkBg={darkBg}
                font={font}
                bgEffect={bgEffect}
                grain={grain}
              />
              <div className="mt-4 flex flex-col gap-2">
                <a href="/dashboard/preview" className="block w-full py-2 text-center text-xs font-mono text-white/40 hover:text-white/70 border border-white/[0.06] hover:border-white/20 rounded-xl transition-all">
                  Ver pantalla completa →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating save */}
      {(hasChanges || saved) && (
        <div className="fixed bottom-8 right-8 z-50">
          <button onClick={handleSave}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-semibold text-sm shadow-2xl transition-all duration-200 ${saved ? 'bg-emerald-500 text-white' : 'bg-[#C026D3] text-white hover:bg-[#A21CAF] shadow-[0_0_30px_#C026D350]'}`}>
            {saved ? <><Check className="w-4 h-4" /> Guardado</> : <><Save className="w-4 h-4" /> Guardar cambios</>}
          </button>
        </div>
      )}
    </div>
  )
}
