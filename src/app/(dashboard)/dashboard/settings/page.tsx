'use client'
import { useState } from 'react'
import {
  User, Globe, Bell, Shield, CreditCard, Trash2, Check,
  Copy, ExternalLink, ChevronRight, AlertTriangle, Zap,
  Mail, Lock, Eye, EyeOff, LogOut, Camera
} from 'lucide-react'

const TABS = [
  { id: 'perfil', label: 'Perfil', icon: User },
  { id: 'cuenta', label: 'Cuenta', icon: Shield },
  { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
  { id: 'dominio', label: 'Dominio', icon: Globe },
  { id: 'plan', label: 'Plan & Facturación', icon: CreditCard },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('perfil')
  const [saved, setSaved] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)

  // Profile state
  const [profile, setProfile] = useState({
    name: 'Valentina M.',
    artistName: 'VALENTINA M.',
    bio: 'House DJ y productora radicada en Buenos Aires. Residente en Club Crobar y Niceto Club.',
    email: 'valentina@email.com',
    phone: '+54 11 1234-5678',
    website: 'valentinaDJ.com',
    city: 'Buenos Aires',
    country: 'Argentina',
  })

  // Notifications state
  const [notifs, setNotifs] = useState({
    bookingRequest: true,
    newVisitor: false,
    weeklyReport: true,
    productUpdates: true,
    downloadAlert: true,
    shareAlert: false,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight">Configuración</h1>
        <p className="text-white/40 text-sm mt-1">Administra tu cuenta, plan y preferencias</p>
      </div>

      <div className="flex gap-8 max-w-5xl">
        {/* Sidebar tabs */}
        <div className="w-52 shrink-0">
          <nav className="flex flex-col gap-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all ${
                  activeTab === id
                    ? 'bg-[#C026D3]/10 text-[#E879F9] border border-[#C026D3]/20'
                    : 'text-white/45 hover:text-white/80 hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </button>
            ))}
          </nav>

          {/* Danger zone shortcut */}
          <div className="mt-6 pt-6 border-t border-white/[0.06]">
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/[0.06] w-full transition-all">
              <Trash2 className="w-4 h-4 shrink-0" />
              Eliminar cuenta
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/30 hover:text-white/60 hover:bg-white/[0.04] w-full transition-all">
              <LogOut className="w-4 h-4 shrink-0" />
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Content panel */}
        <div className="flex-1 min-w-0">

          {/* ── PERFIL ── */}
          {activeTab === 'perfil' && (
            <div className="space-y-6">
              {/* Avatar */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-5">Foto de perfil</h2>
                <div className="flex items-center gap-5">
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#C026D3] to-[#7C3AED] flex items-center justify-center text-2xl font-black">
                      VM
                    </div>
                    <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] rounded-xl text-sm font-medium transition-colors">
                      Subir foto
                    </button>
                    <p className="text-xs text-white/30 mt-2">JPG, PNG o WebP · Máx 5MB</p>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-5">Información básica</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Nombre real', key: 'name', placeholder: 'Tu nombre' },
                    { label: 'Nombre artístico', key: 'artistName', placeholder: 'DJ Name' },
                    { label: 'Ciudad', key: 'city', placeholder: 'Ciudad' },
                    { label: 'País', key: 'country', placeholder: 'País' },
                    { label: 'Teléfono', key: 'phone', placeholder: '+54...' },
                    { label: 'Sitio web', key: 'website', placeholder: 'tudominio.com' },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs text-white/40 mb-1.5 font-mono">{label}</label>
                      <input
                        value={(profile as any)[key]}
                        onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C026D3]/50 focus:bg-white/[0.06] transition-all"
                      />
                    </div>
                  ))}
                  <div className="col-span-2">
                    <label className="block text-xs text-white/40 mb-1.5 font-mono">Bio corta</label>
                    <textarea
                      value={profile.bio}
                      onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                      rows={3}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C026D3]/50 focus:bg-white/[0.06] transition-all resize-none"
                    />
                    <p className="text-xs text-white/25 mt-1 text-right">{profile.bio.length}/280</p>
                  </div>
                </div>
              </div>

              {/* URL pública */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-5">URL de tu presskit</h2>
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center bg-white/[0.04] border border-white/[0.08] rounded-xl overflow-hidden">
                    <span className="px-3 py-2.5 text-sm text-white/30 border-r border-white/[0.06] font-mono shrink-0">presskit.pro/</span>
                    <input
                      defaultValue="valentina-m"
                      className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white focus:outline-none font-mono"
                    />
                  </div>
                  <button
                    onClick={() => handleCopy('https://presskit.pro/valentina-m')}
                    className="p-2.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] rounded-xl transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/50" />}
                  </button>
                  <a
                    href="/demo/valentina-m"
                    target="_blank"
                    className="p-2.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] rounded-xl transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-white/50" />
                  </a>
                </div>
                <p className="text-xs text-white/25 mt-2 font-mono">Solo letras, números y guiones · Sin espacios</p>
              </div>

              <button
                onClick={handleSave}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  saved
                    ? 'bg-green-500 text-white'
                    : 'bg-[#C026D3] hover:bg-[#A21CAF] text-white'
                }`}
              >
                {saved ? (
                  <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Guardado</span>
                ) : 'Guardar cambios'}
              </button>
            </div>
          )}

          {/* ── CUENTA ── */}
          {activeTab === 'cuenta' && (
            <div className="space-y-6">
              {/* Email */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-5">Email</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-white/40 mb-1.5 font-mono">Email actual</label>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5">
                        <Mail className="w-4 h-4 text-white/30" />
                        <span className="text-sm text-white">{profile.email}</span>
                        <span className="ml-auto text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-mono">Verificado</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 mb-1.5 font-mono">Nuevo email</label>
                    <input
                      placeholder="nuevo@email.com"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C026D3]/50 transition-all"
                    />
                  </div>
                  <button className="px-4 py-2 bg-[#C026D3] hover:bg-[#A21CAF] rounded-xl text-sm font-bold transition-colors">
                    Cambiar email
                  </button>
                </div>
              </div>

              {/* Password */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-5">Contraseña</h2>
                <div className="space-y-3">
                  {[
                    { label: 'Contraseña actual', placeholder: '••••••••' },
                    { label: 'Nueva contraseña', placeholder: 'Mínimo 8 caracteres' },
                    { label: 'Confirmar nueva contraseña', placeholder: 'Repite la nueva contraseña' },
                  ].map(({ label, placeholder }) => (
                    <div key={label}>
                      <label className="block text-xs text-white/40 mb-1.5 font-mono">{label}</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder={placeholder}
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 pr-10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C026D3]/50 transition-all"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                  <button className="px-4 py-2 bg-[#C026D3] hover:bg-[#A21CAF] rounded-xl text-sm font-bold transition-colors">
                    Actualizar contraseña
                  </button>
                </div>
              </div>

              {/* 2FA */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-white">Autenticación de dos factores</h2>
                    <p className="text-xs text-white/40 mt-1">Agrega una capa extra de seguridad a tu cuenta</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/30 font-mono">Desactivado</span>
                    <button className="w-11 h-6 bg-white/[0.08] rounded-full border border-white/[0.1] relative transition-colors hover:bg-white/[0.12]">
                      <span className="absolute left-1 top-1 w-4 h-4 bg-white/30 rounded-full transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Sessions */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-5">Sesiones activas</h2>
                <div className="space-y-3">
                  {[
                    { device: 'MacBook Pro · Chrome 120', location: 'Buenos Aires, AR', time: 'Ahora mismo', current: true },
                    { device: 'iPhone 15 · Safari', location: 'Buenos Aires, AR', time: 'Hace 2 horas', current: false },
                    { device: 'Windows PC · Firefox', location: 'Córdoba, AR', time: 'Hace 3 días', current: false },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${s.current ? 'bg-green-400' : 'bg-white/20'}`} />
                        <div>
                          <p className="text-sm text-white">{s.device}</p>
                          <p className="text-xs text-white/30 font-mono">{s.location} · {s.time}</p>
                        </div>
                      </div>
                      {!s.current && (
                        <button className="text-xs text-red-400/60 hover:text-red-400 transition-colors font-mono">
                          Cerrar
                        </button>
                      )}
                      {s.current && (
                        <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-mono">Esta sesión</span>
                      )}
                    </div>
                  ))}
                </div>
                <button className="mt-3 text-xs text-red-400/60 hover:text-red-400 transition-colors font-mono">
                  Cerrar todas las otras sesiones
                </button>
              </div>

              {/* Delete account */}
              <div className="bg-red-950/20 border border-red-500/10 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h2 className="text-sm font-semibold text-red-400">Zona peligrosa</h2>
                    <p className="text-xs text-white/40 mt-1 mb-4">
                      Al eliminar tu cuenta se borrarán permanentemente tu presskit, datos e historial. Esta acción no se puede deshacer.
                    </p>
                    <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-sm font-bold transition-colors">
                      Eliminar mi cuenta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── NOTIFICACIONES ── */}
          {activeTab === 'notificaciones' && (
            <div className="space-y-6">
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-5">Notificaciones por email</h2>
                <div className="space-y-1">
                  {[
                    { key: 'bookingRequest', label: 'Nueva solicitud de booking', desc: 'Cuando alguien usa el formulario de contacto' },
                    { key: 'newVisitor', label: 'Nuevo visitante', desc: 'Cada vez que alguien visita tu presskit' },
                    { key: 'weeklyReport', label: 'Reporte semanal', desc: 'Resumen de analíticas todos los lunes' },
                    { key: 'downloadAlert', label: 'Descarga de EPK', desc: 'Cuando alguien descarga tu press kit en PDF' },
                    { key: 'shareAlert', label: 'Tu presskit fue compartido', desc: 'Cuando alguien comparte tu URL' },
                    { key: 'productUpdates', label: 'Novedades del producto', desc: 'Nuevas funciones y mejoras de PRESSKIT.PRO' },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between py-4 border-b border-white/[0.04] last:border-0">
                      <div>
                        <p className="text-sm text-white font-medium">{label}</p>
                        <p className="text-xs text-white/35 mt-0.5">{desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifs(n => ({ ...n, [key]: !n[key as keyof typeof notifs] }))}
                        className={`w-11 h-6 rounded-full border relative transition-all ${
                          notifs[key as keyof typeof notifs]
                            ? 'bg-[#C026D3] border-[#C026D3]'
                            : 'bg-white/[0.06] border-white/[0.1]'
                        }`}
                      >
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                          notifs[key as keyof typeof notifs] ? 'left-6' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSave}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  saved ? 'bg-green-500 text-white' : 'bg-[#C026D3] hover:bg-[#A21CAF] text-white'
                }`}
              >
                {saved ? <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Guardado</span> : 'Guardar preferencias'}
              </button>
            </div>
          )}

          {/* ── DOMINIO ── */}
          {activeTab === 'dominio' && (
            <div className="space-y-6">
              {/* Current URL */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-5">URL actual</h2>
                <div className="flex items-center gap-2 bg-[#C026D3]/5 border border-[#C026D3]/20 rounded-xl px-4 py-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm font-mono text-white">presskit.pro/valentina-m</span>
                  <button
                    onClick={() => handleCopy('https://presskit.pro/valentina-m')}
                    className="ml-auto text-white/30 hover:text-white/60"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Custom domain */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="text-sm font-semibold text-white">Dominio personalizado</h2>
                    <p className="text-xs text-white/40 mt-1">Conecta tu propio dominio (ej: presskit.valentinaDJ.com)</p>
                  </div>
                  <span className="text-[10px] bg-[#C026D3]/10 text-[#E879F9] border border-[#C026D3]/20 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5" /> PRO
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-white/40 mb-1.5 font-mono">Tu dominio</label>
                    <input
                      placeholder="presskit.tudominio.com"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C026D3]/50 transition-all font-mono"
                    />
                  </div>
                  <button className="px-4 py-2 bg-[#C026D3] hover:bg-[#A21CAF] rounded-xl text-sm font-bold transition-colors">
                    Verificar y conectar
                  </button>
                </div>

                {/* DNS instructions */}
                <div className="mt-5 p-4 bg-black/30 rounded-xl border border-white/[0.04]">
                  <p className="text-xs font-mono text-white/50 mb-3">Instrucciones DNS — agrega estos registros en tu proveedor:</p>
                  <div className="space-y-2">
                    {[
                      { type: 'CNAME', name: 'presskit', value: 'cname.presskit.pro' },
                      { type: 'TXT', name: '_verify', value: 'pk_valentina_8f2a' },
                    ].map((r) => (
                      <div key={r.type} className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                        <span className="text-[#C026D3] bg-[#C026D3]/10 px-2 py-1 rounded text-center">{r.type}</span>
                        <span className="text-white/60 bg-white/[0.04] px-2 py-1 rounded truncate">{r.name}</span>
                        <span className="text-white/60 bg-white/[0.04] px-2 py-1 rounded truncate">{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SSL */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-sm font-semibold text-white">SSL / HTTPS</p>
                      <p className="text-xs text-white/40">Certificado SSL automático incluido con tu dominio</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-mono">Activo</span>
                </div>
              </div>
            </div>
          )}

          {/* ── PLAN & FACTURACIÓN ── */}
          {activeTab === 'plan' && (
            <div className="space-y-6">
              {/* Current plan */}
              <div className="bg-gradient-to-br from-[#C026D3]/10 to-[#7C3AED]/10 border border-[#C026D3]/20 rounded-2xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-[#C026D3]" />
                      <span className="text-xs font-mono text-[#C026D3] tracking-widest">PLAN ACTUAL</span>
                    </div>
                    <h2 className="text-2xl font-black">PRO</h2>
                    <p className="text-sm text-white/50 mt-1">Período de prueba · Expira en 12 días</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black">$12<span className="text-sm font-normal text-white/40">/mes</span></p>
                    <p className="text-xs text-white/30 font-mono mt-1">o $99/año (-31%)</p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    '✓ Presskit ilimitado',
                    '✓ Dominio personalizado',
                    '✓ Analíticas avanzadas',
                    '✓ Sin marca de agua',
                    '✓ Exportar PDF / EPK',
                    '✓ Soporte prioritario',
                  ].map(f => (
                    <div key={f} className="text-sm text-white/70 flex items-center gap-2">
                      <span className="text-[#C026D3]">{f.slice(0, 1)}</span>
                      {f.slice(2)}
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-5 border-t border-white/[0.08] flex gap-3">
                  <button className="flex-1 py-2.5 bg-[#C026D3] hover:bg-[#A21CAF] rounded-xl text-sm font-bold transition-colors">
                    Activar plan PRO
                  </button>
                  <button className="px-4 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] rounded-xl text-sm font-medium transition-colors">
                    Ver planes
                  </button>
                </div>
              </div>

              {/* Payment method */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-5">Método de pago</h2>
                <div className="flex items-center justify-between p-3 bg-white/[0.04] border border-white/[0.06] rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-7 bg-gradient-to-br from-white/10 to-white/5 border border-white/[0.1] rounded-lg flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-white/40" />
                    </div>
                    <div>
                      <p className="text-sm text-white">•••• •••• •••• 4242</p>
                      <p className="text-xs text-white/30 font-mono">Visa · Vence 12/27</p>
                    </div>
                  </div>
                  <button className="text-xs text-[#C026D3] hover:text-[#E879F9] font-mono transition-colors">Cambiar</button>
                </div>
                <button className="mt-3 text-xs text-white/30 hover:text-white/60 font-mono transition-colors flex items-center gap-1">
                  <span>+</span> Agregar método de pago
                </button>
              </div>

              {/* Billing history */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-5">Historial de facturación</h2>
                <div className="space-y-1">
                  {[
                    { date: 'Dic 2024', desc: 'PRO mensual', amount: '$12.00', status: 'Pagado' },
                    { date: 'Nov 2024', desc: 'PRO mensual', amount: '$12.00', status: 'Pagado' },
                    { date: 'Oct 2024', desc: 'PRO mensual', amount: '$12.00', status: 'Pagado' },
                  ].map((inv, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-white/30 font-mono w-16">{inv.date}</span>
                        <span className="text-sm text-white">{inv.desc}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono text-white">{inv.amount}</span>
                        <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-mono">{inv.status}</span>
                        <button className="text-white/30 hover:text-white/60 transition-colors">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
