import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import en from '../src/locales/en.json'
import Articles from '../src/views/Articles.vue'
import Article from '../src/views/Article.vue'
import { articles } from '../src/data/articles'
import { metadata, indexablePaths, ORIGIN } from '../src/seo'
import { routes } from '../src/router/routes'

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } })
const RouterLinkStub = { props: ['to'], template: '<a :href="to"><slot /></a>' }

function open (slug) {
  return mount(Article, {
    global: {
      plugins: [i18n],
      stubs: { RouterLink: RouterLinkStub },
      mocks: { $route: { meta: { article: slug } } }
    }
  })
}

describe('articles', () => {
  beforeEach(() => {
    window.localStorage.clear()
    global.navigator.sendBeacon = vi.fn()
  })

  it('lists every article with a link to it', () => {
    const wrapper = mount(Articles, {
      global: { plugins: [i18n], stubs: { RouterLink: RouterLinkStub } }
    })
    for (const entry of articles) {
      const card = wrapper.get(`[data-testid="article-${entry.slug}"]`)
      expect(card.attributes('href')).toBe(`/articles/${entry.slug}`)
      expect(card.text()).toContain(entry.title)
    }
  })

  it('gives every article a route, a body and a place in the sitemap', () => {
    for (const entry of articles) {
      const route = routes.find(candidate => candidate.path === `/articles/${entry.slug}`)
      expect(route, entry.slug).toBeTruthy()
      expect(indexablePaths()).toContain(route.path)
      expect(metadata(route).canonical).toBe(`${ORIGIN}${route.path}`)
      expect(metadata(route).title).toContain(entry.title)

      const wrapper = open(entry.slug)
      expect(wrapper.get('[data-testid="article-title"]').text()).toBe(entry.title)
      expect(wrapper.get('[data-testid="article-body"]').text().length).toBeGreaterThan(500)
    }
  })

  it('sends a reader of the ODROID article to setup, the hardware page and the shop', async () => {
    const wrapper = open('syncloud-on-odroid')
    expect(wrapper.get('[data-testid="article-link-setup"]').attributes('href')).toBe('/setup')
    expect(wrapper.get('[data-testid="article-link-hardware"]').attributes('href')).toBe('/hardware')
    const shop = wrapper.get('[data-testid="article-link-h5"]')
    expect(shop.attributes('href')).toContain('ameridroid.com/products/odroid-h5')
    shop.element.addEventListener('click', event => event.preventDefault())
    await shop.trigger('click')
    expect(global.navigator.sendBeacon).toHaveBeenCalledTimes(1)
  })
})
