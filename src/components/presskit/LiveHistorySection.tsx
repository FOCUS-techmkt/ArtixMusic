'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { MapPin, Calendar } from 'lucide-react'
import type { LiveEvent } from '@/types'
import { formatDate } from '@/lib/utils'

interface EventItemProps {
  event: LiveEvent
  index: number
  isLeft: boolean
}

function EventItem({ event, index, isLeft }: EventItemProps) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
      className={`flex ${isLeft ? 'flex-row' : 'flex-row-reverse'} items-center gap-6 w-full`}
    >
      {/* Content card */}
      <div
        className="flex-1 p-5 rounded-2xl border"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'color-mix(in srgb, var(--color-surface) 80%, transparent)' }}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="font-display font-bold text-lg" style={{ color: 'var(--color-text)' }}>
            {event.venue_name}
          </p>
          <span
            className="text-xs font-mono shrink-0"
            style={{ color: 'var(--color-accent)' }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        {event.event_name && (
          <p className="text-sm mb-2" style={{ color: 'var(--color-muted)' }}>{event.event_name}</p>
        )}
        <div className="flex items-center gap-3">
          {event.city && (
            <span className="flex items-center gap-1 text-xs font-mono" style={{ color: 'var(--color-muted)' }}>
              <MapPin className="w-3 h-3" />
              {event.city}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs font-mono" style={{ color: 'var(--color-muted)' }}>
            <Calendar className="w-3 h-3" />
            {formatDate(event.event_date)}
          </span>
        </div>
      </div>

      {/* Timeline dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ delay: index * 0.05 + 0.2, type: 'spring', stiffness: 400 }}
        className="w-3 h-3 rounded-full shrink-0"
        style={{ backgroundColor: 'var(--color-accent)', boxShadow: '0 0 8px var(--color-glow)' }}
      />

      {/* Spacer for alternating layout */}
      <div className="flex-1" />
    </motion.div>
  )
}

interface Props {
  events: LiveEvent[]
}

export default function LiveHistorySection({ events }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.3 })

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const lineHeight = useTransform(scrollYProgress, [0.05, 0.9], ['0%', '100%'])

  return (
    <section ref={sectionRef} className="py-24 px-6" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-3xl mx-auto">
        <div ref={headerRef}>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            className="text-xs font-mono tracking-widest uppercase mb-4"
            style={{ color: 'var(--color-accent)' }}
          >
            // LIVE HISTORY
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
            className="font-display font-bold text-4xl md:text-5xl mb-16"
            style={{ color: 'var(--color-text)' }}
          >
            En el escenario
          </motion.h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line that draws itself */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-[1px] top-0 bottom-0"
            style={{ backgroundColor: 'var(--color-border)' }}
          >
            <motion.div
              className="absolute top-0 left-0 w-full origin-top"
              style={{ height: lineHeight, backgroundColor: 'var(--color-accent)' }}
            />
          </div>

          <div className="flex flex-col gap-8">
            {events.map((event, i) => (
              <EventItem key={event.id} event={event} index={i} isLeft={i % 2 === 0} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
