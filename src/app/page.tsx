'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Check, ChevronDown, ArrowRight } from 'lucide-react'

// ─── Design tokens ─────────────────────────────────────────────────────────────
const A1 = '#a855f7'
const A2 = '#c084fc'
const A3 = '#7c3aed'

// ─── Logo Mark ─────────────────────────────────────────────────────────────────
function LogoMark({ size = 26 }: { size?: number }) {
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
      <circle cx="12" cy="17" r="1.5" fill="#05050a" />
    </svg>
  )
}

// ─── FadeIn ────────────────────────────────────────────────────────────────────
function FadeIn({
  children, delay = 0, className = '', y = 28, style,
}: {
  children: React.ReactNode; delay?: number; className?: string; y?: number; style?: React.CSSProperties
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-24px' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

// ─── Iridescent text ───────────────────────────────────────────────────────────
function Iridescent({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-serif italic" style={{
      background: 'linear-gradient(120deg, #e8ddff 0%, #c084fc 30%, #a855f7 55%, #7c3aed 75%, #e8ddff 100%)',
      backgroundSize: '200% 100%',
      WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
      animation: 'shimmer 8s ease-in-out infinite',
    }}>
      {children}
    </span>
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
      <nav className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-5 md:px-10 py-4 transition-all duration-300 ${
        scrolled ? 'border-b border-white/[0.07] backdrop-blur-xl' : ''
      }`}
        style={scrolled ? { background: 'rgba(5,5,10,0.9)' } : {}}
      >
        <div className="flex items-center gap-2.5">
          <LogoMark size={24} />
          <span className="font-display font-semibold text-base tracking-[0.18em] text-white">ARTIX</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-mono text-white/40">
          {[['#features','Producto'],['#social','Artistas'],['#pricing','Precios'],['#faq','FAQ']].map(([h,l]) => (
            <a key={h} href={h} className="hover:text-white transition-colors">{l}</a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm font-mono text-white/40 hover:text-white transition-colors">Iniciar sesión</Link>
          <Link href="/signup" className="text-sm px-5 py-2 rounded-full font-display font-semibold text-white transition-all hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${A3}, ${A1})`, boxShadow: `0 0 20px ${A1}33` }}>
            Early access →
          </Link>
        </div>
        <button className="md:hidden flex flex-col gap-1.5 w-8 h-8 items-center justify-center" onClick={() => setMenuOpen(!menuOpen)}>
          <span className={`w-5 h-px bg-white/60 transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-[3px]' : ''}`} />
          <span className={`w-5 h-px bg-white/60 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-5 h-px bg-white/60 transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-[3px]' : ''}`} />
        </button>
      </nav>
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="fixed top-[60px] inset-x-0 z-40 px-5 py-5 flex flex-col gap-4 md:hidden border-b border-white/[0.07] backdrop-blur-xl"
            style={{ background: 'rgba(5,5,10,0.96)' }}>
            {[['#features','Producto'],['#social','Artistas'],['#pricing','Precios'],['#faq','FAQ']].map(([h,l]) => (
              <a key={h} href={h} onClick={() => setMenuOpen(false)} className="text-sm font-mono text-white/50 hover:text-white transition-colors py-1">{l}</a>
            ))}
            <div className="flex flex-col gap-2 pt-3 border-t border-white/[0.07]">
              <Link href="/login" onClick={() => setMenuOpen(false)} className="text-sm font-mono text-white/40 text-center py-2">Iniciar sesión</Link>
              <Link href="/signup" onClick={() => setMenuOpen(false)}
                className="py-3 rounded-full text-center text-sm font-display font-semibold text-white"
                style={{ background: `linear-gradient(135deg, ${A3}, ${A1})` }}>
                Early access →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  const [variant, setVariant] = useState<'dashboard'|'orb'|'waveform'>('dashboard')
  const gridRef = useRef<HTMLDivElement>(null)

  // Mouse-reactive dot grid
  useEffect(() => {
    const container = gridRef.current
    if (!container) return
    container.innerHTML = ''
    const cols = 16, rows = 10
    const dots: HTMLDivElement[] = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const d = document.createElement('div')
        d.style.cssText = `position:absolute;width:2px;height:2px;border-radius:50%;background:${A2};transition:transform 0.3s,opacity 0.4s;opacity:0.15;left:${(c/(cols-1))*100}%;top:${(r/(rows-1))*100}%`
        container.appendChild(d)
        dots.push(d)
      }
    }
    const handler = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const mx = e.clientX - rect.left, my = e.clientY - rect.top
      dots.forEach(d => {
        const dx = parseFloat(d.style.left) / 100 * rect.width - mx
        const dy = parseFloat(d.style.top) / 100 * rect.height - my
        const dist = Math.sqrt(dx*dx + dy*dy)
        const f = Math.max(0, 1 - dist / 240)
        d.style.opacity = String(0.15 + f * 0.85)
        d.style.transform = `scale(${1 + f * 2.5})`
      })
    }
    window.addEventListener('mousemove', handler)
    return () => { window.removeEventListener('mousemove', handler) }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      {/* Aurora background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div className="absolute rounded-full" animate={{ x:[0,60,-50,0], y:[0,-50,60,0], scale:[1,1.1,0.9,1] }}
          transition={{ duration: 22, repeat: Infinity, ease:'easeInOut' }}
          style={{ width:720, height:720, top:-180, left:-180, background:A1, filter:'blur(90px)', opacity:0.06 }} />
        <motion.div className="absolute rounded-full" animate={{ x:[0,-40,50,0], y:[0,60,-40,0] }}
          transition={{ duration: 22, repeat: Infinity, ease:'easeInOut', delay:-7 }}
          style={{ width:600, height:600, bottom:-200, right:-140, background:A2, filter:'blur(90px)', opacity:0.045 }} />
        <motion.div className="absolute rounded-full" animate={{ x:[0,50,-60,0], y:[0,-60,40,0] }}
          transition={{ duration: 22, repeat: Infinity, ease:'easeInOut', delay:-14 }}
          style={{ width:500, height:500, top:'30%', left:'45%', background:A3, filter:'blur(90px)', opacity:0.035 }} />
        {/* Grid lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(168,85,247,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(168,85,247,0.05) 1px,transparent 1px)`,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 72%)',
        }} />
        {/* Mouse dots */}
        <div ref={gridRef} className="absolute inset-0" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-16 items-center">
          {/* Left text */}
          <div>
            <FadeIn delay={0}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.1] text-[11px] font-mono text-white/45 tracking-widest mb-7">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: A1 }} />
                Early access · Abril 2026
              </div>
            </FadeIn>
            <FadeIn delay={0.08} y={30}>
              <h1 className="font-display font-semibold leading-[0.92] tracking-[-0.04em] text-white mb-7"
                style={{ fontSize: 'clamp(3rem,7.5vw,6.8rem)' }}>
                El <Iridescent>sistema operativo</Iridescent> de tu carrera musical.
              </h1>
            </FadeIn>
            <FadeIn delay={0.16}>
              <p className="text-base md:text-[1.1rem] text-white/55 leading-relaxed mb-8 max-w-lg">
                Tu web, tu press kit, tu audiencia y tus datos — unificados en una sola plataforma impulsada por IA. Sin depender de nadie.
              </p>
            </FadeIn>
            <FadeIn delay={0.22}>
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link href="/signup"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-display font-semibold text-white text-sm transition-all hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${A3}, ${A1})`, boxShadow: `0 0 30px ${A1}40` }}>
                  Solicitar early access <span className="ml-1">→</span>
                </Link>
                <a href="#features"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-white/10 text-white/55 hover:text-white hover:border-white/20 font-display font-medium text-sm transition-all">
                  Ver cómo funciona
                </a>
              </div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="flex gap-8 sm:gap-12">
                {[['3 min','Configuración'],['+2,400','Artistas en lista'],['0€','Hasta el lanzamiento']].map(([n,l]) => (
                  <div key={l}>
                    <div className="font-display font-semibold text-2xl text-white tracking-tight">{n}</div>
                    <div className="text-[11px] font-mono text-white/35 mt-1">{l}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Right visual */}
          <FadeIn delay={0.25} y={40} className="relative">
            <AnimatePresence mode="wait">
              <motion.div key={variant} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3 }}>
                {variant === 'dashboard' && <HeroDashboard />}
                {variant === 'orb' && <HeroOrb />}
                {variant === 'waveform' && <HeroWaveform />}
              </motion.div>
            </AnimatePresence>
            {/* Variant switcher */}
            <div className="flex gap-2 mt-5 justify-center">
              {(['dashboard','orb','waveform'] as const).map((v, i) => (
                <button key={v} onClick={() => setVariant(v)}
                  className="px-4 py-1.5 rounded-full text-[11px] font-mono transition-all cursor-pointer border"
                  style={{
                    background: variant === v ? `${A1}22` : 'transparent',
                    borderColor: variant === v ? `${A1}55` : 'rgba(255,255,255,0.1)',
                    color: variant === v ? A2 : 'rgba(255,255,255,0.35)',
                  }}>
                  {['Perfil','Aura','Signal'][i]}
                </button>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

function HeroDashboard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.1] shadow-2xl" style={{ background: '#0a0a14' }}>
      {/* Chrome bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.07]" style={{ background: '#07070f' }}>
        <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500/70" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" /><div className="w-2.5 h-2.5 rounded-full bg-green-500/70" /></div>
        <div className="flex-1 mx-3 px-3 py-1 rounded text-[11px] font-mono text-white/30 text-center border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.03)' }}>🔒 solen.fm</div>
        <div className="text-[11px] font-mono text-white/20">⌕ ↗</div>
      </div>
      {/* Cover */}
      <div className="relative h-36 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a0535, #0a0a1a)' }}>
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${A3}22, transparent)` }} />
        <div className="absolute bottom-4 left-4">
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-mono mb-2" style={{ background: `${A1}20`, border: `1px solid ${A1}40`, color: A2 }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: A1 }} />LIVE · Berghain esta noche
          </div>
          <div className="font-display font-semibold text-2xl text-white tracking-tight">SOLEN.</div>
          <div className="text-[11px] font-mono text-white/45 mt-0.5">Melodic Techno · Berlin / Barcelona</div>
        </div>
        <div className="absolute top-4 right-4 flex gap-3 text-[11px] font-mono text-white/30">
          <span className="opacity-100 text-white/70">Música</span><span>Tour</span><span>Press</span><span>Booking</span>
        </div>
      </div>
      {/* Release player */}
      <div className="px-4 py-3 flex items-center gap-3 border-b border-white/[0.06]">
        <div className="w-10 h-10 rounded-lg shrink-0" style={{ background: `linear-gradient(135deg, ${A3}, ${A1})` }} />
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-mono text-white/30 mb-0.5">LAST RELEASE · AURORA EP</div>
          <div className="text-sm font-display font-semibold text-white">Midnight Protocol</div>
          <div className="flex items-end gap-0.5 h-4 mt-1">
            {Array.from({length:28}).map((_,i) => (
              <div key={i} className="w-0.5 rounded-full" style={{ height:`${20+Math.abs(Math.sin(i*0.6))*80}%`, background:`${A1}99`, animation:`wf 1.2s ${i*0.04}s ease-in-out infinite alternate` }} />
            ))}
          </div>
        </div>
        <div className="text-[10px] font-mono text-white/30">02:47</div>
      </div>
      {/* Shows */}
      <div className="p-4 flex flex-col gap-2.5">
        {[['23 MAY','Berghain · Berlin','Sold out','text-red-400'],['07 JUN','Hï Ibiza · Ibiza','72% vendido',`text-[${A2}]`],['14 JUN','Sónar · Barcelona','Tickets →','text-white/40']].map(([d,v,s,sc]) => (
          <div key={d} className="flex items-center gap-3">
            <div className="text-center shrink-0 w-9">
              <div className="font-display font-semibold text-sm text-white leading-none">{d.split(' ')[0]}</div>
              <div className="text-[9px] font-mono text-white/35">{d.split(' ')[1]}</div>
            </div>
            <div className="flex-1 text-[12px] font-mono text-white/60">{v}</div>
            <div className={`text-[11px] font-mono ${sc}`}>{s}</div>
          </div>
        ))}
      </div>
      {/* Floating chips */}
      <div className="relative h-8 px-4 flex items-center gap-2 mb-2">
        {['+340 leads · 7d','Booking · Awakenings'].map((t,i) => (
          <div key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono border border-white/[0.08]" style={{ background: `${A1}12`, color: A2 }}>
            <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: A1 }} />{t}
          </div>
        ))}
      </div>
    </div>
  )
}

