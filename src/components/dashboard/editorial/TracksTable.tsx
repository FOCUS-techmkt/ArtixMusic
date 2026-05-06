'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Music } from 'lucide-react'
import { Sparkline } from '@/components/dashboard/Sparkline'
import { formatNumber } from '@/lib/utils'
import { TRACKS, type TrackItem } from '@/lib/dashboard-mocks'

interface Props { tracks?: TrackItem[] }

export function TracksTable({ tracks }: Props) {
  const data = tracks ?? TRACKS
  const isEmpty = data.length === 0

  return (
    <div className="border border-white/[0.06] rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.015)' }}>
      <div className="flex items-baseline justify-between px-6 py-5 border-b border-white/[0.04]">
        <h2 className="font-display font-semibold text-[18px] tracking-[-0.02em]">
          Tus tracks{' '}
          <span className="font-serif italic font-normal text-white/40">esta semana</span>
        </h2>
        <Link href="/dashboard?tab=editor" className="font-mono text-[10px] text-white/25 uppercase tracking-[0.18em] hover:text-white/50 transition-colors">
          Gestionar →
        </Link>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center gap-3 py-12 px-6 text-center">
          <Music className="w-8 h-8 text-white/10" />
          <div>
            <p className="text-[13px] text-white/40 mb-1">Sin tracks configurados</p>
            <Link href="/dashboard?tab=editor" className="text-[12px] font-mono text-magenta-400 hover:text-magenta-300 transition-colors">
              Añadir tracks en el editor →
            </Link>
          </div>
        </div>
      ) : (
        <div>
          {data.map((track, i) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid items-center gap-4 px-6 py-[14px] hover:bg-white/[0.02] transition-colors border-t border-white/[0.04]"
              style={{ gridTemplateColumns: track.sparkData.some(v => v > 0) ? '28px 1fr auto auto auto' : '28px 1fr auto' }}
            >
              <span className="font-serif italic text-[22px] text-white/25 leading-none text-right">{i + 1}</span>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-white truncate">{track.title}</p>
                <p className="font-mono text-[10px] text-white/35 uppercase tracking-[0.1em]">
                  {track.label}{track.length ? ` · ${track.length}` : ''}
                </p>
              </div>
              {track.sparkData.some(v => v > 0) && (
                <Sparkline data={track.sparkData} width={72} height={24} color={track.positive ? '#C026D3' : '#6B7280'} fill={false} strokeWidth={1.4} />
              )}
              {track.plays > 0 && (
                <span className="font-display text-[13px] font-semibold text-white/70 tabular-nums text-right min-w-[64px]">
                  {formatNumber(track.plays)}
                </span>
              )}
              {track.plays > 0 && (
                <span className={`font-mono text-[11px] text-right min-w-[44px] ${track.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {track.change !== 0 ? `${track.positive ? '+' : '−'}${Math.abs(track.change)}%` : '—'}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
