export const routes = [
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
  {
    path: '/en/remote-access',
    name: 'LandingAccessEn',
    component: () => import('../views/Landing.vue'),
    meta: { variant: 'access', language: 'en', noindex: true, bare: true }
  },
  {
    path: '/de/remote-access',
    name: 'LandingAccessDe',
    component: () => import('../views/Landing.vue'),
    meta: { variant: 'access', language: 'de', noindex: true, bare: true }
  },
  { path: '/:catchAll(.*)', name: 'NotFound', component: () => import('../views/NotFound.vue') }
]

export function servedPaths () {
  return routes
    .filter(route => !route.path.includes(':'))
    .flatMap(route => [route.path].concat(route.alias || []))
}
