import { test, expect } from '@playwright/test'

test('a page whose path fixes the language offers no language choice', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('language-button')).toBeVisible()

  await page.getByTestId('index-app-games').click()
  await expect(page).toHaveURL(/\/en\/games$/)

  await expect(page.getByTestId('language-button')).toHaveCount(0)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})

test('the switcher still works where the path leaves the language open', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('language-button').click()
  await page.getByTestId('language-de').click()

  await expect(page.locator('html')).toHaveAttribute('lang', 'de')
})

test('a chosen language survives a page whose path overrides it', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('language-button').click()
  await page.getByTestId('language-de').click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'de')

  await page.getByTestId('index-app-games').click()
  await expect(page).toHaveURL(/\/en\/games$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')

  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'de')
  await expect(page.getByTestId('language-button')).toBeVisible()
})
