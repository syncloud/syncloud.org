import { readFileSync } from 'node:fs'
import { describe, it, expect, beforeEach } from 'vitest'
import {
  ORIGIN,
  applyMetadata,
  headTags,
  indexablePaths,
  landingPath,
  landingPaths,
  metadata,
  sitemapXml
} from '../src/seo.js'
import { routes, servedPaths } from '../src/router/routes.js'
import { landingCopy } from '../src/landing-copy'
import { page } from '../tools/page.js'

function read (relative) {
  return readFileSync(new URL(relative, import.meta.url), 'utf8')
}

const pages = routes.filter(route => route.name !== 'NotFound')

beforeEach(() => {
  document.head.innerHTML = ''
  document.documentElement.setAttribute('lang', 'en')
})

describe('page metadata', () => {
  it('gives every route its own title and description', () => {
    const titles = new Set()
    const descriptions = new Set()
    for (const route of pages) {
      const seo = metadata(route)
      expect(seo.title, route.name).toBeTruthy()
      expect(seo.description, route.name).toBeTruthy()
      titles.add(seo.title)
      descriptions.add(seo.description)
    }
    expect(titles.size).toBe(pages.length)
    expect(descriptions.size).toBe(pages.length)
  })

  it('keeps titles and descriptions within what a search result shows', () => {
    for (const route of pages) {
      const seo = metadata(route)
      expect(seo.title.length, `${route.name} title`).toBeLessThanOrEqual(60)
      expect(seo.description.length, `${route.name} description`).toBeLessThanOrEqual(160)
    }
  })

  it('describes a landing page with its own headline copy', () => {
    const seo = metadata({ name: 'LandingAccessEn', meta: { variant: 'access', language: 'en' } })
    expect(seo.title).toBe(landingCopy('access', 'en').metaTitle)
    expect(seo.description).toBe(landingCopy('access', 'en').subtitle)
  })

  it('writes German metadata on German routes and English on English ones', () => {
    const de = metadata({ name: 'LandingPiDe', meta: { variant: 'pi', language: 'de' } })
    const en = metadata({ name: 'LandingPiEn', meta: { variant: 'pi', language: 'en' } })
    expect(de.lang).toBe('de')
    expect(de.title).toContain('Raspberry Pi als private Cloud')
    expect(en.lang).toBe('en')
    expect(en.title).toContain('Turn a Raspberry Pi into a private cloud')
    expect(de.title).not.toBe(en.title)
    expect(de.description).not.toBe(en.description)
  })

  it('points each landing page at itself and claims no language alternates', () => {
    const seo = metadata({ name: 'LandingCloudDe', meta: { variant: 'cloud', language: 'de', noindex: true } })
    expect(seo.canonical).toBe(`${ORIGIN}/de/private-cloud`)
    expect(seo.alternates).toBeUndefined()
    expect(headTags(seo).join('')).not.toContain('hreflang')
  })

  it('canonicalises an alias onto the route it aliases', () => {
    expect(metadata({ name: 'Setup', meta: {} }).canonical).toBe(`${ORIGIN}/setup`)
  })

  it('leaves the site pages without a robots tag', () => {
    for (const route of pages.filter(route => !route.meta || !route.meta.variant)) {
      expect(metadata(route).robots, route.name).toBeNull()
    }
  })

  it('keeps every landing route out of the index', () => {
    const landings = pages.filter(route => route.meta && route.meta.variant)
    expect(landings).toHaveLength(7)
    for (const route of landings) {
      expect(metadata(route).robots, route.name).toBe('noindex')
    }
  })

  it('describes the password manager page with its own copy, in English', () => {
    const route = routes.find(r => r.name === 'LandingPasswordEn')
    const seo = metadata(route)
    expect(seo.title).toBe(landingCopy('password', 'en').metaTitle)
    expect(seo.description).toBe(landingCopy('password', 'en').subtitle)
    expect(seo.lang).toBe('en')
    expect(seo.canonical).toBe(`${ORIGIN}/en/password-manager`)
    expect(seo.robots).toBe('noindex')
  })

  it('marks an unknown route noindex and gives it no canonical', () => {
    const seo = metadata({ name: 'NotFound', meta: {} })
    expect(seo.robots).toBe('noindex')
    expect(seo.canonical).toBeNull()
    expect(seo.title).toContain('not found')
  })
})

