'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import type { ArtistPalette, Artist } from '@/types'
import type { FanCaptureConfig, FanCaptureGoal } from '@/types/sections'
import { Reveal, SectionWrapper } from './_shared'

interface Props { config: FanCaptureConfig; artist: Artist; palette: ArtistPalette }

// ── Metadatos por objetivo (icono + copy por defecto) ────────────
const GOAL_META: Record<FanCaptureGoal, { icon: string; title: string; sub: string; cta: string }> = {
  community: { icon: '🎧', title: 'Únete a mi comunidad', sub: 'Música exclusiva, primeras escuchas y fechas antes que nadie.', cta: 'Quiero entrar' },
  gift:      { icon: '🎁', title: 'Llévate un regalo', sub: 'Déjame tu email y recibe tu regalo al instante.', cta: 'Obtener regalo' },
  presale:   { icon: '🚀', title: 'Acceso anticipado', sub: 'Entradas y lanzamientos antes que el resto del mundo.', cta: 'Quiero el acceso' },
  vip:       { icon: '⭐', title: 'Lista VIP', sub: 'Beneficios exclusivos para los fans más fieles.', cta: 'Unirme a la VIP' },
  guestlist: { icon: '🎟️', title: 'Entra en la guestlist', sub: 'Reserva tu lugar para la próxima fecha.', cta: 'Anotarme' },
  download:  { icon: '⬇️', title: 'Descarga gratis', sub: 'Pack de tracks y stems gratis al suscribirte.', cta: 'Descargar ahora' },
}

