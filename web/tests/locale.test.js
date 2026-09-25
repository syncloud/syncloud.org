import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import router from '../src/router'
import i18n, { STORAGE_KEY, setLocale } from '../src/i18n'
import de from '../src/locales/de.json'
import en from '../src/locales/en.json'
import LanguageSwitcher from '../src/components/LanguageSwitcher.vue'

function locale () {
  return i18n.global.locale.value
}

function stored () {
  return window.localStorage.getItem(STORAGE_KEY)
}

async function visit (path) {
  await router.push(path)
  await router.isReady()
}

beforeEach(async () => {
  window.localStorage.clear()
  window.scrollTo = vi.fn()
  global.navigator.sendBeacon = vi.fn()
  await setLocale('en')
  window.localStorage.clear()
})

describe('the language a page is shown in', () => {
  it('comes from the path when the route fixes one', async () => {
    await visit('/de/remote-access')
    expect(locale()).toBe('de')
    expect(i18n.global.t('nav.setup')).toBe(de.nav.setup)
    expect(i18n.global.t('nav.privacy')).toBe(de.nav.privacy)
  })

  it('translates the whole page, not only the body copy', async () => {
    await visit('/de/private-cloud')
    for (const key of ['setup', 'privacy', 'theme']) {
      expect(i18n.global.t(`nav.${key}`), key).toBe(de.nav[key])
      expect(de.nav[key], key).not.toBe(en.nav[key])
    }
    expect(i18n.global.t('index.get_started')).toBe(de.index.get_started)
  })

  it('beats a stored preference, so a German path is German either way', async () => {
    await setLocale('en')
    expect(stored()).toBe('en')
    await visit('/de/remote-access')
    expect(locale()).toBe('de')
  })

  it('does not become the preference for the rest of the site', async () => {
    await setLocale('en')
    await visit('/de/remote-access')
    expect(stored()).toBe('en')

    await visit('/faq')
    expect(locale()).toBe('en')
  })

  it('leaves nothing stored when the visitor never chose a language', async () => {
    await visit('/de/raspberry-pi')
    expect(locale()).toBe('de')
    expect(stored()).toBeNull()
  })

  it('is detected as before on a route that fixes no language', async () => {
    await setLocale('fr')
    await visit('/setup')
    expect(locale()).toBe('fr')
    await visit('/')
    expect(locale()).toBe('fr')
    await visit('/privacy')
    expect(locale()).toBe('fr')
  })

  it('returns to the chosen language after a detour through a fixed one', async () => {
    await setLocale('fr')
    await visit('/de/remote-access')
    expect(locale()).toBe('de')
    await visit('/faq')
    expect(locale()).toBe('fr')
    expect(stored()).toBe('fr')
  })

  it('is English on the English paths whatever the visitor prefers', async () => {
    await setLocale('de')
    await visit('/en/actual-budget')
    expect(locale()).toBe('en')
    expect(i18n.global.t('nav.setup')).toBe(en.nav.setup)
    expect(stored()).toBe('de')
  })
})

describe('the language switcher', () => {
  it('still stores what the visitor picks', async () => {
    await visit('/faq')
    const wrapper = mount(LanguageSwitcher, {
      global: { plugins: [i18n, createPinia()] }
    })
    await wrapper.get('[data-testid="language-button"]').trigger('click')
    await wrapper.get('[data-testid="language-de"]').trigger('click')
    expect(locale()).toBe('de')
    expect(stored()).toBe('de')
  })
})
