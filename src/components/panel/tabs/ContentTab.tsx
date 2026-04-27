'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, Check, Plus, Trash2, ExternalLink } from 'lucide-react'
import type { TabProps } from '../DashboardClient'
import type { ArtistLinks } from '@/types'
import RichTextEditor from '@/components/shared/RichTextEditor'

type SubTab = 'bio' | 'links' | 'music' | 'rider'

const LINK_FIELDS: { key: keyof ArtistLinks; label: string; placeholder: string; icon: string }[] = [
  { key: 'soundcloud', label: 'SoundCloud',  placeholder: 'https://soundcloud.com/tu-nombre',     icon: '☁️' },
  { key: 'spotify',    label: 'Spotify',     placeholder: 'https://open.spotify.com/artist/...',  icon: '💚' },
  { key: 'instagram',  label: 'Instagram',   placeholder: 'https://instagram.com/tu_artista',     icon: '📷' },
  { key: 'youtube',    label: 'YouTube',     placeholder: 'https://youtube.com/@tu-canal',        icon: '🎬' },
]

const MUSIC_PLATFORMS = [
  { id: 'soundcloud', label: 'SoundCloud', placeholder: 'https://soundcloud.com/...' },
  { id: 'spotify',    label: 'Spotify',    placeholder: 'https://open.spotify.com/...' },
  { id: 'youtube',    label: 'YouTube',    placeholder: 'https://youtu.be/...' },
  { id: 'bandcamp',   label: 'Bandcamp',   placeholder: 'https://artista.bandcamp.com/...' },
]

function SaveBtn({ saving, saved, onSave, color }: { saving: boolean; saved: boolean; onSave: () => void; color: string }) {
  return (
    <motion.button onClick={onSave} disabled={saving}
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
      style={{ background: color }}>
      {saving ? <Loader2 className="w-4 h-4 animate-spin" />
        : saved  ? <><Check className="w-4 h-4" /> Guardado</>
        : 'Guardar'}
    </motion.button>
  )
}

