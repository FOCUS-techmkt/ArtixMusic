'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import type { VisualTheme } from '@/types'
import { THEME_CONFIGS, THEME_LABELS } from '@/types'

const THEME_DESCRIPTIONS: Record<VisualTheme, string> = {
  dark_rave:       'Underground · Berlín · 6am',
  minimal_pro:     'Estudio · Prensa · Premium',
  cyber_neon:      'Futuro · Digital · Neón',
  editorial_clean: 'Artístico · Limpio · Textural',
}

// Mini presskit preview rendered for each theme
function ThemePreview({ theme, active }: { theme: VisualTheme; active: boolean }) {
  const cfg = THEME_CONFIGS[theme]

  return (
    <div
      className="w-full h-full rounded-xl overflow-hidden relative select-none"
      style={{ backgroundColor: cfg.bg }}
    >
      {/* Gradient wash */}
      <div
        className="absolute inset-0 opacity-35"
        style={{ background: cfg.gradient }}
      />

      {/* Fake hero image strip */}
      <div
        className="absolute top-0 inset-x-0 h-[42%] opacity-60"
        style={{
          background: `linear-gradient(160deg, ${cfg.accent}33 0%, ${cfg.bg} 100%)`,
        }}
      />

      {/* Content mockup */}
      <div className="absolute inset-0 flex flex-col justify-between p-3">
        {/* top: name bars */}
        <div className="flex flex-col gap-1 mt-2">
          <div
            className="h-2.5 rounded-full"
            style={{ width: '70%', backgroundColor: cfg.text, opacity: 0.85 }}
          />
          <div
            className="h-1.5 rounded-full"
            style={{ width: '45%', backgroundColor: cfg.textMuted, opacity: 0.4 }}
          />
          {/* genre tag */}
          <div
            className="mt-1 h-4 rounded-full"
            style={{
              width: '38%',
              backgroundColor: cfg.accent,
              opacity: 0.65,
            }}
          />
        </div>

        {/* middle: fake stat cards */}
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-1 rounded-lg"
              style={{
                height: '28px',
                backgroundColor: cfg.surface,
                border: `1px solid ${cfg.border}`,
                opacity: 0.8,
              }}
            />
          ))}
        </div>

        {/* bottom: fake track list */}
        <div className="flex flex-col gap-1">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 rounded-lg px-2"
              style={{
                height: '22px',
                backgroundColor: cfg.surface,
                border: `1px solid ${cfg.border}`,
              }}
            >
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: cfg.accent, opacity: 0.7 }}
              />
              <div
                className="h-1.5 rounded-full flex-1"
                style={{ backgroundColor: cfg.textMuted, opacity: 0.3 }}
              />
            </div>
          ))}
        </div>

        {/* active glow overlay */}
        {active && (
          <motion.div
            layoutId="activeThemeGlow"
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              boxShadow: `inset 0 0 0 2px ${cfg.accent}, 0 0 20px ${cfg.accent}44`,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
      </div>
    </div>
  )
}

interface Props {
  value: VisualTheme
  onChange: (theme: VisualTheme) => void
  /** If true, shows a more compact grid (for dashboard). Default: false (onboarding full width) */
  compact?: boolean
  saving?: boolean
}

export default function ThemeSwitcher({ value, onChange, compact = false, saving = false }: Props) {
  const [hovered, setHovered] = useState<VisualTheme | null>(null)
  const themes = Object.keys(THEME_CONFIGS) as VisualTheme[]
  const preview = hovered ?? value

  return (
    <div className={compact ? 'flex flex-col gap-4' : 'flex flex-col gap-6'}>
      {/* Live preview panel (hidden in compact mode) */}
      {!compact && (
        <AnimatePresence mode="wait">
          <motion.div
            key={preview}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full rounded-2xl overflow-hidden border"
            style={{
              height: '200px',
              borderColor: THEME_CONFIGS[preview].border,
            }}
          >
            <ThemePreview theme={preview} active={false} />
          </motion.div>
        </AnimatePresence>
      )}

      {/* Theme grid */}
      <div
        className={`grid gap-3 ${
          compact ? 'grid-cols-4' : 'grid-cols-2 md:grid-cols-4'
        }`}
      >
        {themes.map((theme) => {
          const cfg = THEME_CONFIGS[theme]
          const isActive = value === theme

          return (
            <button
              key={theme}
              type="button"
              disabled={saving}
              onClick={() => onChange(theme)}
              onMouseEnter={() => setHovered(theme)}
              onMouseLeave={() => setHovered(null)}
              className="group flex flex-col gap-2 cursor-pointer disabled:opacity-60"
            >
              {/* Card */}
              <motion.div
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="relative rounded-xl overflow-hidden"
                style={{
                  height: compact ? '70px' : '110px',
                  outline: isActive
                    ? `2px solid ${cfg.accent}`
                    : '2px solid transparent',
                  outlineOffset: '2px',
                  transition: 'outline-color .2s',
                }}
              >
                <ThemePreview theme={theme} active={isActive} />

                {/* Selected checkmark */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: cfg.accent }}
                    >
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Label */}
              <div className="text-left">
                <p
                  className="text-xs font-semibold leading-tight transition-colors"
                  style={{ color: isActive ? cfg.accent : 'rgba(255,255,255,0.7)' }}
                >
                  {THEME_LABELS[theme]}
                </p>
                {!compact && (
                  <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {THEME_DESCRIPTIONS[theme]}
                  </p>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
