'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface KitConfig {
  slug: string
  artistName: string
  tagline: string
  role: string
  genres: string[]
  location: string
  bio: string
  email: string
  spotifyUrl: string
  soundcloudUrl: string
  instagramUrl: string
  raUrl: string
  beatportUrl: string
  tracks: { title: string; label: string; year: string }[]
  monthlyListeners: string
  totalShows: string
  countries: string
  djMagRanking: string
  photo: string
  primaryColor: string
  secondaryColor: string
  bgEffect: string
  fontStyle: string
  animationStyle: string
  heroVariant: string
  sections: string[]
}

const DEFAULT_CONFIG: KitConfig = {
  slug: 'preview',
  artistName: 'ARTIST',
  tagline: '',
  role: 'DJ',
  genres: [],
  location: '',
  bio: '',
  email: '',
  spotifyUrl: '',
  soundcloudUrl: '',
  instagramUrl: '',
  raUrl: '',
  beatportUrl: '',
  tracks: [
    { title: '', label: '', year: '' },
    { title: '', label: '', year: '' },
    { title: '', label: '', year: '' },
  ],
  monthlyListeners: '',
  totalShows: '',
  countries: '',
  djMagRanking: '',
  photo: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600&q=80',
  primaryColor: '#C026D3',
  secondaryColor: '#7C3AED',
  bgEffect: 'dark',
  fontStyle: 'grotesk',
  animationStyle: 'elegant',
  heroVariant: 'bottom-left',
  sections: ['bio', 'music', 'gallery', 'stats', 'booking'],
}

function SectionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
    >
      {children}
    </motion.div>
  )
}

