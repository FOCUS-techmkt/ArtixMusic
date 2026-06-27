'use client'
/* ════════════════════════════════════════════════════════════════
   MINIMAL PULSE — réplica exacta de https://landing-dj.vercel.app/dj/demodj
   Layout dedicado: se activa cuando artist.layout_variant === 'minimal-pulse'.
   Lee de los configs de sección existentes (hero, bio, releases, live,
   gallery, music, contact) y los renderiza con el diseño del sitio original.
   ════════════════════════════════════════════════════════════════ */
import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import type { Artist, ArtistPalette, Section } from '@/types'
import type {
  HeroConfig, BioConfig, ReleasesConfig, LiveConfig, GalleryConfig,
  MusicConfig, ContactConfig, HeroSocialLink,
} from '@/types/sections'
import { Reveal } from './_shared'

const VenueMap = dynamic(() => import('./VenueMap'), { ssr: false })

// ── Design tokens (del sitio original) ───────────────────────────
const TONE_A = '#07070f'   // fondo base
const TONE_B = '#050509'   // fondo alterno
const TXT    = '#f1f5f9'
const MUTED  = '#94a3b8'
const SURFACE       = 'rgba(255,255,255,0.04)'
const SURFACE_HOVER = 'rgba(255,255,255,0.07)'
const BORDER        = 'rgba(255,255,255,0.10)'

