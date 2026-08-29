import { describe, it, expect } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import en from '../src/locales/en.json'
import Index from '../src/views/Index.vue'
import Faq from '../src/views/Faq.vue'

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } })

const RouterLinkStub = { template: '<a><slot /></a>' }

describe('views render', () => {
  it('Index shows the hero title and carousel', () => {
    const wrapper = mount(Index, {
      global: {
        plugins: [i18n, createPinia()],
        stubs: { RouterLink: RouterLinkStub, 'i18n-t': true }
      }
    })
    expect(wrapper.text()).toContain(en.index.hero_title)
    expect(wrapper.find('[data-testid="carousel"]').exists()).toBe(true)
  })

  it('Faq toggles an answer on click', async () => {
    const wrapper = shallowMount(Faq, {
      global: { plugins: [i18n], stubs: { 'i18n-t': true } }
    })
    expect(wrapper.text()).toContain(en.faq.q1)
    await wrapper.find('[data-testid="faq-q2"]').trigger('click')
    expect(wrapper.text()).toContain(en.faq.a2)
  })
})
