// Seed de datos de prueba para validar la plantilla MINIMAL PULSE.
// Inicia sesión con la cuenta de prueba y puebla los configs de sección.
// Uso: node scripts/seed-minimal-pulse.mjs
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n').filter(l => l.includes('=')).map(l => {
      const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

const EMAIL = 'solaris.kane.50376@artixtest.com'
const PASS  = 'TestArtix2026!'

const img = (seed, w = 800, h = 800) => `https://picsum.photos/seed/${seed}/${w}/${h}`

const { data: auth, error: authErr } = await supabase.auth.signInWithPassword({ email: EMAIL, password: PASS })
if (authErr) { console.error('login error', authErr); process.exit(1) }
const userId = auth.user.id

const { data: artist } = await supabase.from('artists').select('*').eq('user_id', userId).single()
console.log('artist', artist.id, artist.artist_name)

// portrait del artista (hero + bio)
await supabase.from('artists').update({ photo_url: img('solaris-portrait', 900, 1200) }).eq('id', artist.id)

const { data: sections } = await supabase.from('sections').select('*').eq('artist_id', artist.id)
const byName = Object.fromEntries(sections.map(s => [s.name, s]))

const patch = async (name, extra) => {
  const s = byName[name]
  if (!s) {
    const order = Math.max(0, ...sections.map(x => x.sort_order ?? 0)) + 1
    const { error } = await supabase.from('sections').insert({ artist_id: artist.id, name, is_enabled: true, sort_order: order, config: extra })
    return console.log(error ? `insert-fail ${name} ${error.message}` : `inserted ${name}`)
  }
  await supabase.from('sections').update({ config: { ...s.config, ...extra }, is_enabled: true }).eq('id', s.id)
  console.log('ok', name)
}

await patch('hero', {
  bg_image: img('solaris-hero', 1600, 1000),
  socials: [
    { id: '1', platform: 'instagram',  url: 'https://instagram.com/solariskane',  enabled: true, sort_order: 0 },
    { id: '2', platform: 'spotify',    url: 'https://open.spotify.com/artist/4tZwfgrHOc3mvqYlEYSvVi', enabled: true, sort_order: 1 },
    { id: '3', platform: 'soundcloud', url: 'https://soundcloud.com/danir_music',  enabled: true, sort_order: 2 },
    { id: '4', platform: 'youtube',    url: 'https://youtube.com/@solariskane',    enabled: true, sort_order: 3 },
  ],
})

await patch('bio', {
  text: '<p>Con una identidad sonora marcada por la energía, la elegancia y la conexión con la pista, Solaris Kane se ha consolidado como una de las propuestas emergentes más interesantes de la escena electrónica actual. Su estilo fusiona grooves hipnóticos, percusiones contundentes y melodías envolventes, creando sets dinámicos que mantienen al público en constante movimiento.</p>',
  genres: ['Techno', 'Minimal', 'House'],
  photo_position: 'left',
  stats: [
    { value: '+5',  label: 'Años activo' },
    { value: '+50', label: 'Shows' },
    { value: '+10', label: 'Países' },
    { value: '+10', label: 'Releases' },
  ],
})

await patch('releases', {
  section_title: 'Releases',
  releases: [
    { id: '1', title: 'Endless Nightfall', label: 'SINGLE', cover: img('rel1'), spotify_url: 'https://open.spotify.com/artist/4tZwfgrHOc3mvqYlEYSvVi', beatport_url: '', year: '2026' },
    { id: '2', title: 'Soft Point',        label: 'SINGLE', cover: img('rel2'), spotify_url: 'https://open.spotify.com/artist/4tZwfgrHOc3mvqYlEYSvVi', beatport_url: '', year: '2026' },
    { id: '3', title: 'Solar Path EP',      label: 'EP',     cover: img('rel3'), spotify_url: 'https://open.spotify.com/artist/4tZwfgrHOc3mvqYlEYSvVi', beatport_url: '', year: '2025' },
  ],
})

await patch('live', {
  section_title: 'Shows',
  total_shows: '50+', countries_count: '10',
  venues: [
    { id: '1', name: 'Club Ibiza',         city: 'Ibiza',        country: 'España',    lat: 38.9067, lng: 1.4206,  instagram: '',                                   date: '2026-06-19' },
    { id: '2', name: 'Sonum',              city: 'Córdoba',      country: 'Argentina', lat: -31.4201, lng: -64.1888, instagram: 'https://instagram.com/hypearagency', date: '2026-12-19' },
    { id: '3', name: 'Club Modular',       city: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lng: -58.3816, instagram: '',                                   date: '2026-12-20' },
    { id: '4', name: 'Eclipse Rooftop',    city: 'Montevideo',   country: 'Uruguay',   lat: -34.9011, lng: -56.1645, instagram: 'https://instagram.com/hypearagency', date: '2026-12-21' },
  ],
})

await patch('gallery', {
  section_title: 'Multimedia',
  images: [
    { id: '1', url: img('gal1', 1200, 750), caption: 'Boiler Room, 2026' },
    { id: '2', url: img('gal2', 1200, 750), caption: 'Warehouse Set, 2026' },
    { id: '3', url: img('gal3', 1200, 750), caption: 'Berghain, Berlin 2026' },
    { id: '4', url: img('gal4', 1200, 750), caption: 'Beachclub, Ibiza 2026' },
  ],
})

await patch('music', {
  section_title: 'Mix',
  tracks: [
    { id: '1', platform: 'soundcloud', url: 'https://soundcloud.com/danir_music/tracks', title: 'Latest tracks', cover: null },
    { id: '2', platform: 'spotify',    url: 'https://open.spotify.com/artist/4tZwfgrHOc3mvqYlEYSvVi', title: 'Top tracks', cover: null },
  ],
})

console.log('SEED DONE')
process.exit(0)
