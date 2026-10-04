<template>
  <footer class="sc-footer">
    <div class="sc-container sc-footer-inner">
      <div class="sc-footer-links">
        <router-link to="/setup">
          {{ $t('nav.setup') }}
        </router-link>
        <router-link to="/hardware">
          {{ $t('nav.hardware') }}
        </router-link>
        <router-link to="/faq">
          {{ $t('nav.faq') }}
        </router-link>
        <router-link to="/privacy">
          {{ $t('nav.privacy') }}
        </router-link>
        <a href="https://github.com/syncloud/platform">GitHub</a>
        <a href="https://t.me/syncloud">Telegram</a>
        <a href="https://syncloud.discourse.group">Discourse</a>
      </div>
      <div class="sc-footer-copy">
        © {{ year }} Syncloud
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'SiteFooter',
  data () {
    return { year: 2026 }
  }
}
</script>
