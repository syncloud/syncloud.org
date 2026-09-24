import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { site } from '../src/data/site'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import en from '../src/locales/en.json'
import Landing from '../src/views/Landing.vue'
import { captureGclid } from '../src/attribution'
import { landingCopy, LANGUAGES } from '../src/landing-copy'

vi.mock('../src/i18n', () => ({ setLocale: vi.fn(() => Promise.resolve()) }))

const ACCOUNT = 'https://www.syncloud.it'

function landing (variant, language = 'de') {
  const i18n = createI18n({
    legacy: false, locale: 'en', fallbackLocale: 'en', messages: { en }
  })
  return mount(Landing, {
    global: {
      plugins: [i18n],
      mocks: { $route: { path: `/${language}/x`, meta: { variant, language, bare: true } } }
    }
  })
}

beforeEach(() => {
  window.localStorage.clear()
  site.account = 'https://www.syncloud.it'
})

describe('German landing pages', () => {
  it('shows the cloud variant headline', () => {
    const wrapper = landing('cloud')
    expect(wrapper.get('[data-testid="landing-title"]').text()).toBe(landingCopy('cloud', 'de').title)
  })

  it('shows the raspberry pi variant headline', () => {
    const wrapper = landing('pi')
    expect(wrapper.get('[data-testid="landing-title"]').text()).toBe(landingCopy('pi', 'de').title)
  })

  it('falls back to the cloud variant for an unknown one', () => {
    const wrapper = landing('nonsense')
    expect(wrapper.get('[data-testid="landing-title"]').text()).toBe(landingCopy('cloud', 'de').title)
  })

  it('states the price and the free trial', () => {
    const text = landing('cloud').get('[data-testid="landing-price"]').text()
    expect(text).toContain('£5')
    expect(text.toLowerCase()).toContain('kostenlos')
  })

  it('links both calls to action at the account site', () => {
    const wrapper = landing('cloud')
    expect(wrapper.get('[data-testid="landing-cta"]').attributes('href')).toBe(ACCOUNT)
    expect(wrapper.get('[data-testid="landing-cta-bottom"]').attributes('href')).toBe(ACCOUNT)
  })

  it('carries a captured gclid into both calls to action', () => {
    captureGclid('?gclid=abc123')
    const wrapper = landing('cloud')
    const expected = ACCOUNT + '/?gclid=abc123'
    expect(wrapper.get('[data-testid="landing-cta"]').attributes('href')).toBe(expected)
    expect(wrapper.get('[data-testid="landing-cta-bottom"]').attributes('href')).toBe(expected)
  })

  it('renders exactly one call to action per section and no competing links', () => {
    const wrapper = landing('cloud')
    expect(wrapper.findAll('a').length).toBe(2)
  })

  it('shows an unlinked brand mark, so there is no way back to the site', () => {
    const wrapper = landing('cloud')
    const brand = wrapper.get('[data-testid="landing-brand"]')
    expect(brand.element.closest('a')).toBeNull()
  })

  it('provides every field the page renders, in both languages and variants', () => {
    for (const language of LANGUAGES) {
      for (const variant of ['cloud', 'pi']) {
        const copy = landingCopy(variant, language)
        for (const field of ['title', 'subtitle', 'cta', 'price', 'shotAlt', 'trust']) {
          expect(copy[field], `${language}.${variant}.${field}`).toBeTruthy()
        }
        expect(copy.points.length).toBeGreaterThan(0)
      }
    }
  })

  it('renders English copy on an English route', () => {
    const wrapper = landing('cloud', 'en')
    expect(wrapper.get('[data-testid="landing-title"]').text()).toBe(landingCopy('cloud', 'en').title)
    expect(wrapper.get('[data-testid="landing-price"]').text()).toContain('First month free')
  })

  it('renders German copy on a German route', () => {
    const wrapper = landing('cloud', 'de')
    expect(wrapper.get('[data-testid="landing-price"]').text()).toContain('Erster Monat kostenlos')
  })

  it('states the same price in every language', () => {
    for (const language of LANGUAGES) {
      expect(landingCopy('cloud', language).price).toContain('£5')
    }
  })
})

