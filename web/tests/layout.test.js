import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import en from '../src/locales/en.json'
import de from '../src/locales/de.json'
import VueApp from '../src/VueApp.vue'
import { routes } from '../src/router/routes'

const i18n = createI18n({
  legacy: false, locale: 'en', fallbackLocale: 'en', messages: { en, de }
})

function app (meta, locale = 'en') {
  i18n.global.locale.value = locale
  return mount(VueApp, {
    global: {
      plugins: [i18n, createPinia()],
      mocks: { $route: { path: '/x', meta } },
      stubs: { RouterView: true, RouterLink: { template: '<a><slot /></a>' }, 'i18n-t': true }
    }
  })
}

function meta (name) {
  return routes.find(route => route.name === name).meta
}

describe('app layout', () => {
  it('shows site header and footer on normal pages', () => {
    const wrapper = app({})
    expect(wrapper.findComponent({ name: 'SiteHeader' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'SiteFooter' }).exists()).toBe(true)
  })

  it('hides site chrome on the unindexed landing pages, so they have no exits', () => {
    for (const name of ['LandingCloudEn', 'LandingPiDe', 'LandingAccessDe']) {
      const wrapper = app(meta(name))
      expect(wrapper.findComponent({ name: 'SiteHeader' }).exists(), name).toBe(false)
      expect(wrapper.findComponent({ name: 'SiteFooter' }).exists(), name).toBe(false)
      expect(wrapper.findComponent({ name: 'LanguageSwitcher' }).exists(), name).toBe(false)
    }
  })

  it('gives the indexed app pages the same chrome as every other site page', () => {
    for (const name of ['LandingPasswordEn', 'LandingGamesEn', 'LandingActualBudgetEn']) {
      const wrapper = app(meta(name))
      expect(wrapper.findComponent({ name: 'SiteHeader' }).exists(), name).toBe(true)
      expect(wrapper.findComponent({ name: 'SiteFooter' }).exists(), name).toBe(true)
    }
  })

  it('reads chrome off the same flag as the index, so the two cannot disagree', () => {
    for (const route of routes.filter(route => route.meta && route.meta.variant)) {
      const chrome = app(route.meta).findComponent({ name: 'SiteHeader' }).exists()
      expect(chrome, route.name).toBe(!route.meta.noindex)
    }
  })

  it('translates the shell, so a page shown in German has a German header and footer', () => {
    const wrapper = app({}, 'de')
    expect(wrapper.findComponent({ name: 'SiteHeader' }).text()).toContain(de.nav.setup)
    expect(wrapper.findComponent({ name: 'SiteFooter' }).text()).toContain(de.nav.privacy)
    expect(de.nav.privacy).not.toBe(en.nav.privacy)
  })
})
