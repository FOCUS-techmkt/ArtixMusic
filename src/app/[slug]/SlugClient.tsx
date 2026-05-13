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
    default:             return null
  }
}
