'use client'
import { useState, useEffect } from 'react'
import { useScroll } from 'framer-motion'
import { motion } from 'framer-motion'
import type { Artist, Section, ArtistPalette } from '@/types'
import { deriveArtistPalette } from '@/types'
import type { HeroConfig, BioConfig, MusicConfig, CommunityConfig, SupportersConfig, ReleasesConfig, LiveConfig, ContactConfig, FanCaptureConfig, GalleryConfig, LinksConfig, TestimonialsConfig } from '@/types/sections'
import { FONTS_CATALOG } from '@/lib/fonts'
import HeroSection        from './sections/HeroSection'
import BioSection         from './sections/BioSection'
import MusicSection       from './sections/MusicSection'
import CommunitySection   from './sections/CommunitySection'
import SupportersSection  from './sections/SupportersSection'
import ReleasesSection    from './sections/ReleasesSection'
import LiveSection        from './sections/LiveSection'
import GallerySection     from './sections/GallerySection'
import ContactSection     from './sections/ContactSection'
import FanCaptureSection  from './sections/FanCaptureSection'
import LinksSection       from './sections/LinksSection'
import TestimonialsSection from './sections/TestimonialsSection'
import RiderSection        from './sections/RiderSection'
import MinimalPulse        from './sections/MinimalPulse'
import PressKitLayout       from './sections/PressKitLayout'
import type { RiderConfig } from '@/types/sections'

// Legacy — kept for presskit fallback (page.tsx still exports this type)
export interface ArtistProfile {
  artistName: string; slug: string; tagline?: string; genres?: string[]
  bio?: string; location?: string; photo?: string; monthlyListeners?: string
  totalShows?: string; countries?: string
  tracks?: { title: string; label?: string; year?: string; bpm?: number; key?: string }[]
  spotifyPlaylistUrl?: string; raUrl?: string; beatportUrl?: string; instagramUrl?: string
  galleryPhotos?: string[]; bookingEmail?: string; bookingUrl?: string
  availableDates?: string; supporters?: { name: string }[]
  primaryColor: string; secondaryColor: string; views?: number
}

interface Props {
  artist:   Artist
  sections: Section[]
}

// ── Section animation variants ────────────────────────────────────
const ANIM_VARIANTS: Record<string, { initial: Record<string, unknown>; animate: Record<string, unknown> }> = {
  fade:       { initial: { opacity: 0 },                          animate: { opacity: 1 } },
  'slide-up': { initial: { opacity: 0, y: 48 },                  animate: { opacity: 1, y: 0 } },
  'slide-left':{ initial: { opacity: 0, x: -40 },                animate: { opacity: 1, x: 0 } },
  scale:      { initial: { opacity: 0, scale: 0.94 },             animate: { opacity: 1, scale: 1 } },
  blur:       { initial: { opacity: 0, filter: 'blur(14px)' },   animate: { opacity: 1, filter: 'blur(0px)' } },
}

function AnimatedSection({ section, children }: { section: Section; children: React.ReactNode }) {
  const anim = (section.config?.animation as string | undefined) ?? 'none'
  const v = ANIM_VARIANTS[anim]
  if (!v) return <>{children}</>
  return (
    <motion.div
      initial={v.initial as Parameters<typeof motion.div>[0]['initial']}
      whileInView={v.animate as Parameters<typeof motion.div>[0]['whileInView']}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

// ── Visual effects overlays ───────────────────────────────────────
function buildEffectStyles(
  intensities: Record<string, number>,
  primary: string,
  secondary: string,
): string {
  const parts: string[] = []

  const glitch = intensities['glitch'] ?? 0
  if (glitch > 0) {
    const dur = glitch === 1 ? '7s' : glitch === 2 ? '4s' : '2s'
    parts.push(`
      @keyframes artix-glitch {
        0%,88%,100% { clip-path: none; transform: none; }
        89% { clip-path: polygon(0 12%,100% 12%,100% 28%,0 28%); transform: translate(-4px,1px); }
        91% { clip-path: polygon(0 58%,100% 58%,100% 74%,0 74%); transform: translate(4px,-1px); }
        93% { clip-path: none; transform: none; }
      }
      .artix-glitch-active { animation: artix-glitch ${dur} step-end infinite; }
    `)
  }

  const chromatic = intensities['chromatic'] ?? 0
  if (chromatic > 0) {
    const d = chromatic === 1 ? '1px' : chromatic === 2 ? '2px' : '3.5px'
    parts.push(`
      .artix-chromatic h1,
      .artix-chromatic h2 {
        text-shadow: -${d} 0 2px rgba(255,30,30,0.45), ${d} 0 2px rgba(0,200,255,0.45);
      }
    `)
  }

  const glow = intensities['glow'] ?? 0
  if (glow > 0) {
    const size = glow === 1 ? '320px' : glow === 2 ? '520px' : '800px'
    const opacity = glow === 1 ? '0.18' : glow === 2 ? '0.28' : '0.4'
    parts.push(`
      .artix-glow::before {
        content: '';
        position: fixed;
        top: -${parseInt(size) / 2}px;
        left: 50%;
        transform: translateX(-50%);
        width: ${size};
        height: ${size};
        border-radius: 50%;
        background: radial-gradient(circle, ${primary}${Math.round(parseFloat(opacity) * 255).toString(16).padStart(2,'0')}, transparent 70%);
        pointer-events: none;
        z-index: 0;
      }
    `)
  }

  return parts.join('\n')
}

function GrainOverlay({ intensity }: { intensity: number }) {
  const opacity = intensity === 1 ? 0.025 : intensity === 2 ? 0.055 : 0.1
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 9997,
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
      }}
    />
  )
}

