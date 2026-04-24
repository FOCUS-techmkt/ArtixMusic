'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import type { OnboardingData } from '@/types'
import { COLOR_PRESETS, deriveArtistPalette } from '@/types'
import { staggerContainer, fadeUpItem } from '@/lib/utils'

interface Props {
  data: OnboardingData
  onChange: (partial: Partial<OnboardingData>) => void
}

/** Live mini-presskit preview using the artist's chosen colors */
function LiveColorPreview({ data }: { data: OnboardingData }) {
  const palette = deriveArtistPalette(data.primary_color, data.secondary_color, data.bg_dark)

  return (
    <motion.div
      layout
      className="relative w-full rounded-2xl overflow-hidden border"
      style={{ height: '200px', backgroundColor: palette.bg, borderColor: palette.border }}
    >
      {/* Gradient splash */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse at 30% 40%, ${data.primary_color}88, transparent 60%),
                       radial-gradient(ellipse at 80% 70%, ${data.secondary_color}55, transparent 50%)`,
        }}
      />

      {/* Fake hero content */}
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        <div className="flex flex-col gap-2">
          <div
            className="font-display font-extrabold text-3xl tracking-tight"
            style={{
              color: palette.text,
              textShadow: `0 0 30px ${data.primary_color}88`,
            }}
          >
            {data.artist_name || 'TU NOMBRE'}
          </div>
          <div className="flex gap-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-mono"
              style={{ backgroundColor: data.primary_color + '22', color: data.primary_color, border: `1px solid ${data.primary_color}55` }}
            >
              {data.genre.toUpperCase()}
            </span>
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-mono"
              style={{ backgroundColor: data.secondary_color + '22', color: data.secondary_color, border: `1px solid ${data.secondary_color}55` }}
            >
              {data.role.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-end">
          {/* Fake stat */}
          <div className="flex gap-3">
            {['20M', '142K', '48+'].map((v, i) => (
              <div
                key={i}
                className="flex flex-col items-center px-3 py-2 rounded-xl"
                style={{ backgroundColor: palette.surface, border: `1px solid ${palette.border}` }}
              >
                <span className="font-bold text-sm" style={{ color: data.primary_color }}>{v}</span>
                <span className="text-[9px] font-mono opacity-50" style={{ color: palette.textMuted }}>STAT</span>
              </div>
            ))}
          </div>
          {/* Accent dot */}
          <div
            className="w-10 h-10 rounded-full"
            style={{ background: `linear-gradient(135deg, ${data.primary_color}, ${data.secondary_color})` }}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default function StepColors({ data, onChange }: Props) {
  const [customPrimary, setCustomPrimary] = useState(data.primary_color)
  const [customSecondary, setCustomSecondary] = useState(data.secondary_color)

  const applyPreset = (primary: string, secondary: string) => {
    setCustomPrimary(primary)
    setCustomSecondary(secondary)
    onChange({ primary_color: primary, secondary_color: secondary })
  }

  const handlePrimaryChange = (hex: string) => {
    setCustomPrimary(hex)
    onChange({ primary_color: hex })
  }

  const handleSecondaryChange = (hex: string) => {
    setCustomSecondary(hex)
    onChange({ secondary_color: hex })
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8"
    >
      <motion.div variants={fadeUpItem}>
        <h2 className="font-display font-bold text-3xl md:text-4xl mb-2">
          Los colores de tu marca
        </h2>
        <p className="text-white/50">
          Elige los colores que te representan. Tu press kit usará estos colores
          de forma única — ningún otro artista tendrá la misma combinación.
        </p>
      </motion.div>

      {/* Live preview */}
      <motion.div variants={fadeUpItem}>
        <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-3">
          Vista previa en tiempo real
        </p>
        <LiveColorPreview data={data} />
      </motion.div>

      {/* Color pickers */}
      <motion.div variants={fadeUpItem} className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono text-white/40 uppercase tracking-wider">
            Color principal
          </label>
          <div className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5">
            <input
              type="color"
              value={customPrimary}
              onChange={(e) => handlePrimaryChange(e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0"
              style={{ appearance: 'none' }}
            />
            <div>
              <p className="text-sm font-mono text-white">{customPrimary.toUpperCase()}</p>
              <p className="text-xs text-white/30">Acento principal</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono text-white/40 uppercase tracking-wider">
            Color secundario
          </label>
          <div className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5">
            <input
              type="color"
              value={customSecondary}
              onChange={(e) => handleSecondaryChange(e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0"
              style={{ appearance: 'none' }}
            />
            <div>
              <p className="text-sm font-mono text-white">{customSecondary.toUpperCase()}</p>
              <p className="text-xs text-white/30">Glow y detalles</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dark / Light toggle */}
      <motion.div variants={fadeUpItem} className="flex flex-col gap-3">
        <label className="text-xs font-mono text-white/40 uppercase tracking-wider">
          Fondo
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { dark: true,  icon: Moon,  label: 'Oscuro',  desc: 'Negro profundo' },
            { dark: false, icon: Sun,   label: 'Claro',   desc: 'Blanco brillante' },
          ].map(({ dark, icon: Icon, label, desc }) => (
            <button
              key={String(dark)}
              type="button"
              onClick={() => onChange({ bg_dark: dark })}
              className="relative flex items-center gap-3 p-4 rounded-2xl border transition-all duration-200"
              style={{
                borderColor: data.bg_dark === dark ? data.primary_color : 'rgba(255,255,255,0.1)',
                backgroundColor: data.bg_dark === dark
                  ? data.primary_color + '12'
                  : 'rgba(255,255,255,0.02)',
              }}
            >
              {data.bg_dark === dark && (
                <motion.div
                  layoutId="bgToggle"
                  className="absolute inset-0 rounded-2xl"
                  style={{ border: `1px solid ${data.primary_color}` }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className="w-5 h-5 relative" style={{ color: data.bg_dark === dark ? data.primary_color : 'rgba(255,255,255,0.3)' }} />
              <div className="text-left relative">
                <p className="font-semibold text-sm text-white">{label}</p>
                <p className="text-xs text-white/30">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Preset palettes */}
      <motion.div variants={fadeUpItem} className="flex flex-col gap-3">
        <label className="text-xs font-mono text-white/40 uppercase tracking-wider">
          Inspiración — paletas de referencia
        </label>
        <div className="flex flex-wrap gap-2">
          {COLOR_PRESETS.map((preset) => {
            const isActive =
              data.primary_color === preset.primary &&
              data.secondary_color === preset.secondary

            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset.primary, preset.secondary)}
                className="group flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-mono transition-all duration-200"
                style={{
                  borderColor: isActive ? preset.primary : 'rgba(255,255,255,0.1)',
                  backgroundColor: isActive ? preset.primary + '15' : 'rgba(255,255,255,0.02)',
                  color: isActive ? preset.primary : 'rgba(255,255,255,0.4)',
                }}
              >
                {/* Dual-color swatch */}
                <span className="flex rounded-full overflow-hidden w-4 h-4 flex-shrink-0">
                  <span className="w-1/2 h-full" style={{ backgroundColor: preset.primary }} />
                  <span className="w-1/2 h-full" style={{ backgroundColor: preset.secondary }} />
                </span>
                {preset.name}
              </button>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}
