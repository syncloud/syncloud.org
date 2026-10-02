import { test, expect } from '@playwright/test'

test('the spec stacks the label above the value on a narrow screen', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('index-app-games').click()
  await expect(page).toHaveURL(/\/en\/games$/)

  const spec = page.getByTestId('landing-spec')
  await expect(spec).toBeVisible()

  const label = await spec.locator('dt').first().boundingBox()
  const value = await spec.locator('dd').first().boundingBox()

  expect(value.y).toBeGreaterThan(label.y + label.height - 2)
  expect(Math.abs(value.x - label.x)).toBeLessThan(4)
})

test('no row of the spec pushes the page wider than the screen', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('index-app-games').click()

  const width = page.viewportSize().width
  const box = await page.getByTestId('landing-spec').boundingBox()
  expect(box.x).toBeGreaterThanOrEqual(0)
  expect(box.x + box.width).toBeLessThanOrEqual(width + 1)

  const scrollable = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth)
  expect(scrollable).toBe(false)
})
