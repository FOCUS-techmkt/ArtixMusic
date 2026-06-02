import { test, expect, devices } from '@playwright/test'
import fs from 'fs'

const BASE = 'http://localhost:3000'
const OUT = 'test-results/shots'
fs.mkdirSync(OUT, { recursive: true })

// Throwaway testing account (user's own localhost app)
const stamp = Date.now()
const ARTIST = 'Solen Test'
const EMAIL = `dj.testkit.${stamp}@artixtest.com`
const PASS = 'TestArtix2026!'

async function shot(page: import("@playwright/test").Page, name: string) {
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false })
  console.log(`SHOT ${name}`)
}

test('full entry + onboarding + editor flow', async ({ page }) => {
  const errors: string[] = []
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', e => errors.push('PAGEERROR ' + e.message))

  // ---- SIGNUP ----
  await page.goto(`${BASE}/signup`, { waitUntil: 'networkidle' })
  await shot(page, '01-signup')
  await page.fill('input[type="text"]', ARTIST)
  await page.fill('input[type="email"]', EMAIL)
  await page.fill('input[type="password"]', PASS)
  await shot(page, '02-signup-filled')
  await page.click('button[type="submit"]')

  // Wait up to 25s for: redirect to /onboarding, OR "Revisa tu email", OR an error message
  await Promise.race([
    page.waitForURL('**/onboarding', { timeout: 25000 }).catch(() => {}),
    page.waitForSelector('text=Revisa tu email', { timeout: 25000 }).catch(() => {}),
    page.waitForSelector('.text-red-400', { timeout: 25000 }).catch(() => {}),
  ])
  await page.waitForTimeout(800)
  const errEl = await page.locator('.text-red-400').first()
  if (await errEl.count()) console.log('SIGNUP_ERROR_TEXT:' + (await errEl.textContent()))
  const url = page.url()
  console.log('AFTER SIGNUP URL:', url)
  await shot(page, '03-after-signup')

  if (/Revisa tu email/i.test(await page.content())) {
    console.log('EMAIL_CONFIRMATION_REQUIRED')
    console.log('CONSOLE_ERRORS:' + JSON.stringify(errors))
    return
  }

  // ---- ONBOARDING (single-page 4-step wizard, URL stays /onboarding) ----
  const cont = page.getByRole('button', { name: /siguiente|continuar|next|finalizar|completar|empezar|ir al|crear|listo|terminar/i })
  if (url.includes('/onboarding')) {
    await page.waitForTimeout(1500)
    await shot(page, '04-step1-identity')

    for (let step = 1; step <= 5; step++) {
      const heading = (await page.locator('h2, h1').first().textContent().catch(() => '')) || ''
      console.log(`STEP ${step} heading="${heading.trim()}"`)

      // Make sure something selectable on this step is chosen:
      // click the first template/option card if present (they are <button> with role/genre/template)
      const cards = page.locator('button:visible')
      const n = await cards.count()
      // Heuristic: click a card that looks like a choice (not the Continuar/Atras nav)
      for (let c = 0; c < Math.min(n, 6); c++) {
        const t = (await cards.nth(c).textContent().catch(() => '')) || ''
        if (/continuar|atrás|atras|siguiente|volver/i.test(t)) continue
        if (t.trim().length > 0) { await cards.nth(c).click().catch(() => {}); break }
      }
      await page.waitForTimeout(400)

      if (!(await cont.count())) { console.log('no continue button, stop'); break }
      await cont.first().click().catch(() => {})
      await page.waitForTimeout(1500)
      await shot(page, `05-after-continue-${step}`)
      if (page.url().includes('/dashboard')) { console.log('REACHED DASHBOARD'); break }
    }
  }

  console.log('POST-ONBOARDING URL:', page.url())
  await shot(page, '05b-post-onboarding')

  // ---- DASHBOARD / EDITOR ----
  await page.goto(`${BASE}/dashboard?tab=editor`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2500)
  console.log('EDITOR URL:', page.url())
  await shot(page, '06-editor-desktop')

  // Seed default sections to populate the editor
  const seed = page.getByRole('button', { name: /crear secciones/i })
  if (await seed.count()) {
    await seed.first().click().catch(() => {})
    await page.waitForTimeout(3500)
    await shot(page, '06b-editor-populated')
    // open DISEÑO and EFECTOS tabs to capture those panels
    for (const tab of ['DISEÑO', 'EFECTOS', 'PLANTILLAS']) {
      const t = page.getByRole('button', { name: new RegExp(tab, 'i') }).first()
      if (await t.count()) { await t.click().catch(() => {}); await page.waitForTimeout(1200); await shot(page, `06c-tab-${tab}`) }
    }
  }

  // mobile editor (populated)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.waitForTimeout(1500)
  await shot(page, '07-editor-mobile')
  // mobile: switch to preview pane
  const prev = page.getByRole('button', { name: /vista previa/i }).first()
  if (await prev.count()) { await prev.click().catch(() => {}); await page.waitForTimeout(2000); await shot(page, '08-editor-mobile-preview') }

  console.log('FINAL_URL:' + page.url())
  console.log('CONSOLE_ERRORS:' + JSON.stringify(errors))
})