function ScanlinesOverlay({ intensity }: { intensity: number }) {
  const opacity = intensity === 1 ? 0.03 : intensity === 2 ? 0.065 : 0.13
  const lineH = intensity === 3 ? '3px' : '2px'
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 9996,
        opacity,
        backgroundImage: `repeating-linear-gradient(to bottom, transparent 0px, transparent calc(${lineH} - 1px), rgba(0,0,0,0.9) ${lineH})`,
        backgroundSize: `100% ${lineH}`,
      }}
    />
  )
}

function AuroraOverlay({ intensity, primary, secondary }: { intensity: number; primary: string; secondary: string }) {
  const opacity = intensity === 1 ? 0.07 : intensity === 2 ? 0.14 : 0.24
  return (
    <>
      <style>{`
        @keyframes artix-aurora {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .artix-aurora-el {
          animation: artix-aurora 10s ease-in-out infinite;
        }
      `}</style>
      <div
        className="artix-aurora-el fixed top-0 left-0 right-0 pointer-events-none"
        style={{
          height: '55vh',
          zIndex: 0,
          opacity,
          background: `linear-gradient(135deg, ${primary}, ${secondary}, ${primary}80, transparent)`,
          backgroundSize: '400% 400%',
          filter: 'blur(70px)',
        }}
      />
    </>
  )
}

function ScrollProgressBar({ palette }: { palette: ArtistPalette }) {
  const { scrollYProgress } = useScroll()
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[100] h-[2px] origin-left"
      style={{ scaleX: scrollYProgress, background: palette.primary }}
    />
  )
}