// ── Brand icons (inline SVG, 20px) ───────────────────────────────
function BrandIcon({ platform, size = 18 }: { platform: string; size?: number }) {
  const p = platform.toLowerCase()
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'currentColor' }
  switch (p) {
    case 'instagram':
      return <svg {...common}><path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s0-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.15 0-3.5 0-4.74.07-.9.04-1.38.19-1.7.31-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.12.32-.27.8-.31 1.7C3.43 8.5 3.42 8.85 3.42 12s0 3.5.07 4.74c.04.9.19 1.38.31 1.7.17.43.37.74.69 1.06.32.32.63.52 1.06.69.32.12.8.27 1.7.31 1.24.07 1.59.07 4.74.07s3.5 0 4.74-.07c.9-.04 1.38-.19 1.7-.31.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.12-.32.27-.8.31-1.7.07-1.24.07-1.59.07-4.74s0-3.5-.07-4.74c-.04-.9-.19-1.38-.31-1.7a2.85 2.85 0 0 0-.69-1.06 2.85 2.85 0 0 0-1.06-.69c-.32-.12-.8-.27-1.7-.31C15.5 4 15.15 4 12 4Zm0 3.06A4.94 4.94 0 1 1 7.06 12 4.94 4.94 0 0 1 12 7.06Zm0 8.14A3.2 3.2 0 1 0 8.8 12 3.2 3.2 0 0 0 12 15.2Zm6.3-8.34a1.15 1.15 0 1 1-1.15-1.15 1.15 1.15 0 0 1 1.15 1.15Z"/></svg>
    case 'spotify':
      return <svg {...common}><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.6 14.43a.62.62 0 0 1-.86.21c-2.35-1.44-5.3-1.76-8.79-.97a.62.62 0 1 1-.28-1.22c3.8-.87 7.07-.5 9.71 1.12.3.18.39.57.22.86Zm1.23-2.73a.78.78 0 0 1-1.07.26c-2.69-1.65-6.79-2.13-9.97-1.17a.78.78 0 1 1-.45-1.49c3.63-1.1 8.15-.56 11.24 1.33.37.22.49.7.25 1.07Zm.11-2.85C14.83 8.04 9.4 7.86 6.3 8.8a.93.93 0 1 1-.54-1.79c3.56-1.08 9.56-.87 13.34 1.37a.93.93 0 1 1-.95 1.6Z"/></svg>
    case 'soundcloud':
      return <svg {...common}><path d="M1.5 14.6c-.1 0-.16-.07-.17-.17l-.2-1.45.2-1.48c.01-.1.08-.16.17-.16.1 0 .16.07.17.16l.24 1.48-.24 1.45c-.01.1-.08.17-.17.17Zm1.2.5c-.1 0-.18-.08-.19-.19l-.26-1.93.26-2c.01-.1.09-.18.19-.18.1 0 .17.08.19.19l.3 1.99-.3 1.93c-.02.1-.09.19-.19.19Zm9.13-8.4c.43-.27.94-.43 1.49-.43 1.6 0 2.9 1.3 2.9 2.91 0 .1 0 .2-.02.3.3-.13.62-.2.96-.2 1.34 0 2.43 1.1 2.43 2.45S20.5 17.7 19.15 17.7h-6.82c-.13 0-.24-.11-.24-.24V6.94c0-.13.04-.2.21-.24h-.02Zm-1.04.66c.11 0 .2.09.21.2l.34 4.84-.34 2.79c-.01.11-.1.2-.21.2-.11 0-.2-.09-.21-.2l-.3-2.79.3-4.84c.01-.11.1-.2.21-.2Zm-1.18.43c.12 0 .21.09.22.21l.3 4.4-.3 2.79c-.01.12-.1.21-.22.21-.11 0-.2-.09-.22-.21l-.26-2.79.26-4.4c.02-.12.11-.21.22-.21Zm-1.2.92c.12 0 .22.1.23.22l.25 3.47-.25 2.79c-.01.12-.11.22-.23.22-.12 0-.22-.1-.23-.22l-.22-2.79.22-3.47c.01-.12.11-.22.23-.22Zm-1.19-.16c.13 0 .23.1.24.23l.27 3.62-.27 2.78c-.01.13-.11.23-.24.23-.12 0-.23-.1-.24-.23l-.23-2.78.23-3.62c.01-.13.12-.23.24-.23Zm-1.2.83c.13 0 .24.11.25.24l.24 2.79-.24 2.78c-.01.13-.12.24-.25.24-.13 0-.23-.11-.24-.24l-.21-2.78.21-2.79c.01-.13.11-.24.24-.24Zm-1.18.6c.13 0 .24.11.25.25l.22 2.18-.22 2.79c-.01.13-.12.24-.25.24-.13 0-.24-.11-.25-.24l-.2-2.79.2-2.18c.01-.14.12-.25.25-.25Z"/></svg>
    case 'youtube':
      return <svg {...common}><path d="M23.5 6.5a3 3 0 0 0-2.1-2.13C19.55 3.87 12 3.87 12 3.87s-7.55 0-9.4.5A3 3 0 0 0 .5 6.5 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.5 3 3 0 0 0 2.1 2.13c1.85.5 9.4.5 9.4.5s7.55 0 9.4-.5a3 3 0 0 0 2.1-2.13A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.5ZM9.6 15.57V8.43L15.82 12 9.6 15.57Z"/></svg>
    case 'beatport':
      return <svg {...common}><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1 5.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z"/></svg>
    case 'tiktok':
      return <svg {...common}><path d="M16.6 5.82a4.28 4.28 0 0 1-1-2.82h-3.1v12.3a2.34 2.34 0 1 1-2.34-2.34c.22 0 .43.03.63.09v-3.2a5.54 5.54 0 1 0 4.8 5.5V9.01a7.3 7.3 0 0 0 4.28 1.37V7.28a4.28 4.28 0 0 1-3.27-1.46Z"/></svg>
    default:
      return <svg {...common}><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 1.8a8.2 8.2 0 0 1 0 16.4 8.2 8.2 0 0 1 0-16.4Z"/></svg>
  }
}

