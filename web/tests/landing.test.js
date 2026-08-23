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
      mocks: { $route: { path: `/${language}/x`, meta: { variant, language, noindex: true, bare: true } } }
    }
  })
}

beforeEach(() => {
  window.localStorage.clear()
  document.head.querySelectorAll('meta[name="robots"]').forEach(m => m.remove())
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

  it('marks the page noindex while it is mounted', async () => {
    const wrapper = landing('cloud')
    await new Promise(resolve => setTimeout(resolve, 0))
    const tag = document.head.querySelector('meta[name="robots"]')
    expect(tag).not.toBeNull()
    expect(tag.getAttribute('content')).toBe('noindex')
    wrapper.unmount()
    expect(document.head.querySelector('meta[name="robots"]')).toBeNull()
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