describe('applying metadata to the document', () => {
  it('sets the title, description, canonical, robots and language', () => {
    applyMetadata(document, metadata({ name: 'LandingAccessDe', meta: { variant: 'access', language: 'de', noindex: true } }))
    expect(document.title).toBe(landingCopy('access', 'de').metaTitle)
    expect(document.head.querySelector('meta[name="description"]').getAttribute('content'))
      .toBe(landingCopy('access', 'de').subtitle)
    expect(document.head.querySelector('link[rel="canonical"]').getAttribute('href'))
      .toBe(`${ORIGIN}/de/remote-access`)
    expect(document.head.querySelector('meta[name="robots"]').getAttribute('content')).toBe('noindex')
    expect(document.documentElement.getAttribute('lang')).toBe('de')
  })

  it('replaces the previous page metadata instead of stacking it up', () => {
    applyMetadata(document, metadata({ name: 'LandingAccessDe', meta: { variant: 'access', language: 'de', noindex: true } }))
    applyMetadata(document, metadata({ name: 'Faq', meta: {} }))
    expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1)
    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1)
    expect(document.head.querySelectorAll('meta[name="robots"]')).toHaveLength(0)
    expect(document.head.querySelector('link[rel="canonical"]').getAttribute('href'))
      .toBe(`${ORIGIN}/faq`)
  })

  it('adds a robots tag only while an unindexed route is shown', () => {
    applyMetadata(document, metadata({ name: 'NotFound', meta: {} }))
    expect(document.head.querySelector('meta[name="robots"]').getAttribute('content')).toBe('noindex')
    applyMetadata(document, metadata({ name: 'Index', meta: {} }))
    expect(document.head.querySelector('meta[name="robots"]')).toBeNull()
  })

  it('leaves the language alone on routes that do not fix one', () => {
    document.documentElement.setAttribute('lang', 'ru')
    applyMetadata(document, metadata({ name: 'Index', meta: {} }))
    expect(document.documentElement.getAttribute('lang')).toBe('ru')
  })
})

describe('sitemap', () => {
  const xml = sitemapXml()

  it('lists every indexable route once', () => {
    expect(indexablePaths()).toEqual(['/', '/setup', '/faq', '/privacy'])
    for (const path of indexablePaths()) {
      expect(xml, path).toContain(`<loc>${ORIGIN}${path}</loc>`)
    }
    expect(xml.match(/<loc>/g)).toHaveLength(indexablePaths().length)
  })

  it('lists only paths the router serves', () => {
    for (const path of indexablePaths()) {
      expect(servedPaths(), path).toContain(path)
    }
  })

  it('never lists a route that asks not to be indexed', () => {
    for (const route of routes) {
      if (metadata(route).robots) {
        expect(indexablePaths(), route.name).not.toContain(route.path)
        expect(xml, route.name).not.toContain(`<loc>${ORIGIN}${route.path}</loc>`)
      }
    }
  })

  it('leaves the landing routes out', () => {
    expect(landingPaths()).toHaveLength(7)
    expect(landingPaths()).toContain('/en/password-manager')
    for (const path of landingPaths()) {
      expect(xml, path).not.toContain(`<loc>${ORIGIN}${path}</loc>`)
    }
  })

  it('follows the route table rather than a second list', () => {
    const landing = routes.find(route => route.name === 'LandingAccessEn')
    expect(indexablePaths()).not.toContain(landing.path)
    delete landing.meta.noindex
    try {
      expect(indexablePaths()).toContain(landing.path)
      expect(sitemapXml()).toContain(`<loc>${ORIGIN}${landing.path}</loc>`)
    } finally {
      landing.meta.noindex = true
    }
    expect(indexablePaths()).not.toContain(landing.path)
  })

  it('keeps a route with no metadata of its own out, rather than guessing', () => {
    const extra = { path: '/brand-new', name: 'BrandNew', meta: {} }
    routes.splice(routes.length - 1, 0, extra)
    try {
      expect(metadata(extra).robots).toBe('noindex')
      expect(indexablePaths()).not.toContain('/brand-new')
    } finally {
      routes.splice(routes.indexOf(extra), 1)
    }
  })

  it('is well formed xml', () => {
    const parsed = new window.DOMParser().parseFromString(xml, 'application/xml')
    expect(parsed.querySelector('parsererror')).toBeNull()
    expect(parsed.documentElement.tagName).toBe('urlset')
  })
})

