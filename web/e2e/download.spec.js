import { test, expect } from '@playwright/test'

test('a download click lands on the image', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('nav-setup').click()
  await page.getByTestId('path-build').click()
  await page.getByTestId('board-raspberrypi-64').click()

  const link = page.getByTestId('setup-download-link')
  await expect(link).toBeVisible()
  await expect(link).toHaveText(/^syncloud-raspberrypi-64-\d{2}\.\d{2}\.\d{2}\.img\.xz$/)

  await link.click()
  await expect(page.locator('body')).toContainText('syncloud-raspberrypi-64')
})

test('the virtualbox image is a distinct format', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('nav-setup').click()
  await page.getByTestId('path-build').click()
  await page.getByTestId('board-amd64-vdi').click()

  const link = page.getByTestId('setup-download-link')
  await expect(link).toHaveText(/\.vdi\.xz$/)
  await link.click()
  await expect(page.locator('body')).toContainText('.vdi.xz')
})

test('buying skips the image steps', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('nav-setup').click()
  await page.getByTestId('path-buy').click()
  await expect(page.getByTestId('setup-step-order')).toBeVisible()
  await expect(page.getByTestId('setup-step-write')).toHaveCount(0)
  await expect(page.getByTestId('setup-step-activate')).toBeVisible()
})

test('buying stays on setup and offers one link to the hardware page', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('nav-setup').click()
  await page.getByTestId('path-buy').click()
  await expect(page.getByTestId('setup-step-order')).toBeVisible()
  await page.getByTestId('setup-hardware-link').click()
  await expect(page.getByTestId('hardware-store-link')).toBeVisible()
  for (const id of ['ameridroid', 'protectli', 'sossolutions', 'electrokit']) {
    await expect(page.getByTestId(`reseller-${id}`)).toBeVisible()
  }
  await page.getByTestId('hardware-setup-link').click()
  await expect(page.getByTestId('path-build')).toBeVisible()
  await expect(page.getByTestId('setup-step-order')).toHaveCount(0)
})

test('going back from the hardware page returns to the buy path still open', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('nav-setup').click()
  await page.getByTestId('path-buy').click()
  await page.getByTestId('setup-hardware-link').click()
  await expect(page.getByTestId('hardware-store-link')).toBeVisible()
  await page.goBack()
  await expect(page.getByTestId('setup-step-order')).toBeVisible()
})

test('the footer and the menu lead to the articles, and an article leads on to setup', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('footer-articles').click()
  await expect(page.getByTestId('article-syncloud-on-odroid')).toBeVisible()
  await page.getByTestId('nav-home').click()
  await expect(page.getByTestId('article-syncloud-on-odroid')).toHaveCount(0)
  await page.getByTestId('nav-articles').click()
  await page.getByTestId('article-syncloud-on-odroid').click()
  await expect(page.getByTestId('article-title')).toBeVisible()
  await page.getByTestId('article-link-setup').click()
  await expect(page.getByTestId('path-build')).toBeVisible()
})

test('the hardware page filters shops by country and by name', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('nav-hardware').click()
  await page.getByTestId('hardware-country').selectOption('SE')
  await expect(page.getByTestId('reseller-electrokit')).toBeVisible()
  await expect(page.getByTestId('reseller-ameridroid')).toHaveCount(0)
  await page.getByTestId('hardware-country').selectOption('')
  await page.getByTestId('hardware-search').fill('slimbook')
  await expect(page.getByTestId('reseller-slimbook')).toBeVisible()
  await expect(page.getByTestId('reseller-electrokit')).toHaveCount(0)
  await expect(page.getByTestId('hardware-count')).toHaveText('Shops: 1')
  await page.getByTestId('hardware-search').fill('')
  await page.getByTestId('hardware-arch-x64').click()
  await expect(page.getByTestId('reseller-protectli')).toBeVisible()
  await expect(page.getByTestId('reseller-ameridroid')).toHaveCount(0)
})
