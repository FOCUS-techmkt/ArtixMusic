'use client'
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, Loader2, Sparkles, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import ProgressBar from './ProgressBar'
import StepIdentity from './StepIdentity'
import StepTemplate from './StepTemplate'
import StepMedia from './StepMedia'
import StepEssentials from './StepEssentials'
import type { Artist, OnboardingData, OnboardingStatus } from '@/types'
import { ONBOARDING_STEPS, deriveArtistPalette } from '@/types'
import { DEFAULT_CONFIGS } from '@/types/sections'

const stepVariants = {
  enter:  { opacity: 0, y: 8 },
  center: { opacity: 1, y: 0 },
  exit:   { opacity: 0, y: -8 },
}
const stepTransition = { duration: 0.18, ease: 'easeOut' }

const STEP_COMPONENTS = [
  StepIdentity,
  StepTemplate,
  StepMedia,
  StepEssentials,
]

function initialData(artist: Artist): OnboardingData {
  return {
    artist_name:     artist.artist_name,
    role:            artist.role,
    genre:           artist.genre,
    // Template (Step 2) — empty until user picks
    template_id:     '',
    sound_words:     artist.sound_words ?? [],
    // Media (Step 3)
    photo_url:       artist.photo_url,
    logo_url:        artist.logo_url,
    primary_color:   (artist as any).primary_color   ?? '#C026D3',
    secondary_color: (artist as any).secondary_color ?? '#7C3AED',
    bg_dark:         (artist as any).bg_dark          ?? true,
    layout_variant:  (artist as any).layout_variant   ?? 'centered',
    // Essentials (Step 4)
    bio:             artist.bio ?? '',
    music_url:       '',
    links:           artist.links ?? {},
    booking_email:   artist.booking_email ?? '',
    achievements:    artist.achievements ?? [],
    // Next show
    next_show_date:  '',
    next_show_venue: '',
    next_show_city:  '',
    next_show_url:   '',
  }
}

function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="7" fill="#C026D3" />
      <path d="M9 8h8.5C20.5 8 23 10.2 23 13.2c0 3-2.5 5.2-5.5 5.2H13v5.6H9V8zm4 8.2h4c1.4 0 2.5-.9 2.5-2.2 0-1.3-1.1-2.2-2.5-2.2h-4v4.4z" fill="white" />
    </svg>
  )
}

// ── Celebration screen ────────────────────────────────────────────────────────
function CelebrationScreen({
  data,
  slug,
}: {
  data: OnboardingData
  slug: string
}) {
  const router = useRouter()
  const palette = deriveArtistPalette(data.primary_color, data.secondary_color, data.bg_dark)

  const publicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/${slug}`
    : `/${slug}`

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center px-6 py-12 relative" style={{ background: '#0A0A0F' }}>
      {/* Animated bg glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 45%, ${data.primary_color}20 0%, ${data.secondary_color}08 45%, transparent 70%)`,
        }}
      />

      <div className="w-full max-w-md relative z-10 flex flex-col items-center text-center gap-8">
        {/* Celebration icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.1 }}
          className="flex items-center justify-center w-20 h-20 rounded-full"
          style={{
            background: `linear-gradient(135deg, ${data.primary_color}30, ${data.secondary_color}20)`,
            border: `2px solid ${data.primary_color}50`,
            boxShadow: `0 0 60px ${data.primary_color}30`,
          }}
        >
          <Sparkles className="w-8 h-8" style={{ color: data.primary_color }} />
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col gap-3"
        >
          <div className="font-mono text-[11px] tracking-[0.22em]" style={{ color: data.primary_color }}>
            KIT CREADO
          </div>
          <h1 className="font-display font-black text-4xl md:text-5xl leading-tight tracking-tight">
            <span style={{ color: data.primary_color }}>{data.artist_name}</span>
            <br />
            <span className="text-white">está en vivo.</span>
          </h1>
          <p className="text-white/40 text-[15px] max-w-xs mx-auto leading-relaxed">
            Tu presskit profesional está publicado y listo para compartir con promotores, bookers y medios.
          </p>
        </motion.div>

        {/* URL pill */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full"
          style={{ background: `${data.primary_color}10`, border: `1px solid ${data.primary_color}30` }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: data.primary_color }} />
          <span className="font-mono text-[12px]" style={{ color: data.primary_color }}>
            presskit.pro/{slug}
          </span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.4 }}
          className="flex flex-col gap-3 w-full"
        >
          <motion.a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-[15px] font-semibold text-white"
            style={{ background: `linear-gradient(135deg, ${data.primary_color}, ${data.secondary_color})` }}
          >
            <ExternalLink className="w-4 h-4" />
            Ver mi presskit
          </motion.a>

          <motion.button
            type="button"
            onClick={() => router.push('/dashboard')}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-[14px] font-medium text-white/60 hover:text-white transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
          >
            Ir al dashboard →
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

