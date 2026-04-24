'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'

// ── Marquee ticker strip ──────────────────────────────────────────────────────
const TICKER_ITEMS = [
  '48 PAÍSES', '·', 'DC-10', '·', 'USHUAÏA', '·', 'FABRIC', '·',
  'CLUB SPACE', '·', 'WARUNG', '·', '+200 SUPPORTS', '·', 'GET PHYSICAL',
  '·', 'HOT CREATIONS', '·', 'DESOLAT', '·', 'MOOD RECORDS', '·',
]

function Ticker({ bg = DARK2, color = 'rgba(255,255,255,0.22)' }: { bg?: string; color?: string }) {
  const repeated = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div
      className="w-full overflow-hidden py-3 select-none"
      style={{ background: bg, borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      <motion.div
        className="flex gap-6 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration: 22, ease: 'linear' }}
      >
        {repeated.map((item, i) => (
          <span key={i} className="text-[10px] font-mono tracking-[0.22em] uppercase flex-shrink-0" style={{ color }}>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ── Palette ──────────────────────────────────────────────────────────────────
const CREAM   = '#EAE0C8'
const DARK    = '#1A1208'
const DARK2   = '#100C05'
const GOLD    = '#C4972A'
const GOLD_BG = '#C4972A'

// ── Data ─────────────────────────────────────────────────────────────────────
const VENUES = [
  { name: 'DC-10',              city: 'IBIZA' },
  { name: 'Warung Beach Club',  city: 'ITAJAÍ' },
  { name: 'Fabric',             city: 'LONDON' },
  { name: 'Club Space',         city: 'MIAMI' },
  { name: 'La Terrrazza',       city: 'BARCELONA' },
  { name: 'Rex Club',           city: 'PARIS' },
  { name: 'Printworks',         city: 'LONDON' },
  { name: 'Output',             city: 'NEW YORK' },
  { name: 'Hï Ibiza',           city: 'IBIZA' },
  { name: 'Amnesia',            city: 'IBIZA' },
  { name: 'Ushuaïa',            city: 'IBIZA' },
  { name: 'Lío',                city: 'IBIZA' },
  { name: 'Tresor',             city: 'BERLIN' },
  { name: 'Watergate',          city: 'BERLIN' },
  { name: 'De School',          city: 'AMSTERDAM' },
  { name: 'Cielo',              city: 'NEW YORK' },
  { name: 'Exchange LA',        city: 'LOS ANGELES' },
  { name: 'Green Valley',       city: 'CAMBORIÚ' },
  { name: 'Creamfields',        city: 'UK' },
  { name: 'Ultra Music Festival', city: 'MIAMI' },
  { name: 'Time Warp',          city: 'MANNHEIM' },
  { name: 'Movement',           city: 'DETROIT' },
  { name: 'Sonus Festival',     city: 'ZRĆE BEACH' },
  { name: 'Elrow',              city: 'BARCELONA' },
]

const SUPPORTERS = [
  'AJ MORENO', 'ANDRUSS', 'CHRIS AVANTGARDE', 'CLAUDIA TEJEDA', 'DANIEL ORPI',
  'DAVIDE T', 'FLETCH', 'FREDDY BELLO', 'HARVY VALENCIA', 'JAMIE JONES',
  'JOSH KALKER', 'JUANITO', 'KIDOO', 'MALIKKMUSIC', 'MANDA MOOR',
  'MARKEM', 'MAXINNE', 'MENESIX', 'MIGUEL BASTIDA', 'MIKE MORRISEY',
  'MOOD CHILD', 'NOTRE DAME', 'PACO OSUNA', 'PAUZA', 'SIRUS HOOD',
  'SISTEK', 'SUPERNOVA', 'SYREETA', 'TONY GUERRA', 'YUNG_OMZ (MASON COLLECTIVE)',
]

const HIGHLIGHTED = ['JAMIE JONES', 'MANDA MOOR', 'PACO OSUNA', 'HARVY VALENCIA']

// ── Map dots (approximate screen positions as %) ─────────────────────────────
const MAP_DOTS = [
  { x: 18, y: 52 },  // Miami/NYC
  { x: 14, y: 62 },  // Colombia
  { x: 22, y: 75 },  // Brazil
  { x: 47, y: 35 },  // London/UK
  { x: 49, y: 38 },  // Paris
  { x: 50, y: 36 },  // Amsterdam
  { x: 51, y: 39 },  // Barcelona
  { x: 54, y: 37 },  // Berlin
  { x: 56, y: 38 },  // Vienna
  { x: 58, y: 40 },  // Ibiza
  { x: 61, y: 42 },  // Italy
  { x: 63, y: 50 },  // Middle East/Doha
  { x: 65, y: 55 },  // Dubai
  { x: 78, y: 62 },  // Singapore
]

// ── Count-up hook ─────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800, active: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [active, target, duration])
  return count
}

// ── Section reveal ────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Stagger text ──────────────────────────────────────────────────────────────
function StaggerText({ text, className = '', delay = 0 }: {
  text: string; className?: string; delay?: number
}) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: delay + i * 0.025 }}
          style={{ display: ch === ' ' ? 'inline' : 'inline-block' }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </motion.span>
      ))}
    </span>
  )
}

