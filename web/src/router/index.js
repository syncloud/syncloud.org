import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Index', component: () => import('../views/Index.vue') },
  { path: '/setup', name: 'Setup', component: () => import('../views/Setup.vue'), alias: '/setup.html' },
  { path: '/hardware', name: 'Hardware', component: () => import('../views/Hardware.vue'), alias: '/hardware.html' },
  { path: '/faq', name: 'Faq', component: () => import('../views/Faq.vue'), alias: '/faq.html' },
  { path: '/privacy', name: 'Privacy', component: () => import('../views/Privacy.vue'), alias: '/privacy.html' },
  {
    path: '/de/private-cloud',
    name: 'LandingCloudDe',
    component: () => import('../views/Landing.vue'),
    meta: { variant: 'cloud', noindex: true, bare: true }
  },
  {
    path: '/de/raspberry-pi',
    name: 'LandingPiDe',
    component: () => import('../views/Landing.vue'),
    meta: { variant: 'pi', noindex: true, bare: true }
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
