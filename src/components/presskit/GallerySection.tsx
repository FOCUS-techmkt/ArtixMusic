'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { X, ZoomIn } from 'lucide-react'
import type { MediaItem } from '@/types'

interface LightboxProps {
  item: MediaItem
  onClose: () => void
}

function Lightbox({ item, onClose }: LightboxProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-4xl w-full rounded-3xl overflow-hidden"
        >
          <div className="relative aspect-[4/3]">
            <Image
              src={item.url}
              alt={item.caption ?? ''}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 900px"
            />
          </div>
          {item.caption && (
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white text-sm font-medium">{item.caption}</p>
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

interface GalleryItemProps {
  item: MediaItem
  index: number
  onClick: () => void
}

function GalleryItem({ item, index, onClick }: GalleryItemProps) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: (index % 4) * 0.1, duration: 0.6, ease: 'easeOut' }}
      onClick={onClick}
      className="masonry-item relative group cursor-pointer rounded-2xl overflow-hidden"
    >
      {/* Skeleton while loading */}
      {!imgLoaded && (
        <div
          className="skeleton w-full rounded-2xl"
          style={{ height: index % 3 === 0 ? '280px' : index % 3 === 1 ? '200px' : '240px' }}
        />
      )}

      <div className={`relative transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}>
        <Image
          src={item.url}
          alt={item.caption ?? ''}
          width={400}
          height={300}
          className="w-full h-auto object-cover transition-all duration-500 group-hover:scale-[1.03] filter group-hover:brightness-110"
          style={{ filter: imgLoaded ? 'blur(0)' : 'blur(20px)' }}
          onLoad={() => setImgLoaded(true)}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
          <ZoomIn className="w-8 h-8 text-white drop-shadow-lg" />
        </div>
        {item.caption && (
          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white text-xs">{item.caption}</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

interface Props {
  media: MediaItem[]
}

export default function GallerySection({ media }: Props) {
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="py-24 px-6" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="max-w-6xl mx-auto">
        <div ref={ref}>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            className="text-xs font-mono tracking-widest uppercase mb-4"
            style={{ color: 'var(--color-accent)' }}
          >
            // MEDIA
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
            className="font-display font-bold text-4xl md:text-5xl mb-12"
            style={{ color: 'var(--color-text)' }}
          >
            Galería
          </motion.h2>
        </div>

        <div className="masonry-grid">
          {media.map((item, i) => (
            <GalleryItem
              key={item.id}
              item={item}
              index={i}
              onClick={() => setLightboxItem(item)}
            />
          ))}
        </div>
      </div>

      {lightboxItem && (
        <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
      )}
    </section>
  )
}
