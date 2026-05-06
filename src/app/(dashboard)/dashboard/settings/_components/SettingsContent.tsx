'use client'
import { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import {
  User, Globe, Bell, Shield, CreditCard, Trash2, Check,
  Copy, ExternalLink, AlertTriangle, Zap, Mail, Lock, Eye, EyeOff, LogOut, Camera,
} from 'lucide-react'

const TABS = [
  { id: 'perfil',          label: 'Perfil',            icon: User },
  { id: 'cuenta',          label: 'Cuenta',            icon: Shield },
  { id: 'notificaciones',  label: 'Notificaciones',    icon: Bell },
  { id: 'dominio',         label: 'Dominio',           icon: Globe },
  { id: 'plan',            label: 'Plan',              icon: CreditCard },
]

export interface SettingsInitialData {
  artistName: string
  email: string
  bio: string
  genre: string
  slug: string
  bookingEmail: string
  bookingUrl: string
  city: string
  photoUrl: string | null
  initials: string
}

export default function SettingsContent({
  initialData,
  saveProfileAction,
}: {
  initialData: SettingsInitialData
  saveProfileAction: (data: {
    artistName: string
    bio: string
    bookingEmail: string
    bookingUrl: string
    slug: string
  }) => Promise<{ ok: boolean; error?: string }>
}) {
  const [tab, setTab] = useState('perfil')
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [saveError, setSaveError] = useState<string | null>(null)

  const [profile, setProfile] = useState({
    artistName:   initialData.artistName,
    bio:          initialData.bio,
    bookingEmail: initialData.bookingEmail,
    bookingUrl:   initialData.bookingUrl,
    slug:         initialData.slug,
  })

  const [notifs, setNotifs] = useState({
    bookingRequest: true,
    newVisitor:     false,
    weeklyReport:   true,
    downloadAlert:  true,
    shareAlert:     false,
    productUpdates: true,
  })

  function handleSave() {
    setSaveError(null)
    startTransition(async () => {
      const res = await saveProfileAction(profile)
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      } else {
        setSaveError(res.error ?? 'Error al guardar')
      }
    })
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const inputCls = "w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2.5 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-[#C026D3]/40 focus:bg-white/[0.06] transition-all"
  const labelCls = "block font-mono text-[10px] text-white/35 mb-1.5 uppercase tracking-[0.1em]"

  const cardCls = "rounded-2xl border border-white/[0.06] p-6"
  const cardStyle = { background: 'rgba(255,255,255,0.015)' }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-white/[0.04]">
        <p className="font-mono text-[10px] text-white/25 uppercase tracking-[0.2em] mb-1">Panel</p>
        <h1 className="font-display font-semibold text-[28px] tracking-[-0.03em]">
          Configuración{' '}
          <span className="font-serif italic font-normal text-white/35">de cuenta</span>
        </h1>
      </div>

      <div className="px-8 py-7 flex gap-8 max-w-5xl pb-16">
        {/* Sidebar */}
        <nav className="w-48 shrink-0 flex flex-col gap-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] text-left transition-all"
              style={tab === id
                ? { background: 'rgba(192,38,211,0.10)', color: '#E879F9', border: '1px solid rgba(192,38,211,0.20)' }
                : { color: 'rgba(255,255,255,0.40)', border: '1px solid transparent' }
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
          <div className="mt-6 pt-6 border-t border-white/[0.04] flex flex-col gap-1">
            <button className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] text-red-400/50 hover:text-red-400 hover:bg-red-400/[0.06] w-full transition-all" style={{ border: '1px solid transparent' }}>
              <Trash2 className="w-4 h-4 shrink-0" /> Eliminar cuenta
            </button>
            <button className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] text-white/30 hover:text-white/60 hover:bg-white/[0.04] w-full transition-all" style={{ border: '1px solid transparent' }}>
              <LogOut className="w-4 h-4 shrink-0" /> Cerrar sesión
            </button>
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0">

          {/* PERFIL */}
          {tab === 'perfil' && (
            <motion.div
              key="perfil"
              className="flex flex-col gap-5"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              {/* Avatar */}
              <div className={cardCls} style={cardStyle}>
                <p className={labelCls}>Foto de artista</p>
                <div className="flex items-center gap-5 mt-3">
                  <div className="relative group cursor-pointer">
                    {initialData.photoUrl ? (
                      <img
                        src={initialData.photoUrl}
                        alt={initialData.artistName}
                        className="w-20 h-20 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black"
                        style={{ background: 'linear-gradient(135deg, #C026D3, #7C3AED)' }}>
                        {initialData.initials}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <button className="px-4 py-2 rounded-xl text-[13px] font-medium transition-colors" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      Subir foto
                    </button>
                    <p className="font-mono text-[10px] text-white/25 mt-2">JPG, PNG o WebP · Máx 5MB</p>
                  </div>
                </div>
              </div>

              {/* Basic info */}
              <div className={cardCls} style={cardStyle}>
                <p className={labelCls}>Información básica</p>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className={labelCls}>Nombre artístico</label>
                    <input
                      value={profile.artistName}
                      onChange={e => setProfile(p => ({ ...p, artistName: e.target.value }))}
                      placeholder="DJ Name"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Email de booking</label>
                    <input
                      value={profile.bookingEmail}
                      onChange={e => setProfile(p => ({ ...p, bookingEmail: e.target.value }))}
                      placeholder="booking@tudominio.com"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>URL de booking (opcional)</label>
                    <input
                      value={profile.bookingUrl}
                      onChange={e => setProfile(p => ({ ...p, bookingUrl: e.target.value }))}
                      placeholder="https://calendly.com/..."
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Género / Email actual</label>
                    <input
                      value={initialData.email}
                      readOnly
                      className={`${inputCls} opacity-40 cursor-not-allowed`}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>Biografía corta</label>
                    <textarea
                      value={profile.bio}
                      onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                      rows={3}
                      className={`${inputCls} resize-none`}
                    />
                    <p className="font-mono text-[10px] text-white/20 mt-1 text-right">{profile.bio.length}/500</p>
                  </div>
                </div>
              </div>

              {/* URL pública */}
              <div className={cardCls} style={cardStyle}>
                <p className={labelCls}>URL de tu presskit</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex-1 flex items-center rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="px-3 py-2.5 text-[12px] text-white/30 font-mono shrink-0" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>presskit.pro/</span>
                    <input
                      value={profile.slug}
                      onChange={e => setProfile(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                      className="flex-1 bg-transparent px-3 py-2.5 text-[13px] text-white focus:outline-none font-mono"
                    />
                  </div>
                  <button
                    onClick={() => handleCopy(`https://presskit.pro/${profile.slug}`)}
                    className="p-2.5 rounded-xl transition-colors hover:bg-white/[0.06]"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/40" />}
                  </button>
                  <a
                    href={`https://presskit.pro/${profile.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl transition-colors hover:bg-white/[0.06]"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <ExternalLink className="w-4 h-4 text-white/40" />
                  </a>
                </div>
                <p className="font-mono text-[10px] text-white/20 mt-2">Solo letras minúsculas, números y guiones</p>
              </div>

              {saveError && (
                <p className="font-mono text-[11px] text-rose-400">{saveError}</p>
              )}

              <button
                onClick={handleSave}
                disabled={isPending}
                className="self-start px-6 py-3 rounded-xl text-[13px] font-semibold transition-all flex items-center gap-2"
                style={{ background: saved ? '#10B981' : '#C026D3', opacity: isPending ? 0.7 : 1 }}
              >
                {saved ? <><Check className="w-4 h-4" /> Guardado</> : isPending ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </motion.div>
          )}

          {/* CUENTA */}
          {tab === 'cuenta' && (
            <motion.div key="cuenta" className="flex flex-col gap-5" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              {/* Email */}
              <div className={cardCls} style={cardStyle}>
                <p className={labelCls}>Email</p>
                <div className="flex items-center gap-2 mt-3 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Mail className="w-4 h-4 text-white/30" />
                  <span className="text-[13px] text-white">{initialData.email}</span>
                  <span className="ml-auto font-mono text-[9px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">Verificado</span>
                </div>
              </div>

              {/* Password */}
              <div className={cardCls} style={cardStyle}>
                <p className={labelCls}>Contraseña</p>
                <div className="flex flex-col gap-3 mt-3">
                  {['Contraseña actual', 'Nueva contraseña', 'Confirmar contraseña'].map(label => (
                    <div key={label}>
                      <label className={labelCls}>{label}</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className={`${inputCls} pr-10`}
                        />
                        <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                  <button className="self-start px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors" style={{ background: '#C026D3' }}>
                    Actualizar contraseña
                  </button>
                </div>
              </div>

              {/* Danger zone */}
              <div className="rounded-2xl border border-red-500/10 p-6" style={{ background: 'rgba(239,68,68,0.04)' }}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[13px] font-semibold text-red-400">Zona peligrosa</p>
                    <p className="text-[12px] text-white/35 mt-1 mb-4">Eliminar tu cuenta borrará tu presskit, datos e historial permanentemente.</p>
                    <button className="px-4 py-2 rounded-xl text-[12px] font-semibold transition-colors text-red-400" style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.20)' }}>
                      Eliminar mi cuenta
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* NOTIFICACIONES */}
          {tab === 'notificaciones' && (
            <motion.div key="notifs" className="flex flex-col gap-5" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className={cardCls} style={cardStyle}>
                <p className={labelCls}>Notificaciones por email</p>
                <div className="flex flex-col gap-0 mt-3">
                  {[
                    { key: 'bookingRequest', label: 'Nueva solicitud de booking',     desc: 'Cuando alguien usa el formulario de contacto' },
                    { key: 'newVisitor',     label: 'Nuevo visitante',                desc: 'Cada vez que alguien visita tu presskit' },
                    { key: 'weeklyReport',   label: 'Reporte semanal',               desc: 'Resumen de analíticas todos los lunes' },
                    { key: 'downloadAlert',  label: 'Descarga de EPK',               desc: 'Cuando alguien descarga tu press kit en PDF' },
                    { key: 'shareAlert',     label: 'Tu presskit fue compartido',    desc: 'Cuando alguien comparte tu URL' },
                    { key: 'productUpdates', label: 'Novedades del producto',        desc: 'Nuevas funciones de PRESSKIT.PRO' },
                  ].map(({ key, label, desc }, i, arr) => (
                    <div
                      key={key}
                      className="flex items-center justify-between py-4"
                      style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                    >
                      <div>
                        <p className="text-[13px] text-white font-medium">{label}</p>
                        <p className="text-[11px] text-white/30 mt-0.5">{desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifs(n => ({ ...n, [key]: !n[key as keyof typeof notifs] }))}
                        className="relative w-11 h-6 rounded-full transition-all shrink-0"
                        style={{ background: notifs[key as keyof typeof notifs] ? '#C026D3' : 'rgba(255,255,255,0.08)' }}
                      >
                        <span
                          className="absolute top-1 w-4 h-4 bg-white rounded-full transition-all"
                          style={{ left: notifs[key as keyof typeof notifs] ? 24 : 4 }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={handleSave}
                className="self-start px-6 py-3 rounded-xl text-[13px] font-semibold transition-all flex items-center gap-2"
                style={{ background: saved ? '#10B981' : '#C026D3' }}
              >
                {saved ? <><Check className="w-4 h-4" /> Guardado</> : 'Guardar preferencias'}
              </button>
            </motion.div>
          )}

          {/* DOMINIO */}
          {tab === 'dominio' && (
            <motion.div key="dominio" className="flex flex-col gap-5" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className={cardCls} style={cardStyle}>
                <p className={labelCls}>URL actual</p>
                <div className="flex items-center gap-2 mt-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(192,38,211,0.05)', border: '1px solid rgba(192,38,211,0.18)' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px #34D399' }} />
                  <span className="font-mono text-[13px] text-white">presskit.pro/{initialData.slug}</span>
                  <button onClick={() => handleCopy(`https://presskit.pro/${initialData.slug}`)} className="ml-auto text-white/30 hover:text-white/60">
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className={cardCls} style={cardStyle}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-[14px] font-semibold text-white">Dominio personalizado</h2>
                    <p className="text-[12px] text-white/35 mt-0.5">Conecta tu propio dominio (ej: presskit.tumarca.com)</p>
                  </div>
                  <span className="font-mono text-[9px] flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(192,38,211,0.10)', border: '1px solid rgba(192,38,211,0.20)', color: '#E879F9' }}>
                    <Zap className="w-2.5 h-2.5" /> PRO
                  </span>
                </div>
                <input placeholder="presskit.tudominio.com" className={`${inputCls} font-mono`} />
                <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <p className="font-mono text-[10px] text-white/40 mb-3">Agrega estos registros DNS en tu proveedor:</p>
                  {[
                    { type: 'CNAME', name: 'presskit', value: 'cname.presskit.pro' },
                    { type: 'TXT',   name: '_verify',  value: 'pk_verify_xxx' },
                  ].map(r => (
                    <div key={r.type} className="grid grid-cols-3 gap-2 font-mono text-[10px] mb-1.5">
                      <span className="text-center rounded px-2 py-1" style={{ background: 'rgba(192,38,211,0.12)', color: '#C026D3' }}>{r.type}</span>
                      <span className="px-2 py-1 rounded truncate text-white/50" style={{ background: 'rgba(255,255,255,0.04)' }}>{r.name}</span>
                      <span className="px-2 py-1 rounded truncate text-white/50" style={{ background: 'rgba(255,255,255,0.04)' }}>{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={cardCls} style={cardStyle}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <div>
                      <p className="text-[13px] font-semibold text-white">SSL / HTTPS</p>
                      <p className="text-[11px] text-white/35">Certificado SSL automático incluido</p>
                    </div>
                  </div>
                  <span className="font-mono text-[9px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded-full">Activo</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* PLAN */}
          {tab === 'plan' && (
            <motion.div key="plan" className="flex flex-col gap-5" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, rgba(192,38,211,0.12), rgba(124,58,237,0.08))', border: '1px solid rgba(192,38,211,0.20)' }}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-[#C026D3]" />
                      <span className="font-mono text-[9px] text-[#C026D3] tracking-widest uppercase">Plan actual</span>
                    </div>
                    <h2 className="font-display font-semibold text-[32px] tracking-[-0.04em]">PRO</h2>
                    <p className="text-[12px] text-white/40 mt-1">Período de prueba · Expira en 30 días</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-semibold text-[28px] tracking-[-0.03em]">$12<span className="text-[13px] font-normal text-white/35">/mes</span></p>
                    <p className="font-mono text-[10px] text-white/25 mt-1">o $99/año (−31%)</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2 text-[12px] text-white/60">
                  {['Presskit ilimitado', 'Dominio personalizado', 'Analíticas avanzadas', 'Sin marca de agua', 'Exportar PDF / EPK', 'Soporte prioritario'].map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-[#C026D3]" /> {f}
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-5 flex gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <button className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-colors" style={{ background: '#C026D3' }}>
                    Activar plan PRO
                  </button>
                  <button className="px-4 py-2.5 rounded-xl text-[13px] font-medium transition-colors" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    Ver planes
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  )
}
