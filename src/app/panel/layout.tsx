import { createClient } from '@/lib/supabase/server'
import DashboardShell from '@/app/(dashboard)/_components/DashboardShell'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let artistName    = 'Artista'
  let genre         = ''
  let initials      = 'A'
  let photoUrl: string | null = null
  const planDaysLeft = 30

  if (user) {
    const { data: artist } = await supabase
      .from('artists')
      .select('artist_name, genre, photo_url')
      .eq('user_id', user.id)
      .single()

    if (artist) {
      artistName = artist.artist_name
      genre      = artist.genre ?? ''
      initials   = artist.artist_name
        .split(' ')
        .map((w: string) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
      photoUrl   = artist.photo_url
    }
  }

  return (
    <DashboardShell
      artistName={artistName}
      genre={genre}
      initials={initials}
      photoUrl={photoUrl}
      planDaysLeft={planDaysLeft}
      editorMode
    >
      {children}
    </DashboardShell>
  )
}
