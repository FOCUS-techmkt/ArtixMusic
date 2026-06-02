import { test } from '@playwright/test'
import fs from 'fs'

test.setTimeout(180000)

const BASE = 'http://localhost:3000'
const OUT = 'test-results/client'
fs.mkdirSync(OUT, { recursive: true })

const stamp = Date.now().toString().slice(-5)
const ARTIST = `Solaris Kane`
const EMAIL = `solaris.kane.${stamp}@artixtest.com`
const PASS = 'TestArtix2026!'

const BIO = 'Productor y DJ de techno hipnótico afincado en Berlín. Residente en Tresor, con releases en Drumcode y Afterlife. Su sonido fusiona kicks profundos con texturas atmosféricas.'
const MUSIC = 'https://open.spotify.com/artist/4tZwfgrHOc3mvqYlEYSvVi'
const BOOKING = 'booking@solariskane.com'

async function shot(page: import("@playwright/test").Page, name: string) {
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false })
  console.log('SHOT ' + name)
}
async function safeFill(loc: import("@playwright/test").Locator, val: string) {
  try { await loc.fill(val, { timeout: 2500 }); return true } catch { return false }
}

test('create realistic client account', async ({ page }) => {
  const errors: string[] = []
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', e => errors.push('PAGEERROR ' + e.message))

  const cont = page.getByRole('button', { name: /siguiente|continuar|finalizar|completar|empezar|ir al|listo|terminar|crear mi kit|crear kit|crear/i })

  // SIGNUP
  await page.goto(`${BASE}/signup`)
  await page.fill('input[type="text"]', ARTIST)
  await page.fill('input[type="email"]', EMAIL)
  await page.fill('input[type="password"]', PASS)
  await page.click('button[type="submit"]')
  await page.waitForURL('**/onboarding', { timeout: 25000 }).catch(() => {})
  await page.waitForTimeout(1500)

  // Walk the 4-step wizard
  for (let step = 1; step <= 5; step++) {
    const heading = ((await page.locator('h2, h1').first().textContent().catch(() => '')) || '').trim()
    console.log(`STEP ${step} "${heading}"`)

    // STEP 4 — fill essentials when we recognize it
    if (/esencial|bio|contacto/i.test(heading)) {
      await safeFill(page.locator('textarea').first(), BIO)
      await safeFill(page.getByPlaceholder(/Spotify|SoundCloud/i).first(), MUSIC)
      await safeFill(page.getByPlaceholder(/booking@/i).first(), BOOKING)
      await safeFill(page.getByPlaceholder(/Fabric/i).first(), 'Tresor')
      await safeFill(page.getByPlaceholder(/Madrid/i).first(), 'Berlín')
      await shot(page, '04-essentials')
    } else {
      // generic: click first visible non-nav button (selects role/template/color)
      const btns = page.locator('button:visible')
      const n = await btns.count()
      for (let c = 0; c < Math.min(n, 8); c++) {
        const t = ((await btns.nth(c).textContent().catch(() => '')) || '').trim()
        if (/continuar|atrás|atras|siguiente|volver|finalizar|completar/i.test(t)) continue
        if (t.length > 0) { await btns.nth(c).click().catch(() => {}); break }
      }
      await page.waitForTimeout(400)
      await shot(page, `0${step}-step`)
    }

    if (!(await cont.count())) break
    await cont.first().click().catch(() => {})
    await page.waitForTimeout(1600)
    if (page.url().includes('/dashboard')) break
  }

  await page.waitForTimeout(1500)

  // EDITOR — seed sections
  await page.goto(`${BASE}/dashboard?tab=editor`)
  await page.waitForTimeout(2500)
  const seed = page.getByRole('button', { name: /crear secciones/i }).first()
  if (await seed.count()) { await seed.click().catch(() => {}); await page.waitForTimeout(3500) }
  await shot(page, '06-editor-final')

  // slug
  const slug = await page.evaluate(() => {
    const a = Array.from(document.querySelectorAll('a')).find(x => /^\/[a-z0-9-]+$/.test(x.getAttribute('href') || '') && !/^\/(dashboard|login|signup|onboarding)$/.test(x.getAttribute('href') || ''))
    return a?.getAttribute('href') || ''
  })
  console.log('PUBLIC_SLUG:' + slug)

  // public profile screenshots
  if (slug) {
    await page.goto(`${BASE}${slug}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(2500)
    await page.screenshot({ path: `${OUT}/07-public-desktop.png`, fullPage: true })
    console.log('SHOT 07-public-desktop')
    await page.setViewportSize({ width: 390, height: 844 })
    await page.waitForTimeout(1500)
    await page.screenshot({ path: `${OUT}/08-public-mobile.png`, fullPage: true })
    console.log('SHOT 08-public-mobile')
  }

  console.log('PUBLIC_URL:' + BASE + slug)
  console.log('CREDS:' + EMAIL + ' / ' + PASS)
  console.log('CONSOLE_ERRORS:' + JSON.stringify([...new Set(errors)]))
})