describe('robots.txt', () => {
  const robots = read('../public/robots.txt')

  it('is a real file that points crawlers at the sitemap', () => {
    expect(robots).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`)
    expect(robots).toContain('User-agent: *')
  })

  it('keeps the api out of the index', () => {
    expect(robots).toContain('Disallow: /api/')
  })
})

describe('the web server route table', () => {
  const caddy = read('../../config/caddy/syncloud.org.caddy')
  const matcher = caddy.match(/@app path (.+)/)

  it('rewrites exactly the paths the router serves, so anything else can 404', () => {
    expect(matcher).not.toBeNull()
    expect(matcher[1].trim().split(/\s+/).sort()).toEqual(servedPaths().sort())
  })

  it('answers an unknown path with a 404 page rather than the shell', () => {
    expect(caddy).toContain('handle_errors')
    expect(caddy).toContain('rewrite * /404.html')
    expect(caddy).toContain('status 404')
  })

  it('prefers the prerendered file for a route and keeps the shell as a fallback', () => {
    expect(caddy).toContain('try_files {path}/index.html /index.html')
  })
})

describe('per environment indexability', () => {
  const deploy = read('../../deploy/deploy.sh')
  const prepare = read('../../ci/deploy-prepare.sh')
  const verify = read('../../ci/deploy-verify.sh')
  const environments = ['prod', 'uat', 'test']

  function siteEnv (environment) {
    return read(`../../config/env/${environment}/site.env`).trim()
  }

  it('states indexability for every environment that deploys', () => {
    for (const environment of environments) {
      expect(siteEnv(environment), environment).toMatch(/^SITE_INDEXABLE=(true|false)$/)
    }
  })

  it('publishes production and hides the uat site', () => {
    expect(siteEnv('prod')).toBe('SITE_INDEXABLE=true')
    expect(siteEnv('uat')).toBe('SITE_INDEXABLE=false')
  })

  it('exercises both branches in the pipeline, so neither can rot', () => {
    expect(siteEnv('test')).toBe('SITE_INDEXABLE=true')
    expect(siteEnv('uat')).toBe('SITE_INDEXABLE=false')
  })

  it('ships the setting to the host that deploys', () => {
    expect(prepare).toContain('$CONFIG_DIR/site.env')
    expect(deploy).toContain('source "$STAGE/config/site.env"')
  })

  it('hides a non indexable site with a header, not by blocking the crawler', () => {
    const noindex = read('../../config/caddy/robots-noindex.caddy')
    const indexable = read('../../config/caddy/robots-indexable.caddy')
    expect(noindex).toContain('header X-Robots-Tag noindex')
    expect(indexable).toContain('header -X-Robots-Tag')
    for (const snippet of [noindex, indexable]) {
      expect(snippet).toContain('(syncloud_org_robots)')
    }
    expect(read('../../config/caddy/syncloud.org.caddy')).toContain('import syncloud_org_robots')
    expect(read('../public/robots.txt')).not.toMatch(/^Disallow: \/$/m)
  })

  it('defines the snippet before the site that imports it', () => {
    const installed = deploy.match(/\/etc\/caddy\/conf\.d\/(\S+robots\S*\.caddy)/)
    expect(installed).not.toBeNull()
    expect(installed[1] < 'syncloud.org.caddy').toBe(true)
  })

  it('takes the sitemap and its robots.txt line away from a non indexable site', () => {
    expect(deploy).toContain('rm -f "$TARGET/sitemap.xml"')
    expect(deploy).toContain("sed -i '/^Sitemap: /d' \"$TARGET/robots.txt\"")
  })

  it('proves both branches at deploy time', () => {
    expect(verify).toContain('source "$CONFIG_DIR/site.env"')
    expect(verify).toContain('expect_status /sitemap.xml 200')
    expect(verify).toContain('expect_status /sitemap.xml 404')
    expect(verify).toContain('X-Robots-Tag: noindex')
    expect(verify).toContain('is not marked noindex')
    expect(verify).toContain('which is noindex')
  })
})

describe('the deploy check', () => {
  const verify = read('../../ci/deploy-verify.sh')

  function declared (name) {
    const found = verify.match(new RegExp(`${name}="([^"]+)"`))
    expect(found, name).not.toBeNull()
    return found[1].trim().split(/\s+/).sort()
  }

  it('asserts against every landing route the router serves, not a stale list', () => {
    expect(declared('LANDING_ROUTES')).toEqual(landingPaths().sort())
  })

  it('asserts against every indexable route the sitemap lists', () => {
    expect(declared('INDEXABLE_ROUTES')).toEqual(indexablePaths().sort())
  })

  it('proves the new page is served and carries its own canonical', () => {
    expect(verify).toContain('expect_status /en/password-manager 200')
    expect(verify).toContain('rel="canonical" href="https://syncloud.org/en/password-manager"')
  })
})

