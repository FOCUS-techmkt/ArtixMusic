'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useCountUp } from '@/hooks/useCountUp'
import type { Artist } from '@/types'
import { formatNumber } from '@/lib/utils'

// Individual animated stat
function StatCard({ label, value, suffix = '' }: { label: string; value: number; suffix?: string }) {
  const { count, ref } = useCountUp({ end: value, duration: 2200 })

  return (
    <div ref={ref} className="flex flex-col items-center gap-1 p-5 rounded-2xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'color-mix(in srgb, var(--color-surface) 80%, transparent)' }}>
      <span className="font-display font-extrabold text-3xl md:text-4xl" style={{ color: 'var(--color-accent)' }}>
        {formatNumber(count)}{suffix}
      </span>
      <span className="text-xs font-mono tracking-wider uppercase" style={{ color: 'var(--color-muted)' }}>
        {label}
      </span>
    </div>
  )
}

interface Props {
  artist: Artist
}

export default function BioSection({ artist }: Props) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })

  const stats = [
    { label: 'Reproducciones', value: 20_000_000, suffix: '' },
    { label: 'Seguidores', value: 142_000, suffix: '' },
    { label: 'Eventos anuales', value: 48, suffix: '+' },
  ]

  return (
    <section className="py-24 px-6" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-4xl mx-auto" ref={ref}>
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xs font-mono tracking-widest uppercase mb-4"
          style={{ color: 'var(--color-accent)' }}
        >
          // ABOUT
        </motion.p>

        {/* Bio text with word-level reveal */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.1 }}
          className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight mb-8"
          style={{ color: 'var(--color-text)' }}
        >
          {artist.bio.split(' ').map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.3em]"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.025, duration: 0.4, ease: 'easeOut' }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h2>

        {/* Achievements list */}
        {artist.achievements.length > 0 && (
          <motion.ul
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            className="flex flex-col gap-4 mb-12"
          >
            {artist.achievements.map((a, i) => (
              <motion.li
                key={i}
                variants={{ hidden: { opacity: 0, x: -24 }, show: { opacity: 1, x: 0, transition: { ease: 'easeOut', duration: 0.5 } } }}
                className="flex items-start gap-4"
              >
                <span className="font-mono text-xs mt-1 shrink-0" style={{ color: 'var(--color-accent)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--color-text)' }}>{a.title}</p>
                  <p className="text-sm" style={{ color: 'var(--color-muted)' }}>{a.description}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  )
}