export default function FanCaptureSection({ config, artist, palette }: Props) {
  const accent  = config.accent_override || palette.primary
  const accent2 = palette.secondary
  const goal    = GOAL_META[config.goal] ?? GOAL_META.community
  const variant = config.variant ?? 'glass'

  const title    = config.section_title || goal.title
  const subtitle = config.subtitle || goal.sub
  const button   = config.button_text || goal.cta
  const isLink   = config.mode === 'link'

  const [email, setEmail] = useState('')
  const [name,  setName]  = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setState('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, artist_slug: artist.slug, source: `presskit:${config.goal}` }),
      })
      if (res.ok) {
        setState('done')
        // En modo link, tras suscribir redirige al recurso (regalo, Discord, descarga)
        if (isLink && config.cta_url) setTimeout(() => { window.location.href = config.cta_url }, 900)
      } else setState('error')
    } catch { setState('error') }
  }

  // ── Form compartido ────────────────────────────────────────────
  const Form = ({ stacked = true, inputBg, inputBorder, btnStyle, compact = false }: {
    stacked?: boolean; inputBg: string; inputBorder: string; btnStyle: React.CSSProperties; compact?: boolean
  }) => {
    if (state === 'done') return (
      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-6 text-center">
        <div className="text-5xl mb-3">{isLink ? '✅' : '🎉'}</div>
        <p className="font-semibold text-lg" style={{ color: palette.text }}>
          {isLink ? '¡Listo! Te estamos redirigiendo…' : '¡Ya eres parte de la familia!'}
        </p>
        {!isLink && <p className="text-sm mt-2" style={{ color: palette.textMuted }}>Prepárate para las novedades.</p>}
      </motion.div>
    )
    const inputStyle: React.CSSProperties = {
      background: inputBg, border: `1px solid ${inputBorder}`, color: palette.text,
    }
    return (
      <form onSubmit={submit} className={stacked ? 'flex flex-col gap-3' : 'flex flex-col sm:flex-row gap-3'}>
        {config.show_name && (
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre (opcional)"
            className="w-full px-5 py-4 rounded-2xl text-sm focus:outline-none transition-all" style={inputStyle} />
        )}
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required
          className="w-full px-5 py-4 rounded-2xl text-sm focus:outline-none transition-all" style={inputStyle} />
        <motion.button type="submit" disabled={state === 'loading'}
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className={`${stacked ? 'w-full' : 'shrink-0'} py-4 px-7 rounded-2xl font-bold text-sm tracking-wider uppercase disabled:opacity-60 whitespace-nowrap`}
          style={btnStyle}>
          {state === 'loading' ? '…' : button}
        </motion.button>
        {state === 'error' && <p className="text-xs text-red-400 text-center sm:text-left">Algo salió mal. Intenta de nuevo.</p>}
        {!compact && config.privacy_text && (
          <p className="text-[11px] text-center mt-1" style={{ color: palette.textMuted }}>{config.privacy_text}</p>
        )}
      </form>
    )
  }

  const gradBtn: React.CSSProperties = { background: `linear-gradient(135deg, ${accent}, ${accent2})`, color: '#fff' }
  const solidBtn: React.CSSProperties = { background: accent, color: '#fff' }

  // ════════════════════════════════════════════════════════════════
  // VARIANTES
  // ════════════════════════════════════════════════════════════════

  // ── 1. MINIMAL — limpio, una línea, elegante ──
  if (variant === 'minimal') {
    return (
      <SectionWrapper id="fan-capture" bgImage={config.bg_image} overlay={config.overlay_opacity} palette={palette} className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6" style={{ borderBottom: `1px solid ${palette.border}` }}>
              <div>
                <p className="text-[12px] font-mono uppercase tracking-[3px] mb-2" style={{ color: accent }}>{goal.icon} {config.incentive || 'Newsletter'}</p>
                <h2 className="font-display font-bold text-3xl md:text-4xl" style={{ color: palette.text }}>{title}</h2>
                <p className="text-sm mt-2 max-w-md" style={{ color: palette.textMuted }}>{subtitle}</p>
              </div>
            </div>
            <div className="mt-6">
              <Form stacked={false} inputBg="transparent" inputBorder={palette.border} btnStyle={solidBtn} />
            </div>
          </Reveal>
        </div>
      </SectionWrapper>
    )
  }

  // ── 2. GLASS — tarjeta glassmorphism con glow ──
  if (variant === 'glass') {
    return (
      <SectionWrapper id="fan-capture" bgImage={config.bg_image} overlay={config.overlay_opacity} palette={palette} className="py-24 md:py-32">
        <div className="max-w-xl mx-auto px-6 relative">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[320px] rounded-full blur-[90px] opacity-25" style={{ background: accent }} />
          </div>
          <Reveal>
            <div className="relative rounded-3xl p-8 md:p-10 text-center backdrop-blur-xl"
              style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${palette.border}`, boxShadow: `0 20px 60px -20px ${accent}55` }}>
              <div className="text-4xl mb-4">{goal.icon}</div>
              <h2 className="font-display font-black text-3xl md:text-4xl mb-3" style={{ color: palette.text }}>{title}</h2>
              {config.incentive && <p className="inline-block text-[12px] font-mono uppercase tracking-[2px] px-3 py-1 rounded-full mb-4" style={{ border: `1px solid ${accent}`, color: accent }}>{config.incentive}</p>}
              <p className="text-sm md:text-base mb-7" style={{ color: palette.textMuted }}>{subtitle}</p>
              <Form inputBg={palette.surface} inputBorder={palette.border} btnStyle={gradBtn} />
            </div>
          </Reveal>
        </div>
      </SectionWrapper>
    )
  }

  // ── 3. GRADIENT-POP — fondo gradiente vibrante ──
  if (variant === 'gradient-pop') {
    return (
      <section id="fan-capture" className="relative overflow-hidden py-24 md:py-32" style={{ scrollMarginTop: 70 }}>
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${accent}, ${accent2})` }} />
        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4), transparent 40%)' }} />
        <div className="max-w-2xl mx-auto px-6 relative text-center">
          <Reveal>
            <div className="text-5xl mb-4">{goal.icon}</div>
            <h2 className="font-display font-black text-4xl md:text-6xl mb-4 text-white drop-shadow">{title}</h2>
            <p className="text-base md:text-lg mb-8 text-white/90 max-w-lg mx-auto">{subtitle}</p>
            <div className="max-w-md mx-auto">
              <Form inputBg="rgba(255,255,255,0.18)" inputBorder="rgba(255,255,255,0.4)" btnStyle={{ background: '#fff', color: accent }} />
            </div>
          </Reveal>
        </div>
      </section>
    )
  }

  // ── 4. TICKET — estilo guestlist con borde perforado ──
  if (variant === 'ticket') {
    return (
      <SectionWrapper id="fan-capture" bgImage={config.bg_image} overlay={config.overlay_opacity} palette={palette} className="py-24 md:py-32">
        <div className="max-w-2xl mx-auto px-6">
          <Reveal>
            <div className="relative flex flex-col md:flex-row rounded-2xl overflow-hidden" style={{ background: palette.surface, border: `1px solid ${palette.border}` }}>
              {/* Stub lateral */}
              <div className="md:w-44 shrink-0 flex flex-row md:flex-col items-center justify-center gap-2 p-6 text-center"
                style={{ background: accent, color: '#fff' }}>
                <div className="text-3xl">{goal.icon}</div>
                <div className="font-display font-black uppercase tracking-wider leading-tight text-sm">{config.incentive || 'Acceso'}</div>
              </div>
              {/* Línea perforada */}
              <div className="hidden md:flex flex-col items-center justify-around py-3" style={{ borderLeft: `2px dashed ${palette.border}` }} />
              <div className="flex-1 p-7 md:p-8">
                <h2 className="font-display font-black text-2xl md:text-3xl mb-2" style={{ color: palette.text }}>{title}</h2>
                <p className="text-sm mb-5" style={{ color: palette.textMuted }}>{subtitle}</p>
                <Form inputBg="transparent" inputBorder={palette.border} btnStyle={solidBtn} />
              </div>
            </div>
          </Reveal>
        </div>
      </SectionWrapper>
    )
  }

  // ── 5. NEON — híper animado: bordes neón pulsantes, partículas ──
  if (variant === 'neon') {
    return (
      <section id="fan-capture" className="relative overflow-hidden py-28 md:py-36" style={{ background: '#060608', scrollMarginTop: 70 }}>
        <style>{`
          @keyframes fc-pulse { 0%,100%{box-shadow:0 0 0 0 ${accent}00, 0 0 40px ${accent}55, inset 0 0 30px ${accent}22} 50%{box-shadow:0 0 0 0 ${accent}00, 0 0 70px ${accent}99, inset 0 0 45px ${accent}33} }
          @keyframes fc-float { from{transform:translateY(0)} to{transform:translateY(-22px)} }
          @keyframes fc-spin { to{transform:rotate(360deg)} }
          .fc-card { animation: fc-pulse 2.6s ease-in-out infinite; }
          .fc-orb { animation: fc-float 4s ease-in-out infinite alternate; }
        `}</style>
        {/* Orbs/partículas */}
        <div className="fc-orb absolute rounded-full pointer-events-none" style={{ top: '14%', left: '12%', width: 180, height: 180, background: accent, opacity: 0.25, filter: 'blur(70px)' }} />
        <div className="fc-orb absolute rounded-full pointer-events-none" style={{ bottom: '10%', right: '14%', width: 220, height: 220, background: accent2, opacity: 0.22, filter: 'blur(80px)', animationDelay: '1s' }} />
        <div className="absolute inset-0 pointer-events-none opacity-[0.07]" style={{ backgroundImage: `linear-gradient(${accent}40 1px, transparent 1px), linear-gradient(90deg, ${accent}40 1px, transparent 1px)`, backgroundSize: '44px 44px' }} />
        <div className="max-w-xl mx-auto px-6 relative">
          <Reveal>
            <div className="fc-card rounded-3xl p-8 md:p-12 text-center" style={{ background: 'rgba(10,10,14,0.7)', border: `1.5px solid ${accent}`, backdropFilter: 'blur(6px)' }}>
              <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-5xl mb-4">{goal.icon}</motion.div>
              <h2 className="font-display font-black text-4xl md:text-5xl mb-3" style={{ color: '#fff', textShadow: `0 0 24px ${accent}` }}>{title}</h2>
              {config.incentive && <p className="inline-block text-[12px] font-mono uppercase tracking-[3px] px-4 py-1.5 rounded-full mb-5" style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}` }}>★ {config.incentive}</p>}
              <p className="text-sm md:text-base mb-7" style={{ color: 'rgba(255,255,255,0.7)' }}>{subtitle}</p>
              <Form inputBg="rgba(255,255,255,0.06)" inputBorder={`${accent}66`} btnStyle={{ background: accent, color: '#000', boxShadow: `0 0 30px ${accent}aa` }} />
            </div>
          </Reveal>
        </div>
      </section>
    )
  }

  // ── 6. SPLIT — incentivo/imagen + formulario ──
  return (
    <SectionWrapper id="fan-capture" bgImage={null} overlay={0} palette={palette} className="py-0">
      <div className="grid md:grid-cols-2 min-h-[60vh]">
        {/* Lado visual / incentivo */}
        <div className="relative flex flex-col justify-center p-10 md:p-16 overflow-hidden" style={{ background: config.bg_image ? undefined : `linear-gradient(135deg, ${accent}, ${accent2})` }}>
          {config.bg_image && <img src={config.bg_image} alt="" className="absolute inset-0 w-full h-full object-cover" />}
          {config.bg_image && <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${accent}cc, ${accent2}aa)` }} />}
          <Reveal>
            <div className="relative text-white">
              <div className="text-5xl mb-5">{goal.icon}</div>
              <h2 className="font-display font-black text-3xl md:text-5xl leading-tight mb-4">{title}</h2>
              {config.incentive && <p className="text-lg font-semibold mb-3">{config.incentive}</p>}
              <p className="text-white/85 max-w-sm">{subtitle}</p>
            </div>
          </Reveal>
        </div>
        {/* Lado formulario */}
        <div className="flex flex-col justify-center p-10 md:p-16" style={{ background: palette.surface }}>
          <Reveal delay={0.1}>
            <h3 className="font-display font-bold text-xl mb-6" style={{ color: palette.text }}>
              {isLink ? 'Déjanos tu email y accede' : 'Suscríbete gratis'}
            </h3>
            <Form inputBg={palette.bg} inputBorder={palette.border} btnStyle={gradBtn} />
          </Reveal>
        </div>
      </div>
    </SectionWrapper>
  )
}
