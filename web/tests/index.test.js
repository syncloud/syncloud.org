import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import en from '../src/locales/en.json'
import Index from '../src/views/Index.vue'

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
    const routed = wrapper.findAll('[data-router-link]')
    expect(routed).toHaveLength(1)
    expect(routed[0].attributes('href')).toBe('/setup')
    expect(routed[0].text()).toBe(en.index.get_started)
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