describe('prerendered pages', () => {
  const template = read('../index.html')

  it('carries the body copy and the page metadata into the served html', () => {
    const seo = metadata({ name: 'LandingAccessEn', meta: { variant: 'access', language: 'en' } })
    const html = page(template, '<h1>Your server runs</h1>', seo)
    expect(html).toContain('<div id="app"><h1>Your server runs</h1></div>')
    expect(html).toContain('<html lang="en"')
    expect(html).toContain(`<title>${seo.title}</title>`)
    expect(html).toContain(`<link rel="canonical" href="${ORIGIN}/en/remote-access">`)
    expect(html.match(/<title>/g)).toHaveLength(1)
    expect(html.match(/name="description"/g)).toHaveLength(1)
    expect(html.match(/rel="canonical"/g)).toHaveLength(1)
  })

  it('covers every landing route the router serves', () => {
    expect(landingPaths().sort()).toEqual([
      '/de/private-cloud',
      '/de/raspberry-pi',
      '/de/remote-access',
      '/en/password-manager',
      '/en/private-cloud',
      '/en/raspberry-pi',
      '/en/remote-access'
    ])
    for (const path of landingPaths()) {
      expect(servedPaths(), path).toContain(path)
    }
  })

  it('takes the landing paths from the route table, so a variant can exist in one language only', () => {
    expect(landingPaths()).not.toContain('/de/password-manager')
    expect(servedPaths()).not.toContain('/de/password-manager')
  })

  it('leaves the document language alone when the route does not fix one', () => {
    const html = page(template, '<p>x</p>', metadata({ name: 'Faq', meta: {} }))
    expect(html).toContain('<html lang="en"')
    expect(html).not.toContain('lang="null"')
  })

  it('gives the 404 page a robots tag and no canonical', () => {
    const html = page(template, '<p>x</p>', metadata({ name: 'NotFound', meta: {} }))
    expect(html).toContain('<meta name="robots" content="noindex">')
    expect(html).not.toContain('rel="canonical"')
  })

  it('derives a landing path from its variant and language', () => {
    expect(landingPath('pi', 'de')).toBe('/de/raspberry-pi')
    expect(landingPath('cloud', 'en')).toBe('/en/private-cloud')
  })

  it('escapes anything that would break the head', () => {
    const tags = headTags({
      title: 'a "quoted" & <angled> title',
      description: null,
      canonical: null,
      robots: null
    })
    expect(tags[0]).toBe('<title>a &quot;quoted&quot; &amp; &lt;angled&gt; title</title>')
  })
})
