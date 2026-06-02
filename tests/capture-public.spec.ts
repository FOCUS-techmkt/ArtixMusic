import { test } from '@playwright/test'
import fs from 'fs'

test.setTimeout(120000)
const URL = 'http://localhost:3000/solaris-kane-8di5'
const OUT = 'test-results/client'
fs.mkdirSync(OUT, { recursive: true })

test('capture public profile', async ({ page }) => {
  const errors: string[] = []
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', e => errors.push('PAGEERROR ' + e.message))

  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(3000)
  await page.screenshot({ path: `${OUT}/07-public-desktop.png`, fullPage: true })
  console.log('SHOT desktop')

  await page.setViewportSize({ width: 390, height: 844 })
  await page.waitForTimeout(2000)
  await page.screenshot({ path: `${OUT}/08-public-mobile.png`, fullPage: true })
  console.log('SHOT mobile')

  // also a top-of-fold desktop hero shot
  await page.setViewportSize({ width: 1440, height: 820 })
  await page.waitForTimeout(1500)
  await page.screenshot({ path: `${OUT}/07b-hero-desktop.png`, fullPage: false })
  console.log('SHOT hero')

  console.log('CONSOLE_ERRORS:' + JSON.stringify([...new Set(errors)]))
})
