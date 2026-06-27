'use client'
/* ════════════════════════════════════════════════════════════════
   PRESS KIT — réplica de dj-presskit.com
   Un único layout dedicado parametrizado por `theme`:
     · presskit-pupi  → monocromo B&N (Pupi Jaet)
     · presskit-kay   → rojo + naranja, hero con stats (Kaÿ Wagner)
     · presskit-danny → teal, con sección música (Danny Khas)
   Lee de los configs de sección existentes (hero, bio, live, music,
   gallery, rider, contact). Se activa vía hero.config.pageLayout.
   ════════════════════════════════════════════════════════════════ */
import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Artist, ArtistPalette, Section } from '@/types'
import type {
  HeroConfig, BioConfig, LiveConfig, GalleryConfig,
  MusicConfig, ContactConfig, RiderConfig, HeroSocialLink,
} from '@/types/sections'
import { Reveal } from './_shared'

// ── Tema por DJ ──────────────────────────────────────────────────
type ThemeId = 'pupi' | 'kay' | 'danny'
interface ThemeTokens {
  mono:        boolean                 // monocromo (Pupi)
  headingFont: string                  // font-family CSS var de los títulos
  heroVariant: 'big' | 'stats' | 'tagline'
  stackedName: boolean                 // nombre apilado por palabras
}
const THEMES: Record<ThemeId, ThemeTokens> = {
  pupi:  { mono: true,  headingFont: 'var(--font-bebas-neue)', heroVariant: 'big',     stackedName: false },
  kay:   { mono: false, headingFont: 'var(--font-display)',    heroVariant: 'stats',   stackedName: true  },
  danny: { mono: false, headingFont: 'var(--font-bebas-neue)', heroVariant: 'tagline', stackedName: false },
}

const BG    = '#101010'
const BG2   = '#0c0c0c'
const TXT   = '#f5f5f5'
const MUTED = '#8a8a8a'
const BORDER = 'rgba(255,255,255,0.10)'
const SURFACE = 'rgba(255,255,255,0.04)'

