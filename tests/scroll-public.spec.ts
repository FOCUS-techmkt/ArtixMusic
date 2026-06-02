import { test } from '@playwright/test'
import fs from 'fs'

test.setTimeout(120000)
const URL = 'http://localhost:3000/solaris-kane-8di5'
const OUT = 'test-results/client'
fs.mkdirSync(OUT, { recursive: true })

test('scroll public profile', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 820 })
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)

  const total = await page.evaluate(() => document.body.scrollHeight)
  console.log('PAGE_HEIGHT:' + total)

  let i = 0
  for (let y = 0; y < total; y += 760) {
    await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' as ScrollBehavior }), y)
    await page.waitForTimeout(900)
    await page.screenshot({ path: `${OUT}/scroll-${String(i).padStart(2, '0')}.png` })
    console.log('SHOT scroll-' + i + ' @' + y)
    i++
    if (i > 12) break
  }
})
