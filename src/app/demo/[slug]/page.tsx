'use client'
import { useState } from 'react'
import Link from 'next/link'

// ─── Artist configs ───────────────────────────────────────────────────────────
interface ArtistConfig {
  name: string
  shortName: string
  role: string
  location: string
  nationality: string
  genres: string[]
  bio: string
  bioQuote: string
  quoteSource: string
  accent: string
  secondary: string
  accentDark: string
  bgColor: string
  photo: string
  photoPortrait: string
  stats: {
    monthly: string
    monthlyLabel: string
    countries: number
    shows: string
    djmag?: string
    years: number
  }
  tracks: {
    title: string
    label: string
    year: string
    plays: string
    spotifyUrl: string
    soundcloudUrl: string
  }[]
  gallery: string[]
  press: { name: string; quote: string }[]
  venues: string[]
  social: { ig: string; spotify: string; soundcloud: string; ra: string }
  email: string
  fee: string
  awards: string[]
}

const ARTISTS: Record<string, ArtistConfig> = {

  // ── Charlotte de Witte ─────────────────────────────────────────────────────
  'charlotte-de-witte': {
    name: 'CHARLOTTE DE WITTE',
    shortName: 'CDW',
    role: 'DJ & Producer',
    location: 'Ghent, Belgium',
    nationality: 'Belgian',
    genres: ['Techno', 'Dark Techno', 'Industrial'],
    bio: 'Charlotte de Witte is one of the most prominent and internationally recognized figures in the global techno scene. Hailing from Ghent, Belgium, she has built a reputation for uncompromising, hypnotic sets that draw from the darkest corners of electronic music. Since her breakthrough with "Return to Nowhere" in 2018 — which earned DJ Mag\'s Track of the Year — she has performed at every major festival on Earth: Tomorrowland, ADE, Time Warp, Awakenings, Ultra and Coachella. Her label KNTXT serves as a platform for the most forward-thinking techno artists. With millions of monthly listeners and sold-out headline shows globally, Charlotte de Witte is defining what modern techno sounds like.',
    bioQuote: '"Charlotte de Witte has redefined what a DJ can be. She doesn\'t just play music — she commands entire cities."',
    quoteSource: 'DJ Mag, 2023',
    accent: '#00C8FF',
    secondary: '#0047AB',
    accentDark: '#001A2E',
    bgColor: '#030810',
    photo: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1400&q=90',
    photoPortrait: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80',
    stats: {
      monthly: '4.2M',
      monthlyLabel: 'Spotify Monthly',
      countries: 72,
      shows: '200+',
      djmag: '#4',
      years: 12,
    },
    tracks: [
      {
        title: 'Return to Nowhere',
        label: 'KNTXT',
        year: '2018',
        plays: '18M',
        spotifyUrl: 'https://open.spotify.com/artist/5aqJL2kUVKWXFQg5OKLd9J',
        soundcloudUrl: 'https://soundcloud.com/charlottedewitteofficial',
      },
      {
        title: 'Doppler',
        label: 'KNTXT',
        year: '2020',
        plays: '6.1M',
        spotifyUrl: 'https://open.spotify.com/artist/5aqJL2kUVKWXFQg5OKLd9J',
        soundcloudUrl: 'https://soundcloud.com/charlottedewitteofficial',
      },
      {
        title: 'Sgat',
        label: 'KNTXT',
        year: '2022',
        plays: '4.8M',
        spotifyUrl: 'https://open.spotify.com/artist/5aqJL2kUVKWXFQg5OKLd9J',
        soundcloudUrl: 'https://soundcloud.com/charlottedewitteofficial',
      },
      {
        title: 'Heartbeat (Charlotte de Witte Remix)',
        label: 'Drumcode',
        year: '2023',
        plays: '2.3M',
        spotifyUrl: 'https://open.spotify.com/artist/5aqJL2kUVKWXFQg5OKLd9J',
        soundcloudUrl: 'https://soundcloud.com/charlottedewitteofficial',
      },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80',
      'https://images.unsplash.com/photo-1501386761578-eaa54b616f8a?w=800&q=80',
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80',
      'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80',
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80',
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    ],
    press: [
      { name: 'DJ Mag', quote: 'Track of the Year 2018 · Top 10 DJ 4 consecutive years' },
      { name: 'Resident Advisor', quote: 'One of the most important DJs working today' },
      { name: 'Mixmag', quote: 'The undisputed queen of dark techno' },
      { name: 'The Guardian', quote: 'A global phenomenon reshaping electronic music' },
    ],
    venues: ['Tomorrowland', 'Awakenings', 'Time Warp', 'Coachella', 'ADE', 'Fabric London', 'Berghain', 'Ultra Music Festival'],
    social: {
      ig: 'https://www.instagram.com/charlottedewitteofficial',
      spotify: 'https://open.spotify.com/artist/5aqJL2kUVKWXFQg5OKLd9J',
      soundcloud: 'https://soundcloud.com/charlottedewitteofficial',
      ra: 'https://ra.co/dj/charlottedewitte',
    },
    email: 'booking@charlottedewitte.com',
    fee: 'Fee on request',
    awards: ['DJ Mag Track of the Year 2018', 'Beatport Techno Artist of the Year 2019', 'RA Poll Top 10 DJ 2020–2023'],
  },

  // ── Fisher ─────────────────────────────────────────────────────────────────
  fisher: {
    name: 'FISHER',
    shortName: 'FISHER',
    role: 'DJ & Producer',
    location: 'Sydney, Australia',
    nationality: 'Australian',
    genres: ['Tech House', 'House', 'Electronic'],
    bio: "Paul Nicholas Fisher — known to the world simply as Fisher — is one of music's most explosive success stories. The former pro surfer from Sydney turned DJ/producer has redefined what Tech House sounds like for an entire generation. His 2018 release 'Losing It' became an underground anthem turned mainstream smash, racking up over 100 million Spotify streams and winning DJ Mag's coveted Track of the Year. His stage presence is unmatched — a raw, high-energy party animal who turns every performance into a communal celebration. With residencies in Las Vegas and Ibiza, headline slots at Coachella, Lollapalooza and EDC, and chart-topping releases on Catch & Release and his own Skint Records, Fisher has proven that tech house can move the entire planet.",
    bioQuote: '"Fisher is the most exciting DJ on the planet right now. When he plays, the world stops."',
    quoteSource: 'Billboard, 2022',
    accent: '#F59E0B',
    secondary: '#DC2626',
    accentDark: '#1A0A00',
    bgColor: '#080400',
    photo: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1400&q=90',
    photoPortrait: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&q=80',
    stats: {
      monthly: '8.1M',
      monthlyLabel: 'Spotify Monthly',
      countries: 58,
      shows: '150+',
      djmag: '#11',
      years: 10,
    },
    tracks: [
      {
        title: 'Losing It',
        label: 'Skint Records',
        year: '2018',
        plays: '110M',
        spotifyUrl: 'https://open.spotify.com/artist/4oLeXFyACqeem2VImYeBFe',
        soundcloudUrl: 'https://soundcloud.com/fisherdj',
      },
      {
        title: 'Crowd Control',
        label: 'Catch & Release',
        year: '2019',
        plays: '32M',
        spotifyUrl: 'https://open.spotify.com/artist/4oLeXFyACqeem2VImYeBFe',
        soundcloudUrl: 'https://soundcloud.com/fisherdj',
      },
      {
        title: 'Take Me With U',
        label: 'Skint Records',
        year: '2020',
        plays: '18M',
        spotifyUrl: 'https://open.spotify.com/artist/4oLeXFyACqeem2VImYeBFe',
        soundcloudUrl: 'https://soundcloud.com/fisherdj',
      },
      {
        title: 'Freaks (feat. Shermanology)',
        label: 'Catch & Release',
        year: '2023',
        plays: '9.4M',
        spotifyUrl: 'https://open.spotify.com/artist/4oLeXFyACqeem2VImYeBFe',
        soundcloudUrl: 'https://soundcloud.com/fisherdj',
      },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
      'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80',
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
      'https://images.unsplash.com/photo-1501386761578-eaa54b616f8a?w=800&q=80',
      'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&q=80',
    ],
    press: [
      { name: 'DJ Mag', quote: 'Track of the Year 2018 · Top 11 DJ globally' },
      { name: 'Billboard', quote: 'The most exciting DJ on the planet right now' },
      { name: 'Mixmag', quote: 'The man who took tech house to the mainstream' },
      { name: 'Rolling Stone', quote: 'Fisher\'s "Losing It" is the anthem of a generation' },
    ],
    venues: ['Coachella', 'Lollapalooza', 'EDC Las Vegas', 'Ultra Miami', 'DC-10 Ibiza', 'Exchange LA', 'Hï Ibiza', 'Club Space Miami'],
    social: {
      ig: 'https://www.instagram.com/fisherdj',
      spotify: 'https://open.spotify.com/artist/4oLeXFyACqeem2VImYeBFe',
      soundcloud: 'https://soundcloud.com/fisherdj',
      ra: 'https://ra.co/dj/fisher',
    },
    email: 'booking@fisherdj.com',
    fee: 'Fee on request',
    awards: ['DJ Mag Track of the Year 2018', 'ARIA Award Nomination 2019', 'DJ Mag Top 100 #11 (2022)'],
  },

  // ── Black Coffee ───────────────────────────────────────────────────────────
  'black-coffee': {
    name: 'BLACK COFFEE',
    shortName: 'BC',
    role: 'DJ & Producer',
    location: 'Johannesburg, South Africa',
    nationality: 'South African',
    genres: ['Afro House', 'Deep House', 'Organic House'],
    bio: 'Nkosinathi Innocent Maphumulo — known as Black Coffee — is the Grammy Award-winning South African DJ and producer who single-handedly brought Afro House to the global stage. Born in Durban and raised in Johannesburg, he fused his township roots with electronic music to create a sound that is at once deeply local and universally moving. His 2015 album "We Dance Again" is a cornerstone of modern Afro House. With over 62 million streams, seven consecutive seasons as resident at Hï Ibiza, and headline performances at Coachella, Glastonbury, Boiler Room and every major festival worldwide, Black Coffee is the most globally important African DJ of his generation. Founder of Soulistic Music, he continues to launch careers and cultivate sounds from the African continent.',
    bioQuote: '"Black Coffee\'s music is the sound of a continent speaking to the world — and the world listening."',
    quoteSource: 'The Guardian, 2022',
    accent: '#D97706',
    secondary: '#92400E',
    accentDark: '#1A0A00',
    bgColor: '#050200',
    photo: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1400&q=90',
    photoPortrait: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    stats: {
      monthly: '3.8M',
      monthlyLabel: 'Spotify Monthly',
      countries: 63,
      shows: '500+',
      djmag: '#14',
      years: 20,
    },
    tracks: [
      {
        title: 'Drive (feat. Delilah Montagu)',
        label: 'Soulistic Music',
        year: '2024',
        plays: '12M',
        spotifyUrl: 'https://open.spotify.com/artist/3RGLa0j5S2mkiCo0VoXNfL',
        soundcloudUrl: 'https://soundcloud.com/realblackcoffee',
      },
      {
        title: 'We Dance Again (feat. Nakhane Toure)',
        label: 'Soulistic Music',
        year: '2015',
        plays: '48M',
        spotifyUrl: 'https://open.spotify.com/artist/3RGLa0j5S2mkiCo0VoXNfL',
        soundcloudUrl: 'https://soundcloud.com/realblackcoffee',
      },
      {
        title: 'Superman',
        label: 'Soulistic Music',
        year: '2020',
        plays: '8.6M',
        spotifyUrl: 'https://open.spotify.com/artist/3RGLa0j5S2mkiCo0VoXNfL',
        soundcloudUrl: 'https://soundcloud.com/realblackcoffee',
      },
      {
        title: 'You Need Me',
        label: 'Soulistic Music',
        year: '2023',
        plays: '5.2M',
        spotifyUrl: 'https://open.spotify.com/artist/3RGLa0j5S2mkiCo0VoXNfL',
        soundcloudUrl: 'https://soundcloud.com/realblackcoffee',
      },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
      'https://images.unsplash.com/photo-1501386761578-eaa54b616f8a?w=800&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
      'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
      'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80',
    ],
    press: [
      { name: 'Grammy Awards', quote: 'Best Dance/Electronic Album — We Dance Again (2023)' },
      { name: 'DJ Mag', quote: 'Top 100 DJs #14 · Pioneer of global Afro House movement' },
      { name: 'Resident Advisor', quote: 'The most important African DJ of his generation' },
      { name: 'Rolling Stone', quote: 'Black Coffee is rewriting the rules of electronic music' },
    ],
    venues: ['Hï Ibiza (7 seasons)', 'Coachella', 'Glastonbury', 'Boiler Room', 'Waterfront Cape Town', 'Printworks London', 'Amnesia Ibiza', 'Ultra South Africa'],
    social: {
      ig: 'https://www.instagram.com/realblackcoffee',
      spotify: 'https://open.spotify.com/artist/3RGLa0j5S2mkiCo0VoXNfL',
      soundcloud: 'https://soundcloud.com/realblackcoffee',
      ra: 'https://ra.co/dj/blackcoffee',
    },
    email: 'booking@blackcoffee.com',
    fee: 'Fee on request',
    awards: ['Grammy Award Best Dance/Electronic Album 2023', 'BET Award Best International Act Africa 2022', 'SAMA Award Outstanding Achievement 2021'],
  },

  // ── Francisco Allendes ─────────────────────────────────────────────────────
  'francisco-allendes': {
    name: 'FRANCISCO ALLENDES',
    shortName: 'FA',
    role: 'DJ & Producer',
    location: 'Barcelona / Miami',
    nationality: 'Chilean',
    genres: ['Tech House', 'Deep Tech', 'Afro'],
    bio: 'Francisco Allendes is a Chilean-born DJ and producer based between Barcelona and Miami, widely regarded as one of the most dynamic forces in contemporary Tech House. His sets at DC-10 Ibiza, Warung Beach Club in Brazil and Fabric London have cemented his reputation for raw, high-energy performances that fuse the groove of South America with the precision of European club culture. Founder of MOOD Records, Francisco has released music on Get Physical, Desolat, Hot Creations and Crosstown Rebels — labels that define what Tech House sounds like today. His productions carry undeniable heat: infectious rhythms, deep low ends and the rare ability to hold a dancefloor for hours.',
    bioQuote: '"Allendes can read a crowd better than anyone. His sets are the highlight of every festival he plays."',
    quoteSource: 'Resident Advisor, 2023',
    accent: '#F97316',
    secondary: '#C2410C',
    accentDark: '#150500',
    bgColor: '#040108',
    photo: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1400&q=90',
    photoPortrait: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&q=80',
    stats: {
      monthly: '1.2M',
      monthlyLabel: 'Spotify Monthly',
      countries: 48,
      shows: '320+',
      djmag: 'Top 150',
      years: 15,
    },
    tracks: [
      {
        title: 'Ritual',
        label: 'MOOD Records',
        year: '2024',
        plays: '2.1M',
        spotifyUrl: 'https://open.spotify.com/artist/0LLKRLMmkzJHyMDCBxXjOl',
        soundcloudUrl: 'https://soundcloud.com/franciscoallendes',
      },
      {
        title: 'Barrio Alto EP',
        label: 'Get Physical',
        year: '2023',
        plays: '1.8M',
        spotifyUrl: 'https://open.spotify.com/artist/0LLKRLMmkzJHyMDCBxXjOl',
        soundcloudUrl: 'https://soundcloud.com/franciscoallendes',
      },
      {
        title: 'Santiago Nights',
        label: 'Desolat',
        year: '2023',
        plays: '980K',
        spotifyUrl: 'https://open.spotify.com/artist/0LLKRLMmkzJHyMDCBxXjOl',
        soundcloudUrl: 'https://soundcloud.com/franciscoallendes',
      },
      {
        title: 'Cumbia Electronica',
        label: 'Hot Creations',
        year: '2022',
        plays: '1.4M',
        spotifyUrl: 'https://open.spotify.com/artist/0LLKRLMmkzJHyMDCBxXjOl',
        soundcloudUrl: 'https://soundcloud.com/franciscoallendes',
      },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
      'https://images.unsplash.com/photo-1501386761578-eaa54b616f8a?w=800&q=80',
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
      'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80',
      'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
    ],
    press: [
      { name: 'Resident Advisor', quote: 'One of the most consistent performers in global Tech House' },
      { name: 'DJ Mag', quote: 'Allendes brings South American fire to European precision' },
      { name: 'Mixmag', quote: 'A DC-10 staple who never disappoints' },
      { name: 'FACT Magazine', quote: 'MOOD Records has become the label to watch in Tech House' },
    ],
    venues: ['DC-10 Ibiza', 'Warung Beach Club', 'Fabric London', 'Club Space Miami', 'Rex Club Paris', 'La Terrrazza Barcelona', 'Output New York', 'Printworks London'],
    social: {
      ig: 'https://www.instagram.com/franciscoallendes',
      spotify: 'https://open.spotify.com/artist/0LLKRLMmkzJHyMDCBxXjOl',
      soundcloud: 'https://soundcloud.com/franciscoallendes',
      ra: 'https://ra.co/dj/franciscoallendes',
    },
    email: 'booking@franciscoallendes.com',
    fee: 'Fee on request',
    awards: ['Beatport Tech House Top 10 (2022, 2023)', 'RA Charts #1 Track 2023', 'MOOD Records — Label of the Year Nominee 2023'],
  },
}

