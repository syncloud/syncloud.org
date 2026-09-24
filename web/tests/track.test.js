import { describe, it, expect, beforeEach, vi } from 'vitest'
import { track } from '../src/track'
import { captureLanding } from '../src/attribution'
import { applyLocale } from '../src/i18n'

function sent () {
  const blob = global.navigator.sendBeacon.mock.calls[0][1]
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsText(blob)
  })
}

describe('tracking a step', () => {
  beforeEach(async () => {
    window.localStorage.clear()
    global.navigator.sendBeacon = vi.fn()
    await applyLocale('en')
  })

  it('sends the event name to our own backend, not a third party', () => {
    track('view.setup')
    const [url, blob] = global.navigator.sendBeacon.mock.calls[0]
    expect(url).toBe('/api/event')
    expect(blob.type).toBe('application/json')
  })

  it('says whether the visitor came from an ad without sending the click id', async () => {
    window.localStorage.setItem('syncloud.gclid',
      JSON.stringify({ gclid: 'SECRETCLICK', at: Date.now() }))
    track('setup.build')
    const body = await sent()

    expect(JSON.parse(body)).toEqual({ event: 'setup.build', gclid: true, landing: 'none', language: 'en' })
    expect(body).not.toContain('SECRETCLICK')
  })

  it('reports a direct visit when no click id is stored', async () => {
    track('view.index')
    const body = await sent()
    expect(JSON.parse(body).gclid).toBe(false)
  })

  it('says which landing page the visitor arrived on', async () => {
    captureLanding('password')
    track('setup.build')
    expect(JSON.parse(await sent())).toEqual({
      event: 'setup.build',
      gclid: false,
      landing: 'password',
      language: 'en'
    })
  })

  it('says which language the page was shown in', async () => {
    await applyLocale('de')
    track('view.landing')
    expect(JSON.parse(await sent()).language).toBe('de')
  })

  it('reads the language at the moment of the event, not a stored preference', async () => {
    window.localStorage.setItem('syncloud.locale', 'fr')
    await applyLocale('de')
    track('view.index')
    expect(JSON.parse(await sent()).language).toBe('de')
  })

  it('says none for a visitor who arrived on an ordinary page', async () => {
    track('view.index')
    expect(JSON.parse(await sent()).landing).toBe('none')
  })

  it('falls back to fetch when the browser has no beacon', () => {
    global.navigator.sendBeacon = undefined
    global.fetch = vi.fn().mockResolvedValue({ ok: true })
    track('view.faq')
    expect(global.fetch).toHaveBeenCalledWith('/api/event', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ event: 'view.faq', gclid: false, landing: 'none', language: 'en' })
    }))
  })
})