function HeroOrb() {
  return (
    <div className="flex items-center justify-center py-12 relative" style={{ minHeight: 360 }}>
      <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
        {[1,2,3].map(i => (
          <motion.div key={i} className="absolute rounded-full border border-white/[0.07]"
            animate={{ scale:[1,1.04,1], opacity:[0.4,0.7,0.4] }}
            transition={{ duration: 3+i, repeat: Infinity, delay: i*0.8 }}
            style={{ width: 100+i*70, height: 100+i*70 }} />
        ))}
        <motion.div className="absolute rounded-full"
          animate={{ scale:[1,1.08,1] }} transition={{ duration: 4, repeat: Infinity }}
          style={{ width:180, height:180, background:`radial-gradient(ellipse, ${A2}99, ${A1}55, ${A3}22)`, filter:'blur(12px)' }} />
        <div className="absolute rounded-full" style={{ width:120, height:120, background:`radial-gradient(ellipse, #fff 0%, ${A2}CC 40%, ${A1}88 70%)`, filter:'blur(4px)', opacity:0.9 }} />
      </div>
      <div className="absolute flex flex-col gap-2 right-0 top-8">
        {['Frecuencia · 432 Hz','Audiencia · 8.2K','Shows · +14 mes'].map((t,i) => (
          <div key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono border border-white/[0.08]" style={{ background:`${A1}12`, color:A2 }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:A1 }} />{t}
          </div>
        ))}
      </div>
    </div>
  )
}

function HeroWaveform() {
  return (
    <div className="rounded-2xl border border-white/[0.09] p-6" style={{ background: '#08080f' }}>
      <div className="flex items-center gap-2 mb-5 text-[11px] font-mono text-white/40">
        <span className="w-2 h-2 rounded-full" style={{ background: '#ef4444', boxShadow: '0 0 6px #ef4444' }} />
        LIVE · ANÁLISIS IA
      </div>
      <div className="flex items-end gap-0.5 h-24 mb-4">
        {Array.from({length:60}).map((_,i) => (
          <motion.div key={i} className="flex-1 rounded-full"
            animate={{ height: ['30%','100%','30%'] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: (i*0.03)%1.6, ease:'easeInOut' }}
            style={{ background:`linear-gradient(to top, ${A1}, ${A2})`, opacity: 0.7+Math.sin(i*0.4)*0.3 }} />
        ))}
      </div>
      <div className="flex justify-between text-[11px] font-mono text-white/30">
        <span>00:02:47 / 04:12</span>
        <span>Track · Midnight Protocol</span>
      </div>
    </div>
  )
}

