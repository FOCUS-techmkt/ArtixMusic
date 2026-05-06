'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, ExternalLink, Share2 } from 'lucide-react'
import { PulseDot } from '@/components/dashboard/PulseDot'
import type { PressMeta } from '@/app/(dashboard)/dashboard/_components/DashboardContent'
import { ARTIST } from '@/lib/dashboard-mocks'

interface Props { pressMeta?: PressMeta }

export function PresskitURLCard({ pressMeta }: Props) {
  const [copied, setCopied] = useState(false)
  const url     = pressMeta?.url ?? ARTIST.url
  const fullUrl = url.startsWith('http') ? url : `https://${url}`

  function handleCopy() {
    navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({ title: `${pressMeta?.artistName ?? ARTIST.name} – Presskit`, url: fullUrl }).catch(() => null)
    } else {
      handleCopy()
    }
  }

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden"
      style={{ border: '1px solid rgba(192,38,211,0.18)', background: 'linear-gradient(180deg, rgba(192,38,211,0.06) 0%, rgba(192,38,211,0) 100%)' }}
    >
      {/* Toast */}
      <AnimatePresence>
        {copied && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold text-white shadow-lg"
            style={{ background: '#22C55E', boxShadow: '0 4px 20px rgba(34,197,94,0.35)' }}
          >
            <Check className="w-3.5 h-3.5" /> Link copiado
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        <PulseDot />
        <span className="font-mono text-[10px] text-magenta-400 uppercase tracking-[0.22em]">
          Tu presskit — en vivo
        </span>
      </div>

      <div
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
        style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="font-mono text-[12px] text-white flex-1 truncate">{url}</span>
        <button
          onClick={handleCopy}
          aria-label={copied ? 'Copiado' : 'Copiar URL'}
          className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
          style={{ color: copied ? '#34D399' : 'rgba(255,255,255,0.4)' }}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white text-[12px] font-semibold transition-opacity hover:opacity-90"
          style={{ background: '#C026D3' }}
        >
          <ExternalLink className="w-3.5 h-3.5" /> Abrir
        </a>
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white text-[12px] font-semibold transition-colors hover:bg-white/10"
          style={{ border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <Share2 className="w-3.5 h-3.5" /> Compartir
        </button>
      </div>
    </div>
  )
}
