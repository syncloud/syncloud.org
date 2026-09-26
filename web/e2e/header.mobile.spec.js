import { test, expect } from '@playwright/test'

async function rightEdgeGap (page, testid) {
  const box = await page.getByTestId(testid).boundingBox()
  const width = page.viewportSize().width
  return width - (box.x + box.width)
}

test('the header controls sit at the right edge, with or without a language choice', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('language-button')).toBeVisible()
  const withChoice = await rightEdgeGap(page, 'nav-burger')

  await page.getByTestId('index-app-games').click()
  await expect(page).toHaveURL(/\/en\/games$/)
  await expect(page.getByTestId('language-button')).toHaveCount(0)
  const withoutChoice = await rightEdgeGap(page, 'nav-burger')

  expect(withChoice).toBeLessThan(40)
  expect(withoutChoice).toBeLessThan(40)
  expect(Math.abs(withChoice - withoutChoice)).toBeLessThan(4)
})

test('the theme toggle stays beside the burger rather than drifting left', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('index-app-password').click()
  await expect(page).toHaveURL(/\/en\/password-manager$/)

  const theme = await page.getByTestId('theme-toggle').boundingBox()
  const burger = await page.getByTestId('nav-burger').boundingBox()

  expect(theme.x).toBeLessThan(burger.x)
  expect(burger.x - (theme.x + theme.width)).toBeLessThan(24)
})
