'use client'
import type { ArtistPalette } from '@/types'
import type { CommunityConfig } from '@/types/sections'
import { Reveal, SectionWrapper, CountUp, StaggerParent, StaggerChild } from './_shared'

interface Props { config: CommunityConfig; palette: ArtistPalette }

const PLATFORM_ICONS: Record<string, string> = {
  instagram: '📸', soundcloud: '🎧', spotify: '🎵', youtube: '▶️',
  tiktok: '🎬', twitter: '🐦', facebook: '👥', twitch: '🟣',
}

export default function CommunitySection({ config, palette }: Props) {
  return (
    <SectionWrapper id="community" bgImage={config.bg_image} overlay={config.overlay_opacity} palette={palette} className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">

        <Reveal className="mb-4">
          <h2 className="font-display font-black text-4xl md:text-5xl" style={{ color: palette.text }}>
            {config.section_title ?? 'Comunidad'}
          </h2>
        </Reveal>

        {config.total_reach && (
          <Reveal delay={0.1} className="mb-12">
            <p className="text-6xl md:text-7xl font-display font-black" style={{ color: palette.primary }}>
              {config.count_up_animation ? <CountUp target={config.total_reach} /> : config.total_reach}
              <span className="ml-3 text-2xl font-mono font-normal" style={{ color: palette.textMuted }}>alcance total</span>
            </p>
          </Reveal>
        )}

        <StaggerParent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {config.platforms?.map(p => (
            <StaggerChild key={p.id}>
              <a href={p.url || '#'} target="_blank" rel="noopener noreferrer"
                className="group flex flex-col gap-3 p-6 rounded-2xl transition-all hover:-translate-y-1"
                style={{
                  background: palette.surface,
                  border: `1px solid ${palette.border}`,
                  boxShadow: `0 0 0 0 ${palette.primary}00`,
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 30px ${palette.primary}20`)}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 0 0 0 ${palette.primary}00`)}>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{PLATFORM_ICONS[p.icon] ?? '🔗'}</span>
                  <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: palette.textMuted }}>{p.name}</span>
                </div>
                <p className="text-3xl font-display font-black" style={{ color: palette.primary }}>
                  {config.count_up_animation ? <CountUp target={p.count} /> : p.count}
                </p>
                <p className="text-sm font-mono" style={{ color: palette.textMuted }}>{p.handle}</p>
              </a>
            </StaggerChild>
          ))}
        </StaggerParent>
      </div>
    </SectionWrapper>
  )
}
