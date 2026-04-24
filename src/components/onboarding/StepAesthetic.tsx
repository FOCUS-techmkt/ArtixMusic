'use client'
import { motion } from 'framer-motion'
import type { OnboardingData } from '@/types'
import { staggerContainer, fadeUpItem } from '@/lib/utils'
import ThemeSwitcher from '@/components/ui/ThemeSwitcher'

interface Props {
  data: OnboardingData
  onChange: (partial: Partial<OnboardingData>) => void
}

export default function StepAesthetic({ data, onChange }: Props) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8"
    >
      <motion.div variants={fadeUpItem}>
        <h2 className="font-display font-bold text-3xl md:text-4xl mb-2">Elige la energía visual</h2>
        <p className="text-white/50">
          Esta estética define toda la experiencia de tu press kit.
          Pasa el cursor por cada opción para ver una vista previa.
        </p>
      </motion.div>

      <motion.div variants={fadeUpItem}>
        <ThemeSwitcher
          value={data.visual_theme}
          onChange={(theme) => onChange({ visual_theme: theme })}
        />
      </motion.div>
    </motion.div>
  )
}
