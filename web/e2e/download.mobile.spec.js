import { test, expect } from '@playwright/test'

test('the wizard is usable on a phone', async ({ page }) => {
  await page.goto('/setup')
  await page.getByTestId('path-build').click()
  await page.getByTestId('board-raspberrypi-64').click()

  const link = page.getByTestId('setup-download-link')
  await expect(link).toBeVisible()

  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow, 'the page must not scroll sideways').toBeLessThanOrEqual(0)
})
