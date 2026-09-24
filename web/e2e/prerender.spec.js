import { test, expect } from '@playwright/test'
import { routes, servedPaths } from '../src/router/routes.js'

const pages = routes.filter(route => !route.path.includes(':')).map(route => route.path)

test('every path the router serves arrives prerendered, not as an empty shell', async ({ request }) => {
  for (const path of servedPaths()) {
    const response = await request.get(path)
    expect(response.status(), path).toBe(200)
    expect(await response.text(), path).not.toContain('<div id="app"></div>')
  }
})

test('each route is served its own page rather than one shell for all of them', async ({ request }) => {
  const titles = []
  for (const path of pages) {
    const found = (await request.get(path).then(r => r.text())).match(/<title>([^<]*)<\/title>/)
    expect(found, path).not.toBeNull()
    titles.push(found[1])
  }
  expect(new Set(titles).size).toBe(pages.length)
})
