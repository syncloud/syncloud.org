import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Index', component: () => import('../views/Index.vue') },
  { path: '/setup', name: 'Setup', component: () => import('../views/Setup.vue'), alias: ['/setup.html', '/download', '/download.html', '/hardware', '/hardware.html'] },
  { path: '/faq', name: 'Faq', component: () => import('../views/Faq.vue'), alias: '/faq.html' },
  { path: '/privacy', name: 'Privacy', component: () => import('../views/Privacy.vue'), alias: '/privacy.html' },
  {
    path: '/en/private-cloud',
    name: 'LandingCloudEn',
    component: () => import('../views/Landing.vue'),
    meta: { variant: 'cloud', language: 'en', noindex: true, bare: true }
  },
  {
    path: '/en/raspberry-pi',
    name: 'LandingPiEn',
    component: () => import('../views/Landing.vue'),
    meta: { variant: 'pi', language: 'en', noindex: true, bare: true }
  },
  {
    path: '/de/private-cloud',
    name: 'LandingCloudDe',
    component: () => import('../views/Landing.vue'),
    meta: { variant: 'cloud', language: 'de', noindex: true, bare: true }
  },
  {
    path: '/de/raspberry-pi',
    name: 'LandingPiDe',
    component: () => import('../views/Landing.vue'),
    meta: { variant: 'pi', language: 'de', noindex: true, bare: true }
  },
  { path: '/:catchAll(.*)', redirect: '/' }
]

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

export default router
