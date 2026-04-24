'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Instagram, Youtube, Headphones, Music2, ExternalLink } from 'lucide-react'
import type { Artist } from '@/types'

const SOCIAL_ICONS: Record<string, { icon: typeof Instagram; label: string }> = {
  instagram: { icon: Instagram, label: 'Instagram' },
  youtube: { icon: Youtube, label: 'YouTube' },
  soundcloud: { icon: Headphones, label: 'SoundCloud' },
  spotify: { icon: Music2, label: 'Spotify' },
}

interface Props {
  artist: Artist
}

export default function ContactSection({ artist }: Props) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!artist.booking_email) return
    await navigator.clipboard.writeText(artist.booking_email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const socialLinks = Object.entries(artist.links).filter(([, v]) => v)

  return (
    <section
      className="py-24 px-6 text-center"
      style={{ backgroundColor: 'var(--color-bg)' }}
      ref={ref}
    >
      <div className="max-w-2xl mx-auto">
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          className="text-xs font-mono tracking-widest uppercase mb-4"
          style={{ color: 'var(--color-accent)' }}
        >
          // BOOKING & CONTACT
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
          className="font-display font-extrabold text-4xl md:text-6xl mb-4 leading-tight"
          style={{ color: 'var(--color-text)' }}
        >
          Reserva a{' '}
          <span style={{ color: 'var(--color-accent)' }}>{artist.artist_name}</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg mb-10"
          style={{ color: 'var(--color-muted)' }}
        >
          Para bookings, colaboraciones y prensa
        </motion.p>

        {/* Email copy button */}
        {artist.booking_email && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
            className="mb-10"
          >
            <button
              onClick={handleCopy}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl border text-lg font-mono transition-all duration-300 hover:scale-105"
              style={{
                borderColor: 'var(--color-accent)',
                color: 'var(--color-text)',
                backgroundColor: 'color-mix(in srgb, var(--color-accent) 8%, transparent)',
              }}
            >
              <span>{artist.booking_email}</span>

              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    style={{ color: 'var(--color-accent)' }}
                  >
                    ✓
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="text-sm"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    copiar
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: '0 0 20px color-mix(in srgb, var(--color-accent) 30%, transparent)' }}
              />
            </button>
            <AnimatePresence>
              {copied && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-2 text-sm font-mono"
                  style={{ color: 'var(--color-accent)' }}
                >
                  Email copiado al portapapeles
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Social links */}
        {socialLinks.length > 0 && (
          <motion.div
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
            variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.4 } } }}
            className="flex justify-center gap-4 flex-wrap"
          >
            {socialLinks.map(([platform, url]) => {
              const meta = SOCIAL_ICONS[platform]
              if (!meta || !url) return null
              const Icon = meta.icon
              return (
                <motion.a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                  whileHover={{ scale: 1.1, y: -3 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl border text-sm font-medium transition-colors"
                  style={{
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-muted)',
                    backgroundColor: 'var(--color-surface)',
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {meta.label}
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </motion.a>
              )
            })}
          </motion.div>
        )}
      </div>
    </section>
  )
}
