import { readFileSync } from 'node:fs'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  NO_LANDING,
  captureGclid,
  captureLanding,
  storedGclid,
  storedLanding,
  withGclid
} from '../src/attribution'
import { landingVariants, routes } from '../src/router/routes'
import router from '../src/router'

const KEY = 'syncloud.gclid'
const LANDING_KEY = 'syncloud.landing'
const ACCOUNT = 'https://www.syncloud.it'

function read (relative) {
  return readFileSync(new URL(relative, import.meta.url), 'utf8')
}

beforeEach(() => {
  window.localStorage.clear()
  window.scrollTo = vi.fn()
  global.navigator.sendBeacon = vi.fn()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('captureGclid', () => {
  it('stores a gclid from the query string', () => {
    captureGclid('?gclid=abc123')
    expect(storedGclid()).toBe('abc123')
  })

  it('ignores a query string without a gclid', () => {
    captureGclid('?utm_source=newsletter')
    expect(storedGclid()).toBeNull()
  })

  it('keeps the most recent gclid', () => {
    captureGclid('?gclid=first')
    captureGclid('?gclid=second')
    expect(storedGclid()).toBe('second')
  })

  it('does not clear an existing gclid on an untagged visit', () => {
    captureGclid('?gclid=abc123')
    captureGclid('')
    expect(storedGclid()).toBe('abc123')
  })
})

describe('storedGclid', () => {
  it('returns null when nothing is stored', () => {
    expect(storedGclid()).toBeNull()
  })

  it('returns null for corrupt storage', () => {
    window.localStorage.setItem(KEY, 'not json')
    expect(storedGclid()).toBeNull()
  })

  it('expires after 90 days', () => {
    captureGclid('?gclid=abc123')
    vi.useFakeTimers()
    vi.setSystemTime(Date.now() + 91 * 24 * 60 * 60 * 1000)
    expect(storedGclid()).toBeNull()
  })

  it('survives to 89 days', () => {
    captureGclid('?gclid=abc123')
    vi.useFakeTimers()
    vi.setSystemTime(Date.now() + 89 * 24 * 60 * 60 * 1000)
    expect(storedGclid()).toBe('abc123')
  })
})

describe('withGclid', () => {
  it('returns the url unchanged when no gclid is stored', () => {
    expect(withGclid(ACCOUNT)).toBe(ACCOUNT)
  })

  it('appends the gclid', () => {
    captureGclid('?gclid=abc123')
    expect(withGclid(ACCOUNT)).toBe(ACCOUNT + '/?gclid=abc123')
  })

  it('preserves an existing query string', () => {
    captureGclid('?gclid=abc123')
    expect(withGclid(ACCOUNT + '/register?lang=de'))
      .toBe(ACCOUNT + '/register?lang=de&gclid=abc123')
  })

  it('does not duplicate the parameter', () => {
    captureGclid('?gclid=abc123')
    expect(withGclid(ACCOUNT + '/?gclid=old')).toBe(ACCOUNT + '/?gclid=abc123')
  })

  it('returns the input unchanged when it is not a url', () => {
    captureGclid('?gclid=abc123')
    expect(withGclid('/relative/path')).toBe('/relative/path')
  })
})

describe('captureLanding', () => {
  it('stores the variant of the landing page the visitor arrived on', () => {
    captureLanding('password')
    expect(storedLanding()).toBe('password')
  })

  it('accepts every variant the router serves', () => {
    for (const variant of landingVariants()) {
      window.localStorage.clear()
      captureLanding(variant)
      expect(storedLanding(), variant).toBe(variant)
    }
  })

  it('reports none rather than an empty string when no landing page was seen', () => {
    expect(storedLanding()).toBe('none')
    expect(NO_LANDING).toBe('none')
  })

  it('ignores a route that is not a landing page, leaving what was stored', () => {
    captureLanding('pi')
    captureLanding(undefined)
    captureLanding('')
    expect(storedLanding()).toBe('pi')
  })

  it('refuses a variant the router does not serve', () => {
    captureLanding('invented')
    expect(storedLanding()).toBe('none')
  })

  it('keeps the most recent landing page', () => {
    captureLanding('cloud')
    captureLanding('access')
    expect(storedLanding()).toBe('access')
  })

  it('expires on the same terms as a click id', () => {
    captureLanding('cloud')
    vi.useFakeTimers()
    vi.setSystemTime(Date.now() + 89 * 24 * 60 * 60 * 1000)
    expect(storedLanding()).toBe('cloud')
    vi.setSystemTime(Date.now() + 2 * 24 * 60 * 60 * 1000)
    expect(storedLanding()).toBe('none')
  })

  it('reports none for corrupt storage', () => {
    window.localStorage.setItem(LANDING_KEY, 'not json')
    expect(storedLanding()).toBe('none')
  })

  it('keeps the click id and the landing page in separate entries', () => {
    captureGclid('?gclid=abc123')
    captureLanding('cloud')
    expect(storedGclid()).toBe('abc123')
    expect(storedLanding()).toBe('cloud')
  })
})

describe('arriving on a landing page', () => {
  it('remembers the variant after the visitor navigates away', async () => {
    await router.push('/en/password-manager')
    await router.isReady()
    expect(storedLanding()).toBe('password')

    await router.push('/setup')
    expect(storedLanding()).toBe('password')
  })

  it('records none for a visitor who never saw a landing page', async () => {
    await router.push('/')
    await router.isReady()
    await router.push('/setup')
    expect(storedLanding()).toBe('none')
  })

  it('does not forget the landing page on a later direct visit', async () => {
    await router.push('/de/remote-access')
    await router.isReady()
    await router.push('/')
    await router.push('/faq')
    expect(storedLanding()).toBe('access')
  })
})

describe('the landing allow list', () => {
  it('is exactly what the router marks as a landing route', () => {
    const marked = routes
      .filter(route => route.meta && route.meta.variant)
      .map(route => route.meta.variant)
    expect([...landingVariants()].sort()).toEqual([...new Set(marked)].sort())
    expect(landingVariants().length).toBeGreaterThan(0)
  })

  it('matches the list the backend will accept as a metric label', () => {
    const go = read('../../backend/config/config.go')
    const block = go.match(/Landings: \[\]string\{([^}]*)\}/)
    expect(block, 'backend/config/config.go must configure Landings').not.toBeNull()
    const configured = [...block[1].matchAll(/"([^"]+)"/g)].map(match => match[1])
    expect(configured.sort()).toEqual([...landingVariants()].sort())
  })

  it('never lets a route variant collide with the fallback labels', () => {
    for (const variant of landingVariants()) {
      expect(variant, variant).not.toBe('none')
      expect(variant, variant).not.toBe('other')
    }
  })
})
