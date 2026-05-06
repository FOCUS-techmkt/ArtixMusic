'use client'
import Link from 'next/link'
import { Bell, Search, ExternalLink } from 'lucide-react'
import { PulseDot } from '@/components/dashboard/PulseDot'
import type { PressMeta } from '@/app/(dashboard)/dashboard/_components/DashboardContent'
import { ARTIST } from '@/lib/dashboard-mocks'

interface Props { pressMeta?: PressMeta }

export function TopBar({ pressMeta }: Props) {
  const url = pressMeta?.url ?? ARTIST.url

  return (
    <header className="flex items-center gap-4 px-8 py-3.5 border-b border-white/[0.05]">
      <div
        className="flex items-center gap-2.5 flex-1 max-w-[300px] px-3.5 py-2 rounded-xl"
        style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
      >
        <Search className="w-3.5 h-3.5 text-white/30 shrink-0" />
        <input
          placeholder="Buscar tracks, contactos, eventos…"
          className="bg-transparent border-none outline-none text-[13px] text-white placeholder-white/20 w-full"
        />
        <span className="font-mono text-[9px] text-white/20 border border-white/[0.08] rounded px-1.5 py-0.5">⌘K</span>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <button
          aria-label="Notificaciones"
          className="relative w-9 h-9 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/[0.05] transition-colors"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2">
            <PulseDot color="#C026D3" />
          </span>
        </button>

        <Link
          href={url.startsWith('http') ? url : `https://${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-opacity hover:opacity-80"
          style={{ background: '#fff', color: '#0A0A0F' }}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Ver mi presskit
        </Link>
      </div>
    </header>
  )
}
