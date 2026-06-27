// ════════════════════════════════════════════════════════════════
// renderEmail — genera HTML de email responsive, seguro para clientes
// de correo (tablas + estilos inline). Branded con la identidad del
// artista. Sin dependencias de React: se usa en preview (iframe srcDoc)
// y para exportar / enviar.
// ════════════════════════════════════════════════════════════════
import type { EmailContent, EmailLayout } from './catalog'

export interface EmailBrand {
  artistName: string
  logoUrl:    string | null
  photoUrl:   string | null
  primary:    string
  secondary:  string
  socials:    { platform: string; url: string }[]
  slug:       string
}

const esc = (s: string) =>
  (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Párrafos: \n\n separa bloques, \n es salto de línea simple
function paragraphs(body: string, color: string): string {
  return (body ?? '').split(/\n\n+/).filter(Boolean).map(p =>
    `<p style="margin:0 0 18px;font-size:16px;line-height:1.65;color:${color};">${esc(p).replace(/\n/g, '<br/>')}</p>`
  ).join('')
}

function button(text: string, url: string, bg: string, fg = '#ffffff'): string {
  if (!text) return ''
  const href = url || '#'
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px auto 0;"><tr><td style="border-radius:14px;background:${bg};">
    <a href="${esc(href)}" target="_blank" style="display:inline-block;padding:15px 34px;font-size:15px;font-weight:700;letter-spacing:.4px;color:${fg};text-decoration:none;border-radius:14px;">${esc(text)}</a>
  </td></tr></table>`
}

function socialRow(brand: EmailBrand, muted: string): string {
  if (!brand.socials?.length) return ''
  const links = brand.socials.filter(s => s.url).map(s =>
    `<a href="${esc(s.url)}" target="_blank" style="color:${muted};text-decoration:none;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 8px;">${esc(s.platform)}</a>`
  ).join('<span style="color:'+muted+';">·</span>')
  return `<div style="margin:6px 0;">${links}</div>`
}

// Botones de streaming (release / presave)
function streamingButtons(primary: string): string {
  const rows = [
    { label: 'Spotify',    color: '#1DB954' },
    { label: 'Apple Music', color: '#FA243C' },
    { label: 'SoundCloud', color: '#FF5500' },
    { label: 'Beatport',   color: primary },
  ]
  return rows.map(r =>
    `<a href="#" target="_blank" style="display:block;margin:0 0 10px;padding:13px;border-radius:12px;background:${r.color}1a;border:1px solid ${r.color}55;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;text-align:center;">${r.label}</a>`
  ).join('')
}

export function renderEmail(layout: EmailLayout, c: EmailContent, brand: EmailBrand): string {
  const accent = brand.primary || '#C026D3'
  const accent2 = brand.secondary || accent
  const BG = '#0a0a0f'
  const CARD = '#111118'
  const TXT = '#f3f4f6'
  const MUTED = '#8a8a96'
  const BORDER = 'rgba(255,255,255,0.08)'
  const heroImg = c.image_url || brand.photoUrl

  // ── Header (logo o nombre) ──
  const header = `
    <tr><td style="padding:26px 32px 18px;text-align:center;border-bottom:1px solid ${BORDER};">
      ${brand.logoUrl
        ? `<img src="${esc(brand.logoUrl)}" alt="${esc(brand.artistName)}" height="34" style="height:34px;display:inline-block;"/>`
        : `<span style="font-size:22px;font-weight:800;letter-spacing:1px;color:${TXT};text-transform:uppercase;">${esc(brand.artistName)}</span>`}
    </td></tr>`

  // ── Bloque principal por layout ──
  let main = ''

  const eyebrow = (text: string) =>
    `<div style="font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${accent};margin:0 0 12px;">${esc(text)}</div>`

  const heroBlock = (rounded = true) => heroImg
    ? `<tr><td style="padding:0 ${rounded ? '32px' : '0'};"><img src="${esc(heroImg)}" alt="" width="100%" style="width:100%;border-radius:${rounded ? '16px' : '0'};display:block;margin:0 0 8px;"/></td></tr>`
    : ''

  switch (layout) {
    case 'release':
    case 'presave': {
      main = `
        ${heroImg ? `<tr><td style="padding:0;"><div style="position:relative;text-align:center;background:radial-gradient(circle at 50% 40%, ${accent}33, ${BG} 72%);padding:34px 0;">
          <img src="${esc(heroImg)}" alt="" width="200" style="width:200px;height:200px;object-fit:cover;border-radius:18px;border:1px solid ${BORDER};display:inline-block;"/>
        </div></td></tr>` : ''}
        <tr><td style="padding:30px 32px 8px;text-align:center;">
          ${eyebrow(layout === 'presave' ? 'Próximamente' : 'Ya disponible')}
          <h1 style="margin:0 0 14px;font-size:30px;line-height:1.15;font-weight:800;color:${TXT};">${esc(c.heading)}</h1>
          ${paragraphs(c.body, MUTED)}
        </td></tr>
        <tr><td style="padding:6px 32px 8px;">${streamingButtons(accent)}</td></tr>
        <tr><td style="padding:8px 32px 4px;text-align:center;">${button(c.cta_text, c.cta_url, accent)}</td></tr>`
      break
    }
    case 'event': {
      main = `
        ${heroBlock()}
        <tr><td style="padding:26px 32px 8px;text-align:center;">
          <span style="display:inline-block;padding:8px 18px;border-radius:999px;background:${accent};color:#0a0a0f;font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;">Live Show</span>
          <h1 style="margin:16px 0 14px;font-size:32px;line-height:1.1;font-weight:800;color:${TXT};">${esc(c.heading)}</h1>
          ${paragraphs(c.body, TXT)}
        </td></tr>
        <tr><td style="padding:4px 32px 4px;text-align:center;">${button(c.cta_text, c.cta_url, accent)}</td></tr>`
      break
    }
    case 'vip':
    case 'birthday': {
      main = `
        <tr><td style="padding:34px 32px 8px;text-align:center;">
          <div style="font-size:40px;margin:0 0 8px;">${layout === 'birthday' ? '🎁' : '⭐'}</div>
          <span style="display:inline-block;padding:6px 16px;border-radius:999px;background:${accent}22;border:1px solid ${accent}55;color:${accent};font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">${layout === 'birthday' ? 'Tu día' : 'Exclusivo fans'}</span>
          <h1 style="margin:16px 0 14px;font-size:28px;line-height:1.2;font-weight:800;color:${TXT};">${esc(c.heading)}</h1>
        </td></tr>
        <tr><td style="padding:0 32px 8px;">
          <div style="padding:22px;border-radius:16px;background:${accent}10;border:1px solid ${accent}30;">
            ${paragraphs(c.body, TXT)}
            <div style="text-align:center;margin-top:8px;">${button(c.cta_text, c.cta_url, accent)}</div>
          </div>
        </td></tr>`
      break
    }
    case 'newsletter': {
      main = `
        ${heroBlock()}
        <tr><td style="padding:28px 32px 8px;">
          ${eyebrow(brand.artistName + ' · Newsletter')}
          <h1 style="margin:0 0 16px;font-size:26px;line-height:1.2;font-weight:800;color:${TXT};">${esc(c.heading)}</h1>
          ${paragraphs(c.body, MUTED)}
        </td></tr>
        <tr><td style="padding:6px 32px 4px;">${button(c.cta_text, c.cta_url, accent)}</td></tr>`
      break
    }
    case 'merch':
    case 'crowdfund': {
      main = `
        ${heroBlock()}
        <tr><td style="padding:26px 32px 8px;text-align:center;">
          ${eyebrow(layout === 'merch' ? 'Edición limitada' : 'Apoya el proyecto')}
          <h1 style="margin:0 0 14px;font-size:30px;line-height:1.15;font-weight:800;color:${TXT};">${esc(c.heading)}</h1>
          ${paragraphs(c.body, MUTED)}
        </td></tr>
        <tr><td style="padding:4px 32px 4px;text-align:center;">${button(c.cta_text, c.cta_url, accent)}</td></tr>`
      break
    }
    case 'reengage': {
      main = `
        <tr><td style="padding:38px 32px 8px;text-align:center;">
          <div style="font-size:44px;margin:0 0 10px;">💔</div>
          <h1 style="margin:0 0 14px;font-size:28px;line-height:1.2;font-weight:800;color:${TXT};">${esc(c.heading)}</h1>
          ${paragraphs(c.body, MUTED)}
        </td></tr>
        <tr><td style="padding:4px 32px 4px;text-align:center;">${button(c.cta_text, c.cta_url, accent)}</td></tr>`
      break
    }
    default: { // welcome + fallback
      main = `
        ${heroBlock()}
        <tr><td style="padding:30px 32px 8px;text-align:center;">
          ${eyebrow('Bienvenido/a')}
          <h1 style="margin:0 0 14px;font-size:30px;line-height:1.15;font-weight:800;color:${TXT};">${esc(c.heading)}</h1>
          ${paragraphs(c.body, MUTED)}
        </td></tr>
        <tr><td style="padding:4px 32px 4px;text-align:center;">${button(c.cta_text, c.cta_url, accent)}</td></tr>`
    }
  }

  const secondary = c.secondary
    ? `<tr><td style="padding:18px 32px 0;text-align:center;"><p style="margin:0;font-size:13px;font-style:italic;color:${MUTED};">${esc(c.secondary)}</p></td></tr>`
    : ''

  const footer = `
    <tr><td style="padding:30px 32px 34px;text-align:center;border-top:1px solid ${BORDER};">
      ${socialRow(brand, MUTED)}
      <p style="margin:12px 0 4px;font-size:12px;color:${MUTED};">Recibes este email porque te uniste a la lista de ${esc(brand.artistName)}.</p>
      <p style="margin:0;font-size:12px;color:${MUTED};"><a href="{{unsubscribe_url}}" style="color:${MUTED};text-decoration:underline;">Darse de baja</a> · Enviado con <a href="https://artistpulse.io" style="color:${accent};text-decoration:none;">Artist Pulse</a></p>
    </td></tr>`

  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta name="color-scheme" content="dark"/><title>${esc(c.subject)}</title></head>
  <body style="margin:0;padding:0;background:${BG};-webkit-font-smoothing:antialiased;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(c.preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:28px 0;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:92vw;background:${CARD};border-radius:20px;overflow:hidden;border:1px solid ${BORDER};">
          ${header}
          ${main}
          ${secondary}
          ${footer}
        </table>
        <div style="height:18px;"></div>
      </td></tr>
    </table>
  </body></html>`
}
