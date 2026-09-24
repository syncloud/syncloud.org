import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import en from '../src/locales/en.json'
import Index from '../src/views/Index.vue'
import { appLandings, indexablePaths, landingPaths } from '../src/seo'

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } })
const RouterLinkStub = {
  props: ['to'],
  template: '<a :href="to" data-router-link><slot /></a>'
}

function render () {
  return mount(Index, {
    global: { plugins: [i18n, createPinia()], stubs: { RouterLink: RouterLinkStub } }
  })
}

describe('the front page', () => {
  it('offers one way in, and it is the setup wizard', async () => {
    const wrapper = render()
    const routed = wrapper.get('.sc-hero').findAll('[data-router-link]')
    expect(routed).toHaveLength(1)
    expect(routed[0].attributes('href')).toBe('/setup')
    expect(routed[0].text()).toBe(en.index.get_started)
  })

  it('links the three app pages, and nothing else, from its app section', async () => {
    const wrapper = render()
    const links = wrapper.get('[data-testid="index-apps"]').findAll('[data-router-link]')
    expect(links).toHaveLength(3)
    expect(links.map(link => link.attributes('href')))
      .toEqual(['/en/password-manager', '/en/games', '/en/actual-budget'])
    for (const variant of ['password', 'games', 'actual-budget']) {
      const link = wrapper.get(`[data-testid="index-app-${variant}"]`)
      expect(link.attributes('href'), variant).toBe(`/en/${variant === 'password' ? 'password-manager' : variant}`)
      expect(link.text().length, variant).toBeGreaterThan(30)
    }
  })

  it('links exactly the landing pages that are indexed, so none is left an orphan', async () => {
    const wrapper = render()
    const linked = wrapper.get('[data-testid="index-apps"]')
      .findAll('[data-router-link]')
      .map(link => link.attributes('href'))
    expect(linked).toEqual(landingPaths().filter(path => indexablePaths().includes(path)))
    expect(appLandings().map(app => app.path)).toEqual(linked)
  })

  it('keeps the unindexed ad pages unlinked', async () => {
    const html = render().html()
    for (const path of ['/en/private-cloud', '/de/private-cloud', '/en/raspberry-pi',
      '/de/raspberry-pi', '/en/remote-access', '/de/remote-access']) {
      expect(html, path).not.toContain(`"${path}"`)
    }
  })

  it('labels each app link with what that page is about', async () => {
    const wrapper = render()
    expect(wrapper.get('[data-testid="index-app-password"]').text()).toContain('Password manager')
    expect(wrapper.get('[data-testid="index-app-games"]').text()).toContain('Game server')
    expect(wrapper.get('[data-testid="index-app-actual-budget"]').text())
      .toContain('Personal budgeting')
    expect(wrapper.get('[data-testid="index-app-actual-budget"]').text())
      .toContain('Actual Budget')
  })

  it('sends nobody off site to get started', async () => {
    const html = render().html()
    for (const off of ['github.com', 'shop.syncloud.org', 'store.syncloud.org']) {
      expect(html, off).not.toContain(off)
    }
  })

  it('points learn more at the section further down rather than another page', async () => {
    const wrapper = render()
    expect(wrapper.find('[data-testid="index-learn-more"]').attributes('href')).toBe('#how')
    expect(wrapper.find('#how').exists()).toBe(true)
  })

  it('still shows the screenshots', async () => {
    expect(render().find('[data-testid="carousel"]').exists()).toBe(true)
  })
})
