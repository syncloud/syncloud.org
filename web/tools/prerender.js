import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { servedPaths } from '../src/router/routes.js'
import { sitemapXml } from '../src/seo.js'
import { page } from './page.js'
import { render } from '../dist-ssr/entry-server.js'

const NOT_FOUND = '/404'

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const template = await readFile(join(dist, 'index.html'), 'utf8')

async function write (path, file) {
  const { html, seo } = await render(path)
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, page(template, html, seo))
  console.log(`prerendered ${path} -> ${file.slice(dist.length + 1)}`)
}

for (const path of servedPaths()) {
  await write(path, path === '/' ? join(dist, 'index.html') : join(dist, path, 'index.html'))
}

await write(NOT_FOUND, join(dist, '404.html'))

await writeFile(join(dist, 'sitemap.xml'), sitemapXml())
console.log('wrote sitemap.xml')