export default function SlugClient({ artist, sections }: Props) {
  const [heroOverride, setHeroOverride] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'ARTIX_PREVIEW_UPDATE' && e.data?.section === 'hero') {
        setHeroOverride(prev => ({ ...prev, ...e.data.config }))
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  const palette = deriveArtistPalette(
    artist.primary_color   ?? '#C026D3',
    artist.secondary_color ?? '#7C3AED',
    artist.bg_dark         ?? true,
  )

  const fontEntry = FONTS_CATALOG.find(f => f.id === (artist.font_id ?? 'space-grotesk'))
  const fontStyle = fontEntry && fontEntry.cssVar !== '--font-display'
    ? { '--font-display': `var(${fontEntry.cssVar})` } as React.CSSProperties
    : {}

  // ── Dedicated full-page layout: Minimal Pulse (DJ landing) ───────
  // Routed via hero config (pageLayout) — avoids the DB enum constraint
  // on artists.layout_variant.
  const pageLayout = sections.find(s => s.name === 'hero')?.config?.pageLayout as string | undefined
  if (pageLayout === 'minimal-pulse') {
    return (
      <>
        {!artist.is_published && (
          <div className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center gap-3 py-2.5 px-4 text-[12px] font-mono"
            style={{ background: '#F59E0B', color: '#000' }}>
            <span>⚠</span>
            <span>Vista previa — tu presskit no está publicado todavía.</span>
            <a href="/panel" className="underline font-semibold">Ir al editor</a>
          </div>
        )}
        <MinimalPulse artist={artist} sections={sections} palette={palette} />
      </>
    )
  }
  // Réplicas dj-presskit.com — un solo layout, tres temas (theme via pageLayout)
  if (pageLayout === 'presskit-pupi' || pageLayout === 'presskit-kay' || pageLayout === 'presskit-danny') {
    const theme = pageLayout.replace('presskit-', '') as 'pupi' | 'kay' | 'danny'
    return (
      <>
        {!artist.is_published && (
          <div className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center gap-3 py-2.5 px-4 text-[12px] font-mono"
            style={{ background: '#F59E0B', color: '#000' }}>
            <span>⚠</span>
            <span>Vista previa — tu presskit no está publicado todavía.</span>
            <a href="/panel" className="underline font-semibold">Ir al editor</a>
          </div>
        )}
        <PressKitLayout artist={artist} sections={sections} palette={palette} theme={theme} />
      </>
    )
  }

  const heroSection = sections.find(s => s.name === 'hero')
  const effectIntensities = (heroSection?.config?.effectIntensities as Record<string, number>) ?? {}

  const grainLevel     = effectIntensities['grain']     ?? 0
  const scanlinesLevel = effectIntensities['scanlines'] ?? 0
  const auroraLevel    = effectIntensities['aurora']    ?? 0
  const glitchLevel    = effectIntensities['glitch']    ?? 0
  const chromaticLevel = effectIntensities['chromatic'] ?? 0
  const glowLevel      = effectIntensities['glow']      ?? 0

  const injectedCSS = buildEffectStyles(effectIntensities, palette.primary, palette.secondary)

  const sorted = [...sections]
    .filter(s => s.is_enabled)
    .sort((a, b) => a.sort_order - b.sort_order)

  const mainClass = [
    glitchLevel  > 0 ? 'artix-glitch-active' : '',
    chromaticLevel > 0 ? 'artix-chromatic' : '',
    glowLevel    > 0 ? 'artix-glow' : '',
  ].filter(Boolean).join(' ') || undefined

  return (
    <>
      <ScrollProgressBar palette={palette} />

      {/* Injected effect CSS (glitch, chromatic, glow) */}
      {injectedCSS && <style dangerouslySetInnerHTML={{ __html: injectedCSS }} />}

      {/* Fixed effect overlays */}
      {grainLevel     > 0 && <GrainOverlay intensity={grainLevel} />}
      {scanlinesLevel > 0 && <ScanlinesOverlay intensity={scanlinesLevel} />}
      {auroraLevel    > 0 && <AuroraOverlay intensity={auroraLevel} primary={palette.primary} secondary={palette.secondary} />}

      {/* Draft banner — only visible when presskit is not published yet */}
      {!artist.is_published && (
        <div className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center gap-3 py-2.5 px-4 text-[12px] font-mono"
          style={{ background: '#F59E0B', color: '#000' }}>
          <span>⚠</span>
          <span>Vista previa — tu presskit no está publicado todavía.</span>
          <a href="/panel" className="underline font-semibold">Ir al editor</a>
        </div>
      )}

      {/* Anchored sections should not hide under the fixed nav */}
      <style dangerouslySetInnerHTML={{ __html: 'section[id]{scroll-margin-top:68px}html{scroll-behavior:smooth}' }} />
      <GenericNav artist={artist} sections={sorted} palette={palette} draftOffset={!artist.is_published} />

      <main
        className={mainClass}
        style={{ background: palette.bg, color: palette.text, fontFamily: 'var(--font-inter)', position: 'relative', paddingTop: !artist.is_published ? '40px' : undefined, ...fontStyle }}>

        {sorted.map(section => (
          <AnimatedSection key={section.id} section={section}>
            <SectionRenderer
              section={section}
              artist={artist}
              palette={palette}
              heroOverride={section.name === 'hero' ? heroOverride : null}
            />
          </AnimatedSection>
        ))}

        <footer className="py-6 text-center border-t" style={{ borderColor: palette.border }}>
          <p className="text-[11px] font-mono" style={{ color: palette.textMuted }}>
            Creado con{' '}
            <a href="https://artistpulse.io" className="hover:underline" style={{ color: palette.primary }}>Artist Pulse</a>
          </p>
        </footer>
      </main>
    </>
  )
}

// ── Generic public nav (todas las plantillas excepto minimal-pulse) ──
const NAV_LABELS: Record<string, string> = {
  bio: 'Bio', music: 'Música', releases: 'Releases', live: 'Shows',
  gallery: 'Galería', community: 'Comunidad', supporters: 'Apoyo',
  contact: 'Contacto', 'fan-capture': 'Newsletter', links: 'Links',
  testimonials: 'Reseñas', rider: 'Rider',
}

