<template>
  <SiteHeader />
  <main class="site-main">
    <router-view />
  </main>
  <SiteFooter />
</template>

<script>
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'

export default {
  name: 'VueApp',
  components: {
    SiteHeader,
    SiteFooter
  }
}
</script>