// ─── Problem ───────────────────────────────────────────────────────────────────
function Problem() {
  return (
    <section className="py-28 md:py-36 relative" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        <FadeIn className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-block text-[11px] font-mono text-white/35 tracking-widest mb-6">01 · El problema</div>
          <h2 className="font-display font-semibold text-white mb-6 leading-[0.92] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(2rem,5vw,3.6rem)' }}>
            Un link de bio no es <Iridescent>una carrera.</Iridescent>
          </h2>
          <p className="text-white/50 text-base md:text-lg">Así se ve hoy la presencia digital de un artista. Así debería verse.</p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_60px_1fr] gap-6 lg:gap-0 items-start">
          {/* BEFORE — Linktree */}
          <FadeIn delay={0.05}>
            <div className="rounded-2xl overflow-hidden border border-white/[0.06]" style={{ background:'rgba(255,255,255,0.02)' }}>
              <div className="flex items-center justify-between p-4 border-b border-white/[0.05]">
                <div className="flex items-center gap-2 text-[11px] font-mono text-red-400/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />ANTES · Linktree / bio en IG
                </div>
                <span className="text-[10px] font-mono text-red-400/60 border border-red-400/20 px-2 py-0.5 rounded-full">GENÉRICO</span>
              </div>
              {/* Phone mockup */}
              <div className="flex justify-center py-6 px-4">
                <div className="w-48 rounded-2xl overflow-hidden border border-white/[0.08] p-4 flex flex-col items-center gap-2.5" style={{ background:'#111' }}>
                  <div className="w-12 h-12 rounded-full bg-white/10" />
                  <div className="text-[12px] font-mono text-white/60">@kora_music</div>
                  <div className="text-[10px] font-mono text-white/30 mb-1">DJ / Producer · Bookings DM</div>
                  {['🎵 Spotify','🔗 Press kit (404)','📧 kora.music.info@gma...','📱 Instagram','☁️ Soundcloud','📀 Beatport','▶️ YouTube'].map((btn, i) => (
                    <div key={i} className={`w-full py-2 rounded-lg text-center text-[10px] font-mono border ${btn.includes('404') ? 'border-red-400/30 text-red-400/60' : 'border-white/[0.08] text-white/40'}`}
                      style={{ background: btn.includes('404') ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.03)' }}>
                      {btn}
                    </div>
                  ))}
                  <div className="text-[9px] font-mono text-white/15 mt-1">powered by linktree</div>
                </div>
              </div>
              <div className="px-5 pb-5 flex flex-col gap-2">
                {['Diseño genérico de plantilla','Cero datos de quién clickeó','Audiencia no es tuya','Bookers no te toman en serio','Archivos dispersos en Drive'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-white/40 font-mono">
                    <span className="text-red-400">×</span>{item}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Arrow divider */}
          <div className="hidden lg:flex flex-col items-center justify-center h-full gap-2 pt-32">
            <div className="w-px h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            <div className="w-8 h-8 rounded-full flex items-center justify-center border border-white/[0.1] text-sm font-mono" style={{ background:`${A1}15`, color:A1 }}>→</div>
            <div className="text-[10px] font-mono tracking-widest" style={{ color:A1, writingMode:'vertical-rl', letterSpacing:'0.2em' }}>ARTIX</div>
            <div className="w-px h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          </div>

          {/* AFTER — ARTIX site */}
          <FadeIn delay={0.12}>
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor:`${A1}35`, background:`${A1}06` }}>
              <div className="flex items-center justify-between p-4 border-b" style={{ borderColor:`${A1}18` }}>
                <div className="flex items-center gap-2 text-[11px] font-mono" style={{ color:A2 }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:A1 }} />AHORA · tu web ARTIX
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border" style={{ color:A2, borderColor:`${A1}40`, background:`${A1}15` }}>★ PREMIUM</span>
              </div>
              {/* Browser chrome */}
              <div className="p-3 border-b" style={{ borderColor:`${A1}12`, background:`${A1}05` }}>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500/60"/><div className="w-2 h-2 rounded-full bg-yellow-500/60"/><div className="w-2 h-2 rounded-full bg-green-500/60"/></div>
                  <div className="flex-1 mx-2 px-2.5 py-1 rounded text-[10px] font-mono text-center border" style={{ borderColor:`${A1}20`, color:`${A2}80`, background:`${A1}08` }}>🔒 solen.fm</div>
                </div>
              </div>
              {/* Hero photo area */}
              <div className="relative h-32 overflow-hidden" style={{ background:'linear-gradient(135deg,#1a0535,#0a0a1a)' }}>
                <div className="absolute inset-0 opacity-30" style={{ background:`radial-gradient(ellipse at top right, ${A1}66, transparent 60%)` }} />
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <div className="font-display font-semibold text-2xl text-white tracking-tight">SOLEN.</div>
                  <div className="text-[11px] font-mono text-white/40">Melodic Techno · Berlín</div>
                </div>
                <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-mono border" style={{ background:`${A1}20`, borderColor:`${A1}40`, color:A2 }}>
                  <span className="w-1 h-1 rounded-full animate-pulse" style={{ background:A1 }} />LIVE tonight
                </div>
              </div>
              {/* Panels */}
              <div className="grid grid-cols-2 gap-px" style={{ background:`${A1}15` }}>
                {[['PRÓXIMO SHOW','Berghain · 23.05'],['NUEVO EP','+340 pre-saves hoy']].map(([l,v],i) => (
                  <div key={i} className="p-3" style={{ background:'#07050f' }}>
                    <div className="text-[9px] font-mono text-white/25 mb-1">{l}</div>
                    <div className="text-[12px] font-mono" style={{ color:A2 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div className="p-4 flex flex-col gap-2">
                {['Diseño único con IA','Cada visita = lead capturado','Audiencia tuya para siempre','Press kit + rider profesional','Vende tickets y drops directo'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm font-mono" style={{ color:`${A2}CC` }}>
                    <Check className="w-3 h-3" style={{ color:A1 }} />{item}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Result metrics */}
        <FadeIn delay={0.2} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {[['×3','Más bookings','en 90 días',A1],['×7','Conversión','vs Linktree','#06b6d4'],['0%','Dependencia','del algoritmo','#10b981'],['100%','Datos de','tu audiencia','#f59e0b']].map(([n,l1,l2,c]) => (
            <div key={l1} className="rounded-xl p-4 text-center border border-white/[0.05]" style={{ background:'rgba(255,255,255,0.02)' }}>
              <div className="font-display font-semibold text-3xl tracking-tight" style={{ color:c as string }}>{n}</div>
              <div className="text-[11px] font-mono text-white/35 mt-1.5">{l1}<br/>{l2}</div>
            </div>
          ))}
        </FadeIn>
      </div>
    </section>
  )
}

// ─── Transformation ────────────────────────────────────────────────────────────
const ARTIST_PROFILES = [
  {
    id: 'solen', name: 'SOLEN.', handle: 'solen.fm', role: 'Melodic Techno · DJ / Producer',
    location: 'Berlín · Barcelona', since: 'Desde 2018',
    bio: 'Solen construye paisajes sonoros hipnóticos entre el techno melódico y el progressive. Residente en Watergate Berlín y Hï Ibiza.',
    stats: [['4.2M','Reproducciones'],['184K','Oyentes/mes'],['87','Shows'],['312K','Seguidores']],
    tracks: [['01','Midnight Protocol','07:42','Aurora EP · 2026'],['02','Chrome Dust','06:18','Aurora EP · 2026'],['03','Signal / Noise','08:04','Single · 2025'],['04','Solar Drift','07:56','Parallel LP · 2025'],['05','Berlin Requiem','09:12','Parallel LP · 2025']],
    shows: [['23 MAY','Berghain · Klubnacht','Berlín'],['07 JUN','Hï Ibiza · Main Room','Ibiza'],['14 JUN','Sónar Festival','Barcelona'],['28 JUN','Awakenings','Ámsterdam'],['12 JUL','Tomorrowland · Crystal Garden','Boom']],
    press: ['Mixmag','Resident Advisor','DJ Mag Top 100','Beatport Charts'],
  },
  {
    id: 'okara', name: 'OKARA', handle: 'okara.fm', role: 'Afrohouse · DJ / Live',
    location: 'Johannesburgo · Londres', since: 'Desde 2015',
    bio: 'Okara fusiona raíces sudafricanas con house progresivo. Giras por África, Europa y Norteamérica con Innervisions y Rise Music.',
    stats: [['12.8M','Reproducciones'],['620K','Oyentes/mes'],['142','Shows'],['890K','Seguidores']],
    tracks: [['01','Ancestral Code','08:22','Roots / Future · 2026'],['02','Black Sun','07:14','Roots / Future · 2026'],['03','Umfundisi (Remix)','09:48','Single · 2025']],
    shows: [['18 MAY','Fabric London','Londres'],['01 JUN','Afrikan Basement','Nueva York'],['21 JUN','Kappa FuturFestival','Turín']],
    press: ['Mixmag','DJ Mag África','Boiler Room'],
  },
  {
    id: 'vela', name: 'VELA DRIFT', handle: 'veladrift.fm', role: 'Minimal · DJ / Producer',
    location: 'Ámsterdam', since: 'Desde 2020',
    bio: 'Sonido minimal con texturas orgánicas. Residente en De School y DGTL. Cinco EPs auto-editados, más de 200K oyentes mensuales.',
    stats: [['2.1M','Reproducciones'],['214K','Oyentes/mes'],['64','Shows'],['128K','Seguidores']],
    tracks: [['01','Quiet Machines','06:32','Grain EP · 2026'],['02','Soft Architecture','07:08','Grain EP · 2026'],['03','Static Bloom','08:14','Single · 2026']],
    shows: [['30 MAY','De School','Ámsterdam'],['15 JUN','DGTL Festival','Ámsterdam'],['05 JUL','Nitsa Club','Barcelona']],
    press: ['Mixmag Holanda','Beatport'],
  },
]

function Transformation() {
  const [active, setActive] = useState('solen')
  const artist = ARTIST_PROFILES.find(a => a.id === active)!

  return (
    <section className="py-28 md:py-36" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        <FadeIn className="text-center mb-6">
          <div className="inline-block text-[11px] font-mono text-white/35 tracking-widest mb-6">02 · Esto es lo que construyes</div>
          <h2 className="font-display font-semibold text-white mb-6 leading-[0.92] tracking-[-0.03em]"
            style={{ fontSize:'clamp(2rem,5vw,3.6rem)' }}>
            Perfiles de <Iridescent>nivel internacional.</Iridescent>
          </h2>
          <p className="text-white/50 text-base md:text-lg max-w-xl mx-auto">
            Tres ejemplos de lo que los artistas crean en ARTIX. Todo generado con IA en 3 minutos.
          </p>
        </FadeIn>

        {/* Profile selector */}
        <FadeIn delay={0.08} className="flex gap-3 justify-center flex-wrap mb-8">
          {ARTIST_PROFILES.map(p => (
            <button key={p.id} onClick={() => setActive(p.id)}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-mono transition-all cursor-pointer"
              style={{
                background: active === p.id ? `${A1}18` : 'rgba(255,255,255,0.02)',
                borderColor: active === p.id ? `${A1}50` : 'rgba(255,255,255,0.07)',
                color: active === p.id ? A2 : 'rgba(255,255,255,0.45)',
              }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: active === p.id ? A1 : 'rgba(255,255,255,0.2)' }} />
              {p.name}
              <span className="text-[10px] opacity-60">{p.role.split(' · ')[0]}</span>
            </button>
          ))}
        </FadeIn>

        {/* Profile showcase — browser */}
        <AnimatePresence mode="wait">
          <motion.div key={artist.id} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }} transition={{ duration:0.3 }}
            className="rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl"
            style={{ background:'#08080f' }}>
            {/* Chrome */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.06]" style={{ background:'#05050c' }}>
              <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500/70"/><div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"/><div className="w-2.5 h-2.5 rounded-full bg-green-500/70"/></div>
              <div className="flex-1 mx-4 px-3 py-1 rounded text-[11px] font-mono text-center border border-white/[0.07] text-white/35" style={{ background:'rgba(255,255,255,0.03)' }}>🔒 {artist.handle}</div>
              <div className="flex gap-2 text-[12px] font-mono text-white/20"><span>⌕</span><span>↗</span></div>
            </div>
            {/* Scrollable profile */}
            <div className="overflow-auto max-h-[520px]">
              {/* Hero band */}
              <div className="relative h-40 flex items-end p-6" style={{ background:'linear-gradient(135deg,#1a0535,#080814)' }}>
                <div className="absolute inset-0 opacity-25" style={{ background:`radial-gradient(ellipse at top right, ${A1}66, transparent 60%)` }} />
                <div className="relative z-10">
                  <div className="font-display font-semibold text-3xl text-white tracking-tight leading-none">{artist.name}</div>
                  <div className="flex flex-wrap gap-2 mt-2 text-[11px] font-mono text-white/40">
                    <span>{artist.role}</span><span>·</span><span>{artist.location}</span><span>·</span><span>{artist.since}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <div className="px-4 py-1.5 rounded-full text-[11px] font-mono font-semibold text-black" style={{ background:`linear-gradient(135deg,${A3},${A1})` }}>▶ Última release</div>
                    <div className="px-4 py-1.5 rounded-full text-[11px] font-mono border border-white/20 text-white/60">Booking / Contacto</div>
                  </div>
                </div>
              </div>
              {/* Stats bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 border-b border-white/[0.06]">
                {artist.stats.map(([n,l]) => (
                  <div key={l} className="p-4 border-r border-white/[0.06] last:border-r-0">
                    <div className="font-display font-semibold text-lg text-white">{n}</div>
                    <div className="text-[11px] font-mono text-white/35 mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
              {/* Grid: bio + tracks */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
                <div className="p-5">
                  <div className="text-[11px] font-mono text-white/30 tracking-widest mb-3">Bio</div>
                  <p className="text-sm text-white/55 leading-relaxed mb-4">{artist.bio}</p>
                  <div className="text-[11px] font-mono text-white/30 tracking-widest mb-2">Featured in</div>
                  <div className="flex flex-wrap gap-2">
                    {artist.press.map(p => (
                      <span key={p} className="px-2.5 py-1 rounded border text-[10px] font-mono text-white/40 border-white/[0.08]" style={{ background:'rgba(255,255,255,0.02)' }}>{p}</span>
                    ))}
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-[11px] font-mono text-white/30 tracking-widest mb-3">Latest tracks</div>
                  <div className="flex flex-col gap-2.5">
                    {artist.tracks.map(([n,t,d,ep]) => (
                      <div key={n} className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-5 h-5 rounded-full border border-white/[0.1] flex items-center justify-center text-[9px] font-mono text-white/30 group-hover:border-white/30 transition-colors shrink-0">▶</div>
                        <span className="text-[10px] font-mono text-white/25 w-5">{n}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-mono text-white/75 truncate">{t}</div>
                          <div className="text-[10px] font-mono text-white/30">{ep}</div>
                        </div>
                        <span className="text-[11px] font-mono text-white/30">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Shows */}
              <div className="p-5 border-t border-white/[0.06]">
                <div className="text-[11px] font-mono text-white/30 tracking-widest mb-4">Próximas fechas · World tour</div>
                <div className="flex flex-col gap-3">
                  {artist.shows.map(([d,v,c]) => (
                    <div key={d} className="flex items-center gap-4">
                      <div className="text-[11px] font-mono text-white/40 w-14 shrink-0">{d}</div>
                      <div className="flex-1">
                        <div className="text-sm font-mono text-white/70">{v}</div>
                        <div className="text-[10px] font-mono text-white/30">{c}</div>
                      </div>
                      <div className="text-[11px] font-mono border border-white/[0.1] px-3 py-1 rounded-full text-white/40 hover:text-white transition-colors cursor-pointer">Tickets →</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Press kit */}
              <div className="p-5 border-t border-white/[0.06]">
                <div className="text-[11px] font-mono text-white/30 tracking-widest mb-4">Professional Kit</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[['📄','Press Kit EN/ES','PDF · 2.4 MB'],['🎛','Technical Rider','v2.1 · actualizado'],['📷','Hi-Res Photos','12 fotos · ZIP'],['📑','Hospitality','Auto-enviado']].map(([ico,l,s]) => (
                    <div key={l} className="rounded-xl p-3 border border-white/[0.06] text-center" style={{ background:'rgba(255,255,255,0.02)' }}>
                      <div className="text-xl mb-2">{ico}</div>
                      <div className="text-[11px] font-mono text-white/65">{l}</div>
                      <div className="text-[10px] font-mono text-white/30 mt-0.5">{s}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <FadeIn delay={0.15} className="flex flex-wrap justify-center gap-4 mt-8 text-[11px] font-mono text-white/30">
          {['100% personalizable','Dominio propio','Generado en 3 min','Actualizado en vivo'].map(t => (
            <span key={t} className="flex items-center gap-1.5"><span style={{ color:A1 }}>✓</span>{t}</span>
          ))}
        </FadeIn>
      </div>
    </section>
  )
}

// ─── Features (sticky horizontal scroll) ─────────────────────────────────────
const FEATURES = [
  { num:'01', title:'Web profesional', accent:'en 3 minutos', desc:'Describe tu estilo. La IA construye una web única con tu música, tu estética y tu dominio propio. Sin código. Sin plantillas genéricas.', viz:'prompt' },
  { num:'02', title:'Press kit y rider,', accent:'siempre listos', desc:'Bio, fotos alta resolución, rider técnico, hospitality. Un enlace para mandar a cualquier booker. Siempre actualizado.', viz:'presskit' },
  { num:'03', title:'Captura leads', accent:'que son tuyos', desc:'Cada visitante es un fan potencial. Emails reales, segmentados y exportables. Tu audiencia no vive en Instagram.', viz:'leads' },
  { num:'04', title:'Email marketing', accent:'sin fricción', desc:'Campañas para anunciar lanzamientos, shows o drops. Tasas de apertura 3× superiores a redes sociales.', viz:'email' },
  { num:'05', title:'Dashboard', accent:'en tiempo real', desc:'Visitas, reproducciones, crecimiento, conversión. Todo en una sola vista. Sabes exactamente qué funciona.', viz:'analytics' },
  { num:'06', title:'IA que te', accent:'sugiere la siguiente jugada', desc:'Analiza tu carrera y te dice qué contenido publicar, a qué ciudades apuntar, con qué artistas colaborar.', viz:'ai' },
  { num:'07', title:'Integración', accent:'con todo', desc:'Spotify, Apple Music, Beatport, Bandcamp, SoundCloud. Sincronización automática de tu catálogo.', viz:'music' },
]

function FeatureViz({ kind }: { kind: string }) {
  const base = 'rounded-xl border border-white/[0.07] p-4 mt-auto text-[11px] font-mono'
  const bg = 'rgba(255,255,255,0.02)'
  if (kind === 'prompt') return (
    <div className={base} style={{ background:bg }}>
      <div className="text-white/40 mb-1.5">DJ techno · minimal · berlín underground</div>
      <div className="text-white/40 mb-3">paleta: morado iridiscente + chrome</div>
      <div className="flex items-center gap-1.5" style={{ color:A2 }}>Generando web<span className="flex gap-0.5 ml-1">{[0,1,2].map(i=><motion.span key={i} animate={{opacity:[0,1,0]}} transition={{duration:1.2,delay:i*0.2,repeat:Infinity}} className="w-1 h-1 rounded-full" style={{background:A1}}/>)}</span></div>
    </div>
  )
  if (kind === 'presskit') return (
    <div className={base} style={{ background:bg }}>
      {[['Bio EN','✓ OK'],['Bio ES','✓ OK'],['Rider','v2.1'],['Fotos HR','12'],['Enlace pública','artix.fm/solen/press']].map(([l,v]) => (
        <div key={l} className="flex justify-between py-1.5 border-b border-white/[0.05] last:border-0">
          <span className="text-white/40">{l}</span>
          <span style={{ color:v.includes('✓')?A1:A2 }}>{v}</span>
        </div>
      ))}
    </div>
  )
  if (kind === 'leads') return (
    <div className={base} style={{ background:bg }}>
      <div className="flex items-baseline gap-2 mb-3"><span className="font-display text-2xl font-semibold text-white">8,247</span><span style={{ color:A2 }}>+340 / 7d</span></div>
      {[['lucas@eu.music','BOOKER'],['mia@razzmatazz.com','VENUE'],['alex@...fan.com','FAN']].map(([e,t]) => (
        <div key={e} className="flex justify-between py-1.5 border-b border-white/[0.05] last:border-0">
          <span className="text-white/45">{e}</span>
          <span className="px-1.5 py-0.5 rounded text-[9px]" style={{ background:`${A1}20`, color:A1 }}>{t}</span>
        </div>
      ))}
    </div>
  )
  if (kind === 'email') return (
    <div className={base} style={{ background:bg }}>
      {[['Tour 2026 · 14 fechas','52% OPEN'],['Nuevo EP · Midnight Protocol','61% OPEN'],['Lista VIP · early access','74% OPEN'],['Borrador · Summer residency','—']].map(([s,r]) => (
        <div key={s} className="flex items-center justify-between py-1.5 border-b border-white/[0.05] last:border-0 gap-3">
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background:r==='—'?'rgba(255,255,255,0.2)':A1 }} /><span className="text-white/50 truncate">{s}</span></div>
          <span style={{ color:r==='—'?'rgba(255,255,255,0.2)':A2 }}>{r}</span>
        </div>
      ))}
    </div>
  )
  if (kind === 'analytics') return (
    <div className={base} style={{ background:bg }}>
      <div className="text-white/30 mb-2 text-[10px] tracking-widest">VISITAS · ÚLTIMOS 30D</div>
      <svg viewBox="0 0 300 100" className="w-full" preserveAspectRatio="none" style={{ height:70 }}>
        <defs><linearGradient id="agr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={A1} stopOpacity="0.4"/><stop offset="1" stopColor={A1} stopOpacity="0"/></linearGradient></defs>
        <path d="M0,80 C30,70 60,75 90,58 S160,35 200,40 S260,20 300,12 L300,100 L0,100 Z" fill="url(#agr)"/>
        <path d="M0,80 C30,70 60,75 90,58 S160,35 200,40 S260,20 300,12" fill="none" stroke={A2} strokeWidth="2"/>
        <circle cx="300" cy="12" r="3" fill="#fff"/><circle cx="300" cy="12" r="8" fill={A1} opacity="0.3"/>
      </svg>
      <div className="flex items-baseline gap-2 mt-2"><span className="font-display text-lg font-semibold text-white">124,824</span><span style={{ color:A2 }}>+38%</span></div>
    </div>
  )
  if (kind === 'ai') return (
    <div className={base + ' flex flex-col gap-3'} style={{ background:bg }}>
      {[['IA · Crecimiento','Tu audiencia crece 2.4× más rápido en Berlín. Considera un show allí en Q2.'],['IA · Colaboración','3 artistas con audiencia afín buscan featurings este mes.']].map(([t,d]) => (
        <div key={t} className="rounded-lg p-3 border border-white/[0.06]" style={{ background:`${A1}08` }}>
          <span className="inline-block text-[9px] font-mono px-2 py-0.5 rounded mb-1.5" style={{ background:`${A1}25`, color:A2 }}>{t}</span>
          <p className="text-white/50 text-[11px] leading-relaxed">{d}</p>
        </div>
      ))}
    </div>
  )
  if (kind === 'music') return (
    <div className={base} style={{ background:bg }}>
      {[['Spotify','84.2K'],['Beatport','12 tracks'],['SoundCloud','38.1K'],['Bandcamp','4 albums']].map(([n,v]) => (
        <div key={n} className="flex items-center justify-between py-1.5 border-b border-white/[0.05] last:border-0">
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background:A1 }} /><span className="text-white/55">{n}</span></div>
          <span style={{ color:A2 }}>{v}</span>
        </div>
      ))}
    </div>
  )
  return null
}

function Features() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], ['0px', '-1px']) // placeholder; real calc in effect

  useEffect(() => {
    const wrap = wrapRef.current
    const track = trackRef.current
    const fill = fillRef.current
    if (!wrap || !track) return
    const onScroll = () => {
      const rect = wrap.getBoundingClientRect()
      const total = wrap.offsetHeight - window.innerHeight
      const scrolled = Math.max(0, -rect.top)
      const progress = Math.max(0, Math.min(1, scrolled / total))
      const maxShift = track.scrollWidth - window.innerWidth + 80
      track.style.transform = `translateX(${-progress * maxShift}px)`
      if (fill) fill.style.width = `${progress * 100}%`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // suppress unused warning
  void x

  return (
    <section id="features" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
      <div ref={wrapRef} style={{ height: `${100 + FEATURES.length * 80}vh` }}>
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
          <div className="px-5 md:px-10 max-w-3xl mb-10">
            <FadeIn>
              <div className="text-[11px] font-mono text-white/35 tracking-widest mb-5">03 · Producto</div>
              <h2 className="font-display font-semibold text-white leading-[0.92] tracking-[-0.03em] mb-4"
                style={{ fontSize:'clamp(2rem,5vw,3.4rem)' }}>
                Siete herramientas.<br /><Iridescent>Una sola plataforma.</Iridescent>
              </h2>
              <p className="text-white/45 text-base">Cada pieza diseñada para artistas que toman su carrera en serio. Desplázate para explorar.</p>
            </FadeIn>
          </div>
          <div className="relative overflow-hidden">
            <div ref={trackRef} className="flex gap-5 px-5 md:px-10 pb-1 transition-transform duration-100 ease-out" style={{ willChange:'transform', width:'max-content' }}>
              {FEATURES.map(f => (
                <div key={f.num} className="flex-shrink-0 w-72 md:w-80 rounded-2xl p-5 border border-white/[0.07] flex flex-col gap-4" style={{ background:'rgba(255,255,255,0.025)', minHeight:320 }}>
                  <div className="text-[11px] font-mono text-white/25">{f.num} / 07</div>
                  <h3 className="font-display font-semibold text-white leading-tight text-lg">
                    {f.title}{' '}<span style={{ color:A2 }}>{f.accent}</span>
                  </h3>
                  <p className="text-sm text-white/45 leading-relaxed">{f.desc}</p>
                  <FeatureViz kind={f.viz} />
                </div>
              ))}
            </div>
            {/* Progress bar */}
            <div className="mx-5 md:mx-10 mt-4 h-px bg-white/[0.06] rounded-full overflow-hidden" style={{ maxWidth:400 }}>
              <div ref={fillRef} className="h-full rounded-full transition-all duration-100" style={{ background:`linear-gradient(to right, ${A3}, ${A1})`, width:'0%' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Monetize ─────────────────────────────────────────────────────────────────
function Monetize() {
  const [step, setStep] = useState(0)
  const steps = [
    { k:'capture', t:'Captura', d:'Un visitante deja su email por un unreleased track.' },
    { k:'segment', t:'Segmenta', d:'La IA clasifica: fan, booker, venue, media, VIP.' },
    { k:'launch', t:'Lanza', d:'Envías entradas, drops o música directa a quien importa.' },
    { k:'convert', t:'Convierte', d:'Tickets vendidos, releases en top, data 100% tuya.' },
  ]
  useEffect(() => {
    const iv = setInterval(() => setStep(s => (s+1)%4), 3200)
    return () => clearInterval(iv)
  }, [])

  return (
    <section className="py-28 md:py-36" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        <FadeIn className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-block text-[11px] font-mono text-white/35 tracking-widest mb-6">03 · Monetización directa</div>
          <h2 className="font-display font-semibold text-white mb-6 leading-[0.92] tracking-[-0.03em]"
            style={{ fontSize:'clamp(2rem,5vw,3.6rem)' }}>
            De un email <Iridescent>a un sold out.</Iridescent>
          </h2>
          <p className="text-white/50 text-base md:text-lg">Los emails que capturas no son lista, son una máquina de ventas. Lanza música, vende entradas y conoce a tu audiencia.</p>
        </FadeIn>

        {/* Flow */}
        <FadeIn delay={0.08} className="mb-20">
          {/* Steps */}
          <div className="relative flex flex-col sm:flex-row gap-4 mb-8">
            {steps.map((s, i) => (
              <button key={s.k} onClick={() => setStep(i)}
                className="flex-1 rounded-xl p-4 border text-left transition-all duration-200 cursor-pointer"
                style={{
                  background: step === i ? `${A1}15` : 'rgba(255,255,255,0.02)',
                  borderColor: step === i ? `${A1}45` : 'rgba(255,255,255,0.06)',
                }}>
                <div className="text-[11px] font-mono text-white/30 mb-1">0{i+1}</div>
                <div className="font-display font-semibold text-sm text-white mb-1" style={{ color: step===i ? A2 : undefined }}>{s.t}</div>
                <div className="text-[12px] text-white/40 leading-relaxed">{s.d}</div>
              </button>
            ))}
            {/* Progress line */}
            <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background:'rgba(255,255,255,0.06)' }}>
              <motion.div className="h-full" animate={{ width:`${(step/3)*100}%` }} transition={{ duration:0.4 }}
                style={{ background:`linear-gradient(to right, ${A3}, ${A1})` }} />
            </div>
          </div>
          {/* Demo panel */}
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} transition={{ duration:0.25 }}
              className="rounded-2xl border border-white/[0.07] overflow-hidden" style={{ background:'rgba(255,255,255,0.025)' }}>
              {step === 0 && (
                <div className="p-8 flex flex-col items-center gap-4 max-w-md mx-auto text-center">
                  <div className="text-[11px] font-mono text-white/30 tracking-widest">CAPTURA EN TU WEB</div>
                  <div className="font-display font-semibold text-white text-xl">Unlock · Aurora EP preview</div>
                  <div className="text-sm text-white/45">Accede al EP 48h antes del drop oficial.</div>
                  <div className="w-full flex gap-2 mt-2">
                    <div className="flex-1 px-4 py-3 rounded-xl border border-white/[0.1] text-sm font-mono text-white/25" style={{ background:'rgba(255,255,255,0.03)' }}>tu-email@...</div>
                    <div className="px-5 py-3 rounded-xl text-sm font-mono text-white font-semibold" style={{ background:`linear-gradient(135deg,${A3},${A1})` }}>Acceder →</div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono" style={{ color:A2 }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:A1 }} />2,847 ya dentro
                  </div>
                </div>
              )}
              {step === 1 && (
                <div className="p-8">
                  <div className="text-[11px] font-mono text-white/30 tracking-widest mb-5">SEGMENTACIÓN IA · AUTOMÁTICA</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[['FANS','6,840',A1],['VIP','418','#f59e0b'],['BOOKERS','127','#06b6d4'],['MEDIA','64','#10b981']].map(([t,n,c]) => (
                      <div key={t} className="rounded-xl p-4 text-center border border-white/[0.06]" style={{ background:'rgba(255,255,255,0.03)' }}>
                        <div className="text-[10px] font-mono px-2 py-0.5 rounded-full inline-block mb-2" style={{ background:`${c}22`, color:c as string }}>{t}</div>
                        <div className="font-display font-semibold text-xl text-white">{n}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-[12px] font-mono text-white/30 text-center">→ Cada uno recibe mensajes diferentes</div>
                </div>
              )}
              {step === 2 && (
                <div className="p-8">
                  <div className="text-[11px] font-mono text-white/30 tracking-widest mb-5">CAMPAÑAS ACTIVAS</div>
                  <div className="flex flex-col gap-3">
                    {[['🎫','Berlín · 23.05 · Berghain','A VIPs + Fans Alemania','740 vendidas'],['💿','Aurora EP · 48h early access','A todos los fans','61% open'],['🎛','Press release · Summer Tour','A 64 contactos media','18 features']].map(([ico,t,sub,n]) => (
                      <div key={t} className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.06]" style={{ background:'rgba(255,255,255,0.02)' }}>
                        <span className="text-xl shrink-0">{ico}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-mono text-white/65 truncate">{t}</div>
                          <div className="text-[11px] font-mono text-white/30">{sub}</div>
                        </div>
                        <div className="text-sm font-mono shrink-0" style={{ color:A2 }}>{n}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="p-8">
                  <div className="text-[11px] font-mono text-white/30 tracking-widest mb-5">RESULTADOS · ÚLTIMOS 30 DÍAS</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[['€18,240','Tickets vendidos directo',A1],['2,847','Pre-saves EP',A2],['×4.2','ROI vs Instagram ads','#f59e0b'],['100%','Datos tuyos','#10b981']].map(([n,l,c]) => (
                      <div key={l} className="rounded-xl p-4 border border-white/[0.06]" style={{ background:'rgba(255,255,255,0.02)' }}>
                        <div className="font-display font-semibold text-xl mb-1" style={{ color:c as string }}>{n}</div>
                        <div className="text-[11px] font-mono text-white/35">{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </FadeIn>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { t:'Vende entradas directo', d:'Sin comisiones de ticketeras. El 100% de la venta es tuyo. QR automático al comprador.', m:'0% comisión · €18K este mes', color:A1,
              viz: <div className="flex flex-col gap-2">
                {['BERGHAIN · 23.05 · Berlín','HÏ IBIZA · 07.06 · Ibiza'].map((v,i)=>(
                  <div key={v} className="rounded-lg border border-white/[0.08] p-3 flex items-center gap-3" style={{ background:'rgba(255,255,255,0.02)', opacity:1-i*0.25 }}>
                    <div className="w-8 h-10 rounded border border-dashed border-white/20 flex items-center justify-center text-[9px] font-mono text-white/30">QR</div>
                    <div><div className="text-[11px] font-mono text-white/60">{v}</div><div className="text-[9px] font-mono text-white/30 mt-0.5">Acceso directo</div></div>
                  </div>
                ))}
              </div>
            },
            { t:'Lanza música a tu base', d:'Pre-saves, early access y bundles físicos. Tus fans escuchan antes que en plataformas.', m:'48h antes · 61% open rate', color:'#06b6d4',
              viz: <div>
                <div className="rounded-lg p-3 border border-white/[0.08] mb-3 flex items-center gap-3" style={{ background:'rgba(255,255,255,0.02)' }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg" style={{ background:`linear-gradient(135deg,${A3},${A1})` }}>🎵</div>
                  <div><div className="text-[11px] font-mono text-white/60">AURORA EP</div><div className="text-[10px] font-mono" style={{ color:'#06b6d4' }}>2,847 pre-saves</div></div>
                </div>
                {[['Pre-saves',84],['Early access',62],['Bundle vinilo',38]].map(([l,v])=>(
                  <div key={l as string} className="mb-2">
                    <div className="flex justify-between text-[10px] font-mono text-white/30 mb-1"><span>{l}</span><span>{v}%</span></div>
                    <div className="h-1 rounded-full bg-white/[0.06]"><div className="h-full rounded-full" style={{ width:`${v}%`, background:'#06b6d4' }} /></div>
                  </div>
                ))}
              </div>
            },
            { t:'Tu data, tu propiedad', d:'Exporta en un click. Cumplimiento GDPR total. Tu lista es tuya — hoy y siempre.', m:'100% portable · 1 click export', color:'#10b981',
              viz: <div className="rounded-lg border border-white/[0.08] overflow-hidden" style={{ background:'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center gap-2 p-3 border-b border-white/[0.06]">
                  <span className="text-base">⬇</span>
                  <div><div className="text-[11px] font-mono text-white/60">audience_export.csv</div><div className="text-[10px] font-mono text-white/30">8,247 rows · 1.2 MB</div></div>
                </div>
                {[['lucas@','BOOK','#06b6d4'],['mia@razz','VENUE','#a855f7'],['alex@fan','FAN','#10b981'],['sara@ed','MEDIA','#f59e0b']].map(([e,t,c])=>(
                  <div key={e} className="flex justify-between items-center px-3 py-1.5 border-b border-white/[0.04] last:border-0">
                    <span className="text-[11px] font-mono text-white/40">{e}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background:`${c}20`, color:c }}>{t}</span>
                  </div>
                ))}
              </div>
            },
            { t:'Re-engagement automático', d:'La IA detecta fans fríos y los reactiva con contenido personalizado. Tú no mueves un dedo.', m:'24% reactivación · 0 esfuerzo', color:'#f59e0b',
              viz: <div>
                <svg viewBox="0 0 220 90" className="w-full" style={{ height:70 }}>
                  <defs><linearGradient id="regr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={A1} stopOpacity="0.5"/><stop offset="1" stopColor={A1} stopOpacity="0"/></linearGradient></defs>
                  <path d="M0,70 C30,65 50,72 80,60" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
                  <path d="M80,60 C100,28 140,50 170,20 S200,10 220,8" fill="none" stroke={A2} strokeWidth="2.5"/>
                  <path d="M80,60 C100,28 140,50 170,20 S200,10 220,8 L220,90 L80,90 Z" fill="url(#regr)"/>
                  <circle cx="80" cy="60" r="4" fill="#fff"/><circle cx="80" cy="60" r="10" fill={A1} opacity="0.25"/>
                </svg>
                <div className="flex justify-center gap-4 mt-2">
                  {['💤 inactivo','✉️ mail IA','🔥 activo'].map((s,i)=>(
                    <div key={s} className="flex items-center gap-1 text-[10px] font-mono text-white/35">
                      {i>0 && <span className="text-white/20">→</span>}{s}
                    </div>
                  ))}
                </div>
              </div>
            },
          ].map(pillar => (
            <FadeIn key={pillar.t} className="rounded-2xl p-5 border border-white/[0.06] flex flex-col gap-4" style={{ background:'rgba(255,255,255,0.02)' }}>
              {pillar.viz}
              <div>
                <div className="font-display font-semibold text-sm text-white mb-1.5">{pillar.t}</div>
                <p className="text-[12px] text-white/40 leading-relaxed mb-2">{pillar.d}</p>
                <div className="text-[11px] font-mono" style={{ color:pillar.color as string }}>{pillar.m}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Social proof ──────────────────────────────────────────────────────────────
const TICKER_ARTISTS = ['SOLEN.','OKARA','VELA DRIFT','NOVA SIGNAL','LUMEN //','KAIRÓS','ECHOWAVE','NIGHT MODE','BRUTAL MIRAGE','ZENITH·01']
const TESTIMONIALS_DATA = [
  { q:'Pasé de mandar 6 archivos a cada booker a mandar un solo link. Mis bookings se duplicaron en 3 meses.', n:'SOLEN.', r:'DJ / Producer · Berlín' },
  { q:'Vendí 740 entradas de mi show en Berghain directo a mi lista. Sin comisiones. Sin intermediarios.', n:'OKARA', r:'Afrohouse · Johannesburgo' },
  { q:'La IA me sugirió apuntar a México para mi tour. Acerté tres fechas agotadas. No me lo esperaba.', n:'VELA DRIFT', r:'Minimal · Ámsterdam' },
]

function Social() {
  return (
    <section id="social" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
      {/* Ticker */}
      <div className="overflow-hidden py-4 border-b border-white/[0.06]" style={{ background:'rgba(255,255,255,0.015)' }}>
        <motion.div className="flex gap-8 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
          style={{ width: 'max-content' }}>
          {[...TICKER_ARTISTS,...TICKER_ARTISTS,...TICKER_ARTISTS,...TICKER_ARTISTS].map((name,i) => (
            <span key={i} className="text-[11px] font-mono text-white/20 tracking-[0.25em]">
              {name}<span className="mx-4 text-white/10">·</span>
            </span>
          ))}
        </motion.div>
      </div>

      <div className="py-28 md:py-36 max-w-6xl mx-auto px-5 md:px-10">
        <FadeIn className="mb-16">
          <div className="text-[11px] font-mono text-white/35 tracking-widest mb-5">04 · Artistas en ARTIX</div>
          <h2 className="font-display font-semibold text-white leading-[0.92] tracking-[-0.03em] max-w-3xl"
            style={{ fontSize:'clamp(2rem,5vw,3.6rem)' }}>
            La plataforma donde los <Iridescent>artistas serios</Iridescent> construyen carrera.
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {TESTIMONIALS_DATA.map((t, i) => (
            <FadeIn key={i} delay={i*0.08}
              className="rounded-2xl p-6 border border-white/[0.06] flex flex-col gap-4" style={{ background:'rgba(255,255,255,0.02)' }}>
              <div className="text-4xl font-serif text-white/15 leading-none">&ldquo;</div>
              <p className="text-sm text-white/60 leading-relaxed flex-1">{t.q}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                <div className="w-9 h-9 rounded-full shrink-0" style={{ background:`linear-gradient(135deg,${A3},${A1})` }} />
                <div>
                  <div className="text-sm font-display font-semibold text-white">{t.n}</div>
                  <div className="text-[11px] font-mono text-white/35">{t.r}</div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Metrics */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 py-10 border-y border-white/[0.06]">
            {[['2,400+','Artistas en waitlist',A1],['3×','Más bookings promedio',A2],['47%','Open rate medio','#06b6d4'],['€2.4M','Tickets vendidos directo','#f59e0b']].map(([n,l,c]) => (
              <div key={l} className="text-center">
                <div className="font-display font-semibold text-3xl md:text-4xl tracking-tight mb-1" style={{ color:c as string }}>{n}</div>
                <div className="text-[11px] font-mono text-white/35">{l}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ─── For Who ───────────────────────────────────────────────────────────────────
const WHO = [
  { num:'01', t:'DJs', role:'Para residentes y headliners',
    benefits:['Press kit siempre actualizado','Booking form profesional','Rider técnico auto-enviado','Calendario de shows integrado'],
    result:{ n:'×3', l:'más bookings en 90 días' }, quote:'Los promotores no preguntan dos veces.' },
  { num:'02', t:'Productores', role:'Para quien lanza música',
    benefits:['Lanzamientos a tu base propia','Pre-saves automáticos','Venta de bundles físicos','Integración Bandcamp / Beatport'],
    result:{ n:'+61%', l:'open rate en releases' }, quote:'Mis fans escuchan antes que en Spotify.' },
  { num:'03', t:'Emergentes', role:'Para los que empiezan en serio',
    benefits:['Imagen pro desde día uno','Sin coste hasta facturar','Plantillas de pitch a sellos','Comunidad de artistas'],
    result:{ n:'3 min', l:'para estar online' }, quote:'Parezco un artista de 5 años de carrera.' },
  { num:'04', t:'Profesionales', role:'Para carreras establecidas',
    benefits:['Analítica avanzada multi-ciudad','Sugerencias IA de estrategia','Venta directa de tickets','Multi-idioma automático'],
    result:{ n:'€2M+', l:'gestionado al año' }, quote:'Escalamos sin contratar equipo.' },
]

function ForWho() {
  const [active, setActive] = useState(0)
  const who = WHO[active]
  return (
    <section className="py-28 md:py-36" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        <FadeIn className="mb-14">
          <div className="text-[11px] font-mono text-white/35 tracking-widest mb-5">05 · Para quién es</div>
          <h2 className="font-display font-semibold text-white leading-[0.92] tracking-[-0.03em] max-w-3xl"
            style={{ fontSize:'clamp(2rem,5vw,3.6rem)' }}>
            Si tu carrera depende de <Iridescent>ti mismo,</Iridescent> esto es para ti.
          </h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-5">
          {/* Tabs */}
          <div className="flex md:flex-col gap-3">
            {WHO.map((w, i) => (
              <button key={w.num} onClick={() => setActive(i)}
                className="flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex-1 md:flex-none"
                style={{
                  background: active===i ? `${A1}15` : 'rgba(255,255,255,0.02)',
                  borderColor: active===i ? `${A1}45` : 'rgba(255,255,255,0.06)',
                }}>
                <div className="text-[11px] font-mono text-white/25">{w.num}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-semibold text-sm text-white">{w.t}</div>
                  <div className="text-[11px] font-mono text-white/35 truncate hidden md:block">{w.role}</div>
                </div>
                <span className="text-white/20 text-sm">→</span>
              </button>
            ))}
          </div>
          {/* Display */}
          <AnimatePresence mode="wait">
            <motion.div key={who.num} initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-12 }} transition={{ duration:0.25 }}
              className="rounded-2xl border border-white/[0.07] p-6 md:p-8 relative overflow-hidden" style={{ background:'rgba(255,255,255,0.025)' }}>
              <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ background:`radial-gradient(ellipse at top right, ${A1}, transparent 60%)` }} />
              <div className="relative z-10">
                <div className="mb-6">
                  <div className="font-display font-semibold text-2xl text-white mb-1">{who.t}</div>
                  <div className="text-[12px] font-mono text-white/35">· {who.role}</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
                  <div>
                    <div className="text-[11px] font-mono text-white/30 tracking-widest mb-3">Lo que consigues</div>
                    <ul className="flex flex-col gap-2.5">
                      {who.benefits.map(b => (
                        <li key={b} className="flex items-center gap-2.5 text-sm text-white/60">
                          <Check className="w-3.5 h-3.5 shrink-0" style={{ color:A1 }} />{b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="md:text-right">
                    <div className="font-display font-semibold text-5xl text-white" style={{ background:`linear-gradient(135deg,${A2},${A1})`,WebkitBackgroundClip:'text',backgroundClip:'text',WebkitTextFillColor:'transparent' }}>{who.result.n}</div>
                    <div className="text-[12px] font-mono text-white/40 mt-1 mb-4">{who.result.l}</div>
                    <div className="text-sm text-white/35 italic font-serif">&ldquo;{who.quote}&rdquo;</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

// ─── Pricing ───────────────────────────────────────────────────────────────────
function Pricing() {
  return (
    <section id="pricing" className="py-28 md:py-36" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-4xl mx-auto px-5 md:px-10">
        <FadeIn className="text-center mb-14">
          <div className="inline-block text-[11px] font-mono text-white/35 tracking-widest mb-6">07 · Early access</div>
          <h2 className="font-display font-semibold text-white leading-[0.92] tracking-[-0.03em] mb-5"
            style={{ fontSize:'clamp(2rem,5vw,3.6rem)' }}>
            Los primeros 500 artistas<br />entran <Iridescent>gratis.</Iridescent>
          </h2>
        </FadeIn>
        <FadeIn delay={0.08}>
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor:`${A1}35`, background:`${A1}06` }}>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">
              <div className="p-8">
                <div className="text-[11px] font-mono tracking-widest mb-2" style={{ color:A2 }}>Plan Pro · Founder access</div>
                <h3 className="font-display font-semibold text-xl text-white mb-3">Todo incluido. Un año.</h3>
                <p className="text-sm text-white/45 leading-relaxed mb-6">Web IA, press kit, rider, emails ilimitados, analítica avanzada, sugerencias IA, dominio personalizado, 0% comisión en tickets.</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Web con IA ilimitada','Press kit profesional','Emails ilimitados','Dashboard completo','Sugerencias IA','Dominio propio','0% comisión tickets','Badge Founder perpetuo'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-white/55">
                      <Check className="w-3.5 h-3.5 shrink-0" style={{ color:A1 }} />{f}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <div className="font-display font-semibold text-white mb-1">
                    <span className="text-6xl tracking-tight">0</span>
                    <span className="text-2xl text-white/40 ml-1">€ / año</span>
                  </div>
                  <div className="text-[12px] font-mono text-white/35 mb-8">Después · 29€ / mes</div>
                </div>
                <Link href="/signup"
                  className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl font-display font-semibold text-white text-base transition-all hover:scale-[1.02]"
                  style={{ background:`linear-gradient(135deg,${A3},${A1})`, boxShadow:`0 0 30px ${A1}40` }}>
                  Reclamar mi acceso <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="mt-4 text-center text-[11px] font-mono text-white/25">
                  <span className="w-1.5 h-1.5 rounded-full inline-block mr-1.5 align-middle animate-pulse" style={{ background:A1 }} />
                  {' '}382 / 500 accesos reclamados
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ─── FAQ ───────────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  { q:'¿Necesito saber de diseño o programación?', a:'No. Describes tu estilo en una frase y la IA genera tu web. Luego puedes editar lo que quieras con clicks.' },
  { q:'¿Cuánto tarda la configuración inicial?', a:'Unos 3 minutos. Generación con IA, conexión de tus redes y dominio. Luego afinas detalles cuando quieras.' },
  { q:'¿Puedo usar mi propio dominio?', a:'Sí. Conecta cualquier dominio que ya tengas o compra uno desde la plataforma.' },
  { q:'¿Qué pasa con mis emails si dejo ARTIX?', a:'Tu lista de leads es tuya. La exportas en CSV cuando quieras, sin restricciones. Cumplimiento GDPR completo.' },
  { q:'¿Cobráis comisión por venta de tickets?', a:'0% de comisión durante el primer año en plan Founder. Después, la más baja del mercado (2% vs 10-15% habitual).' },
  { q:'¿Cuándo está disponible?', a:'Abrimos en oleadas desde abril 2026. Los primeros 500 artistas reciben plan Pro gratis durante un año.' },
]

function FAQ() {
  const [open, setOpen] = useState<number>(0)
  return (
    <section id="faq" className="py-28 md:py-36" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-2xl mx-auto px-5 md:px-10">
        <FadeIn className="text-center mb-14">
          <div className="inline-block text-[11px] font-mono text-white/35 tracking-widest mb-6">06 · Preguntas</div>
          <h2 className="font-display font-semibold text-white leading-[0.92] tracking-[-0.03em]"
            style={{ fontSize:'clamp(2rem,5vw,3.6rem)' }}>
            Todo lo que necesitas <Iridescent>saber.</Iridescent>
          </h2>
        </FadeIn>
        <div className="flex flex-col gap-2">
          {FAQ_ITEMS.map((item, i) => (
            <FadeIn key={i} delay={i*0.03}>
              <button onClick={() => setOpen(open===i ? -1 : i)}
                className="w-full flex items-center justify-between gap-4 p-5 rounded-2xl border border-white/[0.06] hover:border-white/10 transition-all text-left cursor-pointer"
                style={{ background:'rgba(255,255,255,0.02)' }}>
                <span className="font-display font-medium text-sm text-white/80">{item.q}</span>
                <motion.div animate={{ rotate: open===i ? 180 : 0 }} transition={{ duration:0.2 }} className="shrink-0">
                  <ChevronDown className="w-4 h-4 text-white/30" />
                </motion.div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
                    transition={{ duration:0.25, ease:'easeInOut' }} className="overflow-hidden">
                    <p className="px-5 pb-5 pt-2 text-sm text-white/45 leading-relaxed">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA Final ─────────────────────────────────────────────────────────────────
function CTAFinal() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const handle = (e: React.FormEvent) => { e.preventDefault(); if (email) setSubmitted(true) }
  return (
    <section id="cta" className="py-36 md:py-48 text-center relative overflow-hidden" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background:`radial-gradient(ellipse at center, ${A1}10 0%, transparent 65%)`, filter:'blur(40px)' }} />
      <div className="relative z-10 max-w-2xl mx-auto px-5">
        <FadeIn>
          <div className="inline-block text-[11px] font-mono text-white/35 tracking-widest mb-6">Cupos limitados · Oleada de abril</div>
          <h2 className="font-display font-semibold text-white leading-[0.92] tracking-[-0.03em] mb-6"
            style={{ fontSize:'clamp(2.5rem,7vw,5rem)' }}>
            Toma tu carrera<br /><Iridescent>en serio.</Iridescent>
          </h2>
          <p className="text-white/45 text-base md:text-lg mb-10">
            Únete a los 2,400 artistas que ya aseguraron su acceso.<br className="hidden md:block" />Los primeros 500 entran gratis durante un año.
          </p>
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form key="form" onSubmit={handle} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
                <input type="email" required placeholder="tu-email@artista.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="flex-1 px-5 py-3.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-white placeholder-white/25 text-sm font-mono outline-none focus:border-white/25 transition-colors" />
                <button type="submit"
                  className="px-7 py-3.5 rounded-full font-display font-semibold text-white text-sm transition-all hover:scale-105 shrink-0"
                  style={{ background:`linear-gradient(135deg,${A3},${A1})`, boxShadow:`0 0 30px ${A1}40` }}>
                  Reservar →
                </button>
              </motion.form>
            ) : (
              <motion.div key="done" initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
                className="flex items-center justify-center gap-3 px-6 py-4 rounded-full border border-white/20 mb-6 max-w-md mx-auto"
                style={{ background:`${A1}12` }}>
                <Check className="w-4 h-4" style={{ color:A1 }} />
                <span className="text-sm font-display font-semibold" style={{ color:A2 }}>✓ Reservado · Revisa tu email en 2 minutos.</span>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex flex-wrap justify-center gap-5 text-[11px] font-mono text-white/25">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:A1 }} />2,847 artistas reservados</span>
            <span>Sin tarjeta</span>
            <span>Cancela cuando quieras</span>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ─── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <LogoMark size={20} />
            <span className="font-display font-semibold tracking-[0.18em] text-white/70">ARTIX</span>
          </div>
          <p className="text-sm text-white/35 leading-relaxed">El sistema operativo de la carrera musical. Para artistas que no esperan a nadie.</p>
        </div>
        {[
          ['Producto',['Generador web IA','Press kit','Analytics','Email marketing'],['#features','#features','#features','#features']],
          ['Artistas',['Casos de éxito','Comunidad','FAQ'],['#social','#social','#faq']],
          ['Empresa',['Manifiesto','Prensa','Carreras'],['#','#','#']],
          ['Legal',['Términos','Privacidad','Cookies'],['#','#','#']],
        ].map(([title, links, hrefs]) => (
          <div key={title as string}>
            <h5 className="text-[11px] font-mono text-white/30 tracking-widest mb-4 uppercase">{title as string}</h5>
            <ul className="flex flex-col gap-2.5">
              {(links as string[]).map((l, i) => (
                <li key={l}><a href={(hrefs as string[])[i]} className="text-sm text-white/40 hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/[0.06] px-5 md:px-10 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="text-[11px] font-mono text-white/25">© 2026 ARTIX · Todos los derechos reservados</div>
        <div className="flex gap-4 text-[11px] font-mono text-white/25">
          {['IG','X','TT','SC'].map(s => <a key={s} href="#" className="hover:text-white transition-colors">{s}</a>)}
        </div>
      </div>
      {/* Mega text */}
      <div className="overflow-hidden" aria-hidden>
        <div className="font-display font-semibold text-white/[0.025] text-center leading-none select-none"
          style={{ fontSize:'clamp(5rem,20vw,18rem)', letterSpacing:'-0.04em', transform:'translateY(20%)' }}>
          ARTIX.
        </div>
      </div>
    </footer>
  )
}

// ─── Global styles ─────────────────────────────────────────────────────────────
const globalStyles = `
  @keyframes shimmer { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes wf { 0%{height:20%} 100%{height:100%} }
  html { scroll-behavior: smooth; }
  .font-display { font-family: var(--font-display, 'Space Grotesk', sans-serif); }
  .font-serif { font-family: var(--font-serif, 'Instrument Serif', serif); }
  .font-mono { font-family: var(--font-mono, 'JetBrains Mono', monospace); }
  body { background: #05050a; }
`

// ─── Root ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <>
      <style>{globalStyles}</style>
      <main className="min-h-screen text-white overflow-x-hidden" style={{ background:'#05050a' }}>
        <Nav />
        <Hero />
        <Problem />
        <Transformation />
        <Features />
        <Monetize />
        <Social />
        <ForWho />
        <Pricing />
        <FAQ />
        <CTAFinal />
        <Footer />
      </main>
    </>
  )
}
