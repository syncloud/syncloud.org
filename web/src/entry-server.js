import { createSSRApp } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import { renderToString } from 'vue/server-renderer'
import { createPinia } from 'pinia'
import VueApp from './VueApp.vue'
import { routes } from './router/routes.js'
import i18n, { applyLocale } from './i18n/index.js'
import { metadata } from './seo.js'

export async function render (path) {
  const app = createSSRApp(VueApp)
  const router = createRouter({ history: createMemoryHistory(), routes })
  app.use(createPinia()).use(router).use(i18n)
  await router.push(path)
  await router.isReady()
  await applyLocale(router.currentRoute.value.meta.language || 'en')
  const html = await renderToString(app)
  return { html, seo: metadata(router.currentRoute.value) }
}
