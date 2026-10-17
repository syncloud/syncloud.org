import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'

const LANGUAGES = ['en', 'zh-CN', 'es', 'hi', 'ar', 'pt', 'ru', 'ja', 'de', 'fr']

test('a seller finds the leaflet from the hardware page and downloads it in every language', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('nav-hardware').click()
  await page.getByTestId('hardware-leaflet-link').click()
  await expect(page.getByTestId('leaflet-sheets')).toBeVisible()
  await expect(page.getByTestId('leaflet-pdfs')).toBeVisible()

  for (const code of LANGUAGES) {
    const button = page.getByTestId(`leaflet-pdf-${code}`)
    await expect(button, code).toBeVisible()
    const [download] = await Promise.all([page.waitForEvent('download'), button.click()])
    expect(await download.failure(), code).toBeNull()
    const body = await readFile(await download.path())
    expect(body.subarray(0, 5).toString(), code).toBe('%PDF-')
    expect(body.length, code).toBeGreaterThan(50000)
  }
})

test('a buyer finds the leaflet from the setup page', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('nav-setup').click()
  await page.getByTestId('path-buy').click()
  await page.getByTestId('setup-leaflet-link').click()
  await expect(page.getByTestId('leaflet-sheets')).toBeVisible()
  await expect(page.getByTestId('leaflet-pdfs')).toBeVisible()
})

test('anyone finds the leaflet from the footer', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('footer-leaflet').click()
  await expect(page.getByTestId('leaflet-sheets')).toBeVisible()
  await expect(page.getByTestId('leaflet-pdfs')).toBeVisible()
})