const DEFAULT_ARTIST = ARTISTS['black-coffee']

// ─── Waveform ─────────────────────────────────────────────────────────────────
const BARS = [3,6,10,14,9,16,12,8,15,11,6,14,10,13,7,11,15,9,12,8,16,10,13,6,11,14,8,12,7,15]

function Waveform({ accent, playing }: { accent: string; playing: boolean }) {
  return (
    <div className="flex items-center gap-[2px] h-9">
      {BARS.map((h, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full transition-all duration-150"
          style={{
            height: playing ? h + (Math.sin(i * 0.5) * 2) : h * 0.55,
            background: i < (playing ? 16 : 0) ? accent : 'rgba(255,255,255,0.1)',
            opacity: playing && i >= 16 ? 0.3 : 1,
          }}
        />
      ))}
    </div>
  )
}

// ─── Contact form ─────────────────────────────────────────────────────────────
function ContactForm({ accent, secondary, accentDark }: { accent: string; secondary: string; accentDark: string }) {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', event: '', date: '', budget: '', message: '' })

  if (sent) {
    return (
      <div className="rounded-3xl p-12 text-center flex flex-col items-center gap-5" style={{ background: `${accent}08`, border: `1px solid ${accent}20` }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl" style={{ background: `${accent}20` }}>✓</div>
        <p className="font-black tracking-tighter text-white text-2xl">Solicitud enviada</p>
        <p className="text-white/40 text-sm max-w-xs">Nuestro equipo de booking revisará tu propuesta y te responderá en 24-48 horas.</p>
      </div>
    )
  }

  const inputCls = 'w-full px-4 py-3.5 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none transition-all'
  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }
  const focusStyle = { '--tw-ring-color': accent } as React.CSSProperties

  return (
    <form onSubmit={e => { e.preventDefault(); setSent(true) }} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-mono text-white/30 tracking-widest mb-2">NOMBRE / PROMOTORA</label>
          <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Tu nombre o empresa" required className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className="block text-[10px] font-mono text-white/30 tracking-widest mb-2">EMAIL PROFESIONAL</label>
          <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} type="email" placeholder="booking@venue.com" required className={inputCls} style={inputStyle} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-mono text-white/30 tracking-widest mb-2">NOMBRE DEL EVENTO / VENUE</label>
          <input value={form.event} onChange={e => setForm(p => ({ ...p, event: e.target.value }))} placeholder="Club / Festival / Evento" required className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className="block text-[10px] font-mono text-white/30 tracking-widest mb-2">FECHA PROPUESTA</label>
          <input value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} type="date" required className={inputCls} style={inputStyle} />
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-mono text-white/30 tracking-widest mb-2">PRESUPUESTO ESTIMADO</label>
        <select value={form.budget} onChange={e => setForm(p => ({ ...p, budget: e.target.value }))} required className={inputCls + ' cursor-pointer'} style={{ ...inputStyle, appearance: 'none' }}>
          <option value="" disabled>Selecciona rango</option>
          <option>€5,000 – €10,000</option>
          <option>€10,000 – €25,000</option>
          <option>€25,000 – €50,000</option>
          <option>€50,000+</option>
          <option>A negociar</option>
        </select>
      </div>
      <div>
        <label className="block text-[10px] font-mono text-white/30 tracking-widest mb-2">DETALLES DEL SHOW</label>
        <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Cuéntanos sobre el evento, capacidad del venue, estilo musical, propuesta de valor..." rows={4} required className={`${inputCls} resize-none leading-relaxed`} style={inputStyle} />
      </div>
      <button type="submit" className="py-4 rounded-2xl font-black text-white text-sm tracking-wider transition-all hover:scale-[1.02] active:scale-95 hover:shadow-[0_0_40px_rgba(0,0,0,0.3)]" style={{ background: `linear-gradient(135deg, ${accent}, ${secondary})`, boxShadow: `0 0 30px ${accent}30` }}>
        ENVIAR SOLICITUD DE BOOKING
      </button>
      <p className="text-center text-[10px] text-white/20 font-mono">Respuesta garantizada en 24–48h · Equipo de management dedicado</p>
    </form>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function DemoPressKitPage({ params }: { params: { slug: string } }) {
  const artist = ARTISTS[params.slug] ?? DEFAULT_ARTIST
  const [playingTrack, setPlayingTrack] = useState<number | null>(null)

  const { accent, secondary, accentDark, bgColor } = artist

  // Social icon SVGs
  const IgIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  )
  const SpotifyIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  )
  const ScIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.56 8.87V17h8.76c.01-.09.01-.18.01-.27 0-2.09-1.04-3.94-2.63-5.06l-6.14-2.8zM0 14.98a2.25 2.25 0 004.5 0V9.25C2 9.25 0 11.9 0 14.98zm6.75-6.87v8.87h.01v.02h1.5V8.67c-.5-.15-1.01-.15-1.51-.08v-.08zm3 1.13v7.74h1.5V9.24c-.5.15-.99.35-1.5.62v-.62z"/>
    </svg>
  )

  return (
    <div className="min-h-screen text-white" style={{ background: bgColor }}>

      {/* ── NAV ──────────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4" style={{ background: `${bgColor}CC`, backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: accent }} />
          <span className="text-[10px] font-mono tracking-widest text-white/30">PRESSKIT.PRO</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#bio" className="text-[11px] font-mono text-white/30 hover:text-white/60 tracking-widest transition-colors">BIO</a>
          <a href="#music" className="text-[11px] font-mono text-white/30 hover:text-white/60 tracking-widest transition-colors">MUSIC</a>
          <a href="#gallery" className="text-[11px] font-mono text-white/30 hover:text-white/60 tracking-widest transition-colors">GALLERY</a>
          <a href="#press" className="text-[11px] font-mono text-white/30 hover:text-white/60 tracking-widest transition-colors">PRESS</a>
        </div>
        <a href="#contact" className="px-5 py-2 rounded-full text-[11px] font-black tracking-widest text-white transition-all hover:opacity-90 hover:scale-105" style={{ background: accent, boxShadow: `0 0 20px ${accent}40` }}>
          BOOKING
        </a>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
        {/* Full-bleed photo */}
        <div className="absolute inset-0">
          <img src={artist.photo} alt={artist.name} className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${bgColor}40 0%, transparent 35%, ${bgColor}80 65%, ${bgColor} 100%)` }} />
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 30% 50%, ${accent}12 0%, transparent 60%)` }} />
        </div>

        {/* Content */}
        <div className="relative z-10 px-8 md:px-16 pb-20 max-w-7xl mx-auto w-full">
          {/* Genre pills */}
          <div className="flex gap-2 flex-wrap mb-6">
            {artist.genres.map(g => (
              <span key={g} className="text-[10px] font-mono tracking-widest px-3 py-1.5 rounded-full border" style={{ color: accent, borderColor: `${accent}40`, background: `${accent}10` }}>
                {g.toUpperCase()}
              </span>
            ))}
          </div>

          {/* Name — massive */}
          <h1 className="font-black tracking-tighter leading-[0.85] mb-4" style={{
            fontSize: 'clamp(52px, 9vw, 130px)',
            textShadow: `0 0 120px ${accent}30`,
          }}>
            {artist.name}
          </h1>

          {/* Sub row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-10">
            <span className="text-sm font-mono text-white/50">{artist.role}</span>
            <span className="text-white/20">·</span>
            <span className="text-sm font-mono text-white/50">{artist.location}</span>
            <span className="text-white/20">·</span>
            <span className="text-sm font-mono text-white/50">{artist.nationality}</span>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px mb-10" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
            {[
              { val: artist.stats.monthly, lbl: artist.stats.monthlyLabel },
              { val: `${artist.stats.countries}`, lbl: 'Países' },
              { val: artist.stats.shows, lbl: 'Shows / año' },
              { val: artist.stats.djmag ?? `${artist.stats.years}Y`, lbl: artist.stats.djmag ? 'DJ Mag' : 'En la escena' },
            ].map(({ val, lbl }) => (
              <div key={lbl} className="flex flex-col items-center py-5 px-4" style={{ background: `${bgColor}CC` }}>
                <span className="text-2xl md:text-3xl font-black tracking-tighter" style={{ color: accent }}>{val}</span>
                <span className="text-[9px] font-mono text-white/25 tracking-widest mt-1">{lbl.toUpperCase()}</span>
              </div>
            ))}
          </div>

          {/* CTA + social */}
          <div className="flex flex-wrap items-center gap-4">
            <a href="#contact" className="px-10 py-4 rounded-2xl font-black text-white text-sm tracking-wider transition-all hover:scale-105 hover:opacity-95" style={{ background: `linear-gradient(135deg, ${accent}, ${secondary})`, boxShadow: `0 0 50px ${accent}35` }}>
              SOLICITAR BOOKING
            </a>
            <div className="flex items-center gap-3">
              <a href={artist.social.ig} target="_blank" rel="noopener" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                <IgIcon />
              </a>
              <a href={artist.social.spotify} target="_blank" rel="noopener" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                <SpotifyIcon />
              </a>
              <a href={artist.social.soundcloud} target="_blank" rel="noopener" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                <ScIcon />
              </a>
              <a href={artist.social.ra} target="_blank" rel="noopener" className="px-4 py-2 rounded-xl text-[10px] font-mono tracking-widest transition-all hover:scale-105" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                RA
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-[8px] font-mono text-white/40 tracking-widest">SCROLL</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── QUOTE BAND ───────────────────────────────────────────────────────── */}
      <section style={{ background: `${accent}0C`, borderTop: `1px solid ${accent}20`, borderBottom: `1px solid ${accent}20` }}>
        <div className="max-w-5xl mx-auto px-8 md:px-16 py-14 text-center">
          <p className="text-xl md:text-2xl font-black tracking-tighter text-white/80 leading-snug max-w-3xl mx-auto">
            {artist.bioQuote}
          </p>
          <p className="text-xs font-mono text-white/30 tracking-widest mt-4">{artist.quoteSource.toUpperCase()}</p>
        </div>
      </section>

      {/* ── BIO ──────────────────────────────────────────────────────────────── */}
      <section id="bio" className="py-28 px-8 md:px-16 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-[1fr_420px] gap-16 items-start">
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-[10px] font-mono tracking-widest mb-4" style={{ color: accent }}>// BIOGRAFÍA</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight mb-6">
                Sonido que define<br />una generación.
              </h2>
              <p className="text-white/50 leading-relaxed text-base">{artist.bio}</p>
            </div>

            {/* Awards */}
            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-mono tracking-widest text-white/25">RECONOCIMIENTOS</p>
              {artist.awards.map(award => (
                <div key={award} className="flex items-start gap-3">
                  <span style={{ color: accent }}>✦</span>
                  <span className="text-sm text-white/60">{award}</span>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <a href={`mailto:${artist.email}`} className="px-6 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105" style={{ background: `${accent}15`, border: `1px solid ${accent}30`, color: accent }}>
                Contactar management
              </a>
              <button className="px-6 py-3 rounded-xl text-sm font-semibold border border-white/[0.08] text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-all">
                Descargar EPK (PDF)
              </button>
            </div>
          </div>

          {/* Portrait */}
          <div className="flex flex-col gap-4">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden" style={{ border: `1px solid ${accent}20`, boxShadow: `0 0 60px ${accent}12` }}>
              <img src={artist.photoPortrait} alt={artist.name} className="w-full h-full object-cover" />
            </div>
            {/* Venues highlight */}
            <div className="rounded-2xl p-5" style={{ background: `${accent}08`, border: `1px solid ${accent}15` }}>
              <p className="text-[10px] font-mono tracking-widest text-white/30 mb-3">VENUES DESTACADOS</p>
              <div className="flex flex-wrap gap-2">
                {artist.venues.map(v => (
                  <span key={v} className="text-xs font-mono px-2.5 py-1 rounded-lg text-white/50" style={{ background: 'rgba(255,255,255,0.05)' }}>{v}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS FULL-WIDTH ─────────────────────────────────────────────────── */}
      <section style={{ background: `${accent}06`, borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x divide-white/[0.05]">
          {[
            { val: artist.stats.monthly, lbl: artist.stats.monthlyLabel, sub: 'Actualizado mensualmente' },
            { val: `${artist.stats.countries}+`, lbl: 'Países', sub: 'Presencia global' },
            { val: artist.stats.shows, lbl: 'Shows por año', sub: 'Festivales + clubes' },
            { val: `${artist.stats.years}`, lbl: 'Años en la escena', sub: 'Carrera consolidada' },
          ].map(({ val, lbl, sub }) => (
            <div key={lbl} className="flex flex-col gap-1 md:pl-8 first:pl-0">
              <p className="text-4xl md:text-5xl font-black tracking-tighter" style={{ color: accent }}>{val}</p>
              <p className="text-sm font-semibold text-white/70">{lbl}</p>
              <p className="text-[10px] font-mono text-white/25">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MUSIC ────────────────────────────────────────────────────────────── */}
      <section id="music" className="py-28 px-8 md:px-16 max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-[10px] font-mono tracking-widest mb-3" style={{ color: accent }}>// DISCOGRAFÍA</p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Releases destacados</h2>
            <a href={artist.social.spotify} target="_blank" rel="noopener" className="hidden md:flex items-center gap-2 text-xs font-mono text-white/30 hover:text-white/60 transition-colors">
              Ver en Spotify →
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {artist.tracks.map(({ title, label, year, plays, spotifyUrl, soundcloudUrl }, i) => (
            <div
              key={title}
              className="group flex items-center gap-5 p-5 rounded-2xl transition-all cursor-pointer hover:scale-[1.01]"
              style={{ background: `${accent}06`, border: `1px solid ${accent}10` }}
              onClick={() => setPlayingTrack(playingTrack === i ? null : i)}
            >
              {/* Index / Play */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-sm font-mono transition-all" style={{ background: playingTrack === i ? accent : `${accent}18`, color: playingTrack === i ? 'white' : accent }}>
                {playingTrack === i ? (
                  <div className="flex gap-[3px] items-end">
                    <div className="w-1 rounded-sm bg-white animate-pulse" style={{ height: 12 }} />
                    <div className="w-1 rounded-sm bg-white animate-pulse" style={{ height: 16, animationDelay: '0.15s' }} />
                    <div className="w-1 rounded-sm bg-white animate-pulse" style={{ height: 10, animationDelay: '0.3s' }} />
                  </div>
                ) : (
                  <span className="font-black">{String(i + 1).padStart(2, '0')}</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-black text-white text-base leading-tight">{title}</p>
                <p className="text-xs font-mono text-white/30 mt-0.5">{label} · {year}</p>
              </div>

              {/* Plays */}
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-black" style={{ color: accent }}>{plays}</span>
                <span className="text-[9px] font-mono text-white/25">PLAYS</span>
              </div>

              {/* Waveform */}
              <div className="hidden lg:block">
                <Waveform accent={accent} playing={playingTrack === i} />
              </div>

              {/* Links */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <a href={spotifyUrl} target="_blank" rel="noopener" onClick={e => e.stopPropagation()} className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-mono transition-all hover:scale-110" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}>
                  <SpotifyIcon />
                </a>
                <a href={soundcloudUrl} target="_blank" rel="noopener" onClick={e => e.stopPropagation()} className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-mono transition-all hover:scale-110" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}>
                  <ScIcon />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <a href={artist.social.spotify} target="_blank" rel="noopener" className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-mono text-white/40 hover:text-white/70 transition-all" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <SpotifyIcon /> Ver discografía completa en Spotify
          </a>
        </div>
      </section>

      {/* ── GALLERY ──────────────────────────────────────────────────────────── */}
      <section id="gallery" className="pb-28 px-8 md:px-16 max-w-7xl mx-auto">
        <p className="text-[10px] font-mono tracking-widest mb-4" style={{ color: accent }}>// GALERÍA</p>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-10">En el escenario.</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {artist.gallery.map((url, i) => (
            <div
              key={url}
              className={`overflow-hidden rounded-2xl ${i === 0 ? 'md:col-span-2 md:row-span-1 aspect-video' : 'aspect-square'} group cursor-zoom-in`}
              style={{ border: `1px solid rgba(255,255,255,0.06)` }}
            >
              <img src={url} alt={`${artist.name} gallery ${i + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          ))}
        </div>
      </section>

      {/* ── PRESS ────────────────────────────────────────────────────────────── */}
      <section id="press" style={{ background: `${accent}05`, borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-24">
          <p className="text-[10px] font-mono tracking-widest mb-4" style={{ color: accent }}>// PRENSA & RECONOCIMIENTOS</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-14">Lo que dicen de él.</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {artist.press.map(({ name, quote }) => (
              <div key={name} className="flex flex-col gap-4 p-7 rounded-2xl" style={{ background: `${accent}08`, border: `1px solid ${accent}15` }}>
                <div className="inline-flex">
                  <span className="text-xs font-black tracking-widest px-3 py-1.5 rounded-lg" style={{ background: accent, color: 'white' }}>{name.toUpperCase()}</span>
                </div>
                <p className="text-white/70 leading-relaxed text-sm">{quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RIDER TEASER ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-8 md:px-16 max-w-7xl mx-auto">
        <div className="rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8" style={{ background: `${accent}08`, border: `1px solid ${accent}15` }}>
          <div>
            <p className="text-[10px] font-mono tracking-widest mb-3 text-white/30">// RIDER TÉCNICO</p>
            <h3 className="text-3xl font-black tracking-tighter mb-2">Rider completo disponible</h3>
            <p className="text-white/40 text-sm max-w-md">Sistema de sonido, iluminación, hospitalidad y especificaciones técnicas completas disponibles bajo solicitud de booking confirmada.</p>
          </div>
          <button className="shrink-0 px-8 py-4 rounded-2xl font-black text-sm tracking-wider transition-all hover:scale-105" style={{ background: `${accent}18`, border: `1px solid ${accent}35`, color: accent }}>
            SOLICITAR RIDER →
          </button>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────────── */}
      <section id="contact" className="pb-32 px-8 md:px-16 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[10px] font-mono tracking-widest mb-4" style={{ color: accent }}>// BOOKING</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Hablemos de tu evento.</h2>
          <p className="text-white/40 max-w-lg mx-auto text-sm">Completa el formulario y nuestro equipo de management se pondrá en contacto en menos de 48 horas con disponibilidad y condiciones.</p>
        </div>
        <ContactForm accent={accent} secondary={secondary} accentDark={accentDark} />
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.05] py-10 px-8 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
            <span className="text-[10px] font-mono text-white/20 tracking-widest">PRESSKIT.PRO · {artist.name}</span>
          </div>
          <div className="flex items-center gap-6">
            <a href={artist.social.ig} target="_blank" rel="noopener" className="text-[10px] font-mono text-white/20 hover:text-white/50 tracking-widest transition-colors">INSTAGRAM</a>
            <a href={artist.social.spotify} target="_blank" rel="noopener" className="text-[10px] font-mono text-white/20 hover:text-white/50 tracking-widest transition-colors">SPOTIFY</a>
            <a href={artist.social.ra} target="_blank" rel="noopener" className="text-[10px] font-mono text-white/20 hover:text-white/50 tracking-widest transition-colors">RA</a>
          </div>
          <Link href="/" className="text-[10px] font-mono text-white/15 hover:text-white/40 tracking-widest transition-colors">
            Crea el tuyo en PRESSKIT.PRO →
          </Link>
        </div>
      </footer>

    </div>
  )
}
