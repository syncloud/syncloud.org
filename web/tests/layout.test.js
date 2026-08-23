import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import en from '../src/locales/en.json'
import VueApp from '../src/VueApp.vue'

const i18n = createI18n({ legacy: false, locale: 'en', fallbackLocale: 'en', messages: { en } })

function app (meta) {
  return mount(VueApp, {
    global: {
      plugins: [i18n, createPinia()],
      mocks: { $route: { path: '/x', meta } },
      stubs: { RouterView: true, RouterLink: { template: '<a><slot /></a>' }, 'i18n-t': true }
    }
  })
}

describe('app layout', () => {
  it('shows site header and footer on normal pages', () => {
    const wrapper = app({})
    expect(wrapper.findComponent({ name: 'SiteHeader' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'SiteFooter' }).exists()).toBe(true)
  })

  it('hides site chrome on bare routes so a landing page has no exits', () => {
    const wrapper = app({ bare: true })
    expect(wrapper.findComponent({ name: 'SiteHeader' }).exists()).toBe(false)
    expect(wrapper.findComponent({ name: 'SiteFooter' }).exists()).toBe(false)
  })

  it('hides the language switcher on bare routes', () => {
    const wrapper = app({ bare: true })
    expect(wrapper.findComponent({ name: 'LanguageSwitcher' }).exists()).toBe(false)
  })
})