describe('the remote access variant', () => {
  it('leads with not being reachable, not with what the product is', () => {
    const wrapper = landing('access', 'de')
    expect(wrapper.get('[data-testid="landing-title"]').text())
      .toBe(landingCopy('access', 'de').title)
    expect(wrapper.get('[data-testid="landing-subtitle"]').text()).toContain('CGNAT')
  })

  it('answers the access problem rather than listing apps', () => {
    for (const language of LANGUAGES) {
      const copy = landingCopy('access', language)
      const points = copy.points.join(' ').toLowerCase()
      expect(points, language).not.toContain('40')
      expect(points, language).toMatch(/relay|port|cgnat/)
      expect(copy.points, language).not.toEqual(landingCopy('cloud', language).points)
    }
  })

  it('names the mesh vpn tools people compare it against, in English', () => {
    const points = landingCopy('access', 'en').points.join(' ')
    for (const tool of ['Tailscale', 'ZeroTier', 'Cloudflare']) {
      expect(points, tool).toContain(tool)
    }
  })

  it('says what Syncloud includes rather than what those tools lack', () => {
    const points = landingCopy('access', 'en').points.join(' ').toLowerCase()
    for (const claim of ['expensive', 'insecure', 'worse', 'unreliable']) {
      expect(points, claim).not.toContain(claim)
    }
    expect(landingCopy('access', 'en').points.join(' ')).toContain('included')
  })

  it('leaves the German copy to speak German', () => {
    const points = landingCopy('access', 'de').points.join(' ')
    expect(points).not.toContain('Tailscale')
    expect(points).toContain('DS-Lite')
  })

  it('renders the extra point on the page', () => {
    const wrapper = landing('access', 'en')
    expect(wrapper.get('[data-testid="landing-points"]').text()).toContain('Tailscale')
  })

  it('keeps the shared price and call to action', () => {
    for (const language of LANGUAGES) {
      expect(landingCopy('access', language).price)
        .toBe(landingCopy('cloud', language).price)
      expect(landingCopy('access', language).cta)
        .toBe(landingCopy('cloud', language).cta)
    }
  })
})

describe('the password manager variant', () => {
  const copy = landingCopy('password', 'en')

  it('leads with a password manager rather than with a private cloud', () => {
    const wrapper = landing('password', 'en')
    expect(wrapper.get('[data-testid="landing-title"]').text()).toBe(copy.title)
    expect(wrapper.get('[data-testid="landing-subtitle"]').text().toLowerCase())
      .toContain('bitwarden')
  })

  it('provides every field the page renders', () => {
    for (const field of ['title', 'subtitle', 'cta', 'price', 'shotAlt', 'trust']) {
      expect(copy[field], field).toBeTruthy()
    }
    expect(copy.points.length).toBeGreaterThan(0)
    expect(copy.points).not.toEqual(landingCopy('cloud', 'en').points)
  })

  it('says the hardware is yours to supply and the OS yours to install', () => {
    const text = copy.points.join(' ') + ' ' + copy.subtitle
    expect(text.toLowerCase()).toContain('raspberry pi')
    expect(text.toLowerCase()).toContain('old pc')
    expect(text.toLowerCase()).toContain('server os')
    expect(text.toLowerCase()).toContain('you supply')
  })

  it('refuses to read as a free product or a cloud account', () => {
    const text = (copy.subtitle + ' ' + copy.points.join(' ')).toLowerCase()
    expect(text).toContain('£5 a month')
    expect(text).toContain('not a free tier')
    expect(text).toContain('not a cloud account')
  })

  it('names what the subscription buys, not just the app', () => {
    const points = copy.points.join(' ').toLowerCase()
    expect(points).toContain('follows your ip')
    expect(points).toContain('port forwarding')
    expect(points).toContain('https certificate')
    expect(points).toContain('mail')
  })

  it('states Bitwarden as one available app and claims nothing on its behalf', () => {
    const text = copy.title + ' ' + copy.subtitle + ' ' + copy.points.join(' ')
    expect(text).toContain('Bitwarden')
    expect(text.match(/Bitwarden/g)).toHaveLength(2)
    expect(copy.metaTitle).not.toContain('Bitwarden')
    for (const claim of ['official', 'partner', 'endorse', 'certified', 'powered by']) {
      expect(text.toLowerCase(), claim).not.toContain(claim)
    }
  })

  it('keeps the shared price, call to action and trust line', () => {
    expect(copy.price).toBe(landingCopy('cloud', 'en').price)
    expect(copy.cta).toBe(landingCopy('cloud', 'en').cta)
    expect(copy.trust).toBe(landingCopy('cloud', 'en').trust)
  })

  it('renders the points on the page', () => {
    const wrapper = landing('password', 'en')
    expect(wrapper.get('[data-testid="landing-points"]').text()).toContain('Bitwarden')
    expect(wrapper.get('[data-testid="landing-price"]').text()).toContain('£5')
  })

  it('exists in English only, and falls back rather than inventing German', () => {
    expect(landingCopy('password', 'de')).toEqual(landingCopy('cloud', 'de'))
  })
})

