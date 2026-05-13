'use client'
import { Component, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
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

interface Props {
  initialArtist:   Artist
  initialSections: Section[]
  analytics:       Pick<AnalyticsRow, 'event_type' | 'created_at' | 'country' | 'referrer'>[]
  fans:            FanSubscriber[]
}

// Error boundary so a crashing tab never shows a black screen
class TabErrorBoundary extends Component<
  { children: React.ReactNode; tabKey: string },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() { return { hasError: true } }

  componentDidUpdate(prev: { tabKey: string }) {
    if (prev.tabKey !== this.props.tabKey) this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center px-8">
          <AlertCircle className="w-8 h-8 text-white/20" />
          <p className="text-sm text-white/40">Esta sección no pudo cargarse.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="text-xs font-mono text-magenta-400 hover:text-magenta-300 transition-colors"
          >
            Reintentar →
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// Inner component that reads URL params (Suspense required for useSearchParams)
function DashboardClientInner({ initialArtist, initialSections, analytics, fans }: Props) {
  const sp     = useSearchParams()
  const router = useRouter()

  // Derive tab ALWAYS from URL — never stale local state
  const urlTab = sp.get('tab')
  const tab: TabId = urlTab && VALID_TABS.includes(urlTab as TabId) ? (urlTab as TabId) : 'editor'

  const supabase  = createClient()
  const [artist, setArtist]     = useState<Artist>(initialArtist)
  const [sections, setSections] = useState<Section[]>(initialSections)

  const palette = deriveArtistPalette(
    artist.primary_color   ?? '#C026D3',
    artist.secondary_color ?? '#7C3AED',
    artist.bg_dark         ?? true,
  )

  const setTab = (t: TabId) => {
    router.replace(`/dashboard?tab=${t}`, { scroll: false })
  }

  const tabProps: TabProps = { artist, setArtist, sections, setSections, analytics, fans, palette, supabase, setTab }

  // Editor tab: renders full-screen over the sidebar (z-[100] > sidebar z-50)
  if (tab === 'editor') {
    return (
      <motion.div
        key="editor-fullscreen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-[100] flex flex-col"
        style={{ background: '#0A0A0F' }}
      >
        <TabErrorBoundary tabKey="editor">
          <EditorTab {...tabProps} />
        </TabErrorBoundary>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col overflow-y-auto" style={{ minHeight: 'calc(100dvh - 56px)' }}>
      <TabErrorBoundary tabKey={tab}>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {tab === 'analytics' && <AnalyticsTab {...tabProps} />}
            {tab === 'content'   && <ContentTab   {...tabProps} />}
            {tab === 'fans'      && <FansTab      {...tabProps} />}
            {tab === 'email'     && <EmailTab     {...tabProps} />}
            {tab === 'booker'    && <BookerTab    {...tabProps} />}
            {tab === 'ai'        && <AITab        {...tabProps} />}
          </motion.div>
        </AnimatePresence>
      </TabErrorBoundary>
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
