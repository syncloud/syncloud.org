<template>
  <div class="sc-lang">
    <button
      class="sc-lang-btn"
      type="button"
      data-testid="language-button"
      @click="open = !open"
    >
      <span>{{ currentName }}</span>
      <span aria-hidden="true">▾</span>
    </button>
    <div
      v-if="open"
      class="sc-lang-menu"
    >
      <button
        v-for="locale in locales"
        :key="locale.code"
        :class="{ active: locale.code === current }"
        :data-testid="'language-' + locale.code"
        @click="choose(locale.code)"
      >
        {{ locale.name }}
      </button>
    </div>
  </div>
</template>

<script>
import { SUPPORTED_LOCALES, setLocale } from '../i18n'

export default {
  name: 'LanguageSwitcher',
  data () {
    return {
      open: false,
      locales: SUPPORTED_LOCALES
    }
  },
  computed: {
    current () {
      return this.$i18n.locale
    },
    currentName () {
      const found = SUPPORTED_LOCALES.find(l => l.code === this.current)
      return found ? found.name : 'English'
    }
  },
  methods: {
    async choose (code) {
      await setLocale(code)
      this.open = false
    }
  }
}
</script>
