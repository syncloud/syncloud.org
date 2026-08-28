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
  await expect(link).toHaveText(/^syncloud-raspberrypi-64-.*\.img\.xz$/)

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

test('the old hardware and download urls still land on setup', async ({ page }) => {
  for (const path of ['/hardware', '/download']) {
    await page.goto(path)
    await expect(page.getByTestId('path-build')).toBeVisible()
  }
})
