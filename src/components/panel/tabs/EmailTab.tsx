'use client'
import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, Send, BarChart2, Users, Plus, X, Eye, Zap, Megaphone,
  Sparkles, Copy, Check, ArrowLeft, Clock, ChevronRight, Code2,
} from 'lucide-react'
import type { TabProps } from '../DashboardClient'
import {
  EMAIL_TEMPLATES, TEMPLATE_BY_ID, SEQUENCES,
  type EmailContent, type EmailTemplateDef,
} from '@/lib/email/catalog'
import { renderEmail, type EmailBrand } from '@/lib/email/renderEmail'
import { buildSegments, segmentRecipients } from '@/lib/email/segments'
import type { FanSubscriber } from '@/types'

// ── Estado persistido en hero.config.emailMarketing ───────────────
interface EmailStore {
  sequences: Record<string, { active: boolean }>
  content:   Record<string, Partial<EmailContent>>
}
const EMPTY_STORE: EmailStore = { sequences: {}, content: {} }

export default function EmailTab({ palette, fans, artist, sections, setSections, supabase, analytics }: TabProps) {
  const heroSection = sections.find(s => s.name === 'hero')
  const stored = (heroSection?.config?.emailMarketing as EmailStore) ?? EMPTY_STORE
  const [store, setStore] = useState<EmailStore>({ ...EMPTY_STORE, ...stored })

  const [view, setView]       = useState<'sequences' | 'templates'>('sequences')
  const [editing, setEditing] = useState<string | null>(null) // template id en edición
  const [saving, setSaving]   = useState(false)

  // ── Brand para el render del email ──
  const brand: EmailBrand = useMemo(() => {
    const heroSocials = ((heroSection?.config?.socials as { platform: string; url: string; enabled?: boolean }[]) ?? [])
      .filter(s => s.url && s.enabled !== false)
    const fallback = [
      artist.links?.instagram && { platform: 'Instagram', url: artist.links.instagram },
      artist.links?.spotify && { platform: 'Spotify', url: artist.links.spotify },
      artist.links?.soundcloud && { platform: 'SoundCloud', url: artist.links.soundcloud },
      artist.links?.youtube && { platform: 'YouTube', url: artist.links.youtube },
    ].filter(Boolean) as { platform: string; url: string }[]
    return {
      artistName: artist.artist_name,
      logoUrl:    artist.logo_url,
      photoUrl:   artist.photo_url,
      primary:    palette.primary,
      secondary:  palette.secondary,
      socials:    heroSocials.length ? heroSocials.map(s => ({ platform: s.platform, url: s.url })) : fallback,
      slug:       artist.slug,
    }
  }, [artist, heroSection, palette])

  // ── Contenido efectivo de una plantilla (default + overrides) ──
  const contentFor = (tplId: string): EmailContent => {
    const tpl = TEMPLATE_BY_ID[tplId]
    return { ...tpl.makeDefault(artist.artist_name), ...(store.content[tplId] ?? {}) }
  }

  // ── Persistencia ──
  const persist = async (next: EmailStore) => {
    setStore(next)
    if (!heroSection) return
    setSaving(true)
    const newConfig = { ...heroSection.config, emailMarketing: next }
    await supabase.from('sections').update({ config: newConfig }).eq('id', heroSection.id)
    setSections(prev => prev.map(s => s.id === heroSection.id ? { ...s, config: newConfig } : s))
    setSaving(false)
  }
  const toggleSequence = (id: string) => {
    const cur = store.sequences[id]?.active ?? false
    persist({ ...store, sequences: { ...store.sequences, [id]: { active: !cur } } })
  }
  const saveContent = (tplId: string, content: EmailContent) =>
    persist({ ...store, content: { ...store.content, [tplId]: content } })

  const activeSeqCount = Object.values(store.sequences).filter(s => s.active).length
  const editTpl = editing ? TEMPLATE_BY_ID[editing] : null

  // Métricas reales de email desde analytics (alimentadas por el webhook de Resend)
  const emailCount = (t: string) => analytics.filter(a => a.event_type === t).length
  const sent = emailCount('email_sent')
  const opened = emailCount('email_opened')
  const clicked = emailCount('email_clicked')
  const openRate = sent > 0 ? Math.round((opened / sent) * 100) : 0
  const clickRate = sent > 0 ? Math.round((clicked / sent) * 100) : 0

  const STATS = [
    { label: 'Suscriptores', value: fans.length || '—', Icon: Users,     color: palette.primary, live: fans.length > 0 },
    { label: 'Enviados',     value: sent || '—',        Icon: Send,      color: '#38BDF8', live: sent > 0 },
    { label: 'Aperturas',    value: sent > 0 ? `${openRate}%` : '—', Icon: Mail, color: '#22C55E', live: sent > 0 },
    { label: 'Clics',        value: sent > 0 ? `${clickRate}%` : '—', Icon: BarChart2, color: '#F59E0B', live: sent > 0 },
  ]

  return (
    <div className="px-5 lg:px-8 py-8 max-w-5xl mx-auto flex flex-col gap-7">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-[10px] font-mono text-white/25 tracking-[0.15em] uppercase mb-1">Marketing</p>
          <h1 className="font-display font-extrabold text-3xl tracking-tight" style={{ color: palette.text }}>Email Marketing</h1>
          <p className="text-sm mt-1" style={{ color: palette.textMuted }}>
            {fans.length > 0 ? `${fans.length} suscriptor${fans.length !== 1 ? 'es' : ''} en tu lista` : 'Captura fans con el formulario de tu press kit y conviértelos con secuencias'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saving && <span className="text-[11px] font-mono" style={{ color: palette.textMuted }}>Guardando…</span>}
          <div className="flex rounded-xl overflow-hidden" style={{ border: `1px solid ${palette.border}` }}>
            {(['sequences', 'templates'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className="px-4 py-2 text-xs font-semibold transition-all"
                style={{ background: view === v ? palette.primary : 'transparent', color: view === v ? '#fff' : palette.textMuted }}>
                {v === 'sequences' ? 'Secuencias' : 'Plantillas'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, Icon, color, live }) => (
          <div key={label} className="p-4 rounded-2xl flex flex-col gap-2"
            style={{ background: '#0E0E12', border: '1px solid rgba(255,255,255,0.05)', opacity: live ? 1 : 0.55 }}>
            <div className="flex items-center gap-2">
              <Icon className="w-3.5 h-3.5" style={{ color }} />
              <span className="text-[9px] font-mono uppercase tracking-wider text-white/30">{label}</span>
            </div>
            <p className="font-display font-extrabold text-2xl" style={{ color: live ? color : 'rgba(255,255,255,0.25)' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── SEQUENCES VIEW ──────────────────────────────────── */}
      {view === 'sequences' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: palette.textMuted }}>Secuencias automáticas</p>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full" style={{ background: palette.primary + '15', color: palette.primary }}>{activeSeqCount} activas</span>
          </div>

          {SEQUENCES.map(seq => {
            const active = store.sequences[seq.id]?.active ?? false
            return (
              <div key={seq.id} className="rounded-2xl overflow-hidden transition-all"
                style={{ background: active ? palette.primary + '08' : '#0E0E12', border: `1px solid ${active ? palette.primary + '35' : 'rgba(255,255,255,0.06)'}` }}>
                <div className="flex items-start justify-between p-5">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{seq.icon}</span>
                    <div>
                      <p className="text-sm font-bold" style={{ color: palette.text }}>{seq.name}</p>
                      <p className="text-[12px] mt-1 max-w-md leading-relaxed" style={{ color: palette.textMuted }}>{seq.desc}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <Clock className="w-3 h-3" style={{ color: palette.primary }} />
                        <span className="text-[10px] font-mono" style={{ color: palette.textMuted }}>{seq.trigger}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => toggleSequence(seq.id)} className="w-11 h-6 rounded-full relative transition-all shrink-0"
                    style={{ background: active ? palette.primary : 'rgba(255,255,255,0.1)' }}>
                    <motion.div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow" animate={{ left: active ? '22px' : '2px' }} transition={{ duration: 0.2 }} />
                  </button>
                </div>

                {/* Timeline de pasos */}
                <div className="px-5 pb-5">
                  <div className="flex flex-col gap-0">
                    {seq.steps.map((step, i) => {
                      const tpl = TEMPLATE_BY_ID[step.template_id]
                      const isLast = i === seq.steps.length - 1
                      return (
                        <div key={step.id} className="flex gap-3">
                          {/* Rail */}
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                              style={{ background: palette.primary + '18', border: `1px solid ${palette.primary}40` }}>{tpl.icon}</div>
                            {!isLast && <div className="w-px flex-1 my-1" style={{ background: palette.border }} />}
                          </div>
                          {/* Card */}
                          <button onClick={() => setEditing(step.template_id)}
                            className="flex-1 text-left mb-2 p-3 rounded-xl transition-all hover:bg-white/[0.03] group"
                            style={{ border: `1px solid ${palette.border}` }}>
                            <div className="flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full shrink-0" style={{ background: palette.primary + '15', color: palette.primary }}>
                                    {step.delay_days === 0 ? 'Inmediato' : `+${step.delay_days} días`}
                                  </span>
                                  <span className="text-[13px] font-semibold truncate" style={{ color: palette.text }}>{step.label}</span>
                                </div>
                                <p className="text-[11px] mt-1 truncate" style={{ color: palette.textMuted }}>{contentFor(step.template_id).subject}</p>
                              </div>
                              <span className="flex items-center gap-1 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity shrink-0" style={{ color: palette.primary }}>
                                Editar <ChevronRight className="w-3 h-3" />
                              </span>
                            </div>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}

          <SendNote palette={palette} />
        </div>
      )}

      {/* ── TEMPLATES VIEW ──────────────────────────────────── */}
      {view === 'templates' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EMAIL_TEMPLATES.map(tpl => {
            const customized = !!store.content[tpl.id]
            return (
              <motion.button key={tpl.id} whileHover={{ y: -3 }} onClick={() => setEditing(tpl.id)}
                className="text-left rounded-2xl overflow-hidden flex flex-col"
                style={{ background: '#0a0a10', border: `1px solid ${customized ? palette.primary + '40' : 'rgba(255,255,255,0.07)'}` }}>
                <div className="h-28 flex items-center justify-center relative"
                  style={{ background: `radial-gradient(circle at 50% 30%, ${palette.primary}22, #0a0a10 75%)` }}>
                  <span className="text-4xl">{tpl.icon}</span>
                  <div className="absolute top-2 left-2">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full"
                      style={{ background: tpl.category === 'Automatización' ? '#7C3AED20' : palette.primary + '20', color: tpl.category === 'Automatización' ? '#A78BFA' : palette.primary }}>
                      {tpl.category === 'Automatización' ? <Zap className="inline w-2.5 h-2.5 mr-0.5" /> : <Megaphone className="inline w-2.5 h-2.5 mr-0.5" />}{tpl.category}
                    </span>
                  </div>
                  {customized && <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: palette.primary }}><Check className="w-3 h-3 text-white" /></div>}
                </div>
                <div className="p-3.5 flex flex-col gap-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  <p className="text-sm font-semibold" style={{ color: palette.text }}>{tpl.name}</p>
                  <p className="text-[11px] leading-relaxed" style={{ color: palette.textMuted }}>{tpl.desc}</p>
                </div>
              </motion.button>
            )
          })}
        </div>
      )}

      {/* ── EDITOR DRAWER ───────────────────────────────────── */}
      <AnimatePresence>
        {editTpl && (
          <EmailEditor
            key={editTpl.id}
            tpl={editTpl}
            content={contentFor(editTpl.id)}
            brand={brand}
            palette={palette}
            artist={artist}
            fans={fans}
            onClose={() => setEditing(null)}
            onSave={(c) => { saveContent(editTpl.id, c); }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Nota de envío ─────────────────────────────────────────────────
function SendNote({ palette }: { palette: TabProps['palette'] }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl mt-2" style={{ background: palette.primary + '0A', border: `1px solid ${palette.primary}25` }}>
      <Send className="w-4 h-4 mt-0.5 shrink-0" style={{ color: palette.primary }} />
      <div>
        <p className="text-[12px] font-semibold" style={{ color: palette.text }}>Listo para enviar</p>
        <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: palette.textMuted }}>
          Tus secuencias y plantillas quedan guardadas y branded. Conecta tu proveedor de envío (Resend) para activarlas en automático —
          mientras tanto puedes exportar el HTML de cualquier email desde el editor.
        </p>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// EDITOR — formulario + preview en vivo (iframe) + IA + export
// ════════════════════════════════════════════════════════════════
function EmailEditor({ tpl, content, brand, palette, artist, fans, onClose, onSave }: {
  tpl: EmailTemplateDef; content: EmailContent; brand: EmailBrand; palette: TabProps['palette']
  artist: TabProps['artist']; fans: FanSubscriber[]; onClose: () => void; onSave: (c: EmailContent) => void
}) {
  const [c, setC] = useState<EmailContent>(content)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiAlt, setAiAlt] = useState<string | null>(null)
  const [aiError, setAiError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [sendOpen, setSendOpen] = useState(false)

  const html = useMemo(() => renderEmail(tpl.layout, c, brand), [tpl.layout, c, brand])
  const set = (k: keyof EmailContent, v: string) => setC(prev => ({ ...prev, [k]: v }))
  const dirty = JSON.stringify(c) !== JSON.stringify(content)

  const genAI = async () => {
    setAiLoading(true); setAiError(null); setAiAlt(null)
    try {
      const res = await fetch('/api/ai/email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artistName: artist.artist_name, goal: tpl.goal, layout: tpl.layout, genres: artist.sound_words ?? artist.genre }),
      })
      if (res.status === 429) { setAiError('Límite de IA diario alcanzado. Vuelve mañana.'); return }
      if (!res.ok) { setAiError('No se pudo generar. Intenta de nuevo.'); return }
      const d = await res.json()
      setC(prev => ({
        ...prev,
        subject: d.subject ?? prev.subject,
        preheader: d.preheader ?? prev.preheader,
        heading: d.heading ?? prev.heading,
        body: d.body ?? prev.body,
        cta_text: d.cta_text ?? prev.cta_text,
      }))
      if (d.subject_alt) setAiAlt(d.subject_alt)
    } catch { setAiError('Error de red. Intenta de nuevo.') }
    finally { setAiLoading(false) }
  }

  const copyHtml = async () => {
    try { await navigator.clipboard.writeText(html); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch {}
  }
  const downloadHtml = () => {
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `${artist.slug}-${tpl.id}.html`; a.click()
    URL.revokeObjectURL(url)
  }

  const Field = ({ label, k, textarea = false, placeholder = '', max }: { label: string; k: keyof EmailContent; textarea?: boolean; placeholder?: string; max?: number }) => {
    const val = (c[k] ?? '') as string
    return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-mono uppercase tracking-wider" style={{ color: palette.textMuted }}>{label}</label>
        {max && <span className="text-[9px] font-mono" style={{ color: val.length > max ? '#F87171' : palette.textMuted }}>{val.length}/{max}</span>}
      </div>
      {textarea
        ? <textarea value={val} onChange={e => set(k, e.target.value)} rows={5} placeholder={placeholder}
            className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none resize-y"
            style={{ background: '#0A0A0E', border: '1px solid rgba(255,255,255,0.08)' }} />
        : <input value={val} onChange={e => set(k, e.target.value)} placeholder={placeholder}
            className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none"
            style={{ background: '#0A0A0E', border: '1px solid rgba(255,255,255,0.08)' }} />}
    </div>
    )
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
        transition={{ type: 'spring', damping: 30, stiffness: 320 }}
        className="fixed inset-2 md:inset-6 z-50 rounded-3xl overflow-hidden flex flex-col"
        style={{ background: '#0E0E14', border: '1px solid rgba(255,255,255,0.08)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b shrink-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <button onClick={onClose} style={{ color: palette.textMuted }}><ArrowLeft className="w-4 h-4" /></button>
            <span className="text-xl">{tpl.icon}</span>
            <div>
              <h2 className="font-display font-bold text-base" style={{ color: palette.text }}>{tpl.name}</h2>
              <p className="text-[11px]" style={{ color: palette.textMuted }}>{tpl.best_for}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={copyHtml} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-medium" style={{ background: 'rgba(255,255,255,0.05)', color: palette.textMuted }}>
              {copied ? <><Check className="w-3.5 h-3.5" /> Copiado</> : <><Code2 className="w-3.5 h-3.5" /> Copiar HTML</>}
            </button>
            <button onClick={downloadHtml} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-medium" style={{ background: 'rgba(255,255,255,0.05)', color: palette.textMuted }}>
              <Copy className="w-3.5 h-3.5" /> Exportar
            </button>
            <button onClick={() => setSendOpen(true)} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-semibold text-white" style={{ background: 'rgba(34,197,94,0.9)' }}>
              <Send className="w-3.5 h-3.5" /> Enviar
            </button>
            <button onClick={() => { onSave(c); onClose() }}
              className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg font-semibold text-white"
              style={{ background: dirty ? `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})` : 'rgba(255,255,255,0.1)' }}>
              <Check className="w-3.5 h-3.5" /> Guardar
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5" style={{ color: palette.textMuted }}><X className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Body: editor + preview */}
        <div className="flex-1 grid md:grid-cols-[380px_1fr] overflow-hidden">
          {/* Editor */}
          <div className="overflow-y-auto p-5 flex flex-col gap-4 border-r" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <button onClick={genAI} disabled={aiLoading}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
              style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})` }}>
              <Sparkles className="w-4 h-4" /> {aiLoading ? 'Generando copy…' : 'Generar copy con IA'}
            </button>
            {aiError && <p className="text-[11px] text-red-400">{aiError}</p>}
            {aiAlt && (
              <button onClick={() => { set('subject', aiAlt); setAiAlt(null) }}
                className="text-left text-[11px] p-2.5 rounded-lg" style={{ background: palette.primary + '12', border: `1px solid ${palette.primary}30`, color: palette.text }}>
                <span className="font-mono uppercase tracking-wider text-[9px] block mb-1" style={{ color: palette.primary }}>Variante A/B de asunto — usar</span>
                {aiAlt}
              </button>
            )}

            <Field label="Asunto" k="subject" placeholder="Asunto del email" max={50} />
            <Field label="Preheader (vista previa)" k="preheader" placeholder="Texto que se ve en la bandeja" max={90} />
            <Field label="Titular" k="heading" placeholder="Gancho principal" />
            <Field label="Cuerpo" k="body" textarea placeholder="Tu mensaje… (doble salto de línea = nuevo párrafo)" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Texto del botón" k="cta_text" placeholder="Escuchar ahora" />
              <Field label="URL del botón" k="cta_url" placeholder="https://…" />
            </div>
            <Field label="URL de imagen (opcional)" k="image_url" placeholder="https://… (usa tu foto si vacío)" />
            <Field label="Nota secundaria (opcional)" k="secondary" placeholder="P.D. …" />
          </div>

          {/* Preview */}
          <div className="flex flex-col overflow-hidden" style={{ background: '#070709' }}>
            <div className="flex items-center justify-between px-4 py-2.5 border-b shrink-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider shrink-0" style={{ color: palette.textMuted }}>Vista previa</span>
                <span className="text-[11px] truncate" style={{ color: palette.text }}>· {c.subject}</span>
              </div>
              <div className="flex rounded-lg overflow-hidden shrink-0" style={{ border: `1px solid ${palette.border}` }}>
                {(['desktop', 'mobile'] as const).map(d => (
                  <button key={d} onClick={() => setDevice(d)} className="px-2.5 py-1 text-[10px] font-mono"
                    style={{ background: device === d ? palette.primary : 'transparent', color: device === d ? '#fff' : palette.textMuted }}>{d === 'desktop' ? 'Desktop' : 'Móvil'}</button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto flex justify-center p-4">
              <iframe title="preview" srcDoc={html} sandbox="allow-same-origin"
                className="bg-white rounded-xl shadow-2xl transition-all"
                style={{ width: device === 'mobile' ? 380 : '100%', maxWidth: device === 'mobile' ? 380 : 680, height: '100%', minHeight: 600, border: 'none' }} />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {sendOpen && (
            <SendModal palette={palette} fans={fans} subject={c.subject} html={html} artist={artist} onClose={() => setSendOpen(false)} />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}

// ── Modal de envío: segmento + prueba + envío real ────────────────
function SendModal({ palette, fans, subject, html, artist, onClose }: {
  palette: TabProps['palette']; fans: FanSubscriber[]; subject: string; html: string
  artist: TabProps['artist']; onClose: () => void
}) {
  const segments = useMemo(() => buildSegments(fans), [fans])
  const [segId, setSegId] = useState('all')
  const seg = segments.find(s => s.id === segId) ?? segments[0]
  const recipients = useMemo(() => segmentRecipients(fans, seg).map(f => f.email), [fans, seg])
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [msg, setMsg] = useState<string | null>(null)
  const [result, setResult] = useState<{ sent: number; test: boolean } | null>(null)

  const send = async (test: boolean) => {
    setState('sending'); setMsg(null)
    try {
      const res = await fetch('/api/email/send', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, html, recipients, test }),
      })
      const d = await res.json()
      if (!res.ok) { setState('error'); setMsg(d.message || d.error || 'No se pudo enviar'); return }
      setState('done'); setResult({ sent: d.sent, test: d.test })
    } catch { setState('error'); setMsg('Error de red.') }
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 z-[60] bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="absolute z-[61] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(440px,92vw)] rounded-2xl p-6"
        style={{ background: '#101018', border: `1px solid ${palette.border}` }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg" style={{ color: palette.text }}>Enviar campaña</h3>
          <button onClick={onClose} style={{ color: palette.textMuted }}><X className="w-5 h-5" /></button>
        </div>

        {state === 'done' ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">✅</div>
            <p className="font-semibold" style={{ color: palette.text }}>
              {result?.test ? 'Email de prueba enviado' : `Enviado a ${result?.sent} ${result?.sent === 1 ? 'fan' : 'fans'}`}
            </p>
            <button onClick={onClose} className="mt-5 px-5 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: palette.primary }}>Cerrar</button>
          </div>
        ) : (
          <>
            <p className="text-[11px] font-mono uppercase tracking-wider mb-2" style={{ color: palette.textMuted }}>Segmento</p>
            <div className="flex flex-col gap-1.5 mb-4 max-h-52 overflow-y-auto">
              {segments.map(s => {
                const count = segmentRecipients(fans, s).length
                const on = s.id === segId
                return (
                  <button key={s.id} onClick={() => setSegId(s.id)} className="flex items-center justify-between p-2.5 rounded-xl text-left transition-all"
                    style={{ background: on ? palette.primary + '18' : 'rgba(255,255,255,0.03)', border: `1px solid ${on ? palette.primary : 'rgba(255,255,255,0.07)'}` }}>
                    <div className="flex items-center gap-2 min-w-0">
                      <span>{s.icon}</span>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold truncate" style={{ color: on ? palette.primary : palette.text }}>{s.label}</p>
                        <p className="text-[10px] truncate" style={{ color: palette.textMuted }}>{s.desc}</p>
                      </div>
                    </div>
                    <span className="text-[12px] font-mono shrink-0" style={{ color: on ? palette.primary : palette.textMuted }}>{count}</span>
                  </button>
                )
              })}
            </div>

            <div className="p-3 rounded-xl mb-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-[11px]" style={{ color: palette.textMuted }}>Asunto</p>
              <p className="text-[13px] truncate" style={{ color: palette.text }}>{subject}</p>
            </div>

            {msg && <p className="text-[11px] mb-3" style={{ color: state === 'error' ? '#F87171' : palette.textMuted }}>{msg}</p>}

            <div className="flex items-center gap-2">
              <button onClick={() => send(true)} disabled={state === 'sending'}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium disabled:opacity-60"
                style={{ background: 'rgba(255,255,255,0.06)', color: palette.text }}>
                Enviarme prueba
              </button>
              <button onClick={() => send(false)} disabled={state === 'sending' || recipients.length === 0}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})` }}>
                {state === 'sending' ? 'Enviando…' : `Enviar a ${recipients.length}`}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </>
  )
}
