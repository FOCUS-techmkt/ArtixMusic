'use client'
import { useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Palette, BarChart2, FileText, Users, Mail, Briefcase, Sparkles } from 'lucide-react'
import type { Artist, Section, FanSubscriber, ArtistPalette } from '@/types'
import type { AnalyticsRow } from '@/types'
import { deriveArtistPalette } from '@/types'
import EditorTab    from './tabs/EditorTab'
import AnalyticsTab from './tabs/AnalyticsTab'
import ContentTab   from './tabs/ContentTab'
import FansTab      from './tabs/FansTab'
import EmailTab     from './tabs/EmailTab'
import BookerTab    from './tabs/BookerTab'
import AITab        from './tabs/AITab'

export type TabId = 'editor' | 'analytics' | 'content' | 'fans' | 'email' | 'booker' | 'ai'

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

const VALID_TABS: TabId[] = ['editor', 'analytics', 'content', 'fans', 'email', 'booker', 'ai']

const TABS: { id: TabId; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: 'editor',     label: 'Mi Sitio',    icon: Palette         },
  { id: 'analytics',  label: 'Stats',       icon: BarChart2       },
  { id: 'content',    label: 'Contenido',   icon: FileText        },
  { id: 'fans',       label: 'Fans',        icon: Users           },
  { id: 'email',      label: 'Email',       icon: Mail,     badge: 'PRONTO' },
  { id: 'booker',     label: 'Booker',      icon: Briefcase, badge: 'NUEVO' },
  { id: 'ai',         label: 'AI',          icon: Sparkles,  badge: 'IA'    },
]

interface Props {
  initialArtist:   Artist
  initialSections: Section[]
  analytics:       Pick<AnalyticsRow, 'event_type' | 'created_at' | 'country' | 'referrer'>[]
  fans:            FanSubscriber[]
}

// Inner component that reads URL params (Suspense required)
function DashboardClientInner({ initialArtist, initialSections, analytics, fans }: Props) {
  const sp     = useSearchParams()
  const router = useRouter()

  const urlTab  = sp.get('tab') as TabId | null
  const initTab = urlTab && VALID_TABS.includes(urlTab) ? urlTab : 'editor'

  const supabase  = createClient()
  const [tab, _setTab]           = useState<TabId>(initTab)
  const [artist, setArtist]     = useState<Artist>(initialArtist)
  const [sections, setSections] = useState<Section[]>(initialSections)

  const palette = deriveArtistPalette(
    artist.primary_color   ?? '#C026D3',
    artist.secondary_color ?? '#7C3AED',
    artist.bg_dark         ?? true,
  )

  const setTab = (t: TabId) => {
    _setTab(t)
    router.replace(`/dashboard?tab=${t}`, { scroll: false })
  }

  const tabProps: TabProps = { artist, setArtist, sections, setSections, analytics, fans, palette, supabase, setTab }

  return (
    <div className="flex flex-col h-full" style={{ minHeight: 'calc(100dvh - 56px)' }}>

      {/* Horizontal tab bar */}
      <div
        className="flex items-center gap-0 overflow-x-auto shrink-0 sticky top-0 z-20"
        style={{ background: '#08080C', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        {TABS.map(({ id, label, icon: Icon, badge }) => {
          const active = tab === id
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex items-center gap-2 px-4 py-3.5 text-[12px] font-medium whitespace-nowrap shrink-0 transition-all border-b-2"
              style={{
                color:       active ? '#FF8BFF' : 'rgba(255,255,255,0.35)',
                borderColor: active ? '#FF2DFF' : 'transparent',
                background:  active ? 'rgba(255,45,255,0.06)' : 'transparent',
              }}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">{label}</span>
              {badge && (
                <span
                  className="font-mono text-[8px] px-1.5 py-0.5 rounded-full hidden sm:inline"
                  style={{ background: 'rgba(255,45,255,0.15)', color: '#FF8BFF' }}
                >
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Tab content — editor gets overflow-hidden, rest scroll */}
      <div className={`flex-1 min-h-0 ${tab === 'editor' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={tab === 'editor' ? 'h-full' : undefined}
          >
            {tab === 'editor'    && <EditorTab    {...tabProps} />}
            {tab === 'analytics' && <AnalyticsTab {...tabProps} />}
            {tab === 'content'   && <ContentTab   {...tabProps} />}
            {tab === 'fans'      && <FansTab      {...tabProps} />}
            {tab === 'email'     && <EmailTab     {...tabProps} />}
            {tab === 'booker'    && <BookerTab    {...tabProps} />}
            {tab === 'ai'        && <AITab        {...tabProps} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function DashboardClient(props: Props) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full py-20">
        <Loader2 className="w-6 h-6 text-white/20 animate-spin" />
      </div>
    }>
      <DashboardClientInner {...props} />
    </Suspense>
  )
}