describe('the games variant', () => {
  const copy = landingCopy('games', 'en')

  it('resolves to its own copy rather than the default variant', () => {
    const wrapper = landing('games', 'en')
    expect(wrapper.get('[data-testid="landing-title"]').text()).toBe(copy.title)
    expect(copy.title).not.toBe(landingCopy('cloud', 'en').title)
    expect(copy.points).not.toEqual(landingCopy('cloud', 'en').points)
  })

  it('provides every field the page renders', () => {
    for (const field of ['title', 'subtitle', 'cta', 'price', 'shotAlt', 'trust']) {
      expect(copy[field], field).toBeTruthy()
    }
    expect(copy.points.length).toBeGreaterThan(0)
  })

  it('exists in English only, and falls back rather than inventing German', () => {
    expect(landingCopy('games', 'de')).toEqual(landingCopy('cloud', 'de'))
  })

  it('holds the hardware filter instead of reading as a hosting company', () => {
    const text = (copy.subtitle + ' ' + copy.points.join(' ')).toLowerCase()
    expect(text).toContain('you supply')
    expect(text).toContain('raspberry pi')
    expect(text).toContain('old pc')
    expect(text).toContain('server os')
    expect(text).toContain('not a hosting service')
    expect(text).toContain('not in a data centre')
  })

  it('prices it as a paid service with a free first month and no free tier', () => {
    const text = (copy.subtitle + ' ' + copy.points.join(' ')).toLowerCase()
    expect(text).toContain('first month free')
    expect(text).toContain('£5 a month')
    expect(text).toContain('not a free tier')
    expect(text).toContain('not a cloud account')
    expect(copy.price).toBe(landingCopy('cloud', 'en').price)
    expect(copy.cta).toBe(landingCopy('cloud', 'en').cta)
  })

  it('reports the supported count honestly and calls the rest experimental', () => {
    const text = copy.points.join(' ') + ' ' + copy.shots.map(shot => shot.caption).join(' ')
    expect(text).toContain('2 games as supported')
    expect(text).toContain('135 marked experimental')
    expect(text.toLowerCase()).toContain('two are supported today')
    expect(text.toLowerCase()).toContain('marked experimental')
    for (const claim of ['hundreds of games', 'any game', 'every game', 'all your games']) {
      expect(text.toLowerCase(), claim).not.toContain(claim)
    }
  })

  it('claims nothing on Mojang behalf and disclaims affiliation', () => {
    const text = copy.title + ' ' + copy.subtitle + ' ' + copy.points.join(' ') +
      ' ' + copy.shots.map(shot => shot.alt + ' ' + shot.caption).join(' ')
    expect(text).toContain('Minecraft Bedrock')
    expect(copy.metaTitle).not.toContain('Minecraft')
    for (const claim of ['official', 'partner', 'endorsed by mojang', 'certified', 'powered by']) {
      expect(text.toLowerCase(), claim).not.toContain(claim)
    }
    expect(copy.trust).toContain('trademarks of Mojang Studios')
    expect(copy.trust).toContain('not affiliated with, endorsed by or sponsored by')
  })

  it('does not present the screenshots as remote access over the internet', () => {
    const captions = copy.shots.map(shot => shot.caption).join(' ').toLowerCase()
    expect(captions).toContain('local network')
    for (const claim of ['from anywhere', 'over the internet', 'remotely']) {
      expect(captions, claim).not.toContain(claim)
    }
  })

  it('tells the four steps in order on the page', () => {
    const wrapper = landing('games', 'en')
    const steps = wrapper.get('[data-testid="landing-steps"]')
    expect(steps.findAll('img')).toHaveLength(4)
    expect(wrapper.find('[data-testid="landing-screenshot"]').exists()).toBe(false)
    const sources = [1, 2, 3, 4].map(
      n => wrapper.get(`[data-testid="landing-step-image-${n}"]`).attributes('src')
    )
    expect(sources).toEqual([
      '/images/screenshot/games-install.webp',
      '/images/screenshot/games-catalog.webp',
      '/images/screenshot/games-running.webp',
      '/images/screenshot/games-play.webp'
    ])
  })

  it('gives every screenshot a size, meaningful alt text and a caption', () => {
    const wrapper = landing('games', 'en')
    for (let n = 1; n <= 4; n++) {
      const image = wrapper.get(`[data-testid="landing-step-image-${n}"]`)
      expect(Number(image.attributes('width')), `width ${n}`).toBeGreaterThan(0)
      expect(Number(image.attributes('height')), `height ${n}`).toBeGreaterThan(0)
      expect(image.attributes('alt').length, `alt ${n}`).toBeGreaterThan(20)
      expect(wrapper.get(`[data-testid="landing-step-caption-${n}"]`).text().length)
        .toBeGreaterThan(20)
    }
    expect(new Set(copy.shots.map(shot => shot.alt)).size).toBe(4)
  })

  it('loads the first screenshot eagerly and defers the ones below the fold', () => {
    const wrapper = landing('games', 'en')
    expect(wrapper.get('[data-testid="landing-step-image-1"]').attributes('loading')).toBe('eager')
    for (const n of [2, 3, 4]) {
      expect(wrapper.get(`[data-testid="landing-step-image-${n}"]`).attributes('loading'), n)
        .toBe('lazy')
    }
  })

  it('renders the trademark notice on the page', () => {
    const wrapper = landing('games', 'en')
    expect(wrapper.get('[data-testid="landing-trust"]').text()).toContain('Mojang Studios')
  })

  it('keeps the bare landing shape, two calls to action and no other links', () => {
    const wrapper = landing('games', 'en')
    expect(wrapper.findAll('a')).toHaveLength(2)
    expect(wrapper.get('[data-testid="landing-cta"]').attributes('href')).toBe(ACCOUNT)
    expect(wrapper.get('[data-testid="landing-cta-bottom"]').attributes('href')).toBe(ACCOUNT)
  })
})

