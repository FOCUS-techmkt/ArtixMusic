'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import type { ArtistPalette } from '@/types'
import type { GalleryConfig } from '@/types/sections'
import { SectionWrapper, Reveal, StaggerParent, StaggerChild } from './_shared'

interface Props { config: GalleryConfig; palette: ArtistPalette }

export default function GallerySection({ config, palette }: Props) {
  const [lightbox, setLightbox] = useState<string | null>(null)

  const images = (config.images ?? []).filter(img => img.url)
  if (images.length === 0) return null

  const cols = config.columns ?? 3
  const gridClass = cols === 2 ? 'grid-cols-2' : cols === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'

  return (
    <SectionWrapper
      id="gallery"
      bgImage={config.bg_image}
      overlay={config.overlay_opacity}
      palette={palette}
      className="py-24 md:py-32"
    >
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <h2
            className="font-display font-black text-3xl md:text-5xl tracking-tight mb-12"
            style={{ color: palette.text }}
          >
            {config.section_title ?? 'Galería'}
          </h2>
        </Reveal>

        <StaggerParent className={`grid ${gridClass} gap-3 md:gap-4`}>
          {images.map((img) => (
            <StaggerChild key={img.id}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.25 }}
                className="relative overflow-hidden rounded-2xl cursor-pointer group"
                style={{ border: `1px solid ${palette.border}` }}
                onClick={() => setLightbox(img.url)}
              >
                <div className="aspect-square">
                  <img
                    src={img.url}
                    alt={img.caption || ''}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                {img.caption && (
                  <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                    <p className="text-xs text-white font-mono truncate">{img.caption}</p>
                  </div>
                )}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: `${palette.primary}10` }} />
              </motion.div>
            </StaggerChild>
          ))}
        </StaggerParent>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            style={{ background: 'rgba(0,0,0,0.92)' }}
            onClick={() => setLightbox(null)}
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              src={lightbox}
              alt=""
              className="max-w-full max-h-full rounded-2xl object-contain"
              style={{ maxHeight: '90vh', boxShadow: `0 0 80px ${palette.primary}30` }}
              onClick={e => e.stopPropagation()}
            />
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-white/60 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  )
}
