'use client'
import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Upload, Loader2, X, ImageIcon, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { uploadImage } from '@/lib/storage'

interface Props {
  value:      string | null
  onChange:   (url: string) => void
  onRemove?:  () => void
  folder?:    'hero' | 'gallery' | 'releases' | 'logo' | 'avatar' | 'misc'
  label?:     string
  hint?:      string
  aspect?:    '1/1' | '16/9' | '3/1' | '21/9'
  maxMB?:     number
  className?: string
  accentColor?: string
}

export default function ImageUpload({
  value, onChange, onRemove,
  folder     = 'misc',
  label      = 'Subir imagen',
  hint       = 'PNG, JPG, WEBP hasta 10MB',
  aspect     = '16/9',
  maxMB      = 10,
  className  = '',
  accentColor = '#C026D3',
}: Props) {
  const [uploading, setUploading] = useState(false)
  const [error,     setError]     = useState('')
  const [drag,      setDrag]      = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const process = useCallback(async (file: File) => {
    setError('')
    if (!file.type.startsWith('image/')) { setError('Solo se admiten imágenes'); return }
    if (file.size > maxMB * 1024 * 1024)  { setError(`Máximo ${maxMB}MB`); return }

    setUploading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('No autenticado'); setUploading(false); return }

    const url = await uploadImage(file, user.id, folder)
    if (url) onChange(url)
    else setError('Error al subir. Intenta de nuevo.')
    setUploading(false)
  }, [supabase, folder, maxMB, onChange])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDrag(false)
    const file = e.dataTransfer.files[0]
    if (file) process(file)
  }, [process])

  if (value) {
    return (
      <div className={`group relative rounded-2xl overflow-hidden ${className}`}
        style={{ aspectRatio: aspect, background: '#0A0A0E' }}>
        <Image src={value} alt="Imagen subida" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center gap-3">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => inputRef.current?.click()}
            className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white"
            style={{ background: accentColor }}>
            <Upload className="w-3.5 h-3.5" /> Cambiar
          </motion.button>
          {onRemove && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={onRemove}
              className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white"
              style={{ background: 'rgba(239,68,68,0.8)' }}>
              <X className="w-3.5 h-3.5" /> Quitar
            </motion.button>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) process(f) }} />
      </div>
    )
  }

  return (
    <div className={className}>
      <motion.div
        animate={{ borderColor: drag ? accentColor : 'rgba(255,255,255,0.08)' }}
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className="relative flex flex-col items-center justify-center gap-3 rounded-2xl cursor-pointer transition-colors"
        style={{
          aspectRatio:     aspect,
          minHeight:       '120px',
          background:      drag ? accentColor + '0E' : '#0A0A0E',
          border:          `2px dashed ${drag ? accentColor : 'rgba(255,255,255,0.08)'}`,
        }}>

        <AnimatePresence mode="wait">
          {uploading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: accentColor }} />
              <p className="text-xs text-white/40 font-mono">Subiendo...</p>
            </motion.div>
          ) : (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2 px-4 text-center">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: accentColor + '18' }}>
                <ImageIcon className="w-5 h-5" style={{ color: accentColor }} />
              </div>
              <div>
                <p className="text-sm font-medium text-white/60">{label}</p>
                <p className="text-[10px] text-white/25 mt-0.5 font-mono">{hint}</p>
              </div>
              <p className="text-[10px] text-white/20">o arrastra aquí</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 mt-2 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <p className="text-xs text-red-400">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) process(f) }} />
    </div>
  )
}
