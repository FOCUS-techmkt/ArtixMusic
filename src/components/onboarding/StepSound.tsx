'use client'
import { motion } from 'framer-motion'
import type { OnboardingData, GenreType } from '@/types'
import { staggerContainer, fadeUpItem } from '@/lib/utils'

const GENRES: GenreType[] = ['Techno', 'House', 'Trap', 'Reggaeton', 'Afrobeats', 'Ambient', 'Other']

interface Props {
  data: OnboardingData
  onChange: (partial: Partial<OnboardingData>) => void
}

export default function StepSound({ data, onChange }: Props) {
  const updateWord = (index: number, value: string) => {
    const updated = [...data.sound_words]
    updated[index] = value
    onChange({ sound_words: updated })
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8"
    >
      <motion.div variants={fadeUpItem}>
        <h2 className="font-display font-bold text-3xl md:text-4xl mb-2">Tu sonido en 3 palabras</h2>
        <p className="text-white/50">¿Cómo describirías tu música a alguien que no te conoce?</p>
      </motion.div>

      <motion.div variants={fadeUpItem} className="flex flex-col gap-3">
        <label className="text-xs font-mono text-white/40 tracking-wider uppercase">3 palabras que definen tu sonido</label>
        <div className="flex gap-3">
          {[0, 1, 2].map((i) => (
            <input
              key={i}
              type="text"
              value={data.sound_words[i] ?? ''}
              onChange={(e) => updateWord(i, e.target.value)}
              placeholder={['oscuro', 'hipnótico', 'directo'][i]}
              maxLength={20}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-center font-display font-semibold placeholder-white/15 focus:outline-none focus:border-[#C026D3]/60 transition-all"
            />
          ))}
        </div>
        {data.sound_words.filter(Boolean).length === 3 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[#E879F9] text-sm font-mono"
          >
            "{data.sound_words.join(' · ')}"
          </motion.p>
        )}
      </motion.div>

      <motion.div variants={fadeUpItem} className="flex flex-col gap-3">
        <label className="text-xs font-mono text-white/40 tracking-wider uppercase">Género principal</label>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => onChange({ genre })}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
                data.genre === genre
                  ? 'border-[#C026D3] bg-[#C026D3]/15 text-[#E879F9]'
                  : 'border-white/10 text-white/50 hover:border-white/20 hover:text-white'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
