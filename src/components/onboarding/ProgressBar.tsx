'use client'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const STEP_LABELS = ['Identidad', 'Sonido', 'Logros', 'Links', 'Colores', 'Layout']

interface ProgressBarProps {
  currentStep: number
  accentColor?: string
}

export default function ProgressBar({ currentStep, accentColor = '#C026D3' }: ProgressBarProps) {
  const total    = STEP_LABELS.length
  const progress = (currentStep / (total - 1)) * 100

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="flex justify-between mb-3">
        {STEP_LABELS.map((label, i) => (
          <span
            key={label}
            className="text-xs font-mono transition-colors duration-300"
            style={{ color: i <= currentStep ? accentColor : 'rgba(255,255,255,0.2)' }}
          >
            {i < currentStep ? <Check className="w-3 h-3 inline" /> : i + 1}
          </span>
        ))}
      </div>

      <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: accentColor }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      <p className="mt-2 text-right text-xs font-mono text-white/30">
        Paso {currentStep + 1} de {total}
      </p>
    </div>
  )
}
