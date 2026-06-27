// Seed para validar las plantillas PRESS KIT (réplicas dj-presskit.com).
// Activa el layout presskit-pupi y puebla rider + secciones. Uso:
//   node scripts/seed-presskit.mjs [pupi|kay|danny]
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n').filter(l => l.includes('=')).map(l => {
      const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    })
)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

const THEME = process.argv[2] || 'pupi'
const PALETTES = {
  pupi:  { primary: '#F5F5F5', secondary: '#9CA3AF' },
  kay:   { primary: '#8F1919', secondary: '#FF5500' },
  danny: { primary: '#59C6BA', secondary: '#2DD4BF' },
}
const EMAIL = 'solaris.kane.50376@artixtest.com'
const PASS  = 'TestArtix2026!'
const img = (seed, w = 800, h = 800) => `https://picsum.photos/seed/${seed}/${w}/${h}`

const { data: auth, error: authErr } = await supabase.auth.signInWithPassword({ email: EMAIL, password: PASS })
if (authErr) { console.error('login error', authErr); process.exit(1) }
const userId = auth.user.id
const { data: artist } = await supabase.from('artists').select('*').eq('user_id', userId).single()
console.log('artist', artist.id, artist.artist_name, '→ theme', THEME)

await supabase.from('artists').update({
  photo_url: img('solaris-portrait', 900, 1200),
  primary_color: PALETTES[THEME].primary,
  secondary_color: PALETTES[THEME].secondary,
  bg_dark: true,
}).eq('id', artist.id)

const { data: sections } = await supabase.from('sections').select('*').eq('artist_id', artist.id)
const byName = Object.fromEntries(sections.map(s => [s.name, s]))

const patch = async (name, extra, order) => {
  const s = byName[name]
  if (!s) {
    const o = order ?? Math.max(0, ...sections.map(x => x.sort_order ?? 0)) + 1
    const { error } = await supabase.from('sections').insert({ artist_id: artist.id, name, is_enabled: true, sort_order: o, config: extra })
    return console.log(error ? `insert-fail ${name} ${error.message}` : `inserted ${name}`)
  }
  await supabase.from('sections').update({ config: { ...s.config, ...extra }, is_enabled: true }).eq('id', s.id)
  console.log('ok', name)
}

await patch('hero', {
  pageLayout: `presskit-${THEME}`,
  bg_image: img('solaris-hero', 1600, 1000),
  socials: [
    { id: '1', platform: 'instagram',  url: 'https://instagram.com/solariskane',  enabled: true, sort_order: 0 },
    { id: '2', platform: 'spotify',    url: 'https://open.spotify.com/artist/4tZwfgrHOc3mvqYlEYSvVi', enabled: true, sort_order: 1 },
    { id: '3', platform: 'soundcloud', url: 'https://soundcloud.com/danir_music',  enabled: true, sort_order: 2 },
    { id: '4', platform: 'youtube',    url: 'https://youtube.com/@solariskane',    enabled: true, sort_order: 3 },
  ],
}, 0)

await patch('bio', {
  text: '<p>Con una identidad sonora marcada por la energía y la conexión con la pista, Solaris Kane se ha consolidado como una de las propuestas emergentes más interesantes de la escena electrónica. Su estilo fusiona grooves hipnóticos, percusiones contundentes y melodías envolventes.</p>',
  genres: ['TECH HOUSE', 'TECHNO', 'GUARACHA', 'RKT'],
  city: 'Buenos Aires', country: 'Argentina',
  photo_position: 'left',
  stats: [
    { value: '+5',  label: 'Años experiencia' },
    { value: '+200', label: 'Eventos realizados' },
    { value: '+15K', label: 'Minutos mixeando' },
  ],
}, 1)

await patch('live', {
  section_title: 'Eventos',
  venues: [
    { id: '1', name: 'EVENTO PRIVADO', city: 'Tigre',        country: 'Argentina', lat: null, lng: null, instagram: 'https://instagram.com/solariskane', date: '2026-03-28' },
    { id: '2', name: 'Almacluub',      city: 'Buenos Aires',  country: 'Argentina', lat: null, lng: null, instagram: 'https://instagram.com/solariskane', date: '2026-03-13' },
    { id: '3', name: 'PeKado',         city: 'Palermo',       country: 'Argentina', lat: null, lng: null, instagram: '', date: '2026-03-13' },
  ],
}, 2)

await patch('music', {
  section_title: 'Música',
  tracks: [
    { id: '1', platform: 'soundcloud', url: 'https://soundcloud.com/danir_music/tracks', title: 'Latest tracks', cover: null },
    { id: '2', platform: 'spotify',    url: 'https://open.spotify.com/artist/4tZwfgrHOc3mvqYlEYSvVi', title: 'Top tracks', cover: null },
  ],
}, 3)

await patch('gallery', {
  section_title: 'Galería',
  images: Array.from({ length: 6 }, (_, i) => ({ id: String(i + 1), url: img(`gal${i + 1}`, 1200, 900), caption: '' })),
}, 4)

await patch('rider', {
  section_title: 'Rider',
  intro: 'Para garantizar una experiencia **óptima** en cada presentación, se requiere el siguiente equipamiento técnico:',
  items: [
    { id: '1', name: 'PIONEER DJ CDJ-3000', role: 'PLAYER 1', image: null },
    { id: '2', name: 'PIONEER DJ CDJ-3000', role: 'PLAYER 2', image: null },
    { id: '3', name: 'PIONEER DJ DJM-A9',   role: 'MIXER',    image: null },
    { id: '4', name: 'PIONEER DJ DJM-V10',  role: 'MIXER ALT', image: null },
  ],
  notes: [
    { id: '1', title: 'Monitores', body: '12" a 15" a la altura de los oídos laterales (en pedestal).' },
    { id: '2', title: 'Extras', body: '5 micrófonos con pedestal.\n1 par de congas.\nDjembe con base para piso.' },
  ],
  cta_text: 'Especificaciones Rider', cta_url: '',
}, 5)

await patch('contact', { section_title: 'Contacto' }, 6)

// desactivar secciones que no usa el press kit
for (const n of ['community', 'supporters', 'releases', 'fan-capture', 'links', 'testimonials']) {
  if (byName[n]) await supabase.from('sections').update({ is_enabled: false }).eq('id', byName[n].id)
}

console.log('SEED PRESSKIT DONE →', THEME)
process.exit(0)