// ── Fan form ──────────────────────────────────────────────────────────────────
function FanForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'err'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, artistSlug: 'francisco-allendes' }),
      })
      setStatus(res.ok ? 'ok' : 'err')
    } catch { setStatus('err') }
  }

  if (status === 'ok') return (
    <p className="text-sm" style={{ color: GOLD }}>✓ ¡Estás dentro! Te avisaremos pronto.</p>
  )

  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 mt-4">
      <input
        type="email" required value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Introduce tu email"
        className="flex-1 px-5 py-3.5 rounded-full text-sm bg-white/[0.08] border border-white/[0.12] text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
      />
      <button
        type="submit" disabled={status === 'loading'}
        className="px-7 py-3.5 rounded-full text-sm font-bold tracking-wide text-black disabled:opacity-50 hover:opacity-90 transition-opacity flex-shrink-0"
        style={{ background: GOLD_BG }}
      >
        {status === 'loading' ? '...' : 'Sé parte de ello'}
      </button>
    </form>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function FranciscoAllendesPage() {

  // Nav scroll state
  const [navScrolled, setNavScrolled] = useState(false)
  useEffect(() => {
    const handler = () => setNavScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Parallax on hero photo
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  // Count-up for stats
  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-100px' })
  const countCountries = useCountUp(48, 1600, statsInView)

  // Venue section
  const venueRef = useRef(null)
  const venueInView = useInView(venueRef, { once: true, margin: '-60px' })

  return (
    <div style={{ background: DARK, color: '#fff', overflowX: 'hidden' }}>

      {/* ═══════════════════════════════════════════════════════
          NAV
      ═══════════════════════════════════════════════════════ */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 transition-all duration-300"
        style={{
          background: navScrolled ? 'rgba(16,12,5,0.92)' : 'transparent',
          backdropFilter: navScrolled ? 'blur(12px)' : 'none',
          borderBottom: navScrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        }}
      >
        {/* Logo */}
        <span
          className="font-black text-white text-lg tracking-tight"
          style={{ fontFamily: 'var(--font-syne)', letterSpacing: '-0.01em' }}
        >
          FRANCISCO<br />
          <span style={{ color: GOLD }}>ALLENDES</span>
        </span>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href="#press"
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium border border-white/20 text-white/70 hover:border-white/40 hover:text-white transition-all backdrop-blur-sm"
            style={{ background: 'rgba(0,0,0,0.3)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
            Recursos de Prensa
          </a>
          <a
            href="#contact"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-black hover:opacity-90 transition-opacity"
            style={{ background: GOLD_BG }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Solicitar Booking
          </a>
        </div>
      </motion.nav>

      {/* ═══════════════════════════════════════════════════════
          HERO — foto izquierda / nombre derecha
      ═══════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden flex">

        {/* Background tinted to match photo tones */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #3B2A0E 0%, #1A1208 50%, #0E0A04 100%)' }}
        />

        {/* Photo with parallax */}
        <motion.div
          style={{ y: photoY }}
          className="absolute left-0 top-0 h-[115%] w-full md:w-[52%]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/artists/francisco-allendes/hero.jpg"
            alt="Francisco Allendes"
            className="w-full h-full object-cover object-top"
          />
          {/* Fade right edge on desktop */}
          <div
            className="absolute inset-0 hidden md:block"
            style={{ background: 'linear-gradient(to right, transparent 55%, #1A1208 95%)' }}
          />
          {/* Fade bottom on mobile */}
          <div
            className="absolute inset-0 md:hidden"
            style={{ background: 'linear-gradient(to bottom, transparent 50%, #1A1208 90%)' }}
          />
        </motion.div>

        {/* Dark overlay on mobile so text is readable */}
        <div className="absolute inset-0 md:hidden" style={{ background: 'rgba(26,18,8,0.55)' }} />

        {/* Right content */}
        <div className="relative z-10 ml-auto w-full md:w-[55%] flex flex-col justify-end px-8 md:px-14 pb-16 pt-32 min-h-screen">

          {/* Artist name — stacked, huge */}
          <div
            className="font-black uppercase text-white leading-[0.85] mb-6 overflow-hidden"
            style={{ fontFamily: 'var(--font-syne)', letterSpacing: '-0.03em' }}
          >
            <div style={{ fontSize: 'clamp(56px, 9.5vw, 136px)' }}>
              <StaggerText text="FRANCISCO" delay={0.3} />
            </div>
            <div style={{ fontSize: 'clamp(56px, 9.5vw, 136px)' }}>
              <StaggerText text="ALLENDES" delay={0.5} />
            </div>
          </div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="flex items-center gap-4 mb-8"
          >
            <span
              className="text-[11px] font-mono tracking-[0.32em] uppercase"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              MUSIC THAT MOVES YOU
            </span>
            <span
              className="block h-px flex-1 max-w-[60px]"
              style={{ background: 'rgba(255,255,255,0.25)' }}
            />
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="mb-10"
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm tracking-[0.08em] text-black hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: GOLD_BG, fontFamily: 'var(--font-syne)' }}
            >
              Solicitar Booking →
            </a>
          </motion.div>

          {/* Supporters row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex items-center gap-3 flex-wrap"
          >
            <span
              className="text-[10px] font-mono tracking-[0.26em] uppercase"
              style={{ color: 'rgba(255,255,255,0.22)' }}
            >
              CON EL APOYO DE
            </span>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
            {['Paco Osuna', 'Jamie Jones', 'Manda Moor', '+40 DJs'].map((name, i) => (
              <span
                key={i}
                className="text-[11px] font-medium cursor-default hover:opacity-100 transition-opacity"
                style={{ color: 'rgba(255,255,255,0.45)' }}
              >
                {name}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 right-10 flex flex-col items-end gap-2 z-10"
        >
          <span
            className="text-[9px] font-mono tracking-[0.35em] uppercase"
            style={{ color: 'rgba(255,255,255,0.2)' }}
          >
            DESPLAZAR
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14 }}
          >
            ↓
          </motion.div>
        </motion.div>
      </section>

      {/* Ticker strip */}
      <Ticker bg={DARK2} color="rgba(255,255,255,0.2)" />

      {/* ═══════════════════════════════════════════════════════
          BIO — cream, "BIO" giant left, text right
      ═══════════════════════════════════════════════════════ */}
      <section style={{ background: CREAM, color: DARK }}>
        <div className="max-w-7xl mx-auto px-8 pt-20 pb-0">
          <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-12 items-start">

            {/* Left: "BIO" giant + pills + location */}
            <Reveal>
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="font-black uppercase leading-none mb-8 select-none"
                  style={{
                    fontSize: 'clamp(80px, 14vw, 180px)',
                    fontFamily: 'var(--font-syne)',
                    letterSpacing: '-0.04em',
                    color: DARK,
                  }}
                >
                  BIO
                </motion.h2>

                {/* Genre pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {['TECH HOUSE', 'DEEP TECH', 'AFRO'].map(g => (
                    <span
                      key={g}
                      className="text-[10px] font-mono tracking-[0.18em] px-4 py-2 rounded-full border font-semibold"
                      style={{ borderColor: `${DARK}35`, color: DARK, background: 'transparent' }}
                    >
                      {g}
                    </span>
                  ))}
                </div>

                <p
                  className="text-xs font-mono tracking-[0.2em]"
                  style={{ color: `${GOLD}` }}
                >
                  Basado en Barcelona, Spain
                </p>
              </div>
            </Reveal>

            {/* Right: bio text */}
            <Reveal delay={0.15}>
              <div className="pt-4">
                <p
                  className="text-base leading-[1.8] mb-6 italic font-medium"
                  style={{ color: `${DARK}CC` }}
                >
                  Conocido por sus enérgicas actuaciones en directo y sus producciones de alta precisión, Francisco Allendes se ha consolidado como una de las fuerzas más dinámicas del Tech House contemporáneo.
                </p>
                <p
                  className="text-[15px] leading-[1.85]"
                  style={{ color: `${DARK}99` }}
                >
                  Con más de 15 años de carrera independiente, este artista chileno afincado entre Barcelona y Miami ha actuado en 48 países y ha conseguido lanzamientos en sellos de referencia como Get Physical, Desolat, Hot Creations y Crosstown Rebels.
                </p>
                <p
                  className="text-[15px] leading-[1.85] mt-4"
                  style={{ color: `${DARK}99` }}
                >
                  Fundador de MOOD Records, Francisco infunde a sus sets de Tech House ritmos latinoamericanos y percusión afro. Sus actuaciones crean experiencias trascendentales en las que la pista de baile se convierte en un espacio de energía compartida y conexión. Con el apoyo de figuras como Paco Osuna, Jamie Jones y Manda Moor, Allendes demuestra que la música se convierte en una puerta hacia infinitas posibilidades cuando crees en tu visión.
                </p>
              </div>
            </Reveal>
          </div>

          {/* INDEPENDENT · INTERNATIONAL divider */}
          <Reveal delay={0.2}>
            <div
              className="mt-16 py-8 flex items-center justify-center border-t"
              style={{ borderColor: `${DARK}12` }}
            >
              <p
                className="text-[10px] font-mono tracking-[0.42em] uppercase"
                style={{ color: `${DARK}38` }}
              >
                INDEPENDENT · INTERNATIONAL
              </p>
            </div>
          </Reveal>
        </div>

        {/* Stats transition — cream fades to dark with big number */}
        <div ref={statsRef} className="relative overflow-hidden" style={{ height: '380px' }}>
          {/* Gradient: cream top → dark bottom */}
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(to bottom, ${CREAM} 0%, ${DARK2} 55%)` }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
            <p
              className="text-[10px] font-mono tracking-[0.38em] uppercase"
              style={{ color: `${DARK}50` }}
            >
              INDEPENDENT · INTERNATIONAL
            </p>
            <motion.p
              className="font-black text-white leading-none select-none"
              style={{
                fontFamily: 'var(--font-syne)',
                fontSize: 'clamp(100px, 20vw, 240px)',
                letterSpacing: '-0.04em',
              }}
            >
              {countCountries}
            </motion.p>
            <p
              className="text-[11px] font-mono tracking-[0.38em] uppercase text-white/30"
            >
              COUNTRIES
            </p>
          </div>
        </div>
      </section>

      {/* Ticker cream-style between bio and venues */}
      <Ticker bg={CREAM} color={`${DARK}28`} />

      {/* ═══════════════════════════════════════════════════════
          VENUES MAP + LIST — "FRANCISCO SPOTS"
      ═══════════════════════════════════════════════════════ */}
      <section ref={venueRef} style={{ background: DARK2 }}>
        <div className="max-w-7xl mx-auto px-8 pt-16 pb-6">
          <Reveal>
            <p
              className="text-[10px] font-mono tracking-[0.35em] uppercase mb-4"
              style={{ color: 'rgba(255,255,255,0.28)' }}
            >
              {VENUES.length} VENUES · 48 PAÍSES
            </p>
            <div className="flex items-end justify-between mb-8">
              <h2
                className="font-black uppercase text-white leading-none"
                style={{
                  fontSize: 'clamp(44px, 7vw, 88px)',
                  fontFamily: 'var(--font-syne)',
                  letterSpacing: '-0.03em',
                }}
              >
                FRANCISCO<br />SPOTS
              </h2>
              <a
                href="#contact"
                className="hidden sm:flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-black mb-2"
                style={{ background: GOLD_BG }}
              >
                SÉ EL PRÓXIMO →
              </a>
            </div>
          </Reveal>

          {/* World map (SVG placeholder with dots) */}
          <Reveal delay={0.1}>
            <div
              className="relative w-full rounded-2xl overflow-hidden mb-10"
              style={{
                height: '340px',
                background: '#0D0B06',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* SVG world map outline simplified */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 1000 500"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Simplified continent blobs */}
                <g fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8">
                  {/* North America */}
                  <path d="M 80 80 L 180 70 L 220 120 L 200 200 L 160 220 L 100 180 L 70 140 Z" />
                  {/* South America */}
                  <path d="M 160 230 L 200 220 L 220 280 L 210 370 L 180 400 L 150 380 L 140 310 L 150 260 Z" />
                  {/* Europe */}
                  <path d="M 420 80 L 520 75 L 540 130 L 500 160 L 450 155 L 415 130 Z" />
                  {/* Africa */}
                  <path d="M 440 165 L 530 160 L 560 230 L 555 340 L 520 390 L 470 395 L 430 340 L 425 240 Z" />
                  {/* Asia */}
                  <path d="M 540 70 L 760 65 L 790 150 L 760 200 L 700 210 L 620 200 L 560 170 L 540 130 Z" />
                  {/* Australia */}
                  <path d="M 720 290 L 800 280 L 840 330 L 820 380 L 760 390 L 710 360 L 700 320 Z" />
                </g>
                {/* Dots */}
                {MAP_DOTS.map((dot, i) => (
                  <motion.circle
                    key={i}
                    cx={dot.x * 10}
                    cy={dot.y * 5}
                    r="5"
                    fill={GOLD}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={venueInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ delay: 0.3 + i * 0.06, duration: 0.4, ease: 'backOut' }}
                  >
                    <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite"
                      begin={`${i * 0.2}s`} />
                  </motion.circle>
                ))}
              </svg>
            </div>
          </Reveal>

          {/* Venue list — 3 columns */}
          <Reveal delay={0.15}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-3 pb-16">
              {VENUES.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={venueInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.03, duration: 0.4 }}
                  className="flex items-center gap-3 py-2 border-b"
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                >
                  <span className="font-bold text-sm text-white tracking-tight">{v.name}</span>
                  <span
                    className="text-[10px] font-mono tracking-[0.18em]"
                    style={{ color: GOLD }}
                  >
                    {v.city}
                  </span>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          VIDEOS — cream bg
      ═══════════════════════════════════════════════════════ */}
      <section style={{ background: CREAM, color: DARK }}>
        <div className="max-w-7xl mx-auto px-8 py-20">
          <Reveal>
            <p
              className="text-[10px] font-mono tracking-[0.35em] uppercase mb-2"
              style={{ color: `${DARK}45` }}
            >
              EN VIVO
            </p>
            <h2
              className="font-black uppercase mb-10 leading-tight"
              style={{
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontFamily: 'var(--font-syne)',
                letterSpacing: '-0.03em',
                color: DARK,
              }}
            >
              SETS
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                thumb: '/artists/francisco-allendes/ibiza.jpg',
                label: 'DC-10 IBIZA — 2H TECH HOUSE',
                title: 'FRANCISCO ALLENDES @ DC-10',
                subtitle: 'DC-10 Ibiza, Spain',
              },
              {
                thumb: '/artists/francisco-allendes/ushuaia.jpg',
                label: 'USHUAÏA IBIZA — LIVE DJ SET',
                title: 'FRANCISCO ALLENDES @ USHUAÏA',
                subtitle: 'Ushuaïa Ibiza, Spain',
              },
            ].map((v, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div>
                  <p
                    className="text-[10px] font-mono tracking-[0.22em] uppercase mb-2"
                    style={{ color: `${DARK}50` }}
                  >
                    {v.label}
                  </p>
                  <div
                    className="relative rounded-xl overflow-hidden group cursor-pointer"
                    style={{ aspectRatio: '16/9' }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={v.thumb}
                      alt={v.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0 transition-opacity duration-300"
                      style={{ background: 'rgba(0,0,0,0.35)' }}
                    />
                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl"
                        style={{ background: GOLD_BG }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </motion.div>
                    </div>
                    {/* Label overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="font-black text-white text-base tracking-tight" style={{ fontFamily: 'var(--font-syne)' }}>
                        {v.title}
                      </p>
                      <p className="text-white/60 text-xs font-mono mt-0.5">{v.subtitle}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          +200 SUPPORTERS — dark, big number + list
      ═══════════════════════════════════════════════════════ */}
      <section style={{ background: DARK2, color: '#fff' }} className="py-20">
        <div className="max-w-7xl mx-auto px-8">

          {/* Big number */}
          <Reveal>
            <div className="text-center mb-4">
              <p
                className="font-black text-white/[0.06] leading-none select-none"
                style={{
                  fontSize: 'clamp(80px, 18vw, 220px)',
                  fontFamily: 'var(--font-syne)',
                  letterSpacing: '-0.04em',
                }}
              >
                +200
              </p>
              <p
                className="text-[10px] font-mono tracking-[0.42em] uppercase -mt-6 relative z-10"
                style={{ color: 'rgba(255,255,255,0.25)' }}
              >
                DJs · ARTISTAS · LABELS
              </p>
            </div>
          </Reveal>

          {/* Supporters list */}
          <Reveal delay={0.1}>
            <div className="mt-12">
              <p
                className="text-[10px] font-mono tracking-[0.28em] uppercase mb-4"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                DESTACADOS:
              </p>
              <p className="text-sm leading-loose">
                {SUPPORTERS.map((name, i) => (
                  <span key={i}>
                    <span
                      className="font-mono tracking-wide cursor-default hover:opacity-100 transition-opacity"
                      style={{
                        color: HIGHLIGHTED.includes(name) ? GOLD : 'rgba(255,255,255,0.45)',
                        fontWeight: HIGHLIGHTED.includes(name) ? 700 : 400,
                      }}
                    >
                      {name}
                    </span>
                    {i < SUPPORTERS.length - 1 && (
                      <span style={{ color: 'rgba(255,255,255,0.15)', margin: '0 6px' }}>·</span>
                    )}
                  </span>
                ))}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          MUSIC — cream, releases + spotify embed
      ═══════════════════════════════════════════════════════ */}
      <section style={{ background: CREAM, color: DARK }} className="py-20">
        <div className="max-w-7xl mx-auto px-8">
          <Reveal>
            <p
              className="text-[10px] font-mono tracking-[0.35em] uppercase mb-2"
              style={{ color: `${DARK}45` }}
            >
              DISCOGRAFÍA
            </p>
            <h2
              className="font-black uppercase mb-12 leading-none"
              style={{
                fontSize: 'clamp(44px, 6.5vw, 80px)',
                fontFamily: 'var(--font-syne)',
                letterSpacing: '-0.03em',
              }}
            >
              MÚSICA
            </h2>
          </Reveal>

          {/* Release cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
            {[
              { label: 'GET PHYSICAL',    title: 'El House',   year: '2024', color: '#E8622A' },
              { label: 'HOT CREATIONS',  title: 'Hold Up',    year: '2023', color: '#2A7AE8' },
              { label: 'MOOD RECORDS',   title: 'Loco',       year: '2023', color: '#E8B72A' },
            ].map((r, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div
                  className="rounded-xl overflow-hidden"
                  style={{ border: `1px solid ${DARK}10` }}
                >
                  <div
                    className="h-40 flex items-center justify-center font-black text-white text-2xl"
                    style={{ background: r.color, fontFamily: 'var(--font-syne)' }}
                  >
                    {r.title.toUpperCase()}
                  </div>
                  <div className="p-4" style={{ background: `${DARK}06` }}>
                    <p className="text-[10px] font-mono tracking-widest mb-1" style={{ color: `${DARK}55` }}>
                      {r.label}
                    </p>
                    <p className="font-bold text-sm" style={{ color: DARK }}>{r.title}</p>
                    <div className="flex gap-2 mt-3">
                      <span
                        className="text-[9px] font-mono tracking-widest px-2.5 py-1 rounded-full border font-semibold"
                        style={{ borderColor: `${DARK}25`, color: `${DARK}70` }}
                      >
                        SPOTIFY
                      </span>
                      <span
                        className="text-[9px] font-mono tracking-widest px-2.5 py-1 rounded-full border font-semibold"
                        style={{ borderColor: `${DARK}25`, color: `${DARK}70` }}
                      >
                        BEATPORT
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Spotify embed */}
          <Reveal delay={0.15}>
            <iframe
              src="https://open.spotify.com/embed/artist/0LLKRLMmkzJHyMDCBxXjOl?utm_source=generator&theme=0"
              width="100%"
              height="400"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-2xl shadow-lg"
              style={{ border: `1px solid ${DARK}12` }}
            />
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CONTACT — dark, photo bg, "CONTÁCTANOS" huge + fan form
      ═══════════════════════════════════════════════════════ */}
      <section id="contact" className="relative overflow-hidden" style={{ minHeight: '85vh' }}>

        {/* Photo bg */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/artists/francisco-allendes/portrait.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ opacity: 0.18 }}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${DARK} 30%, rgba(26,18,8,0.85) 100%)` }}
        />

        {/* Subtle leaf/texture pattern from the original */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(196,151,42,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(196,151,42,0.2) 0%, transparent 50%)',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

            {/* Left: CONTÁCTANOS + CTA */}
            <Reveal>
              <div>
                <h2
                  className="font-black uppercase text-white leading-none mb-6"
                  style={{
                    fontSize: 'clamp(48px, 7vw, 96px)',
                    fontFamily: 'var(--font-syne)',
                    letterSpacing: '-0.03em',
                  }}
                >
                  CONTÁCTANOS
                </h2>
                <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-xs">
                  Respuesta en 48h. Rider técnico disponible al instante.
                </p>
                <a
                  href="mailto:booking@franciscoallendes.com"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm tracking-wide text-black hover:opacity-90 transition-all hover:scale-[1.02]"
                  style={{ background: GOLD_BG, fontFamily: 'var(--font-syne)' }}
                >
                  SOLICITAR BOOKING →
                </a>
                <p
                  className="text-white/22 text-[11px] font-mono mt-5"
                >
                  ⚡ Fechas disponibles Q2–Q3 2026 · Rider técnico incluido
                </p>
              </div>
            </Reveal>

            {/* Right: fan list */}
            <Reveal delay={0.12}>
              <div>
                <h3
                  className="font-black text-white text-xl mb-2"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  Únete al Círculo Íntimo
                </h3>
                <p className="text-white/35 text-sm leading-relaxed mb-1">
                  Música exclusiva, primeras escuchas e invitaciones privadas — directo a tu email.
                </p>
                <FanForm />
                <p className="text-white/20 text-[10px] font-mono mt-3">
                  Al suscribirte aceptas la política de privacidad y el tratamiento de datos.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PRESS RESOURCES — minimal id="press"
      ═══════════════════════════════════════════════════════ */}
      <section id="press" style={{ background: CREAM, color: DARK }} className="py-12">
        <div className="max-w-7xl mx-auto px-8">
          <Reveal>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-[10px] font-mono tracking-[0.3em] uppercase mb-2" style={{ color: `${DARK}45` }}>
                  PRENSA
                </p>
                <h3
                  className="text-2xl font-black uppercase"
                  style={{ fontFamily: 'var(--font-syne)', color: DARK }}
                >
                  Recursos de Prensa
                </h3>
                <p className="text-sm mt-1" style={{ color: `${DARK}60` }}>
                  Bio oficial · Fotos de alta resolución · Rider técnico
                </p>
              </div>
              <a
                href="mailto:booking@franciscoallendes.com"
                className="flex-shrink-0 px-6 py-3 rounded-full text-sm font-bold border-2 hover:bg-black/[0.04] transition-colors"
                style={{ borderColor: `${DARK}20`, color: DARK }}
              >
                Solicitar materiales →
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════ */}
      <footer
        className="border-t"
        style={{ background: '#0A0804', borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-7xl mx-auto px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-mono tracking-widest uppercase text-white/18">
            © {new Date().getFullYear()} Francisco Allendes. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <a href="https://ra.co/dj/franciscoallendes" target="_blank" rel="noopener noreferrer"
              className="text-[10px] font-mono uppercase tracking-widest text-white/20 hover:text-white/50 transition-colors">
              Resident Advisor
            </a>
            <a href="https://www.beatport.com/artist/francisco-allendes/181975" target="_blank" rel="noopener noreferrer"
              className="text-[10px] font-mono uppercase tracking-widest text-white/20 hover:text-white/50 transition-colors">
              Beatport
            </a>
            <a href="https://www.instagram.com/franciscoallendes" target="_blank" rel="noopener noreferrer"
              className="text-[10px] font-mono uppercase tracking-widest text-white/20 hover:text-white/50 transition-colors">
              Instagram
            </a>
          </div>
          <a href="/" className="text-[10px] font-mono tracking-widest uppercase text-white/12 hover:text-white/30 transition-colors">
            presskit.pro
          </a>
        </div>
      </footer>
    </div>
  )
}
