'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

// ─── Unified profile interface (works with artists + presskits tables) ───────
export interface ArtistProfile {
  artistName: string
  slug: string
  tagline?: string
  genres?: string[]
  bio?: string
  location?: string
  photo?: string
  monthlyListeners?: string
  totalShows?: string
  countries?: string
  tracks?: { title: string; label?: string; year?: string; bpm?: number; key?: string }[]
  spotifyPlaylistUrl?: string
  raUrl?: string
  beatportUrl?: string
  instagramUrl?: string
  galleryPhotos?: string[]
  bookingEmail?: string
  bookingUrl?: string
  availableDates?: string
  supporters?: { name: string }[]
  primaryColor: string
  secondaryColor: string
  views?: number
}

// ─── Design tokens ───────────────────────────────────────────────────────────
const DARK  = '#0C0A07'
const DARK2 = '#100D0A'
const CREAM = '#EDE8D8'
const CREAM_TEXT = '#1A1208'

// ─── Fade-in wrapper ─────────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

export default function SlugClient({ profile }: { profile: ArtistProfile }) {
  const [email, setEmail]   = useState('')
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle')

  const accent     = profile.primaryColor  || '#C026D3'
  const supporters = profile.supporters   ?? []
  const tracks     = profile.tracks       ?? []
  const gallery    = profile.galleryPhotos ?? []

  const hasStats   = profile.monthlyListeners || profile.totalShows || profile.countries

  // Booking link: url > email > #booking anchor
  const bookingHref = profile.bookingUrl
    ? profile.bookingUrl
    : profile.bookingEmail
      ? `mailto:${profile.bookingEmail}`
      : '#booking'

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    setSubStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, artistSlug: profile.slug }),
      })
      setSubStatus(res.ok ? 'ok' : 'err')
    } catch {
      setSubStatus('err')
    }
  }

  return (
    <div className="overflow-x-hidden" style={{ background: DARK, color: '#fff' }}>

      {/* ═══════════════════════════════════════════════════════════
          HERO — full viewport, photo left / text right
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col" style={{ background: DARK }}>

        {/* ── Artist photo (full bg + left accent) ── */}
        {profile.photo && (
          <>
            {/* Full bg: artist photo, very dark on mobile */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.photo}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-top md:object-left-top"
              style={{ opacity: 0.15 }}
            />
            {/* Desktop: left half fully visible */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.photo}
              alt={profile.artistName}
              className="hidden md:block absolute left-0 top-0 h-full object-cover object-top"
              style={{ width: '44%', opacity: 1 }}
            />
            {/* Desktop: gradient fade from photo → dark */}
            <div
              className="hidden md:block absolute inset-0"
              style={{ background: 'linear-gradient(to right, transparent 28%, rgba(12,10,7,0.75) 46%, #0C0A07 60%)' }}
            />
          </>
        )}

        {/* ── Top nav ── */}
        <nav className="relative z-20 flex items-center justify-between px-8 py-7">
          <span className="font-black text-white text-base tracking-tight" style={{ fontFamily: 'var(--font-syne)' }}>
            {profile.artistName.toUpperCase()}
          </span>
          <div className="flex items-center gap-2">
            <a
              href="#press"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-white/60 border border-white/15 hover:border-white/35 hover:text-white/90 transition-all backdrop-blur-sm"
            >
              Recursos de Prensa
            </a>
            <a
              href={bookingHref}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-black hover:opacity-90 transition-opacity"
              style={{ background: accent }}
            >
              Solicitar Booking
            </a>
          </div>
        </nav>

        {/* ── Main hero content ── */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="w-full md:w-[58%] md:ml-auto px-8 md:px-12 py-16">

            {/* Genres */}
            {(profile.genres?.length ?? 0) > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {profile.genres!.map(g => (
                  <span
                    key={g}
                    className="text-xs font-mono tracking-widest uppercase px-3 py-1 rounded-full"
                    style={{ background: `${accent}18`, border: `1px solid ${accent}40`, color: accent }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Artist name — very large */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-black uppercase text-white leading-[0.88] mb-5"
              style={{
                fontSize: 'clamp(52px, 8.5vw, 112px)',
                letterSpacing: '-0.025em',
                fontFamily: 'var(--font-syne)',
              }}
            >
              {profile.artistName}
            </motion.h1>

            {/* Tagline */}
            {profile.tagline && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.7 }}
                className="text-xs font-mono tracking-[0.28em] uppercase text-white/45 mb-8 flex items-center gap-4"
              >
                {profile.tagline}
                <span className="block h-px w-14" style={{ background: `linear-gradient(to right, ${accent}70, transparent)` }} />
              </motion.p>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="flex flex-wrap items-center gap-3 mb-10"
            >
              <a
                href={bookingHref}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm tracking-[0.12em] text-black hover:opacity-90 transition-opacity"
                style={{ background: accent, fontFamily: 'var(--font-syne)' }}
              >
                SOLICITAR BOOKING →
              </a>
            </motion.div>

            {/* Supporters */}
            {supporters.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="flex items-center gap-3 flex-wrap"
              >
                <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-white/25">
                  Con el apoyo de
                </span>
                <span className="text-white/15 text-xs">|</span>
                {supporters.map((s, i) => (
                  <span key={i} className="text-xs font-semibold text-white/55 hover:text-white/80 transition-colors cursor-default">
                    {s.name}
                  </span>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="relative z-10 flex flex-col items-end pr-10 pb-8 gap-2 text-white/20">
          <span className="text-[9px] font-mono tracking-[0.3em] uppercase">DESPLAZAR</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/25 to-transparent self-center" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          BIO — cream editorial section
      ═══════════════════════════════════════════════════════════ */}
      <section style={{ background: CREAM, color: CREAM_TEXT }}>
        <div className="max-w-7xl mx-auto px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

            {/* Left: bio */}
            <Reveal>
              <div>
                {profile.location && (
                  <p
                    className="text-xs font-mono tracking-[0.25em] uppercase mb-7"
                    style={{ color: `${CREAM_TEXT}55` }}
                  >
                    Basado en {profile.location}
                  </p>
                )}
                <p className="text-[15px] leading-[1.85] font-normal" style={{ color: `${CREAM_TEXT}CC` }}>
                  {profile.bio?.trim() || 'Artista independiente con proyección internacional.'}
                </p>
              </div>
            </Reveal>

            {/* Right: stats + links */}
            <Reveal delay={0.1}>
              <div className="space-y-10">
                {hasStats && (
                  <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                    {[
                      profile.monthlyListeners && { value: profile.monthlyListeners, label: 'Monthly Listeners' },
                      profile.totalShows       && { value: profile.totalShows,       label: 'Shows / año' },
                      profile.countries        && { value: profile.countries,         label: 'Países' },
                    ].filter(Boolean).map((s: any) => (
                      <div key={s.label}>
                        <div
                          className="font-black mb-1"
                          style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: CREAM_TEXT, fontFamily: 'var(--font-syne)' }}
                        >
                          {s.value}
                        </div>
                        <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: `${CREAM_TEXT}55` }}>
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Platform links */}
                <div className="flex items-center gap-5 flex-wrap">
                  {profile.raUrl && (
                    <a
                      href={profile.raUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-mono uppercase tracking-widest underline underline-offset-4 hover:opacity-70 transition-opacity"
                      style={{ color: `${CREAM_TEXT}70` }}
                    >
                      Resident Advisor ↗
                    </a>
                  )}
                  {profile.beatportUrl && (
                    <a
                      href={profile.beatportUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-mono uppercase tracking-widest underline underline-offset-4 hover:opacity-70 transition-opacity"
                      style={{ color: `${CREAM_TEXT}70` }}
                    >
                      Beatport ↗
                    </a>
                  )}
                  {profile.instagramUrl && (
                    <a
                      href={profile.instagramUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-mono uppercase tracking-widest underline underline-offset-4 hover:opacity-70 transition-opacity"
                      style={{ color: `${CREAM_TEXT}70` }}
                    >
                      Instagram ↗
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Divider */}
          <div
            className="mt-20 pt-8 flex items-center justify-center border-t"
            style={{ borderColor: `${CREAM_TEXT}12` }}
          >
            <span
              className="text-[10px] font-mono tracking-[0.38em] uppercase"
              style={{ color: `${CREAM_TEXT}35` }}
            >
              INDEPENDENT · INTERNATIONAL
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          GALLERY — live performance photos (only if provided)
      ═══════════════════════════════════════════════════════════ */}
      {gallery.length > 0 && (
        <section id="gallery" style={{ background: DARK }} className="py-20">
          <div className="max-w-7xl mx-auto px-8">
            <Reveal>
              <p className="text-[10px] font-mono tracking-[0.32em] uppercase text-white/22 mb-8">EN VIVO</p>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
              {gallery.slice(0, 6).map((url, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <div className="relative overflow-hidden rounded-lg group" style={{ aspectRatio: '4/3' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/15 group-hover:bg-black/0 transition-colors duration-300" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          STATS — big number + supporter ticker
      ═══════════════════════════════════════════════════════════ */}
      {(hasStats || supporters.length > 0) && (
        <section style={{ background: DARK2 }} className="py-28 overflow-hidden">
          <div className="max-w-7xl mx-auto px-8 text-center">
            {/* Big stat number */}
            {(profile.monthlyListeners || profile.totalShows) && (
              <Reveal>
                <div
                  className="font-black text-white/[0.07] leading-none select-none mb-3"
                  style={{
                    fontSize: 'clamp(72px, 20vw, 280px)',
                    fontFamily: 'var(--font-syne)',
                    letterSpacing: '-0.03em',
                  }}
                >
                  +{profile.monthlyListeners || profile.totalShows}
                </div>
              </Reveal>
            )}
            <Reveal delay={0.05}>
              <p className="text-xs font-mono tracking-[0.38em] uppercase text-white/28">
                DJs · ARTISTAS · SELLOS
              </p>
            </Reveal>

            {/* Scrolling supporters ticker */}
            {supporters.length > 0 && (
              <div className="mt-14 relative overflow-hidden">
                <div className="flex animate-marquee gap-12">
                  {[...supporters, ...supporters, ...supporters, ...supporters].map((s, i) => (
                    <span
                      key={i}
                      className="flex-shrink-0 text-sm font-mono tracking-[0.18em] uppercase text-white/18"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MUSIC — spotify embed or track list (cream)
      ═══════════════════════════════════════════════════════════ */}
      {(profile.spotifyPlaylistUrl || tracks.length > 0) && (
        <section id="music" className="relative overflow-hidden py-24" style={{ background: CREAM, color: CREAM_TEXT }}>

          {/* Giant faded background word */}
          <div
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center select-none pointer-events-none"
            style={{
              fontSize: 'clamp(80px, 22vw, 300px)',
              fontWeight: 900,
              fontFamily: 'var(--font-syne)',
              color: `${CREAM_TEXT}05`,
              lineHeight: 1,
              whiteSpace: 'nowrap',
            }}
          >
            MÚSICA
          </div>

          <div className="max-w-4xl mx-auto px-8 relative z-10">
            <Reveal>
              <p className="text-[10px] font-mono tracking-[0.3em] uppercase mb-2" style={{ color: `${CREAM_TEXT}45` }}>
                DISCOGRAFÍA
              </p>
              <h2
                className="font-black uppercase mb-12"
                style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: CREAM_TEXT, fontFamily: 'var(--font-syne)' }}
              >
                Música
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              {profile.spotifyPlaylistUrl ? (
                <iframe
                  src={profile.spotifyPlaylistUrl
                    .replace('open.spotify.com/playlist/', 'open.spotify.com/embed/playlist/')
                    .replace('open.spotify.com/album/',   'open.spotify.com/embed/album/')
                    .replace('open.spotify.com/artist/',  'open.spotify.com/embed/artist/')
                  }
                  width="100%"
                  height="420"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-2xl shadow-xl"
                  style={{ border: `1px solid ${CREAM_TEXT}10` }}
                />
              ) : (
                <div className="space-y-0">
                  {tracks.map((track, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 py-4 border-b transition-colors hover:bg-black/[0.03]"
                      style={{ borderColor: `${CREAM_TEXT}10` }}
                    >
                      <span className="w-6 text-right text-sm font-mono flex-shrink-0" style={{ color: `${CREAM_TEXT}28` }}>
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate" style={{ color: CREAM_TEXT }}>
                          {track.title}
                        </div>
                        {(track.label || track.year) && (
                          <div className="text-xs font-mono mt-0.5" style={{ color: `${CREAM_TEXT}48` }}>
                            {[track.label, track.year].filter(Boolean).join(' · ')}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Reveal>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          BOOKING + FAN LIST — dark section with photo bg
      ═══════════════════════════════════════════════════════════ */}
      <section id="booking" className="relative overflow-hidden" style={{ background: DARK }}>

        {/* Photo background overlay */}
        {profile.photo && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.photo}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-top"
              style={{ opacity: 0.08 }}
            />
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(135deg, ${DARK}E0 40%, ${DARK}CC 100%)` }}
            />
          </>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">

            {/* Booking CTA */}
            <Reveal>
              <div>
                <p className="text-[10px] font-mono tracking-[0.32em] uppercase text-white/28 mb-5">
                  CONTACTO
                </p>
                <h2
                  className="font-black uppercase text-white leading-tight mb-5"
                  style={{
                    fontSize: 'clamp(40px, 6.5vw, 84px)',
                    fontFamily: 'var(--font-syne)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  CONTÁCTANOS
                </h2>
                <p className="text-white/38 text-sm leading-relaxed mb-8 max-w-xs">
                  Respuesta en 48h. Rider técnico disponible al instante.
                </p>
                <a
                  href={bookingHref}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm tracking-[0.1em] text-black hover:opacity-90 transition-opacity"
                  style={{ background: accent, fontFamily: 'var(--font-syne)' }}
                >
                  SOLICITAR BOOKING →
                </a>
                {profile.availableDates && (
                  <p className="text-white/28 text-[11px] font-mono mt-5 leading-relaxed">
                    ⚡ Fechas disponibles {profile.availableDates} · Rider técnico incluido
                  </p>
                )}
              </div>
            </Reveal>

            {/* Fan list signup */}
            <Reveal delay={0.1}>
              <div>
                <h3 className="text-xl font-black text-white mb-2" style={{ fontFamily: 'var(--font-syne)' }}>
                  Únete a la lista
                </h3>
                <p className="text-white/38 text-sm mb-6 leading-relaxed">
                  Música exclusiva, primeras escuchas e invitaciones privadas — directo a tu email.
                </p>

                {subStatus === 'ok' ? (
                  <div
                    className="p-5 rounded-2xl border"
                    style={{ background: `${accent}10`, borderColor: `${accent}30` }}
                  >
                    <p className="text-sm font-mono" style={{ color: accent }}>
                      ✓ ¡Estás dentro! Te avisaremos pronto.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-3">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Introduce tu email"
                      className="w-full px-5 py-4 rounded-2xl text-sm bg-white/[0.055] border border-white/[0.09] text-white placeholder-white/25 focus:outline-none focus:border-white/28 transition-colors"
                    />
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input type="checkbox" required className="mt-0.5 accent-current flex-shrink-0" style={{ accentColor: accent }} />
                      <span className="text-xs text-white/28 font-mono leading-relaxed">
                        Acepto la política de privacidad y tratamiento de datos
                      </span>
                    </label>
                    <button
                      type="submit"
                      disabled={subStatus === 'loading'}
                      className="w-full py-4 rounded-2xl text-sm font-bold tracking-[0.1em] text-black disabled:opacity-50 hover:opacity-90 transition-opacity"
                      style={{ background: accent, fontFamily: 'var(--font-syne)' }}
                    >
                      {subStatus === 'loading' ? 'ENVIANDO...' : 'SÉ PARTE DE ELLO'}
                    </button>
                    {subStatus === 'err' && (
                      <p className="text-red-400/80 text-xs font-mono text-center">
                        Error al suscribirse. Inténtalo de nuevo.
                      </p>
                    )}
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PRESS RESOURCES (id="press") — minimal anchor section
      ═══════════════════════════════════════════════════════════ */}
      <section id="press" style={{ background: CREAM, color: CREAM_TEXT }} className="py-16">
        <div className="max-w-7xl mx-auto px-8">
          <Reveal>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-[10px] font-mono tracking-[0.3em] uppercase mb-2" style={{ color: `${CREAM_TEXT}45` }}>
                  PRENSA
                </p>
                <h3 className="text-2xl font-black uppercase" style={{ fontFamily: 'var(--font-syne)', color: CREAM_TEXT }}>
                  Recursos de Prensa
                </h3>
                <p className="text-sm mt-2" style={{ color: `${CREAM_TEXT}60` }}>
                  Bio oficial, fotos de alta resolución y rider técnico.
                </p>
              </div>
              <a
                href={profile.bookingEmail ? `mailto:${profile.bookingEmail}` : '#booking'}
                className="flex-shrink-0 px-6 py-3 rounded-full text-sm font-bold border-2 hover:bg-black/[0.04] transition-colors"
                style={{ borderColor: `${CREAM_TEXT}20`, color: CREAM_TEXT }}
              >
                Solicitar materiales →
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════ */}
      <footer
        className="border-t"
        style={{ background: '#090705', borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-5">

          <p className="text-[10px] font-mono tracking-widest uppercase text-white/18">
            © {new Date().getFullYear()} {profile.artistName}. Todos los derechos reservados.
          </p>

          {/* Platform links */}
          <div className="flex items-center gap-5">
            {profile.raUrl && (
              <a href={profile.raUrl} target="_blank" rel="noopener noreferrer"
                className="text-[10px] font-mono uppercase tracking-widest text-white/20 hover:text-white/50 transition-colors">
                RA
              </a>
            )}
            {profile.beatportUrl && (
              <a href={profile.beatportUrl} target="_blank" rel="noopener noreferrer"
                className="text-[10px] font-mono uppercase tracking-widest text-white/20 hover:text-white/50 transition-colors">
                Beatport
              </a>
            )}
            {profile.instagramUrl && (
              <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer"
                className="text-[10px] font-mono uppercase tracking-widest text-white/20 hover:text-white/50 transition-colors">
                Instagram
              </a>
            )}
          </div>

          <a
            href="/"
            className="text-[10px] font-mono tracking-widest uppercase text-white/14 hover:text-white/30 transition-colors"
          >
            Creado con PRESSKIT.PRO
          </a>
        </div>
      </footer>
    </div>
  )
}