// ── Helpers ───────────────────────────────────────────────────────
function cfg<T>(sections: Section[], name: string): T | null {
  const s = sections.find(x => x.name === name && x.is_enabled)
  return s ? (s.config as unknown as T) : null
}
function enabled(sections: Section[], name: string): boolean {
  return sections.some(s => s.name === name && s.is_enabled)
}
function collectSocials(hero: HeroConfig | null, artist: Artist): HeroSocialLink[] {
  const fromHero = (hero?.socials ?? []).filter(s => s.enabled && s.url).sort((a, b) => a.sort_order - b.sort_order)
  if (fromHero.length) return fromHero
  // fallback to artist links
  const out: HeroSocialLink[] = []
  const push = (platform: string, url?: string | null) => { if (url) out.push({ id: platform, platform, url, enabled: true, sort_order: out.length }) }
  push('instagram', artist.instagram_url ?? artist.links?.instagram)
  push('spotify',   artist.spotify_playlist_url ?? artist.links?.spotify)
  push('soundcloud', artist.links?.soundcloud)
  push('youtube',   artist.links?.youtube)
  return out
}
function embedUrl(url: string, accent: string): { kind: 'soundcloud' | 'spotify' | 'youtube' | null; src: string } {
  if (/soundcloud\.com/.test(url)) {
    const c = accent.replace('#', '')
    return { kind: 'soundcloud', src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23${c}&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false` }
  }
  if (/spotify\.com/.test(url)) {
    return { kind: 'spotify', src: url.replace(/open\.spotify\.com\/(intl-[a-z]+\/)?/, 'open.spotify.com/embed/').split('?')[0] }
  }
  if (/youtube\.com|youtu\.be/.test(url)) {
    const id = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1]
    return { kind: 'youtube', src: id ? `https://www.youtube.com/embed/${id}` : url }
  }
  return { kind: null, src: url }
}

// ── Eyebrow + section header ──────────────────────────────────────
function Eyebrow({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <p className="text-[12px] uppercase mb-3" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '3px', color: accent }}>
      — {children}
    </p>
  )
}
function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="leading-[0.9]" style={{ fontFamily: 'var(--font-bebas-neue)', fontSize: 'clamp(40px,6vw,72px)', letterSpacing: '-1.8px', color: TXT }}>
      {children}
    </h2>
  )
}
function Section({ id, tone, children }: { id: string; tone: 'a' | 'b'; children: React.ReactNode }) {
  return (
    <section id={id} className="py-20 md:py-32" style={{ background: tone === 'a' ? TONE_A : TONE_B, scrollMarginTop: 64 }}>
      <div className="max-w-6xl mx-auto px-6">{children}</div>
    </section>
  )
}

