import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import en from '../src/locales/en.json'
import Leaflet from '../src/views/Leaflet.vue'
import { SUPPORTED_LOCALES } from '../src/i18n'
import { playUrl, setupUrl } from '../src/data/leaflet'

async function messages (code) {
  const mod = await import(`../src/locales/${code}.json`)
  return mod.default
}

async function render (code = 'en') {
  const i18n = createI18n({
    legacy: false,
    locale: code,
    fallbackLocale: 'en',
    missingWarn: false,
    fallbackWarn: false,
    messages: { en, [code]: await messages(code) }
  })
  return mount(Leaflet, { global: { plugins: [i18n] } })
}

describe('leaflet page', () => {
  it('offers a PDF in every site language, named in that language', async () => {
    const wrapper = await render()
    for (const { code, name } of SUPPORTED_LOCALES) {
      const link = wrapper.get(`[data-testid="leaflet-pdf-${code}"]`)
      expect(link.attributes('href'), code).toBe(`/leaflet/syncloud-quick-start-${code}.pdf`)
      expect(link.attributes('hreflang'), code).toBe(code)
      expect(link.text(), code).toBe(name)
    }
    expect(wrapper.findAll('[data-testid="leaflet-pdfs"] a')).toHaveLength(SUPPORTED_LOCALES.length)
  })

  it('shows the leaflet itself with example addresses built from the example name', async () => {
    const text = (await render('fr')).get('[data-testid="leaflet-sheets"]').text()
    expect(text).toContain('nom.syncloud.it')
    expect(text).toContain('nextcloud.nom.syncloud.it')
    expect(text).toContain('https://192.168.1.20')
    expect(text).toContain('syncloud.org/setup')
  })

  it('draws each QR code from the address it leads to', async () => {
    const wrapper = await render()
    for (const [id, url] of [['leaflet-qr-setup', setupUrl], ['leaflet-qr-play', playUrl]]) {
      const qr = wrapper.get(`[data-testid="${id}"]`)
      expect(qr.attributes('aria-label'), id).toBe(url)
      expect(qr.attributes('viewBox'), id).toMatch(/^0 0 \d+ \d+$/)
      expect(qr.get('path').attributes('d'), id).toMatch(/^(M\d+ \d+h1v1h-1z)+$/)
    }
  })

  it('uses the site logo rather than a copy of it', async () => {
    expect((await render()).get('.ql-brand img').attributes('src')).toBe('/syncloud-logo.svg')
  })

  for (const { code } of SUPPORTED_LOCALES) {
    it(`${code} fills every line of the leaflet from its own messages`, async () => {
      const own = await messages(code)
      const text = (await render(code)).get('[data-testid="leaflet-sheets"]').text()
      expect(text, code).not.toMatch(/leaflet\.sheet\./)
      for (const [key, value] of Object.entries(own.leaflet.sheet)) {
        expect(text, `${code} ${key}`).toContain(value.split('{addr}')[0].trim())
      }
    })
  }
})