export default function ContentTab({ artist, setArtist, palette, supabase }: TabProps) {
  const [sub, setSub] = useState<SubTab>('bio')

  // Bio state
  const [bio,         setBio]         = useState(artist.bio ?? '')
  const [bioSaving,   setBioSaving]   = useState(false)
  const [bioSaved,    setBioSaved]    = useState(false)

  // Links state
  const [links,        setLinks]       = useState<ArtistLinks>(artist.links as ArtistLinks ?? {})
  const [linksSaving,  setLinksSaving] = useState(false)
  const [linksSaved,   setLinksSaved]  = useState(false)

  // Booking email
  const [bookingEmail, setBookingEmail] = useState(artist.booking_email ?? '')

  // Music embeds (stored in links as _music)
  const [musicLinks, setMusicLinks]   = useState<{ platform: string; url: string }[]>([])
  const [musicSaving, setMusicSaving] = useState(false)
  const [musicSaved,  setMusicSaved]  = useState(false)

  // Rider
  const [rider,       setRider]       = useState('')
  const [riderSaving, setRiderSaving] = useState(false)
  const [riderSaved,  setRiderSaved]  = useState(false)

  const saveBio = async () => {
    setBioSaving(true)
    const { error } = await supabase.from('artists').update({ bio }).eq('user_id', artist.user_id)
    if (!error) { setArtist(p => ({ ...p, bio })); setBioSaved(true); setTimeout(() => setBioSaved(false), 2000) }
    setBioSaving(false)
  }

  const saveLinks = async () => {
    setLinksSaving(true)
    const { error } = await supabase.from('artists').update({ links, booking_email: bookingEmail }).eq('user_id', artist.user_id)
    if (!error) { setArtist(p => ({ ...p, links, booking_email: bookingEmail })); setLinksSaved(true); setTimeout(() => setLinksSaved(false), 2000) }
    setLinksSaving(false)
  }

  const saveMusic = async () => {
    setMusicSaving(true)
    await new Promise(r => setTimeout(r, 600))
    setMusicSaved(true); setTimeout(() => setMusicSaved(false), 2000)
    setMusicSaving(false)
  }

  const saveRider = async () => {
    setRiderSaving(true)
    await new Promise(r => setTimeout(r, 600))
    setRiderSaved(true); setTimeout(() => setRiderSaved(false), 2000)
    setRiderSaving(false)
  }

  const addMusicLink = () => setMusicLinks(p => [...p, { platform: 'soundcloud', url: '' }])
  const removeMusicLink = (i: number) => setMusicLinks(p => p.filter((_, idx) => idx !== i))
  const updateMusicLink = (i: number, field: 'platform' | 'url', val: string) =>
    setMusicLinks(p => p.map((m, idx) => idx === i ? { ...m, [field]: val } : m))

  const SUBTABS: { id: SubTab; label: string }[] = [
    { id: 'bio',   label: 'Bio & Logros' },
    { id: 'links', label: 'Redes & Booking' },
    { id: 'music', label: 'Música' },
    { id: 'rider', label: 'Rider Técnico' },
  ]

  const input = "w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none transition-all"
  const inputStyle = { background: '#141418', border: '1px solid rgba(255,255,255,0.08)', outline: 'none' }

  return (
    <div className="px-6 lg:px-8 py-8 max-w-3xl mx-auto flex flex-col gap-6">

      {/* Header */}
      <div>
        <p className="text-[10px] font-mono text-white/25 tracking-[0.15em] uppercase mb-1">Gestión de contenido</p>
        <h1 className="font-display font-extrabold text-3xl tracking-tight">Contenido</h1>
      </div>

      {/* Sub-nav */}
      <div className="flex gap-1 p-1 rounded-xl w-fit"
        style={{ background: '#0E0E12', border: '1px solid rgba(255,255,255,0.06)' }}>
        {SUBTABS.map(({ id, label }) => (
          <button key={id} onClick={() => setSub(id)}
            className="px-4 py-2 rounded-[10px] text-[12px] font-medium transition-all"
            style={{
              background: sub === id ? palette.primary + '22' : 'transparent',
              color:      sub === id ? palette.primary : 'rgba(255,255,255,0.4)',
            }}>
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* BIO */}
        {sub === 'bio' && (
          <motion.div key="bio" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col gap-5">

            <Section title="Nombre artístico">
              <input className={input} style={inputStyle}
                value={artist.artist_name} readOnly
                placeholder="Tu nombre artístico"
              />
              <p className="text-[10px] text-white/20 font-mono mt-1">Para cambiar el nombre, contacta soporte.</p>
            </Section>

            <Section title="Género musical">
              <p className="text-sm text-white/50 px-4 py-3 rounded-xl"
                style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.08)' }}>
                {artist.genre}
              </p>
            </Section>

            <Section title="Rol">
              <p className="text-sm text-white/50 px-4 py-3 rounded-xl"
                style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.08)' }}>
                {artist.role}
              </p>
            </Section>

            <Section title="Palabras que definen tu sonido">
              <div className="flex gap-2">
                {(artist.sound_words ?? []).filter(Boolean).map((w, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full text-xs font-mono"
                    style={{ background: palette.primary + '20', color: palette.primary, border: `1px solid ${palette.primary}35` }}>
                    {w}
                  </span>
                ))}
              </div>
            </Section>

            <Section title="Biografía">
              <RichTextEditor
                value={bio}
                onChange={setBio}
                accentColor={palette.primary}
                placeholder="Cuéntale al mundo quién eres, de dónde vienes y qué te hace único como artista..."
              />
              <p className="text-[10px] text-white/20 font-mono mt-1">
                {bio.replace(/<[^>]+>/g, '').length} caracteres · El texto se guarda con formato
              </p>
            </Section>

            {(artist.achievements ?? []).length > 0 && (
              <Section title="Logros destacados">
                <div className="flex flex-col gap-2">
                  {artist.achievements.map((a, i) => (
                    <div key={i} className="p-3 rounded-xl" style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <p className="text-xs font-semibold text-white/70">{a.title}</p>
                      <p className="text-[11px] text-white/35 mt-0.5">{a.description}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            <div className="flex justify-end">
              <SaveBtn saving={bioSaving} saved={bioSaved} onSave={saveBio} color={palette.primary} />
            </div>
          </motion.div>
        )}

        {/* LINKS */}
        {sub === 'links' && (
          <motion.div key="links" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col gap-5">

            <Section title="Redes sociales y plataformas">
              <div className="flex flex-col gap-3">
                {LINK_FIELDS.map(({ key, label, placeholder, icon }) => (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-lg w-7 shrink-0 text-center">{icon}</span>
                    <div className="flex-1">
                      <p className="text-[10px] font-mono text-white/30 mb-1">{label}</p>
                      <input
                        type="url"
                        value={(links as Record<string, string>)[key] ?? ''}
                        onChange={e => setLinks(p => ({ ...p, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className={input} style={inputStyle}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Email de booking">
              <input
                type="email"
                value={bookingEmail}
                onChange={e => setBookingEmail(e.target.value)}
                placeholder="booking@tumanager.com"
                className={input} style={inputStyle}
              />
            </Section>

            <div className="flex justify-end">
              <SaveBtn saving={linksSaving} saved={linksSaved} onSave={saveLinks} color={palette.primary} />
            </div>
          </motion.div>
        )}

        {/* MUSIC */}
        {sub === 'music' && (
          <motion.div key="music" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col gap-5">

            <div className="p-4 rounded-xl"
              style={{ background: palette.primary + '10', border: `1px solid ${palette.primary}25` }}>
              <p className="text-xs text-white/60">
                Añade links de tus tracks en SoundCloud, Spotify u otras plataformas.
                Aparecerán embebidos en la sección de música de tu press kit.
              </p>
            </div>

            <Section title="Tracks y lanzamientos">
              <div className="flex flex-col gap-3">
                {musicLinks.map((m, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <select
                      value={m.platform}
                      onChange={e => updateMusicLink(i, 'platform', e.target.value)}
                      className="px-3 py-3 rounded-xl text-xs font-mono text-white/60 shrink-0"
                      style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.08)' }}>
                      {MUSIC_PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                    </select>
                    <input
                      type="url"
                      value={m.url}
                      onChange={e => updateMusicLink(i, 'url', e.target.value)}
                      placeholder={MUSIC_PLATFORMS.find(p => p.id === m.platform)?.placeholder}
                      className={`${input} flex-1`} style={inputStyle}
                    />
                    <button onClick={() => removeMusicLink(i)} className="text-white/20 hover:text-red-400 transition-colors p-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button onClick={addMusicLink}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-white/10 text-xs text-white/30 hover:text-white/60 hover:border-white/20 transition-all w-fit">
                  <Plus className="w-3.5 h-3.5" />
                  Añadir track
                </button>
              </div>
            </Section>

            <Section title="Enlace a playlist de Spotify">
              <input type="url" placeholder="https://open.spotify.com/playlist/..."
                className={input} style={inputStyle} />
            </Section>

            <div className="flex justify-end">
              <SaveBtn saving={musicSaving} saved={musicSaved} onSave={saveMusic} color={palette.primary} />
            </div>
          </motion.div>
        )}

        {/* RIDER */}
        {sub === 'rider' && (
          <motion.div key="rider" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col gap-5">

            <div className="p-4 rounded-xl"
              style={{ background: palette.primary + '10', border: `1px solid ${palette.primary}25` }}>
              <p className="text-xs text-white/60">
                Tu rider técnico aparece en tu perfil cuando activás el modo <strong className="text-white/80">Booker Ready</strong>.
                Escríbelo en texto o pega el contenido de tu rider actual.
              </p>
            </div>

            <Section title="Rider técnico">
              <textarea
                value={rider}
                onChange={e => setRider(e.target.value)}
                rows={12}
                placeholder={`RIDER TÉCNICO — ${artist.artist_name.toUpperCase()}

AUDIO
- Sistema de sonido principal: mínimo 10kW
- Monitor de escenario: 2 x wedge + 1 sidefill
- Mesa de sonido: Digico SD9 o similar
- Micrófono para MC: Shure SM58

DJ SETUP
- 2 x Pioneer CDJ-2000 NXS2 (o superior)
- 1 x Pioneer DJM-900 NXS2
- Laptop stand + tomacorriente en DJ booth

HOSPITALIDAD
- 6 x agua mineral sin gas
- Camarín privado con baño
- 2 x pases guest list para equipo`}
                className={`${input} resize-none leading-relaxed font-mono text-xs`}
                style={inputStyle}
              />
            </Section>

            <div className="flex items-center justify-between">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-xs text-white/40 hover:text-white/70 transition-all"
                onClick={() => {
                  const blob = new Blob([rider], { type: 'text/plain' })
                  const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
                  a.download = `rider-${artist.slug}.txt`; a.click()
                }}>
                <ExternalLink className="w-3.5 h-3.5" />
                Descargar .txt
              </button>
              <SaveBtn saving={riderSaving} saved={riderSaved} onSave={saveRider} color={palette.primary} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] font-mono uppercase tracking-wider text-white/25">{title}</p>
      {children}
    </div>
  )
}
