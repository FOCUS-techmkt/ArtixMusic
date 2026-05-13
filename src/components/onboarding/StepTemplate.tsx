'use client'
import { motion } from 'framer-motion'
import type { OnboardingData, LayoutVariant } from '@/types'
import { staggerContainer, fadeUpItem } from '@/lib/utils'

interface Template {
  id: string
  name: string
  vibe: string
  ref: string
  animLabel: string
  primary: string
  secondary: string
  bgDark: boolean
  layout: LayoutVariant
  renderCard: () => React.ReactNode
}

const TEMPLATES: Template[] = [
  {
    id: 'noir',
    name: 'NOIR MINIMAL',
    vibe: 'Elegancia sin ruido',
    ref: 'Solomun · Dixon',
    animLabel: 'Ken Burns · Fade',
    primary: '#D4D4D4',
    secondary: '#737373',
    bgDark: true,
    layout: 'centered',
    renderCard: () => (
      <div className="relative w-full h-full flex flex-col justify-between p-4" style={{ background: 'linear-gradient(160deg, #111111 0%, #080808 100%)' }}>
        {/* Thin top line */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />
        {/* Center name */}
        <div className="flex-1 flex flex-col items-center justify-center gap-1">
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 300, letterSpacing: '0.18em', color: '#F0F0F0', textAlign: 'center', lineHeight: 1 }}>
            SOLOMUN
          </div>
          <div style={{ width: '32px', height: '1px', background: 'rgba(255,255,255,0.2)', margin: '6px auto' }} />
          <div style={{ color: '#737373', fontSize: '8px', letterSpacing: '0.24em', fontFamily: 'monospace', textAlign: 'center' }}>
            DJ · TECHNO
          </div>
        </div>
        {/* Bottom line */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />
      </div>
    ),
  },
  {
    id: 'acid',
    name: 'NEON ACID',
    vibe: 'Techno sin compromiso',
    ref: 'Charlotte de Witte',
    animLabel: 'Glitch · Neon Pulse',
    primary: '#B5FF3A',
    secondary: '#00FF88',
    bgDark: true,
    layout: 'split',
    renderCard: () => (
      <div className="relative w-full h-full" style={{ background: '#050505' }}>
        {/* Photo area right */}
        <div className="absolute right-0 top-0 bottom-0 w-[38%]" style={{ background: 'rgba(181,255,58,0.04)', borderLeft: '1px solid rgba(181,255,58,0.18)' }}>
          <div className="absolute inset-0 flex items-center justify-center" style={{ opacity: 0.25 }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(181,255,58,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#B5FF3A', fontSize: '14px' }}>◆</span>
            </div>
          </div>
        </div>
        {/* Left content */}
        <div className="absolute left-0 top-0 bottom-0" style={{ width: '62%', padding: '14px 12px' }}>
          <div style={{ color: 'rgba(181,255,58,0.5)', fontSize: '7px', letterSpacing: '0.22em', fontFamily: 'monospace', marginBottom: '10px' }}>
            PRESSKIT.PRO
          </div>
          <div style={{ fontSize: '15px', fontWeight: 900, color: '#B5FF3A', textShadow: '0 0 18px rgba(181,255,58,0.5)', lineHeight: 1.1, letterSpacing: '0.04em' }}>
            CHARLOTTE<br />DE WITTE
          </div>
          <div style={{ color: 'rgba(181,255,58,0.4)', fontSize: '7px', letterSpacing: '0.18em', fontFamily: 'monospace', marginTop: '8px' }}>
            TECHNO · DJ
          </div>
          {/* Neon line accent */}
          <div style={{ height: '1px', width: '28px', background: '#B5FF3A', boxShadow: '0 0 6px #B5FF3A', marginTop: '10px' }} />
        </div>
      </div>
    ),
  },
  {
    id: 'editorial',
    name: 'EDITORIAL MAG',
    vibe: 'Arte y música fusionados',
    ref: 'Jamie xx · Four Tet',
    animLabel: 'Slide In · Parallax',
    primary: '#E94560',
    secondary: '#1A1A2E',
    bgDark: false,
    layout: 'editorial',
    renderCard: () => (
      <div className="relative w-full h-full" style={{ background: 'linear-gradient(160deg, #F5F0E8 0%, #EDE8DF 100%)' }}>
        {/* Big decorative number */}
        <div style={{ position: 'absolute', right: '10px', top: '6px', fontSize: '60px', fontWeight: 900, color: 'rgba(0,0,0,0.05)', lineHeight: 1, fontFamily: 'Georgia, serif' }}>
          01
        </div>
        {/* Photo placeholder top-right */}
        <div style={{ position: 'absolute', right: '10px', bottom: '10px', width: '42px', height: '56px', background: 'rgba(0,0,0,0.08)', borderRadius: '4px' }} />
        {/* Content */}
        <div style={{ padding: '10px 12px', position: 'relative', zIndex: 1 }}>
          <div style={{ color: '#E94560', fontSize: '7px', letterSpacing: '0.22em', fontFamily: 'monospace', marginBottom: '6px' }}>
            EDITORIAL
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 700, color: '#1A1A1A', lineHeight: 1.05 }}>
            JAMIE<br />XX
          </div>
          <div style={{ height: '1px', background: '#1A1A1A', margin: '8px 0', width: '100%', opacity: 0.12 }} />
          <div style={{ fontSize: '7px', fontFamily: 'monospace', letterSpacing: '0.12em', color: '#6B7280' }}>
            HOUSE · ELECTRONIC
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'warm',
    name: 'WARM VINYL',
    vibe: 'Calidez y groove',
    ref: 'Peggy Gou · Mall Grab',
    animLabel: 'Vinyl Spin · Breathe',
    primary: '#F59E0B',
    secondary: '#EC4899',
    bgDark: true,
    layout: 'centered',
    renderCard: () => (
      <div className="relative w-full h-full flex flex-col items-center justify-center" style={{ background: 'radial-gradient(ellipse at 50% 110%, #2D1800 0%, #1A0F00 55%, #0D0800 100%)' }}>
        {/* Vinyl record ring */}
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '1.5px solid rgba(245,158,11,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px', position: 'relative' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1px solid rgba(245,158,11,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#F59E0B' }} />
          </div>
          {/* Ring lines */}
          <div style={{ position: 'absolute', inset: '6px', borderRadius: '50%', border: '1px solid rgba(245,158,11,0.15)' }} />
        </div>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#FEF3C7', letterSpacing: '0.1em', textAlign: 'center' }}>
          PEGGY GOU
        </div>
        <div style={{ color: '#F59E0B', fontSize: '8px', letterSpacing: '0.2em', fontFamily: 'monospace', marginTop: '4px' }}>
          DJ · HOUSE
        </div>
        {/* Warm glow */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(245,158,11,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      </div>
    ),
  },
  {
    id: 'trap',
    name: 'DARK TRAP',
    vibe: 'Oscuridad total, máximo impacto',
    ref: 'Travis Scott · Playboi',
    animLabel: 'Smoke · Grain · Scanlines',
    primary: '#EF4444',
    secondary: '#D97706',
    bgDark: true,
    layout: 'raw',
    renderCard: () => (
      <div className="relative w-full h-full overflow-hidden" style={{ background: 'linear-gradient(160deg, #1A0000 0%, #0D0D0D 100%)' }}>
        {/* Shadow photo texture */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 40%, rgba(239,68,68,0.07) 0%, transparent 60%)' }} />
        {/* Scanlines overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)', pointerEvents: 'none' }} />
        {/* Giant ghost text */}
        <div style={{ position: 'absolute', top: '4px', left: '8px', fontSize: '40px', fontWeight: 900, color: 'rgba(239,68,68,0.09)', lineHeight: 1, letterSpacing: '-0.02em' }}>
          DARK
        </div>
        {/* Main content */}
        <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
          <div style={{ fontSize: '20px', fontWeight: 900, color: '#F5F5F5', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
            TRAVIS<br />SCOTT
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
            <div style={{ width: '24px', height: '2px', background: '#EF4444', boxShadow: '0 0 8px #EF4444' }} />
            <div style={{ color: 'rgba(239,68,68,0.7)', fontSize: '7px', letterSpacing: '0.2em', fontFamily: 'monospace' }}>
              TRAP
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'festival',
    name: 'FESTIVAL ENERGY',
    vibe: 'Mainstage 24/7',
    ref: 'Martin Garrix · Tiësto',
    animLabel: 'Light Beams · Energy Pulse',
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    bgDark: true,
    layout: 'centered',
    renderCard: () => (
      <div className="relative w-full h-full overflow-hidden" style={{ background: 'linear-gradient(160deg, #0A0F2E 0%, #030712 100%)' }}>
        {/* Light beams */}
        <div style={{ position: 'absolute', inset: 0, background: 'conic-gradient(from 190deg at 50% 120%, transparent 0deg, rgba(59,130,246,0.14) 25deg, transparent 50deg, rgba(139,92,246,0.08) 75deg, transparent 100deg)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'conic-gradient(from 200deg at 30% 120%, transparent 0deg, rgba(139,92,246,0.1) 20deg, transparent 40deg)', pointerEvents: 'none' }} />
        {/* Content */}
        <div style={{ padding: '12px 14px', position: 'relative', zIndex: 1 }}>
          <div style={{ color: 'rgba(59,130,246,0.6)', fontSize: '7px', letterSpacing: '0.22em', fontFamily: 'monospace', marginBottom: '8px' }}>
            PRESSKIT.PRO
          </div>
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#3B82F6', textShadow: '0 0 24px rgba(59,130,246,0.6)', lineHeight: 1.1, letterSpacing: '0.04em' }}>
            MARTIN<br />GARRIX
          </div>
          <div style={{ color: 'rgba(139,92,246,0.8)', fontSize: '8px', letterSpacing: '0.18em', fontFamily: 'monospace', marginTop: '8px' }}>
            EDM · FESTIVAL
          </div>
        </div>
        {/* Glow dot */}
        <div style={{ position: 'absolute', bottom: '14px', right: '14px', width: '28px', height: '28px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(59,130,246,0.5) 0%, transparent 70%)', border: '1px solid rgba(59,130,246,0.3)' }} />
      </div>
    ),
  },
]

interface Props {
  data: OnboardingData
  onChange: (partial: Partial<OnboardingData>) => void
}

export default function StepTemplate({ data, onChange }: Props) {
  const select = (t: Template) => {
    onChange({
      template_id:     t.id,
      primary_color:   t.primary,
      secondary_color: t.secondary,
      bg_dark:         t.bgDark,
      layout_variant:  t.layout,
    })
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8"
    >
      <motion.div variants={fadeUpItem}>
        <h2 className="font-display font-bold text-3xl md:text-4xl mb-2">Elige tu estilo</h2>
        <p className="text-white/50">
          Cada template es una estética completa — estructura, animación y tipografía propias.
          Puedes personalizarlo después.
        </p>
      </motion.div>

      <motion.div variants={fadeUpItem} className="grid grid-cols-2 gap-3">
        {TEMPLATES.map((t) => {
          const isActive = data.template_id === t.id
          return (
            <motion.button
              key={t.id}
              type="button"
              onClick={() => select(t)}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.1 }}
              className="w-full flex flex-col gap-2 text-left group"
              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' } as React.CSSProperties}
            >
              {/* Visual card */}
              <div
                className="relative w-full overflow-hidden rounded-2xl"
                style={{
                  height: '110px',
                  outline: isActive ? `2px solid ${t.primary}` : `1px solid rgba(255,255,255,0.12)`,
                  outlineOffset: isActive ? '3px' : '0px',
                  transition: 'outline 0.2s',
                  borderRadius: '16px',
                }}
              >
                {t.renderCard()}

                {/* Hover overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-200"
                  style={{ background: `linear-gradient(135deg, ${t.primary}08, transparent)`, opacity: isActive ? 0 : 0 }}
                />

                {/* Active check */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg"
                    style={{ backgroundColor: t.primary, boxShadow: `0 0 10px ${t.primary}80` }}
                  >
                    ✓
                  </motion.div>
                )}

                {/* Anim badge bottom-left */}
                <div
                  className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[7px] font-mono tracking-wider"
                  style={{
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(4px)',
                    color: isActive ? t.primary : 'rgba(255,255,255,0.5)',
                    border: `1px solid ${isActive ? t.primary + '50' : 'rgba(255,255,255,0.1)'}`,
                  }}
                >
                  {t.animLabel}
                </div>
              </div>

              {/* Label */}
              <div className="px-0.5">
                <p
                  className="font-display font-bold text-[13px] tracking-[0.04em] transition-colors duration-200"
                  style={{ color: isActive ? t.primary : 'rgba(255,255,255,0.8)' }}
                >
                  {t.name}
                </p>
                <p className="text-[11px] text-white/35 leading-tight mt-0.5">{t.vibe}</p>
                <p className="text-[10px] font-mono mt-0.5" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  {t.ref}
                </p>
              </div>
            </motion.button>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
