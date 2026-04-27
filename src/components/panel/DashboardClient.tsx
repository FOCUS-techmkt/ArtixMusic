'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, Palette, BarChart2, FileText,
  Users, Mail, Briefcase, LogOut, Menu, X, Sparkles,
} from 'lucide-react'
import type { Artist, Section, FanSubscriber, ArtistPalette } from '@/types'
import type { AnalyticsRow } from '@/types'
import { deriveArtistPalette } from '@/types'
import OverviewTab  from './tabs/OverviewTab'
import EditorTab    from './tabs/EditorTab'
import AnalyticsTab from './tabs/AnalyticsTab'
import ContentTab   from './tabs/ContentTab'
import FansTab      from './tabs/FansTab'
import EmailTab     from './tabs/EmailTab'
import BookerTab    from './tabs/BookerTab'
import AITab        from './tabs/AITab'
import { ArtistPulseIcon } from '@/components/shared/ArtistPulseLogo'

export type TabId = 'overview' | 'editor' | 'analytics' | 'content' | 'fans' | 'email' | 'booker' | 'ai'

export interface TabProps {
  artist:      Artist
  setArtist:   React.Dispatch<React.SetStateAction<Artist>>
  sections:    Section[]
  setSections: React.Dispatch<React.SetStateAction<Section[]>>
  analytics:   Pick<AnalyticsRow, 'event_type' | 'created_at' | 'country' | 'referrer'>[]
  fans:        FanSubscriber[]
  palette:     ArtistPalette
  supabase:    ReturnType<typeof createClient>
  setTab:      (t: TabId) => void
}

const NAV: { id: TabId; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: 'overview',   label: 'Resumen',       icon: LayoutDashboard },
  { id: 'editor',     label: 'Mi sitio',       icon: Palette },
  { id: 'analytics',  label: 'Analíticas',     icon: BarChart2 },
  { id: 'content',    label: 'Contenido',      icon: FileText },
  { id: 'fans',       label: 'Fans',           icon: Users },
  { id: 'email',      label: 'Email',          icon: Mail,      badge: 'PRONTO' },
  { id: 'booker',     label: 'Booker Ready',   icon: Briefcase, badge: 'NUEVO' },
  { id: 'ai',         label: 'AI Coach',       icon: Sparkles,  badge: 'IA'    },
]

interface Props {
  initialArtist:    Artist
  initialSections:  Section[]
  analytics:        Pick<AnalyticsRow, 'event_type' | 'created_at' | 'country' | 'referrer'>[]
  fans:             FanSubscriber[]
}

export default function DashboardClient({ initialArtist, initialSections, analytics, fans }: Props) {
  const supabase = createClient()
  const [tab, setTab]         = useState<TabId>('overview')
  const [artist, setArtist]   = useState<Artist>(initialArtist)
  const [sections, setSections] = useState<Section[]>(initialSections)
  const [open, setOpen]       = useState(false)

  const palette = deriveArtistPalette(
    artist.primary_color   ?? '#C026D3',
    artist.secondary_color ?? '#7C3AED',
    artist.bg_dark         ?? true,
  )

  const tabProps: TabProps = { artist, setArtist, sections, setSections, analytics, fans, palette, supabase, setTab }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#070709', color: '#F5F5F5' }}>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-20 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ─────────────────────────────────── */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-30
          w-[220px] flex flex-col shrink-0
          transition-transform duration-300 lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ background: '#0A0A0E', borderRight: '1px solid rgba(255,255,255,0.05)' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-[60px] shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-2.5">
            <ArtistPulseIcon color="#AAFF00" size={26} />
            <div className="leading-none">
              <p className="font-display font-black text-[13px] tracking-[0.1em] uppercase text-white">Artist Pulse</p>
              <p className="font-mono text-[8px] tracking-[0.15em] uppercase" style={{ color: '#AAFF00' }}>AI for Artists</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden p-1 text-white/30 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="flex flex-col gap-0.5">
            {NAV.map(({ id, label, icon: Icon, badge }) => {
              const active = tab === id
              return (
                <button
                  key={id}
                  onClick={() => { setTab(id); setOpen(false) }}
                  className="group flex items-center gap-3 w-full px-3 py-2.5 rounded-[10px] text-[13px] font-medium transition-all duration-150 text-left"
                  style={{
                    background: active ? palette.primary + '18' : 'transparent',
                    color:      active ? palette.primary : 'rgba(255,255,255,0.38)',
                  }}
                >
                  <Icon className="w-[15px] h-[15px] shrink-0 transition-colors" />
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full"
                      style={{ background: palette.primary + '22', color: palette.primary }}>
                      {badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Artist + Logout */}
        <div className="px-3 pb-4 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
              style={{ background: palette.primary + '28', color: palette.primary }}>
              {artist.artist_name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-medium text-white/80 truncate">{artist.artist_name}</p>
              <p className="text-[10px] font-mono text-white/25 truncate">/{artist.slug}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-[10px] text-[12px] text-white/25 hover:text-white/60 hover:bg-white/[0.04] transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── MAIN ──────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Mobile topbar */}
        <div className="flex lg:hidden items-center justify-between px-4 h-[56px] shrink-0"
          style={{ background: '#0A0A0E', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={() => setOpen(true)} className="text-white/40 hover:text-white transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <ArtistPulseIcon color="#AAFF00" size={20} />
            <span className="font-display font-black text-[13px] tracking-[0.1em] uppercase text-white">Artist Pulse</span>
          </div>
          <div className="w-8" />
        </div>

        {/* Tab content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="min-h-full"
            >
              {tab === 'overview'  && <OverviewTab  {...tabProps} />}
              {tab === 'editor'    && <EditorTab    {...tabProps} />}
              {tab === 'analytics' && <AnalyticsTab {...tabProps} />}
              {tab === 'content'   && <ContentTab   {...tabProps} />}
              {tab === 'fans'      && <FansTab      {...tabProps} />}
              {tab === 'email'     && <EmailTab     {...tabProps} />}
              {tab === 'booker'    && <BookerTab    {...tabProps} />}
              {tab === 'ai'        && <AITab        {...tabProps} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
