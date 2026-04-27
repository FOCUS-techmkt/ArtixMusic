import { createClient } from './supabase/client'

const BUCKET = 'presskit-assets'

export async function uploadImage(
  file: File,
  userId: string,
  folder: 'hero' | 'gallery' | 'releases' | 'logo' | 'avatar' | 'misc' = 'misc',
): Promise<string | null> {
  const supabase = createClient()
  const ext  = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`
  const path = `${userId}/${folder}/${name}`

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type })

  if (error) { console.error('[storage]', error.message); return null }

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(data.path)
  return publicUrl
}

export async function deleteImage(url: string): Promise<void> {
  const supabase = createClient()
  // Extract the path from the public URL
  const marker = `/${BUCKET}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return
  const path = url.slice(idx + marker.length)
  await supabase.storage.from(BUCKET).remove([path])
}
