<template>
  <button
    class="sc-icon-btn"
    type="button"
    :aria-label="$t('nav.theme')"
    data-testid="theme-toggle"
    @click="theme.toggle()"
  >
    {{ theme.isDark ? '☀' : '☾' }}
  </button>
</template>

<script>
import { useThemeStore } from '../stores/theme'

export default {
  name: 'ThemeToggle',
  setup () {
    return { theme: useThemeStore() }
  }
}
</script>
