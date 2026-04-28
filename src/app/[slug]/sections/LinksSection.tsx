'use client'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import type { ArtistPalette } from '@/types'
import type { LinksConfig } from '@/types/sections'
import { SectionWrapper, Reveal, StaggerParent, StaggerChild } from './_shared'

interface Props { config: LinksConfig; palette: ArtistPalette }

export default function LinksSection({ config, palette }: Props) {
  const links = (config.links ?? []).filter(l => l.enabled && l.url)
  if (links.length === 0) return null

  return (
    <SectionWrapper id="links" bgImage={config.bg_image} overlay={config.overlay_opacity} palette={palette} className="py-24 md:py-32">
      <div className="max-w-xl mx-auto px-6">
        <Reveal>
          <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight mb-12 text-center"
            style={{ color: palette.text }}>
            {config.section_title ?? 'Links'}
          </h2>
        </Reveal>

        <StaggerParent className="flex flex-col gap-3">
          {links.map(link => (
            <StaggerChild key={link.id}>
              <motion.a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-between gap-4 px-6 py-4 rounded-2xl text-base font-semibold transition-all"
                style={{
                  background: palette.surface,
                  border: `1px solid ${palette.border}`,
                  color: palette.text,
                  boxShadow: `0 2px 20px ${palette.primary}08`,
                }}>
                <div className="flex items-center gap-3 min-w-0">
                  {link.icon && (
                    <span className="text-xl shrink-0">{link.icon}</span>
                  )}
                  <span className="truncate">{link.label}</span>
                </div>
                <ExternalLink className="w-4 h-4 shrink-0" style={{ color: palette.primary }} />
              </motion.a>
            </StaggerChild>
          ))}
        </StaggerParent>
      </div>
    </SectionWrapper>
  )
}
