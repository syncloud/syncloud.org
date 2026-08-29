<template>
  <header class="sc-header">
    <div class="sc-container sc-header-inner">
      <router-link
        to="/"
        class="sc-logo"
        data-testid="nav-home"
        @click="menuOpen = false"
      >
        <img
          src="/syncloud-logo.svg"
          alt="Syncloud"
          class="sc-logo-img"
        >
        <span class="sc-logo-name">Syncloud</span>
      </router-link>

      <nav
        class="sc-nav"
        :class="{ open: menuOpen }"
        @click="menuOpen = false"
      >
        <router-link
          to="/setup"
          data-testid="nav-setup"
        >
          {{ $t('nav.setup') }}
        </router-link>
        <a
          href="https://store.syncloud.org"
          data-testid="nav-apps"
        >{{ $t('nav.apps') }}</a>
        <a
          href="https://github.com/syncloud/platform/wiki"
          data-testid="nav-docs"
        >{{ $t('nav.docs') }}</a>
        <router-link
          to="/faq"
          data-testid="nav-faq"
        >
          {{ $t('nav.faq') }}
        </router-link>
        <a
          :href="accountUrl"
          data-testid="nav-login"
          @click="track('outbound.account')"
        >{{ $t('nav.login') }}</a>
      </nav>

      <div class="sc-header-actions">
        <LanguageSwitcher />
        <ThemeToggle />
        <button
          class="sc-burger"
          type="button"
          aria-label="menu"
          data-testid="nav-burger"
          @click="menuOpen = !menuOpen"
        >
          <span /><span /><span />
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import LanguageSwitcher from './LanguageSwitcher.vue'
import ThemeToggle from './ThemeToggle.vue'
import { withGclid } from '../attribution'
import { track } from '../track'

export default {
  name: 'SiteHeader',
  components: { LanguageSwitcher, ThemeToggle },
  data () {
    return { menuOpen: false }
  },
  computed: {
    accountUrl () {
      return withGclid('https://syncloud.it')
    }
  },
  methods: {
    track (event) {
      track(event)
    }
  }
}
</script>