export default function PreviewPage() {
  const [mounted, setMounted] = useState(false)
  const [kit, setKit] = useState<KitConfig | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('presskit-preview')
      if (raw) {
        setKit(JSON.parse(raw) as KitConfig)
      }
    } catch {
      // ignore parse errors
    }
    setMounted(true)
  }, [])

  // Loading state
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#07070B] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div
              className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
              style={{ borderTopColor: DEFAULT_CONFIG.primaryColor }}
            />
            <div className="absolute inset-2 rounded-full flex items-center justify-center bg-[#07070B]">
              <span className="text-white font-black text-lg">P</span>
            </div>
          </div>
          <span className="text-white/40 text-sm font-mono tracking-widest">PRESSKIT.PRO</span>
        </div>
      </div>
    )
  }

  // Empty state
  if (!kit) {
    return (
      <div className="min-h-screen bg-[#07070B] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-6xl mb-6">◉</div>
          <h1 className="text-2xl font-black tracking-tight mb-3">No encontramos tu presskit</h1>
          <p className="text-white/40 text-sm mb-8">Completa el wizard para generar tu presskit de demostración.</p>
          <Link
            href="/prueba"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #C026D3, #7C3AED)', color: '#fff' }}
          >
            Crear mi presskit
          </Link>
        </div>
      </div>
    )
  }

  const { primaryColor, secondaryColor } = kit

  const tracks = kit.tracks.some(t => t.title.trim())
    ? kit.tracks
    : [
        { title: 'Tu Track #1', label: 'Label', year: '2024' },
        { title: 'Tu Track #2', label: 'Label', year: '2024' },
        { title: 'Tu Track #3', label: 'Label', year: '2023' },
      ]

  const galleryPhotos = [
    kit.photo,
    kit.photo,
    kit.photo,
    kit.photo,
    kit.photo,
    kit.photo,
  ]

  const stats = [
    { value: kit.monthlyListeners || '—', label: 'MONTHLY LISTENERS' },
    { value: kit.countries || '—', label: 'PAÍSES' },
    { value: kit.totalShows || '—', label: 'SHOWS/AÑO' },
    ...(kit.djMagRanking ? [{ value: kit.djMagRanking, label: 'DJ MAG' }] : []),
  ]

  return (
    <div className="min-h-screen bg-[#07070B] text-white overflow-x-hidden">
      {/* Floating edit toolbar */}
      <div className="fixed top-4 left-4 z-50 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full px-3 py-2 flex items-center gap-3">
        <Link
          href="/prueba"
          className="text-xs font-mono text-white/60 hover:text-white transition-colors"
        >
          ← Editar
        </Link>
        <div className="w-px h-3 bg-white/20" />
        <Link
          href="/signup"
          className="text-xs font-mono font-bold hover:opacity-80 transition-opacity"
          style={{ color: primaryColor }}
        >
          Crear cuenta →
        </Link>
      </div>

      {/* Fixed nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/[0.05] backdrop-blur-xl bg-[#07070B]/80">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
            />
            <span className="font-bold text-sm tracking-tight">PRESSKIT.PRO</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {['bio', 'music', 'gallery', 'press'].map((anchor) => (
              <a
                key={anchor}
                href={`#${anchor}`}
                className="text-xs font-mono text-white/40 hover:text-white/80 uppercase tracking-widest transition-colors"
              >
                {anchor}
              </a>
            ))}
          </div>
          <a
            href="#booking"
            className="px-4 py-2 rounded-full text-xs font-bold font-mono tracking-widest transition-opacity hover:opacity-80"
            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, color: '#fff' }}
          >
            BOOKING
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section id="hero" className="relative w-full min-h-screen flex flex-col justify-end overflow-hidden pt-14">
        {/* Photo background */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={kit.photo}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.5 }}
        />
        {/* Overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.3) 40%, rgba(7,7,11,0.95) 100%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pb-16">
          {/* Genre pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {kit.genres.length > 0
              ? kit.genres.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 rounded-full text-xs font-mono tracking-widest uppercase text-white"
                    style={{ background: `${primaryColor}30`, border: `1px solid ${primaryColor}50` }}
                  >
                    {g}
                  </span>
                ))
              : (
                  <span
                    className="px-3 py-1 rounded-full text-xs font-mono tracking-widest uppercase text-white"
                    style={{ background: `${primaryColor}30`, border: `1px solid ${primaryColor}50` }}
                  >
                    Electronic
                  </span>
                )}
          </div>

          {/* Artist name */}
          <h1
            className="font-black tracking-tighter leading-none mb-4 uppercase"
            style={{ fontSize: 'clamp(48px, 10vw, 120px)' }}
          >
            {kit.artistName || 'YOUR NAME'}
          </h1>

          {/* Role + location */}
          <div className="flex items-center gap-2 text-white/60 text-sm font-mono mb-8">
            <span>{kit.role}</span>
            {kit.location && (
              <>
                <span className="text-white/20">·</span>
                <span>{kit.location}</span>
              </>
            )}
            {kit.tagline && (
              <>
                <span className="text-white/20">·</span>
                <span className="italic">{kit.tagline}</span>
              </>
            )}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 max-w-xl">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-3 text-center"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="text-xl font-black">{s.value}</div>
                <div className="text-[10px] text-white/40 font-mono tracking-widest mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#booking"
              className="px-6 py-3 rounded-full text-sm font-bold tracking-widest font-mono transition-opacity hover:opacity-90"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, color: '#fff' }}
            >
              SOLICITAR BOOKING
            </a>
            <div className="flex gap-2">
              {kit.instagramUrl && (
                <a
                  href={kit.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all text-sm"
                >
                  ◎
                </a>
              )}
              {kit.spotifyUrl && (
                <a
                  href={kit.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all text-sm"
                >
                  ♫
                </a>
              )}
              {kit.soundcloudUrl && (
                <a
                  href={kit.soundcloudUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all text-sm"
                >
                  ☁
                </a>
              )}
              {kit.raUrl && (
                <a
                  href={kit.raUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all text-sm"
                >
                  ▲
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 z-10">
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
          <span className="text-[9px] font-mono tracking-widest">SCROLL</span>
        </div>
      </section>

      {/* ── Quote band ── */}
      <SectionWrapper>
        <section
          className="py-20 px-6 text-center relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${primaryColor}08, #07070B, ${secondaryColor}08)` }}
        >
          <div
            className="absolute inset-0"
            style={{ background: `radial-gradient(ellipse at 50% 50%, ${primaryColor}10 0%, transparent 70%)` }}
          />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div
              className="text-8xl leading-none mb-4 font-serif"
              style={{ color: primaryColor }}
            >
              &ldquo;
            </div>
            <blockquote className="text-xl sm:text-2xl text-white/80 font-serif italic leading-relaxed mb-6">
              {kit.bio.trim().length > 0
                ? kit.bio.slice(0, 180)
                : 'Un artista que redefine los límites de la música electrónica, fusionando texturas sonoras con energía pura de dancefloor.'}
            </blockquote>
            <div className="w-16 h-px mx-auto mb-4" style={{ background: `linear-gradient(to right, transparent, ${primaryColor}, transparent)` }} />
            <span className="text-xs font-mono text-white/30 tracking-widest">— {kit.email || 'MANAGEMENT'}</span>
          </div>
        </section>
      </SectionWrapper>

      {/* ── Bio section ── */}
      <SectionWrapper>
        <section id="bio" className="py-20 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Left */}
            <div>
              <span
                className="text-xs font-mono tracking-widest uppercase mb-4 block"
                style={{ color: primaryColor }}
              >
                BIOGRAFÍA
              </span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mb-6 uppercase">
                {kit.artistName || 'YOUR NAME'}
              </h2>
              <p className="text-white/60 text-base leading-relaxed mb-8">
                {kit.bio.trim().length > 0
                  ? kit.bio
                  : 'Un artista que redefine los límites de la música electrónica. Con años de experiencia en los clubes más importantes del mundo, su sonido único mezcla influencias de múltiples géneros para crear experiencias sonoras únicas.'}
              </p>
              {/* Award badges */}
              <div className="flex flex-wrap gap-2">
                {['DJ Mag Top 100', 'Resident Advisor Pick', 'Beatport Bestseller'].map((award) => (
                  <span
                    key={award}
                    className="text-xs font-mono px-3 py-1.5 rounded-full border"
                    style={{ color: primaryColor, borderColor: `${primaryColor}40`, background: `${primaryColor}10` }}
                  >
                    ★ {award}
                  </span>
                ))}
              </div>
            </div>
            {/* Right: photo */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden aspect-[3/4] max-h-[520px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={kit.photo}
                  alt={kit.artistName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl flex flex-col items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
              >
                <span className="text-2xl font-black text-white">{kit.totalShows || '∞'}</span>
                <span className="text-[9px] font-mono text-white/70 tracking-wider">SHOWS</span>
              </div>
            </div>
          </div>
        </section>
      </SectionWrapper>

      {/* ── Stats bar ── */}
      <SectionWrapper>
        <section className="py-12 border-y border-white/[0.05]" style={{ background: 'rgba(255,255,255,0.01)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className="text-center py-8 px-4 relative"
                >
                  {i > 0 && (
                    <div className="absolute left-0 top-1/4 h-1/2 w-px bg-white/[0.06]" />
                  )}
                  <div className="text-4xl sm:text-5xl font-black mb-2">{s.value}</div>
                  <div className="text-[11px] font-mono text-white/30 tracking-widest uppercase">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionWrapper>

      {/* ── Music section ── */}
      <SectionWrapper>
        <section id="music" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <span
              className="text-xs font-mono tracking-widest uppercase mb-4 block"
              style={{ color: primaryColor }}
            >
              DISCOGRAFÍA
            </span>
            <h2 className="text-4xl font-black tracking-tighter mb-10 uppercase">Música</h2>

            <div className="space-y-3 mb-8">
              {tracks.map((track, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-white/[0.06] hover:border-white/15 transition-all"
                  style={{ background: 'rgba(255,255,255,0.02)' }}
                >
                  {/* Number */}
                  <span className="text-sm font-mono text-white/20 w-5 text-center flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {/* Play button */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                  >
                    <span className="text-white text-xs ml-0.5">▶</span>
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{track.title}</div>
                    <div className="text-xs text-white/40 font-mono">{track.label} · {track.year}</div>
                  </div>
                  {/* Waveform */}
                  <div className="hidden sm:flex gap-0.5 items-end h-6 flex-shrink-0">
                    {[8, 16, 10, 20, 14, 8, 18, 12, 6, 16].map((h, j) => (
                      <div
                        key={j}
                        className="w-1 rounded-sm"
                        style={{ height: h, background: `${primaryColor}50` }}
                      />
                    ))}
                  </div>
                  {/* Plays */}
                  <span className="text-xs text-white/20 font-mono flex-shrink-0">—</span>
                </div>
              ))}
            </div>

            {/* Platform buttons */}
            <div className="flex flex-wrap gap-3">
              {kit.spotifyUrl && (
                <a
                  href={kit.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-mono transition-all hover:opacity-80"
                  style={{ background: '#1DB95415', borderColor: '#1DB95440', color: '#1DB954' }}
                >
                  ♫ Escuchar en Spotify
                </a>
              )}
              {kit.soundcloudUrl && (
                <a
                  href={kit.soundcloudUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-mono transition-all hover:opacity-80"
                  style={{ background: '#FF550015', borderColor: '#FF550040', color: '#FF5500' }}
                >
                  ☁ SoundCloud
                </a>
              )}
            </div>
          </div>
        </section>
      </SectionWrapper>

      {/* ── Gallery ── */}
      <SectionWrapper>
        <section id="gallery" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <span
              className="text-xs font-mono tracking-widest uppercase mb-4 block"
              style={{ color: primaryColor }}
            >
              GALERÍA
            </span>
            <h2 className="text-4xl font-black tracking-tighter mb-10 uppercase">Fotos</h2>

            <div className="grid grid-cols-3 gap-3" style={{ gridAutoRows: '220px' }}>
              {galleryPhotos.map((url, i) => (
                <div
                  key={i}
                  className={`relative rounded-2xl overflow-hidden ${i === 0 ? 'row-span-2' : ''}`}
                  style={{ opacity: i === 0 ? 1 : i < 4 ? 0.7 : 0.5 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  {/* Last image overlay */}
                  {i === 5 && (
                    <div className="absolute inset-0 flex items-center justify-center text-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
                      <div>
                        <div className="text-xs font-mono text-white/60 mb-2 leading-relaxed">
                          Galería completa disponible con cuenta PRO
                        </div>
                        <Link
                          href="/signup"
                          className="text-xs font-bold font-mono px-3 py-1.5 rounded-full"
                          style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, color: '#fff' }}
                        >
                          Activar PRO
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionWrapper>

      {/* ── Press ── */}
      <SectionWrapper>
        <section id="press" className="py-20 px-6" style={{ background: 'rgba(255,255,255,0.01)' }}>
          <div className="max-w-7xl mx-auto">
            <span
              className="text-xs font-mono tracking-widest uppercase mb-4 block"
              style={{ color: primaryColor }}
            >
              PRENSA
            </span>
            <h2 className="text-4xl font-black tracking-tighter mb-10 uppercase">Medios</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { publisher: 'Mixmag', color: '#FF0066', quote: kit.bio.trim().length > 0 ? kit.bio.slice(0, 120) : 'Una de las propuestas más frescas del panorama electrónico actual. Su capacidad para leer al público es extraordinaria.' },
                { publisher: 'Resident Advisor', color: '#EF4444', quote: kit.bio.trim().length > 0 ? kit.bio.slice(0, 120) : 'Sets que trascienden lo técnico para convertirse en experiencias emocionales puras. Un artista a seguir de cerca.' },
                { publisher: 'DJ Mag', color: '#00AAFF', quote: kit.bio.trim().length > 0 ? kit.bio.slice(0, 120) : 'La energía que emana en cada actuación es contagiosa. Un nombre que resonará durante años en el circuito internacional.' },
              ].map((item) => (
                <div
                  key={item.publisher}
                  className="rounded-2xl p-6 border border-white/[0.06]"
                  style={{ background: 'rgba(255,255,255,0.02)' }}
                >
                  <span
                    className="inline-block text-xs font-mono font-bold px-2.5 py-1 rounded-md mb-4"
                    style={{ background: `${item.color}20`, color: item.color, border: `1px solid ${item.color}30` }}
                  >
                    {item.publisher}
                  </span>
                  <p className="text-white/70 text-sm leading-relaxed italic mb-4">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-px" style={{ background: item.color }} />
                    <span className="text-xs text-white/30 font-mono">{item.publisher.toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionWrapper>

      {/* ── Booking ── */}
      <SectionWrapper>
        <section id="booking" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <span
              className="text-xs font-mono tracking-widest uppercase mb-4 block"
              style={{ color: primaryColor }}
            >
              BOOKING
            </span>
            <h2 className="text-4xl font-black tracking-tighter mb-2 uppercase">Solicitar show</h2>
            <p className="text-white/40 text-sm mb-10">Respuesta garantizada en 48h. Te contactaremos con propuesta y rider técnico.</p>

            <div className="max-w-xl">
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/30 font-mono uppercase tracking-wider mb-1.5 block">Nombre / Promotor</label>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#C026D3]/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/30 font-mono uppercase tracking-wider mb-1.5 block">Email</label>
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#C026D3]/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/30 font-mono uppercase tracking-wider mb-1.5 block">Nombre del evento</label>
                  <input
                    type="text"
                    placeholder="Festival / Club / Evento"
                    className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#C026D3]/50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/30 font-mono uppercase tracking-wider mb-1.5 block">Fecha</label>
                    <input
                      type="date"
                      className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#C026D3]/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/30 font-mono uppercase tracking-wider mb-1.5 block">Presupuesto</label>
                    <select className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C026D3]/50 transition-all appearance-none">
                      <option value="">Seleccionar...</option>
                      <option value="500-1000">€500 – €1.000</option>
                      <option value="1000-2500">€1.000 – €2.500</option>
                      <option value="2500-5000">€2.500 – €5.000</option>
                      <option value="5000-10000">€5.000 – €10.000</option>
                      <option value="10000+">€10.000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/30 font-mono uppercase tracking-wider mb-1.5 block">Detalles adicionales</label>
                  <textarea
                    rows={4}
                    placeholder="Cuéntanos más sobre el evento, aforo, horario, etc."
                    className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#C026D3]/50 transition-all resize-none"
                  />
                </div>
              </div>

              <button
                className="w-full py-4 rounded-2xl text-sm font-bold tracking-widest font-mono transition-opacity hover:opacity-90"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, color: '#fff' }}
              >
                ENVIAR SOLICITUD DE BOOKING
              </button>

              <p className="text-xs text-white/25 text-center mt-4 leading-relaxed">
                Este es tu presskit de demostración. Crea una cuenta para recibir solicitudes de booking reales.
              </p>
            </div>
          </div>
        </section>
      </SectionWrapper>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.05] py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
              />
              <span className="font-bold text-sm tracking-tight">PRESSKIT.PRO</span>
            </div>

            {/* Social links */}
            <div className="flex gap-3">
              {kit.instagramUrl && (
                <a href={kit.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all text-sm">
                  ◎
                </a>
              )}
              {kit.spotifyUrl && (
                <a href={kit.spotifyUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all text-sm">
                  ♫
                </a>
              )}
              {kit.soundcloudUrl && (
                <a href={kit.soundcloudUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all text-sm">
                  ☁
                </a>
              )}
              {kit.raUrl && (
                <a href={kit.raUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all text-sm">
                  ▲
                </a>
              )}
            </div>
          </div>

          <div className="h-px bg-white/[0.05] mb-6" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/prueba"
              className="text-xs font-mono transition-colors hover:opacity-80"
              style={{ color: primaryColor }}
            >
              Crea el tuyo en PRESSKIT.PRO →
            </Link>
            <span className="text-xs text-white/20 font-mono">
              © {new Date().getFullYear()} PRESSKIT.PRO · Todos los derechos reservados
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
