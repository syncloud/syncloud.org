import { chromium } from '@playwright/test'
import { createServer } from 'node:http'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
}

const FONTS = {
  all: ['Sora', 'Figtree', 'JetBrains Mono'],
  ru: ['Noto Sans'],
  ar: ['Noto Sans Arabic'],
  hi: ['Noto Sans Devanagari']
}

const dist = resolve(process.argv[2] || 'dist')
if (!existsSync(join(dist, 'leaflet', 'index.html'))) {
  throw new Error(`${dist}/leaflet/index.html does not exist, build the site first`)
}

function file (path) {
  const direct = join(dist, decodeURIComponent(path))
  if (!direct.startsWith(dist)) return null
  if (existsSync(direct) && statSync(direct).isFile()) return direct
  const index = join(direct, 'index.html')
  if (existsSync(index)) return index
  return null
}

const server = createServer((request, response) => {
  const found = file(new URL(request.url, 'http://localhost').pathname)
  if (!found) {
    response.writeHead(404)
    response.end()
    return
  }
  response.writeHead(200, { 'content-type': TYPES[extname(found)] || 'application/octet-stream' })
  response.end(readFileSync(found))
})
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const origin = `http://127.0.0.1:${server.address().port}`

const browser = await chromium.launch()
try {
  const listing = await browser.newPage()
  await listing.goto(`${origin}/leaflet`)
  const pdfs = await listing.locator('[data-testid="leaflet-pdfs"] a').evaluateAll(links =>
    links.map(link => ({ code: link.getAttribute('hreflang'), href: link.getAttribute('href') })))
  if (pdfs.length === 0) {
    throw new Error('the leaflet page lists no PDFs')
  }

  for (const { code, href } of pdfs) {
    const context = await browser.newContext()
    await context.addInitScript(locale => localStorage.setItem('syncloud.locale', locale), code)
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(`${origin}/leaflet`)
    await page.waitForFunction(locale => document.documentElement.lang === locale, code)
    await page.getByTestId('leaflet-sheets').waitFor()
    await page.emulateMedia({ media: 'print' })

    const wanted = FONTS.all.concat(FONTS[code] || [])
    const ready = await page.waitForFunction(families => {
      const loaded = [...document.fonts]
        .filter(face => face.status === 'loaded')
        .map(face => face.family.replace(/"/g, ''))
      return families.every(family => loaded.includes(family))
    }, wanted, { timeout: 20000 }).then(() => true, () => false)
    if (!ready) {
      const loaded = await page.evaluate(() => [...document.fonts].map(face => `${face.family} ${face.status}`))
      throw new Error(`${code}: fonts not loaded, wanted ${wanted.join(', ')}, have ${loaded.join(', ')}`)
    }
    await page.evaluate(() => document.fonts.ready)

    const overflowing = await page.locator('.ql-panel').evaluateAll(panels => panels
      .map((panel, index) => ({ index, over: panel.scrollHeight - panel.clientHeight }))
      .filter(panel => panel.over > 1))
    if (overflowing.length > 0) {
      throw new Error(`${code}: text runs off panels ${JSON.stringify(overflowing)}`)
    }
    if (errors.length > 0) {
      throw new Error(`${code}: page errors: ${errors.join('; ')}`)
    }

    const out = join(dist, href)
    await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true })
    const pages = (readFileSync(out, 'latin1').match(/\/Type\s*\/Page\b/g) || []).length
    if (pages !== 2) {
      throw new Error(`${code}: ${out} has ${pages} pages, expected 2`)
    }
    console.log(`${code} ${out} ${statSync(out).size} bytes`)
    await context.close()
  }
} finally {
  await browser.close()
  server.close()
}
