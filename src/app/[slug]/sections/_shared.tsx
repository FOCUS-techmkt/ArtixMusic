'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { ArtistPalette } from '@/types'

// ── Scroll-triggered reveal ───────────────────────────────────
export function Reveal({
  children,
  delay = 0,
  y = 32,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}>
      {children}
    </motion.div>
  )
}

// ── Stagger container ─────────────────────────────────────────
export function StaggerParent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      className={className}>
      {children}
    </motion.div>
  )
}

export function StaggerChild({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
      className={className}>
      {children}
    </motion.div>
  )
}

// ── Parallax wrapper ──────────────────────────────────────────
export function ParallaxBg({ src, overlay, children }: { src?: string | null; overlay?: number; children?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      {src && (
        <motion.div className="absolute inset-0" style={{ y, scale: 1.2 }}>
          <img src={src} alt="" className="w-full h-full object-cover" />
        </motion.div>
      )}
      <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${overlay ?? 0.6})` }} />
      {children}
    </div>
  )
}

// ── Count-up number ───────────────────────────────────────────
export function CountUp({ target, suffix = '', duration = 1800 }: { target: string; suffix?: string; duration?: number }) {
  const [display, setDisplay] = useState('0')
  const ref = useRef<HTMLSpanElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const num = parseFloat(target.replace(/[^0-9.]/g, ''))
    if (isNaN(num) || !started) return
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      const val = Math.round(ease * num)
      setDisplay(target.replace(/\d+/, val.toString()))
      if (p < 1) requestAnimationFrame(tick)
      else setDisplay(target)
    }
    requestAnimationFrame(tick)
  }, [started, target])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return <span ref={ref}>{display}</span>
}

// ── Section wrapper ───────────────────────────────────────────
export function SectionWrapper({
  id,
  bgImage,
  overlay,
  parallax,
  palette,
  className = '',
  children,
}: {
  id?: string
  bgImage?: string | null
  overlay?: number
  parallax?: boolean
  palette: ArtistPalette
  className?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className={`relative overflow-hidden ${className}`}
      style={{ background: palette.bg }}>
      {bgImage && parallax && <ParallaxBg src={bgImage} overlay={overlay} />}
      {bgImage && !parallax && (
        <div className="absolute inset-0">
          <img src={bgImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${overlay ?? 0.6})` }} />
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </section>
  )
}

// ── Infinite ticker ───────────────────────────────────────────
export function Ticker({ items, speed = 30, accent }: { items: string[]; speed?: number; accent: string }) {
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden whitespace-nowrap" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
        className="inline-flex gap-8">
        {doubled.map((item, i) => (
          <span key={i} className="text-sm font-mono uppercase tracking-widest flex items-center gap-3"
            style={{ color: i % 2 === 0 ? accent : 'rgba(255,255,255,0.4)' }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: accent, opacity: 0.6 }} />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ── Glitch text animation ─────────────────────────────────────
export function GlitchText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <motion.span
        className="relative z-10"
        animate={{ x: [0, -2, 2, 0], opacity: [1, 0.9, 1] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}>
        {text}
      </motion.span>
      <motion.span
        aria-hidden
        className="absolute inset-0 select-none"
        style={{ color: '#ff00ff', clipPath: 'inset(40% 0 50% 0)' }}
        animate={{ x: [0, 3, -3, 0], opacity: [0, 0.7, 0] }}
        transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3.5 }}>
        {text}
      </motion.span>
      <motion.span
        aria-hidden
        className="absolute inset-0 select-none"
        style={{ color: '#00ffff', clipPath: 'inset(20% 0 60% 0)' }}
        animate={{ x: [0, -3, 3, 0], opacity: [0, 0.7, 0] }}
        transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3.8, delay: 0.05 }}>
        {text}
      </motion.span>
    </span>
  )
}
