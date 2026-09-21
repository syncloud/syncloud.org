import { createRouter, createWebHistory } from 'vue-router'
import { track } from '../track'
import { applyMetadata, metadata } from '../seo.js'
import { captureLanding } from '../attribution'
import { routes } from './routes.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior (to) {
    if (to.hash) {
      return { el: to.hash, top: 80, behavior: 'smooth' }
    }
    return { top: 0 }
  }
})

const VIEWS = {
  Index: 'view.index',
  Setup: 'view.setup',
  Faq: 'view.faq',
  Privacy: 'view.privacy'
}

router.afterEach(to => {
  if (typeof document !== 'undefined') {
    applyMetadata(document, metadata(to))
  }
  captureLanding(to.meta.variant)
  const event = to.meta.variant ? 'view.landing' : VIEWS[to.name]
  if (event) {
    track(event)
  }
})

export default router
