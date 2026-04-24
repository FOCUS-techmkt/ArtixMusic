'use client'
import { motion } from 'framer-motion'
import type { OnboardingData, ArtistRole } from '@/types'
import { staggerContainer, fadeUpItem } from '@/lib/utils'

const ROLES: { value: ArtistRole; icon: string; desc: string }[] = [
  { value: 'DJ', icon: '🎛️', desc: 'Mezclas en vivo' },
  { value: 'Producer', icon: '🎹', desc: 'Producción en estudio' },
  { value: 'Both', icon: '🔥', desc: 'DJ + Productor' },
  { value: 'Live Act', icon: '🎸', desc: 'Acto en vivo' },
]

interface Props {
  data: OnboardingData
  onChange: (partial: Partial<OnboardingData>) => void
}

export default function StepIdentity({ data, onChange }: Props) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8"
    >
      <motion.div variants={fadeUpItem}>
        <h2 className="font-display font-bold text-3xl md:text-4xl mb-2">¿Quién eres?</h2>
        <p className="text-white/50">Tu nombre artístico y tu rol principal en la escena.</p>
      </motion.div>

      <motion.div variants={fadeUpItem} className="flex flex-col gap-2">
        <label className="text-xs font-mono text-white/40 tracking-wider uppercase">Nombre artístico</label>
        <input
          type="text"
          value={data.artist_name}
          onChange={(e) => onChange({ artist_name: e.target.value })}
          placeholder="NXGHT"
          className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-xl font-display font-bold placeholder-white/15 focus:outline-none focus:border-[#C026D3]/60 transition-all"
        />
      </motion.div>

      <motion.div variants={fadeUpItem} className="flex flex-col gap-3">
        <label className="text-xs font-mono text-white/40 tracking-wider uppercase">Rol principal</label>
        <div className="grid grid-cols-2 gap-3">
          {ROLES.map((role) => (
            <button
              key={role.value}
              type="button"
              onClick={() => onChange({ role: role.value })}
              className={`group relative flex flex-col items-start gap-1 p-4 rounded-2xl border transition-all duration-200 ${
                data.role === role.value
                  ? 'border-[#C026D3] bg-[#C026D3]/10 text-white'
                  : 'border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white'
              }`}
            >
              {data.role === role.value && (
                <motion.div
                  layoutId="roleSelector"
                  className="absolute inset-0 rounded-2xl border border-[#C026D3] bg-[#C026D3]/10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative text-2xl">{role.icon}</span>
              <span className="relative font-display font-bold">{role.value}</span>
              <span className="relative text-xs text-white/40">{role.desc}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
