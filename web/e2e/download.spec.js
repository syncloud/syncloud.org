import { test, expect } from '@playwright/test'
import { downloadCount } from './metrics.js'

test('a download click is recorded and lands on the image', async ({ page, request }) => {
  const before = await downloadCount(request, { board: 'raspberrypi-64' })

  await page.goto('/')
  await page.getByTestId('nav-setup').click()
  await expect(page).toHaveURL(/\/setup$/)

  await page.getByTestId('path-build').click()
  await page.getByTestId('board-raspberrypi-64').click()

  const link = page.getByTestId('setup-download-link')
  await expect(link).toBeVisible()
  await expect(link).toHaveText(/^syncloud-raspberrypi-64-\d{2}\.\d{2}\.\d{2}\.img\.xz$/)

  await link.click()
  await expect(page.locator('body')).toContainText('syncloud-raspberrypi-64')

  const after = await downloadCount(request, { board: 'raspberrypi-64' })
  expect(after).toBe(before + 1)
})

test('a click carrying an ad id is counted separately', async ({ page, request }) => {
  const before = await downloadCount(request, { board: 'amd64', source: 'ad' })

  await page.goto('/setup?gclid=E2ETESTCLICK')
  await page.getByTestId('path-build').click()
  await page.getByTestId('board-amd64').click()
  await page.getByTestId('setup-download-link').click()

  const after = await downloadCount(request, { board: 'amd64', source: 'ad' })
  expect(after).toBe(before + 1)
})

test('a download is attributed to the landing page the visitor arrived on', async ({ page, request }) => {
  const before = await downloadCount(request, { board: 'amd64', format: 'vdi', landing: 'bitwarden' })

  await page.goto('/en/bitwarden')
  await page.goto('/setup')
  await page.getByTestId('path-build').click()
  await page.getByTestId('board-amd64-vdi').click()
  await page.getByTestId('setup-download-link').click()

  const after = await downloadCount(request, { board: 'amd64', format: 'vdi', landing: 'bitwarden' })
  expect(after).toBe(before + 1)
})

test('the virtualbox image is a distinct format', async ({ page, request }) => {
  const before = await downloadCount(request, { board: 'amd64', format: 'vdi' })

  await page.goto('/setup')
  await page.getByTestId('path-build').click()
  await page.getByTestId('board-amd64-vdi').click()
  await expect(page.getByTestId('setup-download-link')).toHaveText(/\.vdi\.xz$/)
  await page.getByTestId('setup-download-link').click()

  expect(await downloadCount(request, { board: 'amd64', format: 'vdi' })).toBe(before + 1)
})

test('buying skips the image steps', async ({ page }) => {
  await page.goto('/setup')
  await page.getByTestId('path-buy').click()
  await expect(page.getByTestId('setup-step-order')).toBeVisible()
  await expect(page.getByTestId('setup-step-write')).toHaveCount(0)
  await expect(page.getByTestId('setup-step-activate')).toBeVisible()
})

test('the old download url still lands on setup', async ({ page }) => {
  await page.goto('/download')
  await expect(page.getByTestId('path-build')).toBeVisible()
})

test('buying stays on setup and offers one link to the hardware page', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('nav-setup').click()
  await page.getByTestId('path-buy').click()
  await expect(page).toHaveURL(/\/setup\?path=buy$/)
  await page.getByTestId('setup-hardware-link').click()
  await expect(page).toHaveURL(/\/hardware$/)
  await expect(page.getByTestId('hardware-store-link')).toBeVisible()
  for (const id of ['ameridroid', 'protectli', 'sossolutions', 'electrokit']) {
    await expect(page.getByTestId(`reseller-${id}`)).toBeVisible()
  }
  await page.getByTestId('hardware-setup-link').click()
  await expect(page).toHaveURL(/\/setup$/)
})

test('going back from the hardware page returns to the buy path still open', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('nav-setup').click()
  await page.getByTestId('path-buy').click()
  await page.getByTestId('setup-hardware-link').click()
  await expect(page.getByTestId('hardware-store-link')).toBeVisible()
  await page.goBack()
  await expect(page).toHaveURL(/\/setup\?path=buy$/)
  await expect(page.getByTestId('setup-step-order')).toBeVisible()
})

test('a download is attributed to the language the page was shown in', async ({ page, request }) => {
  const before = await downloadCount(request, { board: 'raspberrypi-64', language: 'de' })

  await page.goto('/setup')
  await page.getByTestId('language-button').click()
  await page.getByTestId('language-de').click()
  await page.getByTestId('path-build').click()
  await page.getByTestId('board-raspberrypi-64').click()
  await page.getByTestId('setup-download-link').click()

  const after = await downloadCount(request, { board: 'raspberrypi-64', language: 'de' })
  expect(after).toBe(before + 1)
})

test('the footer and the menu lead to the articles, and an article leads on to setup', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('footer-articles').click()
  await expect(page).toHaveURL(/\/articles$/)
  await page.getByTestId('nav-home').click()
  await page.getByTestId('nav-articles').click()
  await expect(page).toHaveURL(/\/articles$/)
  await page.getByTestId('article-syncloud-on-odroid').click()
  await expect(page).toHaveURL(/\/articles\/syncloud-on-odroid$/)
  await expect(page.getByTestId('article-title')).toBeVisible()
  await page.getByTestId('article-link-setup').click()
  await expect(page).toHaveURL(/\/setup$/)
})
