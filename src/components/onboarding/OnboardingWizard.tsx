'use client'
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import ProgressBar from './ProgressBar'
import StepIdentity from './StepIdentity'
import StepSound from './StepSound'
import StepAchievements from './StepAchievements'
import StepLinks from './StepLinks'
import StepColors from './StepColors'
import StepLayout from './StepLayout'
import type { Artist, OnboardingData, OnboardingStatus } from '@/types'
import { ONBOARDING_STEPS } from '@/types'
import { DEFAULT_CONFIGS } from '@/types/sections'

const stepVariants = {
  enter:  (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
}
const stepTransition = { type: 'tween' as const, ease: 'easeInOut', duration: 0.28 }

const STEP_COMPONENTS = [
  StepIdentity,
  StepSound,
  StepAchievements,
  StepLinks,
  StepColors,
  StepLayout,
]

function initialData(artist: Artist): OnboardingData {
  return {
    artist_name:     artist.artist_name,
    role:            artist.role,
    sound_words:     artist.sound_words ?? [],
    genre:           artist.genre,
    achievements:    artist.achievements ?? [],
    bio:             artist.bio ?? '',
    photo_url:       artist.photo_url,
    logo_url:        artist.logo_url,
    links:           artist.links ?? {},
    booking_email:   artist.booking_email ?? '',
    primary_color:   (artist as any).primary_color   ?? '#C026D3',
    secondary_color: (artist as any).secondary_color ?? '#7C3AED',
    bg_dark:         (artist as any).bg_dark          ?? true,
    layout_variant:  (artist as any).layout_variant   ?? 'centered',
  }
}

export default function OnboardingWizard({ initialArtist }: { initialArtist: Artist }) {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep]       = useState(() => {
    const idx = ONBOARDING_STEPS.indexOf(initialArtist.onboarding_step as OnboardingStatus)
    return idx >= 0 ? idx : 0
  })
  const [dir, setDir]         = useState(1)
  const [data, setData]       = useState<OnboardingData>(() => initialData(initialArtist))
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  const update = useCallback((partial: Partial<OnboardingData>) => {
    setData(p => ({ ...p, ...partial }))
    setError('')
  }, [])

  const validate = (): string | null => {
    if (step === 0 && !data.artist_name.trim()) return 'Escribe tu nombre artístico'
    if (step === 1 && data.sound_words.filter(Boolean).length < 3) return 'Escribe las 3 palabras que definen tu sonido'
    return null
  }

  const saveProgress = async (stepIdx: number) => {
    const isLast = stepIdx >= STEP_COMPONENTS.length - 1
    const onboarding_step: OnboardingStatus = isLast ? 'complete' : ONBOARDING_STEPS[stepIdx + 1]

    const { error: dbError } = await supabase
      .from('artists')
      .update({
        artist_name:     data.artist_name,
        role:            data.role,
        sound_words:     data.sound_words,
        genre:           data.genre,
        achievements:    data.achievements,
        bio:             data.bio,
        photo_url:       data.photo_url,
        logo_url:        data.logo_url,
        links:           data.links,
        booking_email:   data.booking_email,
        primary_color:   data.primary_color,
        secondary_color: data.secondary_color,
        bg_dark:         data.bg_dark,
        layout_variant:  data.layout_variant,
        onboarding_step,
        is_published: isLast,
      })
      .eq('user_id', initialArtist.user_id)

    if (dbError) throw new Error(dbError.message)

    // On completion, pre-configure sections with onboarding data
    if (isLast) {
      const { data: artist } = await supabase
        .from('artists')
        .select('id')
        .eq('user_id', initialArtist.user_id)
        .maybeSingle()

      if (artist?.id) {
        const { data: sections } = await supabase
          .from('sections')
          .select('id, name, config')
          .eq('artist_id', artist.id)

        if (sections?.length) {
          await Promise.all(sections.map(s => {
            const base = { ...(DEFAULT_CONFIGS[s.name] ?? {}) } as Record<string, unknown>
            let patch: Record<string, unknown> = {}

            if (s.name === 'hero') {
              patch = {
                ...base,
                tagline:     data.artist_name,
                sub_tagline: [data.role, data.genre].filter(Boolean).join(' · '),
                supporters:  data.sound_words ?? [],
                particles:   true,
              }
            } else if (s.name === 'bio') {
              patch = {
                ...base,
                text:    data.bio ? `<p>${data.bio}</p>` : base.text,
                genres:  [data.genre].filter(Boolean),
                badges:  (data.achievements ?? []).slice(0, 3).map((a: { title: string }) => a.title),
              }
            } else if (s.name === 'contact') {
              patch = {
                ...base,
                cta_url: data.booking_email ? `mailto:${data.booking_email}` : '',
              }
            } else {
              patch = base
            }

            // Only update if config is empty
            if (!s.config || Object.keys(s.config).length === 0) {
              return supabase.from('sections').update({ config: patch }).eq('id', s.id)
            }
            return Promise.resolve()
          }))
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
      if (step >= STEP_COMPONENTS.length - 1) { router.push('/panel'); return }
      setDir(1)
      setStep(s => s + 1)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const handleBack = () => {
    if (step === 0) return
    setDir(-1)
    setStep(s => s - 1)
  }

  const StepComponent = STEP_COMPONENTS[step]
  const isLast = step === STEP_COMPONENTS.length - 1
  const accentColor = data.primary_color || '#C026D3'

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 border-b border-white/5">
        <span className="font-display font-bold tracking-widest">
          PRESSKIT<span style={{ color: accentColor }}>.PRO</span>
        </span>
        <span className="text-xs font-mono text-white/30">{data.artist_name || 'Setup'}</span>
      </header>

      {/* Background glow from artist's color */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          key={`${step}-${accentColor}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[150px]"
          style={{ backgroundColor: accentColor + '0A' }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {/* Progress */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <ProgressBar currentStep={step} accentColor={accentColor} />
          </motion.div>

          {/* Step content */}
          <div className="relative">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={step}
                custom={dir}
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
                initial={{ opacity: 0, y: -8, x: 0 }}
                animate={{ opacity: 1, y: 0, x: [0, -8, 8, -8, 8, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-4 text-red-400 text-sm text-center"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Nav */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="mt-10 flex items-center justify-between"
          >
            <button
              type="button" onClick={handleBack} disabled={step === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/40 hover:text-white disabled:opacity-0 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Atrás
            </button>

            <motion.button
              type="button" onClick={handleNext} disabled={saving}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-8 py-3 rounded-full text-white font-semibold transition-colors disabled:opacity-70"
              style={{ backgroundColor: accentColor }}
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>{isLast ? '¡Publicar mi kit!' : 'Continuar'}<ArrowRight className="w-5 h-5" /></>
              )}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