describe('the actual budget variant', () => {
  const copy = landingCopy('actual-budget', 'en')

  it('resolves to its own copy rather than the default variant', () => {
    const wrapper = landing('actual-budget', 'en')
    expect(wrapper.get('[data-testid="landing-title"]').text()).toBe(copy.title)
    expect(copy.title).not.toBe(landingCopy('cloud', 'en').title)
    expect(copy.points).not.toEqual(landingCopy('cloud', 'en').points)
  })

  it('provides every field the page renders', () => {
    for (const field of ['title', 'subtitle', 'cta', 'price', 'shotAlt', 'trust']) {
      expect(copy[field], field).toBeTruthy()
    }
    expect(copy.points.length).toBeGreaterThan(0)
  })

  it('exists in English only, and falls back rather than inventing German', () => {
    expect(landingCopy('actual-budget', 'de')).toEqual(landingCopy('cloud', 'de'))
  })

  it('holds the same hardware filter as the other ad pages', () => {
    const text = (copy.subtitle + ' ' + copy.points.join(' ')).toLowerCase()
    expect(text).toContain('you supply')
    expect(text).toContain('raspberry pi')
    expect(text).toContain('old pc')
    expect(text).toContain('server os')
  })

  it('prices it as a paid service with a free first month and no free tier', () => {
    const text = (copy.subtitle + ' ' + copy.points.join(' ')).toLowerCase()
    expect(text).toContain('first month free')
    expect(text).toContain('£5 a month')
    expect(text).toContain('not a free tier')
    expect(text).toContain('not a cloud account')
    expect(copy.price).toBe(landingCopy('cloud', 'en').price)
    expect(copy.cta).toBe(landingCopy('cloud', 'en').cta)
  })

  it('argues the phone reaches the server, and says what the subscription provides', () => {
    const points = copy.points.join(' ').toLowerCase()
    expect(points).toContain('phone')
    expect(points).toContain('follows your ip')
    expect(points).toContain('port forwarding')
    expect(points).toContain('https certificate')
  })

  it('states no price but its own, so no competitor figure can go stale', () => {
    const text = copy.title + ' ' + copy.subtitle + ' ' + copy.points.join(' ') +
      ' ' + copy.trust + ' ' + copy.shots.map(shot => shot.alt + ' ' + shot.caption).join(' ')
    const prices = text.match(/[£$€]\s?\d+(\.\d+)?/g) || []
    expect(new Set(prices)).toEqual(new Set(['£5']))
  })

  it('claims only what the screenshots show about the app', () => {
    const text = (copy.title + ' ' + copy.subtitle + ' ' + copy.points.join(' ') +
      ' ' + copy.shots.map(shot => shot.alt + ' ' + shot.caption).join(' ')).toLowerCase()
    expect(text).toContain('version 38')
    expect(text).toContain('local-first personal finance and budgeting')
    for (const claim of ['bank sync', 'import', 'report', 'multi-user', 'forecast', 'tax']) {
      expect(text, claim).not.toContain(claim)
    }
  })

  it('names the app without claiming a relationship with it', () => {
    const text = copy.title + ' ' + copy.subtitle + ' ' + copy.points.join(' ')
    expect(text).toContain('Actual Budget')
    expect(copy.metaTitle).not.toContain('Actual Budget')
    for (const claim of ['official', 'partner', 'certified', 'powered by', 'ynab', 'you need a budget']) {
      expect(text.toLowerCase(), claim).not.toContain(claim)
    }
    expect(copy.trust).toContain('independent open source project')
    expect(copy.trust).toContain('not affiliated with, endorsed by or sponsored by')
  })

  it('does not present the screenshots as remote access over the internet', () => {
    const captions = copy.shots.map(shot => shot.caption).join(' ').toLowerCase()
    for (const claim of ['from anywhere', 'over the internet', 'remotely', 'anywhere in the world']) {
      expect(captions, claim).not.toContain(claim)
    }
  })

  it('tells the two steps in order on the page', () => {
    const wrapper = landing('actual-budget', 'en')
    const steps = wrapper.get('[data-testid="landing-steps"]')
    expect(steps.findAll('img')).toHaveLength(2)
    expect(wrapper.find('[data-testid="landing-screenshot"]').exists()).toBe(false)
    const sources = [1, 2].map(
      n => wrapper.get(`[data-testid="landing-step-image-${n}"]`).attributes('src')
    )
    expect(sources).toEqual([
      '/images/screenshot/actual-budget-app.webp',
      '/images/screenshot/actual-budget-running.webp'
    ])
  })

  it('ships both screenshots as real files sized as the markup declares', () => {
    for (const shot of copy.shots) {
      const data = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'public', shot.src))
      expect(data.subarray(8, 12).toString('latin1'), shot.src).toBe('WEBP')
      expect(data.subarray(12, 16).toString('latin1'), shot.src).toBe('VP8 ')
      expect(data.readUInt16LE(26) & 0x3fff, `${shot.src} width`).toBe(shot.width)
      expect(data.readUInt16LE(28) & 0x3fff, `${shot.src} height`).toBe(shot.height)
    }
  })

  it('gives every screenshot its intrinsic size, distinct alt text and a caption', () => {
    const wrapper = landing('actual-budget', 'en')
    const sizes = [[720, 785], [720, 1297]]
    for (let n = 1; n <= 2; n++) {
      const image = wrapper.get(`[data-testid="landing-step-image-${n}"]`)
      expect(Number(image.attributes('width')), `width ${n}`).toBe(sizes[n - 1][0])
      expect(Number(image.attributes('height')), `height ${n}`).toBe(sizes[n - 1][1])
      expect(image.attributes('alt').length, `alt ${n}`).toBeGreaterThan(20)
      expect(wrapper.get(`[data-testid="landing-step-caption-${n}"]`).text().length)
        .toBeGreaterThan(20)
    }
    expect(new Set(copy.shots.map(shot => shot.alt)).size).toBe(2)
  })

  it('loads the first screenshot eagerly and defers the one below the fold', () => {
    const wrapper = landing('actual-budget', 'en')
    expect(wrapper.get('[data-testid="landing-step-image-1"]').attributes('loading')).toBe('eager')
    expect(wrapper.get('[data-testid="landing-step-image-2"]').attributes('loading')).toBe('lazy')
  })

  it('renders the non affiliation notice on the page', () => {
    const wrapper = landing('actual-budget', 'en')
    expect(wrapper.get('[data-testid="landing-trust"]').text())
      .toContain('not affiliated with, endorsed by or sponsored by')
  })

  it('keeps the bare landing shape, two calls to action and no other links', () => {
    const wrapper = landing('actual-budget', 'en')
    expect(wrapper.findAll('a')).toHaveLength(2)
    expect(wrapper.get('[data-testid="landing-cta"]').attributes('href')).toBe(ACCOUNT)
    expect(wrapper.get('[data-testid="landing-cta-bottom"]').attributes('href')).toBe(ACCOUNT)
  })

  it('leaves the variants that were already there alone', () => {
    expect(landingCopy('games', 'en').shots).toHaveLength(4)
    for (const variant of ['cloud', 'pi', 'access', 'password']) {
      expect(landingCopy(variant, 'en').shots, variant).toEqual([])
    }
    for (const variant of ['cloud', 'pi', 'access', 'password', 'games']) {
      const other = landingCopy(variant, 'en')
      expect(other.title, variant).not.toBe(copy.title)
      expect(other.points, variant).not.toEqual(copy.points)
      expect(other.trust, variant).not.toBe(copy.trust)
    }
    expect(landingCopy('cloud', 'en').trust)
      .toBe('Open source. Your data stays on your own hardware.')
    expect(landingCopy('games', 'en').trust).toContain('Mojang Studios')
  })
})

describe('variants with a single screenshot', () => {
  it('still render one screenshot and no step list', () => {
    for (const variant of ['cloud', 'pi', 'access', 'password']) {
      const wrapper = landing(variant, 'en')
      const shot = wrapper.get('[data-testid="landing-screenshot"]')
      expect(shot.attributes('src'), variant).toBe('/images/screenshot/app-store.webp')
      expect(shot.attributes('alt'), variant).toBe(landingCopy(variant, 'en').shotAlt)
      expect(shot.attributes('width'), variant).toBe('1200')
      expect(shot.attributes('height'), variant).toBe('750')
      expect(wrapper.findAll('img'), variant).toHaveLength(2)
      expect(wrapper.find('[data-testid="landing-steps"]').exists(), variant).toBe(false)
      expect(landingCopy(variant, 'en').shots, variant).toEqual([])
    }
  })

  it('keeps the shared trust line where a variant does not replace it', () => {
    for (const variant of ['cloud', 'pi', 'access', 'password']) {
      expect(landingCopy(variant, 'en').trust, variant)
        .toBe(landingCopy('cloud', 'en').trust)
    }
  })
})