// ── Brand icons ──────────────────────────────────────────────────
function BrandIcon({ platform, size = 18 }: { platform: string; size?: number }) {
  const p = platform.toLowerCase()
  const c = { width: size, height: size, viewBox: '0 0 24 24', fill: 'currentColor' as const }
  switch (p) {
    case 'instagram': return <svg {...c}><path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s0-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.15 0-3.5 0-4.74.07-.9.04-1.38.19-1.7.31-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.12.32-.27.8-.31 1.7C3.43 8.5 3.42 8.85 3.42 12s0 3.5.07 4.74c.04.9.19 1.38.31 1.7.17.43.37.74.69 1.06.32.32.63.52 1.06.69.32.12.8.27 1.7.31 1.24.07 1.59.07 4.74.07s3.5 0 4.74-.07c.9-.04 1.38-.19 1.7-.31.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.12-.32.27-.8.31-1.7.07-1.24.07-1.59.07-4.74s0-3.5-.07-4.74c-.04-.9-.19-1.38-.31-1.7a2.85 2.85 0 0 0-.69-1.06 2.85 2.85 0 0 0-1.06-.69c-.32-.12-.8-.27-1.7-.31C15.5 4 15.15 4 12 4Zm0 3.06A4.94 4.94 0 1 1 7.06 12 4.94 4.94 0 0 1 12 7.06Zm0 8.14A3.2 3.2 0 1 0 8.8 12 3.2 3.2 0 0 0 12 15.2Zm6.3-8.34a1.15 1.15 0 1 1-1.15-1.15 1.15 1.15 0 0 1 1.15 1.15Z"/></svg>
    case 'spotify': return <svg {...c}><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.6 14.43a.62.62 0 0 1-.86.21c-2.35-1.44-5.3-1.76-8.79-.97a.62.62 0 1 1-.28-1.22c3.8-.87 7.07-.5 9.71 1.12.3.18.39.57.22.86Zm1.23-2.73a.78.78 0 0 1-1.07.26c-2.69-1.65-6.79-2.13-9.97-1.17a.78.78 0 1 1-.45-1.49c3.63-1.1 8.15-.56 11.24 1.33.37.22.49.7.25 1.07Zm.11-2.85C14.83 8.04 9.4 7.86 6.3 8.8a.93.93 0 1 1-.54-1.79c3.56-1.08 9.56-.87 13.34 1.37a.93.93 0 1 1-.95 1.6Z"/></svg>
    case 'soundcloud': return <svg {...c}><path d="M1.5 14.6c-.1 0-.16-.07-.17-.17l-.2-1.45.2-1.48c.01-.1.08-.16.17-.16.1 0 .16.07.17.16l.24 1.48-.24 1.45c-.01.1-.08.17-.17.17Zm11.33-8.3c.43-.27.94-.43 1.49-.43 1.6 0 2.9 1.3 2.9 2.91 0 .1 0 .2-.02.3.3-.13.62-.2.96-.2 1.34 0 2.43 1.1 2.43 2.45S19.5 17.7 18.15 17.7h-6.82c-.13 0-.24-.11-.24-.24V6.94c0-.13.04-.2.21-.24.5-.18 1.04-.28 1.6-.28.65 0 1.27.14 1.83.38Z"/></svg>
    case 'youtube': return <svg {...c}><path d="M23.5 6.5a3 3 0 0 0-2.1-2.13C19.55 3.87 12 3.87 12 3.87s-7.55 0-9.4.5A3 3 0 0 0 .5 6.5 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.5 3 3 0 0 0 2.1 2.13c1.85.5 9.4.5 9.4.5s7.55 0 9.4-.5a3 3 0 0 0 2.1-2.13A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.5ZM9.6 15.57V8.43L15.82 12 9.6 15.57Z"/></svg>
    case 'beatport': return <svg {...c}><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1 5.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z"/></svg>
    case 'tiktok': return <svg {...c}><path d="M16.6 5.82a4.28 4.28 0 0 1-1-2.82h-3.1v12.3a2.34 2.34 0 1 1-2.34-2.34c.22 0 .43.03.63.09v-3.2a5.54 5.54 0 1 0 4.8 5.5V9.01a7.3 7.3 0 0 0 4.28 1.37V7.28a4.28 4.28 0 0 1-3.27-1.46Z"/></svg>
    default: return <svg {...c}><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 1.8a8.2 8.2 0 0 1 0 16.4 8.2 8.2 0 0 1 0-16.4Z"/></svg>
  }
}

// ── Helpers ───────────────────────────────────────────────────────
function cfg<T>(sections: Section[], name: string): T | null {
  const s = sections.find(x => x.name === name && x.is_enabled)
  return s ? (s.config as unknown as T) : null
}
function collectSocials(hero: HeroConfig | null, artist: Artist): HeroSocialLink[] {
  const fromHero = (hero?.socials ?? []).filter(s => s.enabled && s.url).sort((a, b) => a.sort_order - b.sort_order)
  if (fromHero.length) return fromHero
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
    const cc = accent.replace('#', '')
    return { kind: 'soundcloud', src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23${cc}&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false` }
  }
  if (/spotify\.com/.test(url)) return { kind: 'spotify', src: url.replace(/open\.spotify\.com\/(intl-[a-z]+\/)?/, 'open.spotify.com/embed/').split('?')[0] }
  if (/youtube\.com|youtu\.be/.test(url)) {
    const id = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1]
    return { kind: 'youtube', src: id ? `https://www.youtube.com/embed/${id}` : url }
  }
  return { kind: null, src: url }
}

// ── Título con letras espaciadas (B I O) — firma de dj-presskit ───
function SpacedTitle({ text, accent, font }: { text: string; accent: string; font: string }) {
  return (
    <h2 className="flex flex-wrap" aria-label={text}
      style={{ fontFamily: font, fontSize: 'clamp(54px,11vw,120px)', lineHeight: 0.9, fontWeight: 700, color: accent }}>
      {text.toUpperCase().split('').map((ch, i) => (
        <span key={i} style={{ marginRight: ch === ' ' ? '0.35em' : '0.12em' }}>{ch === ' ' ? ' ' : ch}</span>
      ))}
    </h2>
  )
}

