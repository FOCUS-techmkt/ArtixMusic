import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardClient from '@/components/panel/DashboardClient'

export default async function PanelPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: artist } = await supabase
    .from('artists')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!artist) redirect('/onboarding')
  if (artist.onboarding_step !== 'complete') redirect('/onboarding')

  const [{ data: sections }, { data: analytics }] = await Promise.all([
    supabase.from('sections').select('*').eq('artist_id', artist.id).order('sort_order'),
    supabase.from('analytics').select('event_type, created_at').eq('artist_id', artist.id).order('created_at', { ascending: false }).limit(200),
  ])

  return (
    <DashboardClient
      initialArtist={artist}
      initialSections={sections ?? []}
      analytics={analytics ?? []}
    />
  )
}
