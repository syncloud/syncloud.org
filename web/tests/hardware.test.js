import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { site } from '../src/data/site'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import en from '../src/locales/en.json'
import Hardware from '../src/views/Hardware.vue'
import { resellers } from '../src/data/resellers'

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } })
const RouterLinkStub = { template: '<a><slot /></a>' }

const replace = vi.fn()

function render (query = {}) {
  return mount(Hardware, {
    global: {
      plugins: [i18n],
      stubs: { RouterLink: RouterLinkStub },
      mocks: { $route: { query }, $router: { replace } }
    }
  })
}

const worldwide = resellers.filter(seller => seller.worldwide).map(seller => seller.id)

function listed (wrapper) {
  return resellers.map(seller => seller.id)
    .filter(id => wrapper.find(`[data-testid="reseller-${id}"]`).exists())
}

function sentEvent () {
  const blob = global.navigator.sendBeacon.mock.calls[0][1]
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = () => resolve(JSON.parse(reader.result).event)
    reader.readAsText(blob)
  })
}

describe('hardware page', () => {
  beforeEach(() => {
    window.localStorage.clear()
    site.account = 'https://www.syncloud.it'
    global.navigator.sendBeacon = vi.fn()
  })

  it('offers our own device first, carrying any click id', () => {
    window.localStorage.setItem('syncloud.gclid', JSON.stringify({ gclid: 'BUYCLICK', at: Date.now() }))
    const href = render().find('[data-testid="hardware-store-link"]').attributes('href')
    expect(href).toContain('syncloud.it/shop')
    expect(href).toContain('gclid=BUYCLICK')
  })

  it('lists every seller with a link to its shop', () => {
    const wrapper = render()
    expect(resellers.length).toBeGreaterThan(3)
    for (const seller of resellers) {
      const link = wrapper.find(`[data-testid="reseller-${seller.id}"]`)
      expect(link.attributes('href'), seller.id).toBe(seller.url)
      expect(link.text(), seller.id).toContain(seller.board)
    }
  })

  it('names the regions a seller ships to in the page language', () => {
    const wrapper = render()
    expect(wrapper.find('[data-testid="reseller-protectli"]').text())
      .toContain('United States, Canada, European Union')
    expect(wrapper.find('[data-testid="reseller-electrokit"]').text()).toContain('Sweden')
  })

  it('counts a click per seller', async () => {
    const link = render().find('[data-testid="reseller-sossolutions"]')
    link.element.addEventListener('click', event => event.preventDefault())
    await link.trigger('click')
    expect(await sentEvent()).toBe('outbound.sossolutions')
  })

  it('sends a seller id the backend knows for every seller', () => {
    const config = readFileSync(resolve(process.cwd(), '../backend/config/config.go'), 'utf8')
    for (const seller of resellers) {
      expect(config, seller.id).toContain(`"outbound.${seller.id}"`)
    }
  })

  it('narrows the list by shop or product name as it is typed', async () => {
    const wrapper = render()
    expect(wrapper.get('[data-testid="hardware-count"]').text()).toBe(`Shops: ${resellers.length}`)
    await wrapper.get('[data-testid="hardware-search"]').setValue('odroid')
    const ids = listed(wrapper)
    expect(ids).toContain('ameridroid')
    expect(ids).not.toContain('electrokit')
    expect(replace).toHaveBeenLastCalledWith({ query: { q: 'odroid' } })

    await wrapper.get('[data-testid="hardware-search"]').setValue('  SLIM ')
    expect(listed(wrapper)).toEqual(['slimbook'])
    expect(wrapper.get('[data-testid="hardware-count"]').text()).toBe('Shops: 1')
  })

  it('narrows the list by country, counting EU-wide shops for members and worldwide shops everywhere', async () => {
    const wrapper = render()
    await wrapper.get('[data-testid="hardware-country"]').setValue('SE')
    expect(listed(wrapper).filter(id => !worldwide.includes(id))).toEqual(['protectli', 'electrokit', 'teklager'])
    expect(replace).toHaveBeenLastCalledWith({ query: { country: 'SE' } })

    for (const id of worldwide) {
      expect(listed(wrapper), id).toContain(id)
    }
    expect(wrapper.get('[data-testid="reseller-beelink"]').text()).toContain('China · ships worldwide')

    await wrapper.get('[data-testid="hardware-country"]').setValue('GB')
    expect(listed(wrapper)).not.toContain('protectli')
    expect(listed(wrapper)).toContain('thepihut')
  })

  it('narrows the list to one architecture, and back when the same toggle is pressed again', async () => {
    const wrapper = render()
    const x64 = wrapper.get('[data-testid="hardware-arch-x64"]')
    await x64.trigger('click')
    expect(listed(wrapper)).toEqual(resellers.filter(seller => seller.arch === 'x64').map(seller => seller.id))
    expect(x64.attributes('aria-pressed')).toBe('true')
    expect(replace).toHaveBeenLastCalledWith({ query: { arch: 'x64' } })

    await wrapper.get('[data-testid="hardware-arch-ARM"]').trigger('click')
    expect(listed(wrapper)).toContain('ameridroid')
    expect(listed(wrapper)).not.toContain('protectli')

    await wrapper.get('[data-testid="hardware-arch-ARM"]').trigger('click')
    expect(listed(wrapper).length).toBe(resellers.length)
    expect(replace).toHaveBeenLastCalledWith({ query: {} })
  })

  it('keeps the architecture toggles when nothing matches', async () => {
    const wrapper = render({ arch: 'x64', q: 'ameridroid' })
    expect(listed(wrapper)).toEqual([])
    expect(wrapper.find('[data-testid="hardware-arch-x64"]').exists()).toBe(true)
  })

  it('offers each country once, by name, and never the EU as a country', () => {
    const options = render().get('[data-testid="hardware-country"]').findAll('option')
    const values = options.map(option => option.attributes('value'))
    expect(values[0]).toBe('')
    expect(values).not.toContain('EU')
    expect(new Set(values).size).toBe(values.length)
    expect(options.map(option => option.text())).toContain('United States')
  })

  it('says so when nothing matches, and keeps our own device on the page', async () => {
    const wrapper = render()
    await wrapper.get('[data-testid="hardware-search"]').setValue('no such shop')
    expect(listed(wrapper)).toEqual([])
    expect(wrapper.find('[data-testid="hardware-empty"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="hardware-count"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="hardware-store-link"]').exists()).toBe(true)
  })

  it('opens with the filters named in the address and ignores a country nobody sells in', () => {
    expect(listed(render({ country: 'DE', q: 'shelly' }))).toEqual(['shellyparts'])
    expect(listed(render({ country: 'XX' })).length).toBe(resellers.length)
    expect(listed(render({ arch: 'x64', q: 'slim' }))).toEqual(['slimbook'])
    expect(listed(render({ arch: 'MIPS' })).length).toBe(resellers.length)
  })

  it('invites other sellers to get listed', () => {
    expect(render().find('[data-testid="hardware-listed"]').text()).toContain('support@syncloud.it')
  })
})