// ── Ticker animado de géneros ────────────────────────────────────
function GenreTicker({ genres, accent, font }: { genres: string[]; accent: string; font: string }) {
  if (!genres.length) return null
  const loop = [...genres, ...genres, ...genres]
  return (
    <div className="relative w-full overflow-hidden py-4 select-none" style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
      <div className="flex w-max gap-8 pk-marquee" style={{ fontFamily: font, fontSize: 'clamp(20px,3.5vw,40px)', color: TXT, fontWeight: 700 }}>
        {loop.map((g, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap uppercase">
            {g}<span style={{ color: accent }}>•</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Marquee vertical del nombre (Bio) ────────────────────────────
function VerticalMarquee({ text, accent }: { text: string; accent: string }) {
  const items = Array.from({ length: 8 }, () => text)
  return (
    <div className="hidden lg:block absolute right-0 top-0 h-full overflow-hidden pointer-events-none" style={{ width: 60 }}>
      <div className="pk-marquee-v flex flex-col gap-6" style={{ writingMode: 'vertical-rl' }}>
        {[...items, ...items].map((t, i) => (
          <span key={i} className="uppercase tracking-[4px] text-[13px] font-mono whitespace-nowrap" style={{ color: i % 2 ? accent : MUTED, opacity: 0.5 }}>{t}</span>
        ))}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
export default function PressKitLayout({ artist, sections, palette, theme }: {
  artist: Artist; sections: Section[]; palette: ArtistPalette; theme: ThemeId
}) {
  const t = THEMES[theme]
  const accent  = palette.primary
  const accent2 = palette.secondary || accent
  const font = t.headingFont

  const hero    = cfg<HeroConfig>(sections, 'hero')
  const bio     = cfg<BioConfig>(sections, 'bio')
  const live    = cfg<LiveConfig>(sections, 'live')
  const music   = cfg<MusicConfig>(sections, 'music')
  const gallery = cfg<GalleryConfig>(sections, 'gallery')
  const rider   = cfg<RiderConfig>(sections, 'rider')
  const contact = cfg<ContactConfig>(sections, 'contact')

  const socials = collectSocials(hero, artist)
  const genres  = (bio?.genres?.length ? bio.genres : artist.sound_words ?? [])
  const heroImg = hero?.bg_image ?? artist.photo_url
  const subTagline = artist.tagline ?? hero?.sub_tagline ?? hero?.tagline ?? ''

  const nameWords = artist.artist_name.split(' ')

  const navLinks = [
    bio     && { href: '#bio',     label: 'Bio' },
    live    && { href: '#events',  label: 'Eventos' },
    music   && { href: '#music',   label: 'Música' },
    gallery && { href: '#gallery', label: 'Galería' },
    rider   && { href: '#rider',   label: 'Rider' },
    contact && { href: '#contact', label: 'Contacto' },
  ].filter(Boolean) as { href: string; label: string }[]

  return (
    <div style={{ background: BG, color: TXT, fontFamily: 'var(--font-display)', minHeight: '100vh' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        section[id] { scroll-margin-top: 70px; }
        @keyframes pk-scroll { from { transform: translateX(0) } to { transform: translateX(-33.333%) } }
        .pk-marquee { animation: pk-scroll 22s linear infinite; }
        @keyframes pk-scroll-v { from { transform: translateY(0) } to { transform: translateY(-50%) } }
        .pk-marquee-v { animation: pk-scroll-v 18s linear infinite; }
        .pk-input { transition: border-color .2s, box-shadow .2s; }
        .pk-input::placeholder { color: rgba(255,255,255,0.3); }
        .pk-input:focus { outline: none; border-color: ${accent} !important; box-shadow: 0 0 0 3px ${accent}22; }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <PkNav artistName={artist.artist_name} navLinks={navLinks} socials={socials} accent={accent} mono={t.mono} font={font} />

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-end overflow-hidden" style={{ background: BG }}>
        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt={artist.artist_name} className="w-full h-full object-cover" style={{ filter: t.mono ? 'grayscale(1) contrast(1.05)' : 'none', opacity: 0.85 }} />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${BG} 6%, ${BG}55 45%, ${BG}90 100%)` }} />
          </div>
        )}
        {!t.mono && (
          <>
            <div className="absolute rounded-full pointer-events-none" style={{ top: '12%', left: '6%', width: 560, height: 560, background: accent, opacity: 0.16, filter: 'blur(130px)' }} />
            <div className="absolute rounded-full pointer-events-none" style={{ bottom: '6%', right: '8%', width: 460, height: 460, background: accent2, opacity: 0.12, filter: 'blur(120px)' }} />
          </>
        )}

        <div className="relative z-10 max-w-6xl mx-auto w-full px-6 pb-16 md:pb-24">
          {t.heroVariant === 'stats' ? (
            // ── Variante Kaÿ: nombre apilado + stats ──
            <div className="grid md:grid-cols-[1.4fr_1fr] gap-10 items-end">
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                {subTagline && <p className="mb-4 text-[12px] font-mono uppercase tracking-[3px]" style={{ color: accent }}>{subTagline}</p>}
                <h1 className="uppercase" style={{ fontFamily: font, fontSize: 'clamp(64px,13vw,150px)', lineHeight: 0.86, fontWeight: 800, letterSpacing: '-0.02em' }}>
                  {nameWords.map((w, i) => <span key={i} className="block" style={{ color: i === 0 ? TXT : accent }}>{w}</span>)}
                </h1>
              </motion.div>
              {bio?.stats && bio.stats.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
                  className="flex flex-col gap-5 pb-4">
                  {bio.stats.slice(0, 3).map((s, i) => (
                    <div key={i} className="flex items-baseline gap-3" style={{ borderBottom: `1px solid ${BORDER}`, paddingBottom: 12 }}>
                      <span style={{ fontFamily: font, fontSize: 44, fontWeight: 800, color: accent, lineHeight: 1 }}>{s.value}</span>
                      <span className="text-[12px] font-mono uppercase tracking-[2px]" style={{ color: MUTED }}>{s.label}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          ) : (
            // ── Variante Pupi/Danny: nombre gigante centrado ──
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              {t.heroVariant === 'tagline' && subTagline && (
                <p className="mb-4 text-[13px] md:text-[15px] font-mono uppercase tracking-[3px]" style={{ color: accent }}>{subTagline}</p>
              )}
              <h1 className="uppercase" style={{ fontFamily: font, fontSize: 'clamp(72px,17vw,200px)', lineHeight: 0.82, fontWeight: 700, letterSpacing: '-0.02em', color: TXT }}>
                {artist.artist_name}
              </h1>
              {t.heroVariant === 'big' && bio?.text && (
                <div className="mt-5 max-w-xl text-[14px] md:text-[16px] leading-relaxed line-clamp-3" style={{ color: MUTED }}
                  dangerouslySetInnerHTML={{ __html: bio.text }} />
              )}
              <div className="flex items-center gap-4 mt-6">
                {socials.map(s => (
                  <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.platform}
                    className="transition-transform hover:scale-110" style={{ color: TXT }}>
                    <BrandIcon platform={s.platform} size={22} />
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Ticker de géneros al fondo del hero */}
        {(t.heroVariant !== 'stats') && genres.length > 0 && (
          <div className="relative z-10">
            <GenreTicker genres={genres} accent={accent} font={font} />
          </div>
        )}
      </section>

      {/* ── BIO ─────────────────────────────────────────────── */}
      {bio && (
        <section id="bio" className="relative py-24 md:py-32" style={{ background: BG }}>
          <div className="max-w-6xl mx-auto px-6 relative">
            <Reveal><SpacedTitle text="Bio" accent={accent} font={font} /></Reveal>
            <div className="grid md:grid-cols-[1fr_1.2fr] gap-10 md:gap-16 mt-10 items-start relative">
              {bio.photo_position !== 'none' && (bio.bg_image || artist.photo_url) && (
                <Reveal>
                  <div className="overflow-hidden rounded-2xl" style={{ aspectRatio: '3/4', background: SURFACE }}>
                    <img src={(bio.bg_image || artist.photo_url) as string} alt={artist.artist_name}
                      className="w-full h-full object-cover" style={{ filter: t.mono ? 'grayscale(1)' : 'none' }} />
                  </div>
                </Reveal>
              )}
              <Reveal delay={0.1}>
                <div className="text-[15px] md:text-[16px] leading-[1.8]" style={{ color: '#cfcfcf' }}
                  dangerouslySetInnerHTML={{ __html: bio.text ?? '' }} />
                {genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {genres.map((g, i) => (
                      <span key={i} className="text-[12px] font-mono uppercase tracking-[1px] px-3 py-1 rounded-full"
                        style={{ border: `1px solid ${BORDER}`, color: accent }}>{g}</span>
                    ))}
                  </div>
                )}
              </Reveal>
              <VerticalMarquee text={`DJ ${artist.artist_name}`} accent={accent} />
            </div>

            {/* Stats grid */}
            {(bio.city || (bio.stats && bio.stats.length > 0)) && (
              <Reveal>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 mt-16 pt-10" style={{ borderTop: `1px solid ${BORDER}` }}>
                  {bio.city && (
                    <div>
                      <div className="text-[11px] font-mono uppercase tracking-[2px] mb-1" style={{ color: MUTED }}>Ubicación</div>
                      <div style={{ fontFamily: font, fontSize: 22, color: TXT }}>{[bio.city, bio.country].filter(Boolean).join(', ')}</div>
                    </div>
                  )}
                  {(bio.stats ?? []).map((s, i) => (
                    <div key={i}>
                      <div style={{ fontFamily: font, fontSize: 42, fontWeight: 800, color: accent, lineHeight: 1 }}>{s.value}</div>
                      <div className="text-[11px] font-mono uppercase tracking-[2px] mt-1" style={{ color: MUTED }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* ── EVENTOS ─────────────────────────────────────────── */}
      {live && (
        <section id="events" className="py-24 md:py-32" style={{ background: BG2 }}>
          <div className="max-w-6xl mx-auto px-6">
            <Reveal><SpacedTitle text={live.section_title || 'Eventos'} accent={accent} font={font} /></Reveal>
            {live.venues.length > 0 ? (
              <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {live.venues.map(v => (
                  <Reveal key={v.id}>
                    <div className="rounded-2xl p-6 h-full flex flex-col transition-transform hover:-translate-y-1"
                      style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                      <div className="text-[12px] font-mono uppercase tracking-[2px] mb-3" style={{ color: accent }}>{fmtDate(v.date)}</div>
                      <div style={{ fontFamily: font, fontSize: 26, color: TXT, lineHeight: 1.05 }}>{v.name}</div>
                      <p className="text-[13px] mt-2 flex items-center gap-1.5" style={{ color: MUTED }}>📍 {[v.city, v.country].filter(Boolean).join(', ')}</p>
                      {v.instagram && (
                        <a href={v.instagram} target="_blank" rel="noopener noreferrer"
                          className="mt-4 inline-flex w-fit text-[12px] font-mono uppercase tracking-[2px] px-4 py-2 rounded-full transition-transform hover:scale-105"
                          style={{ border: `1px solid ${accent}`, color: accent }}>Ver más</a>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              <Reveal><p className="mt-8 text-[15px]" style={{ color: MUTED }}>Próximas fechas a confirmar. ¡Estate atento a las novedades!</p></Reveal>
            )}
          </div>
        </section>
      )}

      {/* ── MÚSICA ──────────────────────────────────────────── */}
      {music && music.tracks.length > 0 && (
        <section id="music" className="py-24 md:py-32" style={{ background: BG }}>
          <div className="max-w-6xl mx-auto px-6">
            <Reveal><SpacedTitle text={music.section_title || 'Música'} accent={accent} font={font} /></Reveal>
            <div className="mt-10 grid md:grid-cols-2 gap-6">
              {music.tracks.map(tr => {
                const e = embedUrl(tr.url, accent)
                if (!e.kind) return null
                return (
                  <Reveal key={tr.id}>
                    <div className="rounded-2xl overflow-hidden" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                      <iframe src={e.src} title={tr.title || e.kind} width="100%"
                        height={e.kind === 'soundcloud' ? 166 : e.kind === 'youtube' ? 240 : 352}
                        frameBorder="0" loading="lazy"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" />
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── GALERÍA ─────────────────────────────────────────── */}
      {gallery && gallery.images.length > 0 && (
        <section id="gallery" className="py-24 md:py-32" style={{ background: BG2 }}>
          <div className="max-w-6xl mx-auto px-6">
            <Reveal><SpacedTitle text={gallery.section_title || 'Galería'} accent={accent} font={font} /></Reveal>
            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {gallery.images.map((img, i) => (
                <Reveal key={img.id}>
                  <div className={`overflow-hidden rounded-xl ${i % 5 === 0 ? 'md:row-span-2 md:aspect-[3/4]' : 'aspect-square'}`} style={{ background: SURFACE }}>
                    <img src={img.url} alt={img.caption} loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      style={{ filter: t.mono ? 'grayscale(1)' : 'none' }} />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── RIDER ───────────────────────────────────────────── */}
      {rider && (
        <section id="rider" className="py-24 md:py-32" style={{ background: BG }}>
          <div className="max-w-6xl mx-auto px-6">
            <Reveal><SpacedTitle text={rider.section_title || 'Rider'} accent={accent} font={font} /></Reveal>
            {rider.intro && (
              <Reveal><p className="mt-6 max-w-2xl text-[15px] md:text-[16px] leading-relaxed" style={{ color: MUTED }}>{renderBold(rider.intro, accent)}</p></Reveal>
            )}
            {rider.items.length > 0 && (
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {rider.items.map(it => (
                  <Reveal key={it.id}>
                    <div className="rounded-2xl p-6 h-full flex flex-col transition-transform hover:-translate-y-1" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                      {it.image && (
                        <div className="mb-5 rounded-xl overflow-hidden aspect-[4/3]" style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <img src={it.image} alt={it.name} className="w-full h-full object-contain" />
                        </div>
                      )}
                      {it.role && <span className="text-[11px] font-mono uppercase tracking-[2px] mb-1" style={{ color: accent }}>{it.role}</span>}
                      <span style={{ fontFamily: font, fontSize: 22, color: TXT, lineHeight: 1.1 }}>{it.name}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
            {rider.notes.length > 0 && (
              <div className="mt-5 grid md:grid-cols-2 gap-4 md:gap-5">
                {rider.notes.map(n => (
                  <Reveal key={n.id}>
                    <div className="rounded-2xl p-6 h-full" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                      <h3 className="text-[12px] font-mono uppercase tracking-[2px] mb-2" style={{ color: accent }}>{n.title}</h3>
                      <p className="text-[14px] leading-relaxed whitespace-pre-line" style={{ color: MUTED }}>{n.body}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── CONTACTO ────────────────────────────────────────── */}
      {contact && (
        <section id="contact" className="py-24 md:py-32" style={{ background: BG2 }}>
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
            <Reveal>
              <SpacedTitle text={contact.section_title || 'Contacto'} accent={accent} font={font} />
              {artist.booking_email && (
                <a href={`mailto:${artist.booking_email}`} className="mt-8 inline-flex items-center gap-3 group">
                  <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>✉</span>
                  <span>
                    <span className="block text-[12px] font-mono" style={{ color: MUTED }}>Booking</span>
                    <span className="block text-[15px]" style={{ color: TXT }}>{artist.booking_email}</span>
                  </span>
                </a>
              )}
              {socials.length > 0 && (
                <div className="mt-8 flex items-center gap-4">
                  {socials.map(s => (
                    <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.platform}
                      className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: TXT }}>
                      <BrandIcon platform={s.platform} size={18} />
                    </a>
                  ))}
                </div>
              )}
            </Reveal>
            <Reveal delay={0.1}><PkContactForm accent={accent} bookingEmail={artist.booking_email} /></Reveal>
          </div>
        </section>
      )}

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer style={{ background: BG, borderTop: `1px solid ${BORDER}` }}>
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <span style={{ fontFamily: font, fontSize: 26, color: TXT }}>{artist.artist_name}</span>
          <div className="flex items-center gap-4">
            {socials.map(s => (
              <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.platform} style={{ color: MUTED }}>
                <BrandIcon platform={s.platform} size={18} />
              </a>
            ))}
          </div>
          <p className="text-[12px] font-mono text-center" style={{ color: MUTED }}>
            © {new Date().getFullYear()} {artist.artist_name}. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}

// ── Nav ───────────────────────────────────────────────────────────
function PkNav({ artistName, navLinks, socials, accent, mono, font }: {
  artistName: string; navLinks: { href: string; label: string }[]; socials: HeroSocialLink[]; accent: string; mono: boolean; font: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <header className="fixed top-0 inset-x-0 z-[80] backdrop-blur-md" style={{ background: 'rgba(16,16,16,0.7)', borderBottom: `1px solid ${BORDER}` }}>
      <nav className="max-w-6xl mx-auto px-6 h-[60px] flex items-center justify-between">
        <a href="#" style={{ fontFamily: font, fontSize: 22, color: TXT }}>{artistName}</a>
        <ul className="hidden md:flex items-center gap-7">
          {navLinks.map(l => (
            <li key={l.href}><a href={l.href} className="text-[12px] font-mono uppercase tracking-[1.5px] transition-colors hover:text-white" style={{ color: MUTED }}>{l.label}</a></li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3">
            {socials.slice(0, 4).map(s => (
              <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.platform} style={{ color: mono ? TXT : accent }}>
                <BrandIcon platform={s.platform} size={16} />
              </a>
            ))}
          </div>
          {navLinks.length > 0 && (
            <button onClick={() => setOpen(o => !o)} aria-label="Menú" aria-expanded={open}
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px]">
              <span className="block w-5 h-[2px]" style={{ background: TXT, transform: open ? 'translateY(7px) rotate(45deg)' : 'none', transition: 'transform .2s' }} />
              <span className="block w-5 h-[2px]" style={{ background: TXT, opacity: open ? 0 : 1, transition: 'opacity .2s' }} />
              <span className="block w-5 h-[2px]" style={{ background: TXT, transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none', transition: 'transform .2s' }} />
            </button>
          )}
        </div>
      </nav>
      {open && (
        <div className="md:hidden" style={{ background: 'rgba(16,16,16,0.97)', borderBottom: `1px solid ${BORDER}` }}>
          <ul className="px-6 py-4 flex flex-col gap-1">
            {navLinks.map(l => (
              <li key={l.href}><a href={l.href} onClick={() => setOpen(false)} className="block py-2.5 text-[15px]" style={{ color: TXT }}>{l.label}</a></li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}

// ── Contact form ──────────────────────────────────────────────────
function PkContactForm({ accent, bookingEmail }: { accent: string; bookingEmail: string | null }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const inputStyle: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 14, padding: '12px 16px', color: '#fff', width: '100%' }
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Booking — ${name}`)
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`)
    window.location.href = `mailto:${bookingEmail ?? ''}?subject=${subject}&body=${body}`
  }
  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input className="pk-input" style={inputStyle} placeholder="Tu nombre" value={name} onChange={e => setName(e.target.value)} required />
        <input className="pk-input" style={inputStyle} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <textarea className="pk-input" style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }} placeholder="Tu mensaje..." value={message} onChange={e => setMessage(e.target.value)} required />
      <button type="submit" className="py-3.5 px-7 rounded-full font-semibold self-start transition-transform hover:scale-105" style={{ background: accent, color: '#fff' }}>Enviar mensaje</button>
    </form>
  )
}

// ── utils ─────────────────────────────────────────────────────────
function fmtDate(d: string): string {
  try {
    const dt = new Date(d)
    if (isNaN(dt.getTime())) return d
    return dt.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '')
  } catch { return d }
}
function renderBold(text: string, accent: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i} style={{ color: accent, fontWeight: 700 }}>{p.slice(2, -2)}</strong>
      : <span key={i}>{p}</span>)
}
