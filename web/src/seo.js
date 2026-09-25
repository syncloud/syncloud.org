import { landingCopy, DEFAULT_LANGUAGE, DEFAULT_VARIANT } from './landing.js'
import { routes } from './router/routes.js'

export const ORIGIN = 'https://syncloud.org'

export const VARIANT_PATHS = {
  cloud: 'private-cloud',
  pi: 'raspberry-pi',
  access: 'remote-access',
  password: 'password-manager',
  games: 'games',
  'actual-budget': 'actual-budget'
}

const PAGES = {
  Index: {
    path: '/',
    title: 'Syncloud - your own apps on your own server at home',
    description: 'Run Nextcloud, media, photos and a password manager on hardware you own. Syncloud installs and updates them for you, with HTTPS and a domain name included.'
  },
  Setup: {
    path: '/setup',
    title: 'Set up a Syncloud device - images and hardware',
    description: 'Write a Syncloud image to a Raspberry Pi, an old PC or VirtualBox, or order a ready made device. Plug it in, activate it, then install apps in one click.'
  },
  Faq: {
    path: '/faq',
    title: 'Syncloud FAQ - access, accounts and where data is stored',
    description: 'How to reach a Syncloud device from anywhere, why an account is needed, what happens to your personal data and where Syncloud stores it.'
  },
  Privacy: {
    path: '/privacy',
    title: 'Privacy policy - Syncloud',
    description: 'What personal information Syncloud collects, why it is needed, and who it is shared with.'
  }
}

const NOT_FOUND = {
  title: 'Page not found - Syncloud',
  description: 'This page does not exist.'
}

export function landingPath (variant, language) {
  return `/${language}/${VARIANT_PATHS[variant] || VARIANT_PATHS[DEFAULT_VARIANT]}`
}

export function landingPaths () {
  return routes
    .filter(route => route.meta && route.meta.variant)
    .map(route => route.path)
}

export function appLandings () {
  return routes
    .filter(route => route.meta && route.meta.variant && !metadata(route).robots)
    .map(route => ({
      path: route.path,
      variant: route.meta.variant,
      ...landingCopy(route.meta.variant, route.meta.language).link
    }))
}

export function indexablePaths () {
  return routes
    .filter(route => !route.path.includes(':') && !metadata(route).robots)
    .map(route => route.path)
}

export function metadata (route) {
  const meta = (route && route.meta) || {}
  if (meta.variant) {
    const language = meta.language || DEFAULT_LANGUAGE
    const copy = landingCopy(meta.variant, language)
    return {
      title: copy.metaTitle,
      description: copy.subtitle,
      lang: language,
      canonical: ORIGIN + landingPath(meta.variant, language),
      robots: meta.noindex ? 'noindex' : null
    }
  }
  const page = PAGES[route && route.name]
  if (!page) {
    return {
      title: NOT_FOUND.title,
      description: NOT_FOUND.description,
      lang: null,
      canonical: null,
      robots: 'noindex'
    }
  }
  return {
    title: page.title,
    description: page.description,
    lang: null,
    canonical: ORIGIN + page.path,
    robots: meta.noindex ? 'noindex' : null
  }
}

function upsert (doc, selector, tag, attributes, value) {
  const existing = doc.head.querySelector(selector)
  if (!value) {
    if (existing) existing.remove()
    return
  }
  const el = existing || doc.createElement(tag)
  for (const [name, content] of Object.entries(attributes)) {
    el.setAttribute(name, content)
  }
  if (!existing) doc.head.appendChild(el)
}

function setMeta (doc, name, content) {
  upsert(doc, `meta[name="${name}"]`, 'meta', { name, content }, content)
}

function setCanonical (doc, href) {
  upsert(doc, 'link[rel="canonical"]', 'link', { rel: 'canonical', href }, href)
}

export function applyMetadata (doc, seo) {
  doc.title = seo.title
  setMeta(doc, 'description', seo.description)
  setMeta(doc, 'robots', seo.robots)
  setCanonical(doc, seo.canonical)
  if (seo.lang) {
    doc.documentElement.setAttribute('lang', seo.lang)
  }
}

export function escapeHtml (value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function headTags (seo) {
  const tags = [`<title>${escapeHtml(seo.title)}</title>`]
  if (seo.description) {
    tags.push(`<meta name="description" content="${escapeHtml(seo.description)}">`)
  }
  if (seo.robots) {
    tags.push(`<meta name="robots" content="${escapeHtml(seo.robots)}">`)
  }
  if (seo.canonical) {
    tags.push(`<link rel="canonical" href="${escapeHtml(seo.canonical)}">`)
  }
  return tags
}

export function sitemapXml () {
  const urls = indexablePaths()
    .map(path => `  <url>\n    <loc>${ORIGIN}${path}</loc>\n  </url>`)
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}
