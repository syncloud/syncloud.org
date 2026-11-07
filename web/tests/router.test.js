import { describe, it, expect, beforeEach, vi } from 'vitest'
import { track } from '../src/track'
import router from '../src/router'

vi.mock('../src/track', () => ({ track: vi.fn() }))

beforeEach(() => {
  window.localStorage.clear()
  window.scrollTo = vi.fn()
  track.mockClear()
})

describe('what the router counts', () => {
  it('counts the first page a visitor lands on, even when it is the front page', async () => {
    await router.push('/')
    await router.isReady()

    expect(track).toHaveBeenCalledWith('view.index')
  })

  it('counts each further page the visitor opens', async () => {
    await router.push('/setup')
    await router.isReady()
    track.mockClear()

    await router.push('/hardware')

    expect(track).toHaveBeenCalledWith('view.hardware')
  })

  it('does not count the page again when only the query changes', async () => {
    await router.push('/setup')
    await router.isReady()
    track.mockClear()

    await router.push('/setup?board=raspberrypi5')

    expect(track).not.toHaveBeenCalled()
  })
})
