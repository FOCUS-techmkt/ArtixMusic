import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SettingsContent from './_components/SettingsContent'
import type { SettingsInitialData } from './_components/SettingsContent'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: artist } = await supabase
    .from('artists')
    .select('*')
    .eq('user_id', user.id)
    .single()
  if (!artist) redirect('/onboarding')

  const initials = artist.artist_name
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const initialData: SettingsInitialData = {
    artistName:   artist.artist_name,
    email:        user.email ?? '',
    bio:          artist.bio ?? '',
    genre:        artist.genre ?? '',
    slug:         artist.slug ?? '',
    bookingEmail: artist.booking_email ?? '',
    bookingUrl:   artist.booking_url ?? '',
    city:         '',
    photoUrl:     artist.photo_url,
    initials,
  }

  async function saveProfile(data: {
    artistName: string
    bio: string
    bookingEmail: string
    bookingUrl: string
    slug: string
  }): Promise<{ ok: boolean; error?: string }> {
    'use server'
    try {
      const sb = await createClient()
      const { data: { user: u } } = await sb.auth.getUser()
      if (!u) return { ok: false, error: 'No autenticado' }

      const { data: a } = await sb.from('artists').select('id').eq('user_id', u.id).single()
      if (!a) return { ok: false, error: 'Artista no encontrado' }

      const { error } = await sb.from('artists').update({
        artist_name:   data.artistName,
        bio:           data.bio,
        booking_email: data.bookingEmail || null,
        booking_url:   data.bookingUrl   || null,
        slug:          data.slug,
      }).eq('id', a.id)

      if (error) return { ok: false, error: error.message }
      return { ok: true }
    } catch (e) {
      return { ok: false, error: String(e) }
    }
  }

  return (
    <div className="overflow-y-auto flex-1">
      <SettingsContent initialData={initialData} saveProfileAction={saveProfile} />
    </div>
  )
}
