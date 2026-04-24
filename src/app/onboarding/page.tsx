import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import OnboardingWizard from '@/components/onboarding/OnboardingWizard'
import { slugify } from '@/lib/utils'

export default async function OnboardingPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Try to find existing artist row
  let { data: artist } = await supabase
    .from('artists')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // No artist yet — create one from auth metadata (set during signup)
  if (!artist) {
    const meta       = user.user_metadata as { artist_name?: string; slug?: string } | undefined
    const artistName = meta?.artist_name || user.email?.split('@')[0] || 'Artist'
    const baseSlug   = meta?.slug || slugify(artistName)

    // Try slug, fallback with random suffix on collision
    let slug = baseSlug
    const { error: insertError } = await supabase
      .from('artists')
      .insert({ user_id: user.id, slug, artist_name: artistName })

    if (insertError && insertError.code === '23505') {
      slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`
      await supabase.from('artists').insert({ user_id: user.id, slug, artist_name: artistName })
    }

    // Re-fetch the newly created artist
    const { data: fresh } = await supabase
      .from('artists')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!fresh) redirect('/signup')
    artist = fresh
  }

  // Already completed onboarding → go to dashboard
  if (artist.onboarding_step === 'complete') redirect('/panel')

  return <OnboardingWizard initialArtist={artist} />
}
