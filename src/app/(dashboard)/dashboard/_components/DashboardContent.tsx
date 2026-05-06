'use client'
import type { Artist } from '@/types'
import type { KpiItem, TrackItem, ShowItem, ChecklistItem, ActivityItem } from '@/lib/dashboard-mocks'
import { TopBar }           from '@/components/dashboard/editorial/TopBar'
import { EditorialHero }    from '@/components/dashboard/editorial/EditorialHero'
import { HeroStatsRow }     from '@/components/dashboard/editorial/HeroStatsRow'
import { InsightCard }      from '@/components/dashboard/editorial/InsightCard'
import { TracksTable }      from '@/components/dashboard/editorial/TracksTable'
import { UpcomingShows }    from '@/components/dashboard/editorial/UpcomingShows'
import { PresskitURLCard }  from '@/components/dashboard/editorial/PresskitURLCard'
import { ProfileChecklist } from '@/components/dashboard/editorial/ProfileChecklist'
import { ActivityFeed }     from '@/components/dashboard/editorial/ActivityFeed'

export interface PressMeta {
  url: string
  artistName: string
  firstName: string
  initials: string
  genre: string
  photoUrl: string | null
  plan: string
  planDaysLeft: number
}

interface Props {
  artist:    Artist
  pressMeta: PressMeta
  kpis:      KpiItem[]
  tracks:    TrackItem[]
  upcoming:  ShowItem[]
  checklist: ChecklistItem[]
  activity:  ActivityItem[]
}

export default function DashboardContent({ artist, pressMeta, kpis, tracks, upcoming, checklist, activity }: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar pressMeta={pressMeta} />
      <EditorialHero pressMeta={pressMeta} kpis={kpis} />
      <HeroStatsRow kpis={kpis} />

      <div className="flex-1 px-4 lg:px-8 pt-7 pb-12 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-7 items-start">
        <div className="flex flex-col gap-7">
          <InsightCard pressMeta={pressMeta} kpis={kpis} />
          <TracksTable tracks={tracks} />
          <UpcomingShows upcoming={upcoming} />
        </div>
        <div className="flex flex-col gap-5">
          <PresskitURLCard pressMeta={pressMeta} />
          <ProfileChecklist checklist={checklist} />
          <ActivityFeed activity={activity} />
        </div>
      </div>
    </div>
  )
}
