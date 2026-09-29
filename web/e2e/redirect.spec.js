import { test, expect } from '@playwright/test'

test('the old password manager path redirects permanently to the app page', async ({ request }) => {
  const response = await request.get('/en/password-manager', { maxRedirects: 0 })

  expect(response.status()).toBe(301)
  expect(response.headers().location).toBe('/en/bitwarden')
})

test('following the old path lands on the app page', async ({ page }) => {
  await page.goto('/en/password-manager')

  await expect(page).toHaveURL(/\/en\/bitwarden$/)
  await expect(page.getByTestId('landing-title')).toBeVisible()
})
