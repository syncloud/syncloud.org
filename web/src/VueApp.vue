<template>
  <SiteHeader v-if="!bare" />
  <main class="site-main">
    <router-view />
  </main>
  <SiteFooter v-if="!bare" />
</template>

<script>
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'

export default {
  name: 'VueApp',
  components: {
    SiteHeader,
    SiteFooter
  },
  computed: {
    bare () {
      return Boolean(this.$route.meta && this.$route.meta.bare)
    }
  }
}
</script>