// ── Main Wizard ────────────────────────────────────────────────────────────────
export default function OnboardingWizard({ initialArtist }: { initialArtist: Artist }) {
  const router  = useRouter()
  const supabase = createClient()

  const [step, setStep]                 = useState(() => {
    const idx = ONBOARDING_STEPS.indexOf(initialArtist.onboarding_step as OnboardingStatus)
    return idx >= 0 ? idx : 0
  })
  const [data, setData]                 = useState<OnboardingData>(() => initialData(initialArtist))
  const [saving, setSaving]             = useState(false)
  const [error, setError]               = useState('')
  const [showCelebration, setShowCelebration] = useState(false)

  const update = useCallback((partial: Partial<OnboardingData>) => {
    setData(p => ({ ...p, ...partial }))
    setError('')
  }, [])

  const validate = (): string | null => {
    if (step === 0 && !data.artist_name.trim()) return 'Escribe tu nombre artístico'
    if (step === 1 && !data.template_id)         return 'Elige un template para continuar'
    return null
  }

  const saveProgress = async (stepIdx: number) => {
    const isLast = stepIdx >= STEP_COMPONENTS.length - 1
    const onboarding_step: OnboardingStatus = isLast ? 'complete' : ONBOARDING_STEPS[stepIdx + 1]

    const corePayload = {
      artist_name:     data.artist_name,
      role:            data.role,
      genre:           data.genre,
      sound_words:     data.sound_words,
      achievements:    data.achievements,
      bio:             data.bio,
      photo_url:       data.photo_url,
      links:           data.links,
      booking_email:   data.booking_email || null,
      primary_color:   data.primary_color,
      secondary_color: data.secondary_color,
      bg_dark:         data.bg_dark,
      layout_variant:  data.layout_variant,
      onboarding_step,
      is_published:    isLast,
    }

    // Try with logo_url (migration-v4) — fall back gracefully if column missing
    const { error: dbError } = await supabase
      .from('artists')
      .update({ ...corePayload, logo_url: data.logo_url })
      .eq('user_id', initialArtist.user_id)

    if (dbError) {
      if (dbError.message?.includes('logo_url')) {
        const { error: retryError } = await supabase
          .from('artists')
          .update(corePayload)
          .eq('user_id', initialArtist.user_id)
        if (retryError && isLast) throw new Error(retryError.message)
        if (retryError) console.error('[onboarding] save error (non-blocking):', retryError.message)
      } else if (isLast) {
        throw new Error(dbError.message)
      } else {
        console.error('[onboarding] save error (non-blocking):', dbError.message)
      }
    }

    if (isLast) {
      const { data: artistRow } = await supabase
        .from('artists').select('id').eq('user_id', initialArtist.user_id).maybeSingle()

      if (artistRow?.id) {
        // Update section configs
        const { data: sections } = await supabase
          .from('sections').select('id, name, config').eq('artist_id', artistRow.id)

        if (sections?.length) {
          await Promise.all(sections.map(s => {
            const base = { ...(DEFAULT_CONFIGS[s.name] ?? {}) } as Record<string, unknown>
            let patch: Record<string, unknown> = {}

            if (s.name === 'hero') {
              patch = { ...base, tagline: data.artist_name, sub_tagline: [data.role, data.genre].filter(Boolean).join(' · '), particles: true }
            } else if (s.name === 'bio') {
              patch = { ...base, text: data.bio ? `<p>${data.bio}</p>` : base.text, genres: [data.genre].filter(Boolean) }
            } else if (s.name === 'contact') {
              patch = { ...base, cta_url: data.booking_email ? `mailto:${data.booking_email}` : '' }
            } else if (s.name === 'music' && data.music_url) {
              const platform = data.music_url.includes('spotify') ? 'spotify'
                : data.music_url.includes('soundcloud') ? 'soundcloud'
                : data.music_url.includes('youtube')    ? 'youtube'
                : 'link'
              patch = { ...base, tracks: [{ id: '1', title: `${data.artist_name} — Mix`, platform, url: data.music_url }] }
            } else {
              patch = base
            }

            if (!s.config || Object.keys(s.config).length === 0) {
              return supabase.from('sections').update({ config: patch }).eq('id', s.id)
            }
            return Promise.resolve()
          }))
        }

        // Create live_event if next show date is provided
        if (data.next_show_date) {
          await supabase.from('live_events').insert({
            artist_id:  artistRow.id,
            venue_name: data.next_show_venue || 'TBA',
            event_date: data.next_show_date,
            city:       data.next_show_city || null,
          })
        }
      }
    }
  }

  const handleNext = async () => {
    const err = validate()
    if (err) { setError(err); return }
    setSaving(true)
    try {
      await saveProgress(step)
      if (step >= STEP_COMPONENTS.length - 1) {
        setShowCelebration(true)
        return
      }
      setStep(s => s + 1)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const handleBack = () => {
    if (step === 0) return
    setStep(s => s - 1)
  }

  // Show celebration screen after final save
  if (showCelebration) {
    return <CelebrationScreen data={data} slug={initialArtist.slug} />
  }

  const StepComponent = STEP_COMPONENTS[step]
  const isLast = step === STEP_COMPONENTS.length - 1

  return (
    <div className="min-h-screen text-white" style={{ background: '#0A0A0F' }}>
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[150px]"
          style={{ backgroundColor: data.primary_color ? data.primary_color + '08' : 'rgba(192,38,211,0.06)' }}
        />
      </div>

      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#0A0A0F' }}
      >
        <div className="flex items-center gap-2.5">
          <LogoMark size={26} />
          <div className="flex flex-col leading-none">
            <span className="font-display font-semibold text-[14px] tracking-[0.04em]">
              PRESSKIT<span style={{ color: '#C026D3' }}>.PRO</span>
            </span>
            <span className="font-mono text-[9px] text-white/25 tracking-[0.18em] mt-1">SETUP</span>
          </div>
        </div>
        <span className="font-mono text-[11px] text-white/25 truncate max-w-[120px]">{data.artist_name || '···'}</span>
      </header>

      {/* Content — natural page scroll, padded for fixed header + nav */}
      <div className="flex flex-col items-center px-5 pt-24 pb-28 relative z-10">
          <div className="w-full max-w-lg">
            {/* Progress */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <ProgressBar currentStep={step} accentColor={data.primary_color || '#C026D3'} />
            </motion.div>

            {/* Step content */}
            <div className="relative">
              <AnimatePresence mode="sync">
                <motion.div
                  key={step}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={stepTransition}
                >
                  <StepComponent data={data} onChange={update} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0, x: [0, -8, 8, -8, 8, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-4 text-rose-400 text-[13px] text-center font-mono"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
      </div>

      {/* Fixed nav at bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 z-20 px-5 py-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: '#0A0A0F' }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-lg mx-auto flex items-center justify-between"
        >
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 0}
            style={{ touchAction: 'manipulation' }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-[13px] text-white/35 hover:text-white disabled:opacity-0 transition-all min-w-[72px]"
          >
            <ArrowLeft className="w-4 h-4" /> Atrás
          </button>

          <motion.button
            type="button"
            onClick={handleNext}
            disabled={saving}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-7 py-3 rounded-xl text-[14px] text-white font-semibold transition-all disabled:opacity-70"
            style={{ touchAction: 'manipulation',
              background: isLast
                ? `linear-gradient(135deg, ${data.primary_color || '#C026D3'}, ${data.secondary_color || '#7C3AED'})`
                : (data.primary_color || '#C026D3'),
            }}
          >
            {saving
              ? <Loader2 className="w-5 h-5 animate-spin" />
              : <>{isLast ? '¡Crear mi kit!' : 'Continuar'}<ArrowRight className="w-5 h-5" /></>
            }
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
