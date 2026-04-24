'use client'
import { motion } from 'framer-motion'
import type { OnboardingData, LayoutVariant } from '@/types'
import { LAYOUT_META, deriveArtistPalette } from '@/types'
import { staggerContainer, fadeUpItem } from '@/lib/utils'

const LAYOUT_PREVIEWS: Record<LayoutVariant, React.ReactNode> = {
  centered: (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
      <div className="w-3/4 h-3 rounded-full bg-current opacity-80" />
      <div className="w-1/2 h-2 rounded-full bg-current opacity-30" />
      <div className="flex gap-1 mt-2">
        <div className="w-12 h-4 rounded-full bg-current opacity-20" />
        <div className="w-10 h-4 rounded-full bg-current opacity-20" />
      </div>
    </div>
  ),
  editorial: (
    <div className="w-full h-full flex flex-col justify-end p-4 gap-1">
      <div className="w-full h-5 rounded bg-current opacity-80" />
      <div className="w-3/4 h-5 rounded bg-current opacity-80" />
      <div className="w-1/2 h-3 rounded bg-current opacity-30 mt-1" />
      <div className="flex gap-1 mt-2">
        <div className="w-10 h-3 rounded-full bg-current opacity-20" />
        <div className="w-8 h-3 rounded-full bg-current opacity-20" />
      </div>
    </div>
  ),
  split: (
    <div className="w-full h-full flex gap-0">
      <div className="flex-1 flex flex-col justify-center p-3 gap-2">
        <div className="w-full h-2.5 rounded bg-current opacity-80" />
        <div className="w-4/5 h-2.5 rounded bg-current opacity-80" />
        <div className="w-1/2 h-2 rounded bg-current opacity-30 mt-1" />
      </div>
      <div className="w-2/5 rounded-r-lg bg-current opacity-15" />
    </div>
  ),
  raw: (
    <div className="w-full h-full relative">
      <div className="absolute inset-0 bg-current opacity-10 rounded-lg" />
      <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1">
        <div className="w-4/5 h-3 rounded bg-current opacity-90" />
        <div className="w-1/2 h-2 rounded bg-current opacity-40" />
      </div>
      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-current opacity-30" />
    </div>
  ),
}

interface Props {
  data: OnboardingData
  onChange: (partial: Partial<OnboardingData>) => void
}

export default function StepLayout({ data, onChange }: Props) {
  const palette = deriveArtistPalette(data.primary_color, data.secondary_color, data.bg_dark)
  const layouts = Object.keys(LAYOUT_META) as LayoutVariant[]

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8"
    >
      <motion.div variants={fadeUpItem}>
        <h2 className="font-display font-bold text-3xl md:text-4xl mb-2">
          Estructura del kit
        </h2>
        <p className="text-white/50">
          ¿Cómo quieres presentar tu historia? Esto controla cómo está organizada
          la sección hero y la jerarquía visual de todo el kit.
        </p>
      </motion.div>

      <motion.div variants={fadeUpItem} className="grid grid-cols-2 gap-4">
        {layouts.map((variant) => {
          const meta = LAYOUT_META[variant]
          const isActive = data.layout_variant === variant

          return (
            <button
              key={variant}
              type="button"
              onClick={() => onChange({ layout_variant: variant })}
              className="group flex flex-col gap-3 text-left"
            >
              {/* Preview box */}
              <motion.div
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="relative w-full rounded-2xl overflow-hidden"
                style={{
                  height: '120px',
                  backgroundColor: palette.bg,
                  color: palette.primary,
                  outline: isActive ? `2px solid ${data.primary_color}` : '2px solid transparent',
                  outlineOffset: '3px',
                  transition: 'outline-color .2s',
                }}
              >
                {/* Gradient wash */}
                <div
                  className="absolute inset-0 opacity-25"
                  style={{
                    background: `linear-gradient(135deg, ${data.primary_color}44, ${data.secondary_color}22)`,
                  }}
                />

                <div className="relative w-full h-full" style={{ color: data.primary_color }}>
                  {LAYOUT_PREVIEWS[variant]}
                </div>

                {/* Active check */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ backgroundColor: data.primary_color }}
                  >
                    ✓
                  </motion.div>
                )}
              </motion.div>

              {/* Label */}
              <div>
                <p
                  className="font-display font-bold text-sm transition-colors"
                  style={{ color: isActive ? data.primary_color : 'rgba(255,255,255,0.7)' }}
                >
                  {meta.label}
                </p>
                <p className="text-xs text-white/30 mt-0.5 leading-relaxed">
                  {meta.desc}
                </p>
              </div>
            </button>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