function GenericNav({ artist, sections, palette, draftOffset }: {
  artist: Artist; sections: Section[]; palette: ArtistPalette; draftOffset?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = sections
    .filter(s => s.name !== 'hero' && NAV_LABELS[s.name])
    .map(s => ({ href: `#${s.name}`, label: NAV_LABELS[s.name] }))
  const hasContact = sections.some(s => s.name === 'contact')

  const hexToRgba = (hex: string, a: number) => {
    const m = hex.replace('#', '')
    const n = m.length === 3 ? m.split('').map(c => c + c).join('') : m
    const r = parseInt(n.slice(0, 2), 16), g = parseInt(n.slice(2, 4), 16), b = parseInt(n.slice(4, 6), 16)
    return `rgba(${r},${g},${b},${a})`
  }

  return (
    <header className="fixed left-0 right-0 z-[80] transition-all duration-300"
      style={{
        top: draftOffset ? 40 : 0,
        fontFamily: 'var(--font-display)',
        background: scrolled ? hexToRgba(palette.bg, 0.82) : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : undefined,
        borderBottom: `1px solid ${scrolled ? palette.border : 'transparent'}`,
      }}>
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#hero" className="text-[19px] font-bold tracking-wide" style={{ color: palette.text }}>
          {artist.artist_name}
        </a>
        <ul className="hidden md:flex items-center gap-7">
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} className="text-[13px] transition-opacity hover:opacity-100" style={{ color: palette.textMuted }}>{l.label}</a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          {hasContact && (
            <a href="#contact" className="hidden sm:inline-block text-[13px] px-4 py-2 rounded-full font-semibold transition-transform hover:scale-105"
               style={{ background: palette.primary, color: '#fff' }}>Contacto</a>
          )}
          {links.length > 0 && (
            <button onClick={() => setOpen(o => !o)} aria-label="Menú" aria-expanded={open}
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px]">
              <span className="block w-5 h-[2px] transition-transform" style={{ background: palette.text, transform: open ? 'translateY(7px) rotate(45deg)' : 'none' }} />
              <span className="block w-5 h-[2px] transition-opacity" style={{ background: palette.text, opacity: open ? 0 : 1 }} />
              <span className="block w-5 h-[2px] transition-transform" style={{ background: palette.text, transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
            </button>
          )}
        </div>
      </nav>

      {open && (
        <div className="md:hidden" style={{ background: hexToRgba(palette.bg, 0.97), borderBottom: `1px solid ${palette.border}` }}>
          <ul className="px-6 py-4 flex flex-col gap-1">
            {links.map(l => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block py-2.5 text-[15px]" style={{ color: palette.text }}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}

function SectionRenderer({ section, artist, palette, heroOverride }: {
  section: Section; artist: Artist; palette: ArtistPalette
  heroOverride?: Record<string, unknown> | null
}) {
  const c = (section.config ?? {}) as Record<string, unknown>
  switch (section.name) {
    case 'hero': {
      const heroConfig = heroOverride ? { ...c, ...heroOverride } : c
      return <HeroSection config={heroConfig as unknown as HeroConfig} artist={artist} palette={palette} />
    }
    case 'bio':          return <BioSection         config={c as unknown as BioConfig}          artist={artist} palette={palette} />
    case 'music':        return <MusicSection       config={c as unknown as MusicConfig}        palette={palette} />
    case 'community':    return <CommunitySection   config={c as unknown as CommunityConfig}    palette={palette} />
    case 'supporters':   return <SupportersSection  config={c as unknown as SupportersConfig}   palette={palette} />
    case 'releases':     return <ReleasesSection    config={c as unknown as ReleasesConfig}     palette={palette} />
    case 'live':         return <LiveSection        config={c as unknown as LiveConfig}         palette={palette} />
    case 'gallery':      return <GallerySection     config={c as unknown as GalleryConfig}      palette={palette} />
    case 'contact':      return <ContactSection     config={c as unknown as ContactConfig}      artist={artist} palette={palette} />
    case 'fan-capture':  return <FanCaptureSection  config={c as unknown as FanCaptureConfig}   artist={artist} palette={palette} />
    case 'links':        return <LinksSection       config={c as unknown as LinksConfig}        palette={palette} />
    case 'testimonials': return <TestimonialsSection config={c as unknown as TestimonialsConfig} palette={palette} />
    case 'rider':        return <RiderSection       config={c as unknown as RiderConfig}        palette={palette} />
    default:             return null
  }
}
