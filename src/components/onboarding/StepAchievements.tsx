'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'
import type { OnboardingData, Achievement } from '@/types'
import { staggerContainer, fadeUpItem } from '@/lib/utils'

const PLACEHOLDERS: Achievement[] = [
  { title: 'Fabric Residency 2024', description: 'Residente mensual en Fabric London' },
  { title: 'Sonar Festival 2023', description: 'Headliner en SonarNight — 4,200 asistentes' },
  { title: '20M Streams', description: 'Reproducciones acumuladas en SoundCloud + Spotify' },
]

interface Props {
  data: OnboardingData
  onChange: (partial: Partial<OnboardingData>) => void
}

export default function StepAchievements({ data, onChange }: Props) {
  const achievements = data.achievements.length > 0 ? data.achievements : [{ title: '', description: '' }]

  const update = (index: number, field: keyof Achievement, value: string) => {
    const updated = [...achievements]
    updated[index] = { ...updated[index], [field]: value }
    onChange({ achievements: updated })
  }

  const add = () => {
    if (achievements.length >= 5) return
    onChange({ achievements: [...achievements, { title: '', description: '' }] })
  }

  const remove = (index: number) => {
    onChange({ achievements: achievements.filter((_, i) => i !== index) })
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8"
    >
      <motion.div variants={fadeUpItem}>
        <h2 className="font-display font-bold text-3xl md:text-4xl mb-2">Tus 3 mayores logros</h2>
        <p className="text-white/50">Residencias, festivales, lanzamientos, hitos de reproducciones…</p>
      </motion.div>

      <motion.div variants={fadeUpItem} className="flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {achievements.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative p-4 rounded-2xl border border-white/10 bg-white/[0.03] flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#C026D3] w-5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <input
                  type="text"
                  value={a.title}
                  onChange={(e) => update(i, 'title', e.target.value)}
                  placeholder={PLACEHOLDERS[i]?.title ?? 'Logro destacado'}
                  className="flex-1 bg-transparent text-white font-display font-semibold placeholder-white/20 focus:outline-none"
                />
                {achievements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="text-white/20 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <input
                type="text"
                value={a.description}
                onChange={(e) => update(i, 'description', e.target.value)}
                placeholder={PLACEHOLDERS[i]?.description ?? 'Descripción breve…'}
                className="w-full bg-transparent text-white/50 text-sm placeholder-white/15 focus:outline-none pl-7"
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {achievements.length < 5 && (
          <button
            type="button"
            onClick={add}
            className="flex items-center gap-2 text-sm text-white/30 hover:text-[#E879F9] transition-colors py-2"
          >
            <Plus className="w-4 h-4" />
            Añadir logro
          </button>
        )}
      </motion.div>

      <motion.div variants={fadeUpItem} className="flex flex-col gap-2">
        <label className="text-xs font-mono text-white/40 tracking-wider uppercase">Bio breve (opcional)</label>
        <textarea
          value={data.bio}
          onChange={(e) => onChange({ bio: e.target.value })}
          placeholder="Describe quién eres, tu trayectoria y lo que te hace único…"
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/15 focus:outline-none focus:border-[#C026D3]/60 transition-all resize-none"
        />
      </motion.div>
    </motion.div>
  )
}
