import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { captureGclid, storedGclid, withGclid } from '../src/attribution'

const KEY = 'syncloud.gclid'
const ACCOUNT = 'https://www.syncloud.it'

beforeEach(() => {
  window.localStorage.clear()
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
