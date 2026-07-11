import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueApp from './VueApp.vue'
import router from './router'
import './style/design.css'
import i18n, { detectLocale, setLocale } from './i18n'
import { useThemeStore } from './stores/theme'

async function start () {
  await setLocale(detectLocale())

  const pinia = createPinia()

  createApp(VueApp)
    .use(pinia)
    .use(router)
    .use(i18n)
    .mount('#app')

  useThemeStore(pinia).init()
}

start()
