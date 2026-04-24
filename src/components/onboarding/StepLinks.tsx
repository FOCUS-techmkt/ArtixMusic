'use client'
import { motion } from 'framer-motion'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import { Upload, Music2, Instagram, Youtube, Headphones } from 'lucide-react'
import type { OnboardingData } from '@/types'
import { staggerContainer, fadeUpItem } from '@/lib/utils'

const LINK_FIELDS = [
  { key: 'soundcloud', label: 'SoundCloud', icon: Headphones, placeholder: 'https://soundcloud.com/tu-nombre' },
  { key: 'spotify', label: 'Spotify', icon: Music2, placeholder: 'https://open.spotify.com/artist/...' },
  { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/tu_nombre' },
  { key: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/@tu-canal' },
] as const

interface Props {
  data: OnboardingData
  onChange: (partial: Partial<OnboardingData>) => void
}

export default function StepLinks({ data, onChange }: Props) {
  const updateLink = (key: string, value: string) => {
    onChange({ links: { ...data.links, [key]: value } })
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8"
    >
      <motion.div variants={fadeUpItem}>
        <h2 className="font-display font-bold text-3xl md:text-4xl mb-2">Tus links y medios</h2>
        <p className="text-white/50">Sube tu foto principal y conecta tus plataformas.</p>
      </motion.div>

      {/* Photo upload */}
      <motion.div variants={fadeUpItem} className="flex flex-col gap-3">
        <label className="text-xs font-mono text-white/40 tracking-wider uppercase">Foto / Arte principal</label>
        <div className="flex gap-4 items-start">
          {data.photo_url ? (
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-white/20 shrink-0">
              <Image src={data.photo_url} alt="Foto artista" fill className="object-cover" />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-2xl border border-dashed border-white/20 flex items-center justify-center shrink-0">
              <Upload className="w-6 h-6 text-white/20" />
            </div>
          )}
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? 'presskit_unsigned'}
            onSuccess={(result) => {
              if (result.info && typeof result.info === 'object' && 'secure_url' in result.info) {
                onChange({ photo_url: result.info.secure_url as string })
              }
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="px-4 py-3 rounded-xl border border-white/10 text-white/60 hover:border-[#C026D3]/60 hover:text-white text-sm transition-all flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                {data.photo_url ? 'Cambiar foto' : 'Subir foto'}
              </button>
            )}
          </CldUploadWidget>
        </div>
      </motion.div>

      {/* Links */}
      <motion.div variants={fadeUpItem} className="flex flex-col gap-3">
        <label className="text-xs font-mono text-white/40 tracking-wider uppercase">Plataformas</label>
        {LINK_FIELDS.map(({ key, label, icon: Icon, placeholder }) => (
          <div key={key} className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-white/30 shrink-0" />
            <input
              type="url"
              value={(data.links as Record<string, string>)[key] ?? ''}
              onChange={(e) => updateLink(key, e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/15 focus:outline-none focus:border-[#C026D3]/60 transition-all"
            />
          </div>
        ))}
      </motion.div>

      {/* Booking email */}
      <motion.div variants={fadeUpItem} className="flex flex-col gap-2">
        <label className="text-xs font-mono text-white/40 tracking-wider uppercase">Email de booking</label>
        <input
          type="email"
          value={data.booking_email}
          onChange={(e) => onChange({ booking_email: e.target.value })}
          placeholder="booking@tumanager.com"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/15 focus:outline-none focus:border-[#C026D3]/60 transition-all"
        />
      </motion.div>
    </motion.div>
  )
}