// ── Nav (con menú móvil) ─────────────────────────────────────────
function Nav({ artistName, navLinks, socials, accent }: {
  artistName: string
  navLinks: { href: string; label: string }[]
  socials: HeroSocialLink[]
  accent: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md"
      style={{ background: 'rgba(7,7,15,0.6)', borderBottom: `1px solid ${BORDER}` }}>
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="text-[20px] tracking-wide" style={{ fontFamily: 'var(--font-bebas-neue)', color: TXT }}>
          {artistName}
        </a>
        <ul className="hidden md:flex items-center gap-7">
          {navLinks.map(l => (
            <li key={l.href}>
              <a href={l.href} className="text-[13px] transition-opacity hover:opacity-100" style={{ color: MUTED }}>{l.label}</a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3">
            {socials.map(s => (
              <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"
                 aria-label={s.platform} className="transition-colors" style={{ color: MUTED }}>
                <BrandIcon platform={s.platform} size={16} />
              </a>
            ))}
          </div>
          <a href="#contact" className="hidden sm:inline-block text-[13px] px-4 py-2 rounded-full font-semibold transition-transform hover:scale-105"
             style={{ background: accent, color: '#fff' }}>Contacto</a>
          {/* Hamburger — solo móvil */}
          <button onClick={() => setOpen(o => !o)} aria-label="Menú" aria-expanded={open}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px]">
            <span className="block w-5 h-[2px] transition-transform" style={{ background: TXT, transform: open ? 'translateY(7px) rotate(45deg)' : 'none' }} />
            <span className="block w-5 h-[2px] transition-opacity" style={{ background: TXT, opacity: open ? 0 : 1 }} />
            <span className="block w-5 h-[2px] transition-transform" style={{ background: TXT, transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Panel móvil desplegable */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden"
            style={{ background: 'rgba(7,7,15,0.96)', borderBottom: `1px solid ${BORDER}` }}>
            <ul className="px-6 py-4 flex flex-col gap-1">
              {navLinks.map(l => (
                <li key={l.href}>
                  <a href={l.href} onClick={() => setOpen(false)}
                     className="block py-2.5 text-[15px]" style={{ color: TXT }}>{l.label}</a>
                </li>
              ))}
              <li className="flex items-center gap-4 pt-3 mt-2" style={{ borderTop: `1px solid ${BORDER}` }}>
                {socials.map(s => (
                  <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.platform} style={{ color: MUTED }}>
                    <BrandIcon platform={s.platform} size={18} />
                  </a>
                ))}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// ════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════
export default function MinimalPulse({ artist, sections, palette }: {
  artist: Artist; sections: Section[]; palette: ArtistPalette
}) {
  const accent  = palette.primary
  const accent2 = palette.secondary

  const hero     = cfg<HeroConfig>(sections, 'hero')
  const bio      = cfg<BioConfig>(sections, 'bio')
  const releases = cfg<ReleasesConfig>(sections, 'releases')
  const live     = cfg<LiveConfig>(sections, 'live')
  const gallery  = cfg<GalleryConfig>(sections, 'gallery')
  const music    = cfg<MusicConfig>(sections, 'music')
  const contact  = cfg<ContactConfig>(sections, 'contact')

  const socials  = collectSocials(hero, artist)
  const genres   = (bio?.genres?.length ? bio.genres : artist.sound_words ?? []).slice(0, 4)
  const heroImg  = hero?.bg_image ?? artist.photo_url
  const subTagline = artist.tagline ?? hero?.sub_tagline ?? ''

  const navLinks = [
    enabled(sections, 'bio')      && { href: '#bio',      label: 'Bio' },
    enabled(sections, 'releases') && { href: '#releases', label: 'Releases' },
    enabled(sections, 'live')     && { href: '#shows',    label: 'Shows' },
    enabled(sections, 'gallery')  && { href: '#media',    label: 'Media' },
    enabled(sections, 'music')    && { href: '#mix',      label: 'Mix' },
    enabled(sections, 'contact')  && { href: '#contact',  label: 'Contacto' },
  ].filter(Boolean) as { href: string; label: string }[]

  return (
    <div style={{ background: TONE_A, color: TXT, fontFamily: 'var(--font-display)', minHeight: '100vh' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        .mp-input { transition: border-color .2s, box-shadow .2s; }
        .mp-input::placeholder { color: rgba(255,255,255,0.35); }
        .mp-input:focus { outline: none; border-color: ${accent} !important; box-shadow: 0 0 0 3px ${accent}22; }
      `}</style>
      {/* ── NAV ───────────────────────────────────────────── */}
      <Nav artistName={artist.artist_name} navLinks={navLinks} socials={socials} accent={accent} />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-end md:justify-center h-screen overflow-hidden"
        style={{ background: TONE_A }}>
        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt={artist.artist_name} className="w-full h-full object-cover object-center" />
          </div>
        )}
        {/* bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-2/5" style={{ background: `linear-gradient(to top, ${TONE_A}cc, transparent)` }} />
        {/* glow orbs */}
        <div className="absolute rounded-full pointer-events-none" style={{ top: '15%', left: '10%', width: 600, height: 600, background: accent, opacity: 0.15, filter: 'blur(120px)' }} />
        <div className="absolute rounded-full pointer-events-none" style={{ bottom: '10%', right: '8%', width: 500, height: 500, background: accent2, opacity: 0.10, filter: 'blur(120px)' }} />
        <div className="absolute rounded-full pointer-events-none" style={{ top: '35%', right: '20%', width: 300, height: 300, background: accent, opacity: 0.06, filter: 'blur(90px)' }} />

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center text-center px-4 pb-10 md:pb-0">
          {genres.length > 0 && (
            <p className="text-[12px] uppercase mb-4" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '3px', color: MUTED }}>
              {genres.join(' · ')}
            </p>
          )}
          <h1 className="leading-[0.85]" style={{ fontFamily: 'var(--font-bebas-neue)', fontSize: 'clamp(72px,16vw,192px)', letterSpacing: '-0.03em', color: TXT }}>
            {artist.artist_name}
          </h1>
          {subTagline && <p className="mt-3 text-[15px] md:text-[18px]" style={{ color: MUTED }}>{subTagline}</p>}

          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <a href="#contact" className="text-[13px] px-6 py-3 rounded-full font-semibold transition-transform hover:scale-105"
               style={{ background: accent, color: '#fff' }}>Contacto</a>
            <div className="flex items-center gap-4">
              {socials.map(s => (
                <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.platform}
                   className="transition-transform hover:scale-110" style={{ color: TXT }}>
                  <BrandIcon platform={s.platform} size={20} />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── BIO ───────────────────────────────────────────── */}
      {bio && (
        <Section id="bio" tone="a">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            {bio.photo_position !== 'none' && (artist.photo_url || bio.bg_image) && (
              <Reveal>
                <div className="overflow-hidden" style={{ aspectRatio: '3/4', background: SURFACE }}>
                  <img src={(bio.bg_image || artist.photo_url) as string} alt={artist.artist_name} className="w-full h-full object-cover" />
                </div>
              </Reveal>
            )}
            <Reveal delay={0.1}>
              <Eyebrow accent={accent}>Sobre el artista</Eyebrow>
              <H2>Biografía</H2>
              <BioText html={bio.text} />
              {bio.stats?.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
                  {bio.stats.map((st, i) => (
                    <div key={i}>
                      <div style={{ fontFamily: 'var(--font-bebas-neue)', fontSize: 34, color: accent, lineHeight: 1 }}>{st.value}</div>
                      <div className="text-[12px] mt-1" style={{ fontFamily: 'var(--font-mono)', color: MUTED }}>{st.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </Reveal>
          </div>
        </Section>
      )}

      {/* ── RELEASES ──────────────────────────────────────── */}
      {releases && releases.releases.length > 0 && (
        <Section id="releases" tone="b">
          <Reveal className="mb-12">
            <Eyebrow accent={accent}>Discografía</Eyebrow>
            <H2>{releases.section_title || 'Releases'}</H2>
            <p className="mt-3 text-[15px]" style={{ color: MUTED }}>Música disponible en las principales plataformas digitales.</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {releases.releases.map(r => {
              const link = r.spotify_url || r.beatport_url
              const platform = r.spotify_url ? 'spotify' : 'beatport'
              return (
                <Reveal key={r.id}>
                  <article className="group">
                    <div className="relative overflow-hidden" style={{ aspectRatio: '1/1', background: SURFACE }}>
                      {r.cover && <img src={r.cover} alt={r.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                      {link && (
                        <a href={link} target="_blank" rel="noopener noreferrer" aria-label={platform}
                           className="absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                           style={{ background: accent, color: '#fff' }}>
                          <BrandIcon platform={platform} size={18} />
                        </a>
                      )}
                    </div>
                    <div className="mt-4">
                      <div className="text-[11px] uppercase" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '2px', color: accent }}>
                        {r.label || 'SINGLE'}
                      </div>
                      <h3 className="mt-1" style={{ fontFamily: 'var(--font-bebas-neue)', fontSize: 24, color: TXT }}>{r.title}</h3>
                      {r.year && <p className="text-[13px]" style={{ color: MUTED }}>{r.year}</p>}
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </Section>
      )}

      {/* ── SHOWS ─────────────────────────────────────────── */}
      {live && live.venues.length > 0 && (
        <Section id="shows" tone="a">
          <Reveal className="mb-10">
            <Eyebrow accent={accent}>Agenda</Eyebrow>
            <H2>{live.section_title || 'Shows'}</H2>
          </Reveal>
          <Reveal>
            <ShowsList venues={live.venues} accent={accent} />
          </Reveal>
          {live.venues.some(v => v.lat != null && v.lng != null) && (
            <Reveal className="mt-14">
              <Eyebrow accent={accent}>Gira mundial</Eyebrow>
              <H2>Mapa de Shows</H2>
              <div className="mt-6">
                <VenueMap venues={live.venues} palette={palette} />
              </div>
            </Reveal>
          )}
        </Section>
      )}

      {/* ── MEDIA / GALLERY ───────────────────────────────── */}
      {gallery && gallery.images.length > 0 && (
        <Section id="media" tone="b">
          <Reveal className="mb-12">
            <Eyebrow accent={accent}>Galería</Eyebrow>
            <H2>{gallery.section_title || 'Multimedia'}</H2>
            <p className="mt-3 text-[15px]" style={{ color: MUTED }}>Momentos capturados en escena y fuera de ella.</p>
          </Reveal>
          <Coverflow images={gallery.images} accent={accent} />
        </Section>
      )}

      {/* ── MIX ───────────────────────────────────────────── */}
      {music && music.tracks.length > 0 && (
        <Section id="mix" tone="a">
          <Reveal className="mb-10">
            <Eyebrow accent={accent}>Audio</Eyebrow>
            <H2>{music.section_title || 'Mix'}</H2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6">
            {music.tracks.map(t => {
              const e = embedUrl(t.url, accent)
              if (!e.kind) return null
              return (
                <Reveal key={t.id}>
                  <div className="rounded-2xl overflow-hidden" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                    <div className="flex items-center gap-2 px-4 py-3" style={{ color: MUTED, borderBottom: `1px solid ${BORDER}` }}>
                      <BrandIcon platform={e.kind} size={16} />
                      <span className="text-[12px] uppercase" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '2px' }}>{e.kind}</span>
                    </div>
                    <iframe
                      src={e.src}
                      title={t.title || e.kind}
                      width="100%"
                      height={e.kind === 'soundcloud' ? 166 : e.kind === 'youtube' ? 240 : 352}
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    />
                  </div>
                </Reveal>
              )
            })}
          </div>
        </Section>
      )}

      {/* ── CONTACT ───────────────────────────────────────── */}
      {contact && (
        <Section id="contact" tone="a">
          <div className="grid md:grid-cols-2 gap-12">
            <Reveal>
              <Eyebrow accent={accent}>Contacto</Eyebrow>
              <H2>Hablemos</H2>
              <p className="mt-3 text-[15px] max-w-md" style={{ color: MUTED }}>
                ¿Querés bookearlo para tu evento? ¿Tenés un proyecto de prensa o colaboración? Escribinos.
              </p>
              {artist.booking_email && (
                <div className="mt-8 flex flex-col gap-3">
                  <a href={`mailto:${artist.booking_email}`} className="flex items-center gap-3 group">
                    <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>✉</span>
                    <span>
                      <span className="block text-[12px]" style={{ fontFamily: 'var(--font-mono)', color: MUTED }}>Booking</span>
                      <span className="block text-[15px]" style={{ color: TXT }}>{artist.booking_email}</span>
                    </span>
                  </a>
                </div>
              )}
              {socials.length > 0 && (
                <div className="mt-8">
                  <p className="text-[12px] mb-3" style={{ fontFamily: 'var(--font-mono)', color: MUTED }}>Redes sociales</p>
                  <div className="flex items-center gap-4">
                    {socials.map(s => (
                      <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.platform}
                         className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                         style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: TXT }}>
                        <BrandIcon platform={s.platform} size={18} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </Reveal>
            <Reveal delay={0.1}>
              <ContactForm accent={accent} bookingEmail={artist.booking_email} />
            </Reveal>
          </div>
        </Section>
      )}

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer style={{ background: TONE_A, borderTop: `1px solid ${BORDER}` }}>
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <span style={{ fontFamily: 'var(--font-bebas-neue)', fontSize: 22, color: TXT }}>{artist.artist_name}</span>
          <div className="flex items-center gap-4">
            {socials.map(s => (
              <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.platform} style={{ color: MUTED }}>
                <BrandIcon platform={s.platform} size={18} />
              </a>
            ))}
          </div>
          <p className="text-[12px]" style={{ color: MUTED }}>
            © {new Date().getFullYear()} {artist.artist_name}. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}

// ── Bio text with "leer más" ─────────────────────────────────────
function BioText({ html }: { html: string }) {
  const [open, setOpen] = useState(false)
  const clean = html ?? ''
  return (
    <div className="mt-5">
      <div className={open ? '' : 'line-clamp-5'} style={{ color: '#cbd5e1', lineHeight: 1.7 }}
        dangerouslySetInnerHTML={{ __html: clean }} />
      {clean.replace(/<[^>]+>/g, '').length > 260 && (
        <button onClick={() => setOpen(o => !o)} className="mt-3 text-[12px]"
          style={{ fontFamily: 'var(--font-mono)', color: '#d45137' }}>
          {open ? 'Leer menos ↑' : 'Leer más ↓'}
        </button>
      )}
    </div>
  )
}

// ── Shows list (date-block rows) ─────────────────────────────────
function ShowsList({ venues, accent }: { venues: LiveConfig['venues']; accent: string }) {
  const fmt = (d: string) => {
    try {
      const dt = new Date(d)
      return {
        day:   dt.toLocaleDateString('es-ES', { day: '2-digit' }),
        month: dt.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '').toUpperCase(),
        year:  dt.toLocaleDateString('es-ES', { year: 'numeric' }),
      }
    } catch { return { day: '', month: d, year: '' } }
  }
  return (
    <div className="flex flex-col">
      {venues.map(v => {
        const dt = fmt(v.date)
        const tickets = v.instagram
        return (
          <div key={v.id} className="flex items-center gap-5 py-5" style={{ borderTop: `1px solid ${BORDER}` }}>
            <div className="text-center shrink-0 w-14">
              <div style={{ fontFamily: 'var(--font-bebas-neue)', fontSize: 28, color: TXT, lineHeight: 1 }}>{dt.day}</div>
              <div className="text-[11px]" style={{ fontFamily: 'var(--font-mono)', color: accent }}>{dt.month}</div>
              <div className="text-[10px]" style={{ fontFamily: 'var(--font-mono)', color: MUTED }}>{dt.year}</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <span style={{ fontFamily: 'var(--font-bebas-neue)', fontSize: 22, color: TXT }}>{v.name}</span>
                {!tickets && <span className="text-[10px] uppercase px-2 py-0.5 rounded-full" style={{ background: SURFACE, color: '#f87171', letterSpacing: '0.5px' }}>Sold Out</span>}
              </div>
              <p className="text-[13px] mt-0.5 flex items-center gap-1.5" style={{ color: MUTED }}>
                <span>📍</span>{[v.city, v.country].filter(Boolean).join(', ')}
              </p>
            </div>
            {tickets && (
              <a href={tickets} target="_blank" rel="noopener noreferrer"
                 className="shrink-0 text-[13px] px-4 py-2 rounded-full font-semibold transition-transform hover:scale-105"
                 style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: TXT }}>
                Tickets
              </a>
            )}
          </div>
        )
      })}
      <div style={{ borderTop: `1px solid ${BORDER}` }} />
    </div>
  )
}

// ── Coverflow gallery ────────────────────────────────────────────
function Coverflow({ images, accent }: { images: GalleryConfig['images']; accent: string }) {
  const [idx, setIdx] = useState(0)
  const n = images.length
  const go = (d: number) => setIdx(i => (i + d + n) % n)

  return (
    <div className="relative">
      <div className="relative h-[340px] sm:h-[440px] flex items-center justify-center overflow-hidden">
        {images.map((img, i) => {
          let off = i - idx
          if (off > n / 2) off -= n
          if (off < -n / 2) off += n
          const abs = Math.abs(off)
          if (abs > 2) return null
          return (
            <motion.div key={img.id} className="absolute"
              animate={{
                x: `${off * 58}%`,
                scale: off === 0 ? 1 : 0.78,
                opacity: off === 0 ? 1 : 0.45,
                zIndex: 10 - abs,
                filter: off === 0 ? 'none' : 'brightness(0.6)',
              }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: 'min(560px, 80vw)', aspectRatio: '16/10' }}>
              <div className="relative w-full h-full overflow-hidden rounded-xl" style={{ border: `1px solid ${BORDER}` }}>
                <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                {off === 0 && img.caption && (
                  <div className="absolute bottom-0 inset-x-0 p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                    <p className="text-[13px]" style={{ fontFamily: 'var(--font-mono)', color: TXT }}>{img.caption}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
      <button onClick={() => go(-1)} aria-label="Anterior"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: TXT }}>‹</button>
      <button onClick={() => go(1)} aria-label="Siguiente"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: TXT }}>›</button>
      <div className="flex items-center justify-center gap-2 mt-6">
        {images.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} aria-label={`Ir a imagen ${i + 1}`}
            className="rounded-full transition-all" style={{ width: i === idx ? 22 : 7, height: 7, background: i === idx ? accent : BORDER }} />
        ))}
      </div>
    </div>
  )
}

// ── Contact form ─────────────────────────────────────────────────
function ContactForm({ accent, bookingEmail }: { accent: string; bookingEmail: string | null }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [type, setType] = useState('Booking')
  const [message, setMessage] = useState('')

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)', border: `1px solid rgba(255,255,255,0.1)`,
    borderRadius: 14, padding: '12px 16px', color: '#fff', width: '100%',
  }
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const to = bookingEmail ?? ''
    const subject = encodeURIComponent(`[${type}] ${name}`)
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`)
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`
  }
  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input className="mp-input" style={inputStyle} placeholder="Tu nombre" value={name} onChange={e => setName(e.target.value)} required />
        <input className="mp-input" style={inputStyle} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div className="flex gap-2">
        {['Booking', 'Prensa', 'Otro'].map(t => (
          <button key={t} type="button" onClick={() => setType(t)}
            className="flex-1 py-2 rounded-full text-[13px] font-medium transition-all"
            style={{ background: type === t ? accent : SURFACE, color: type === t ? '#fff' : MUTED, border: `1px solid ${BORDER}` }}>
            {t}
          </button>
        ))}
      </div>
      <textarea className="mp-input" style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }} placeholder="Tu mensaje..." value={message} onChange={e => setMessage(e.target.value)} required />
      <button type="submit" className="py-3.5 px-7 rounded-full font-semibold self-start transition-transform hover:scale-105"
        style={{ background: accent, color: '#fff', letterSpacing: '0.35px' }}>
        Enviar mensaje
      </button>
    </form>
  )
}
