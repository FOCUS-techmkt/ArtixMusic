import { test } from '@playwright/test'
import fs from 'fs'

test.setTimeout(120000)
const BASE = 'http://localhost:3000'
const OUT = 'test-results/verify'
fs.mkdirSync(OUT, { recursive: true })

const EMAIL = process.env.VERIFY_EMAIL || 'solaris.kane.50376@artixtest.com'
const PASS = 'TestArtix2026!'

test('login, find slug, screenshot public profile', async ({ page }) => {
  const errors: string[] = []
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', e => errors.push('PAGEERROR ' + e.message))

  await page.goto(`${BASE}/login`)
  await page.fill('input[type="email"]', EMAIL)
  await page.fill('input[type="password"]', PASS)
  await page.click('button[type="submit"]')
  await page.waitForTimeout(4000)
  console.log('AFTER LOGIN URL:' + page.url())

  // Slug is rendered as "/slug" text in the editor header
  await page.goto(`${BASE}/dashboard?tab=editor`)
  await page.waitForTimeout(3500)
  const slug = await page.evaluate(() => {
    const m = document.body.innerText.match(/\/([a-z0-9]+(?:-[a-z0-9]+)+)/)
    return m ? m[0] : ''
  })
  console.log('PUBLIC_SLUG:' + slug)

  if (slug) {
    await page.goto(`${BASE}${slug}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(2500)
    await page.screenshot({ path: `${OUT}/hero.png`, fullPage: false })
    await page.screenshot({ path: `${OUT}/full.png`, fullPage: true })
    console.log('PUBLIC_URL:' + BASE + slug)
  }
  console.log('CONSOLE_ERRORS:' + JSON.stringify([...new Set(errors)]))
})
