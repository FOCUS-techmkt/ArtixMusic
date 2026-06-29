import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// ════════════════════════════════════════════════════════════════
// Dominio propio del artista. Guarda artists.custom_domain y (si hay
// VERCEL_API_TOKEN) registra el dominio en el proyecto de Vercel.
// Requiere migración: ALTER TABLE artists ADD COLUMN custom_domain text UNIQUE;
// Devuelve los registros DNS que el artista debe configurar.
// ════════════════════════════════════════════════════════════════

const DOMAIN_RE = /^([a-z0-9-]+\.)+[a-z]{2,}$/i

function dnsInstructions(domain: string) {
  const isApex = domain.split('.').length === 2
  return isApex
    ? [{ type: 'A', name: '@', value: '76.76.21.21' }]
    : [{ type: 'CNAME', name: domain.split('.')[0], value: 'cname.vercel-dns.com' }]
}

async function vercelAddDomain(domain: string) {
  const token = process.env.VERCEL_API_TOKEN
  const projectId = process.env.VERCEL_PROJECT_ID
  const teamId = process.env.VERCEL_TEAM_ID
  if (!token || !projectId) return { configured: false, note: 'Vercel no configurado (VERCEL_API_TOKEN/VERCEL_PROJECT_ID)' }
  const qs = teamId ? `?teamId=${teamId}` : ''
  const res = await fetch(`https://api.vercel.com/v10/projects/${projectId}/domains${qs}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: domain }),
  })
  const data = await res.json()
  // 409 = ya añadido → lo tratamos como ok
  if (res.ok || data?.error?.code === 'domain_already_in_use' || res.status === 409) return { configured: true, vercel: data }
  return { configured: false, note: data?.error?.message ?? 'Error al registrar en Vercel' }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { domain } = await req.json()
    const clean = String(domain ?? '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '')
    if (!DOMAIN_RE.test(clean)) return NextResponse.json({ error: 'Dominio inválido' }, { status: 400 })

    const vercel = await vercelAddDomain(clean)

    const { error } = await supabase.from('artists').update({ custom_domain: clean } as never).eq('user_id', user.id)
    if (error) {
      // La columna puede no existir todavía (migración pendiente)
      return NextResponse.json({
        error: 'no_column',
        message: 'Falta la columna artists.custom_domain. Ejecuta: ALTER TABLE artists ADD COLUMN custom_domain text UNIQUE;',
        dns: dnsInstructions(clean), vercel,
      }, { status: 503 })
    }

    return NextResponse.json({ ok: true, domain: clean, dns: dnsInstructions(clean), ...vercel })
  } catch (err) {
    console.error('[domains POST]', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    await supabase.from('artists').update({ custom_domain: null } as never).eq('user_id', user.id)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
