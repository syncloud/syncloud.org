import { createRouter, createWebHistory } from 'vue-router'
import { track } from '../track'
import { applyMetadata, metadata } from '../seo.js'
import { captureLanding } from '../attribution'
import { applyLocale, detectLocale } from '../i18n'
import { routes } from './routes.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior (to, from, saved) {
    if (saved) {
      return saved
    }
    if (to.hash) {
      return { el: to.hash, top: 80, behavior: 'smooth' }
    }
    if (to.path === from.path) {
      return false
    }
    return { top: 0 }
  }
})

const VIEWS = {
  Index: 'view.index',
  Setup: 'view.setup',
  Hardware: 'view.hardware',
  Articles: 'view.articles',
  Faq: 'view.faq',
  Privacy: 'view.privacy'
}

router.beforeEach(async to => {
  await applyLocale(to.meta.language || detectLocale())
})

router.afterEach((to, from) => {
  if (typeof document !== 'undefined') {
    applyMetadata(document, metadata(to))
  }
  if (to.path === from.path) {
    return
  }
  captureLanding(to.meta.variant)
  const event = to.meta.variant ? 'view.landing' : to.meta.article ? 'view.article' : VIEWS[to.name]
  if (event) {
    track(event)
  }
})

export default router
