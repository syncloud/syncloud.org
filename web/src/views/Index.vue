<template>
  <div>
    <section class="sc-hero">
      <div class="sc-container">
        <h1>{{ $t('index.hero_title') }}</h1>
        <p>{{ $t('index.hero_subtitle') }}</p>
        <div class="sc-hero-actions">
          <router-link
            class="sc-btn sc-btn-primary"
            to="/setup"
            data-testid="index-get-started"
          >
            {{ $t('index.get_started') }}
          </router-link>
          <a
            class="sc-hero-more"
            href="#how"
            data-testid="index-learn-more"
          >{{ $t('index.learn_more') }}</a>
        </div>
      </div>
    </section>

    <section class="sc-container">
      <div
        class="sc-carousel"
        data-testid="carousel"
      >
        <img
          :src="slides[active].src"
          :alt="slides[active].alt"
        >
        <div class="sc-carousel-dots">
          <button
            v-for="(slide, i) in slides"
            :key="i"
            :class="{ active: i === active }"
            :aria-label="slide.alt"
            @click="go(i)"
          />
        </div>
      </div>
    </section>

    <section
      id="how"
      class="sc-section sc-section-alt"
    >
      <div class="sc-container sc-grid sc-grid-2">
        <div class="sc-feature">
          <h3>{{ $t('index.install_title') }}</h3>
          <p>{{ $t('index.install_summary') }}</p>
        </div>
        <div class="sc-feature">
          <h3>{{ $t('index.secure_title') }}</h3>
          <i18n-t
            keypath="index.secure_summary"
            tag="p"
            scope="global"
          >
            <template #link>
              <a :href="accountUrl">syncloud.it</a>
            </template>
          </i18n-t>
          <p>{{ $t('index.secure_traffic') }}</p>
        </div>
        <div class="sc-feature">
          <h3>{{ $t('index.cost_title') }}</h3>
          <i18n-t
            keypath="index.cost_summary"
            tag="p"
            scope="global"
          >
            <template #link>
              <a :href="accountUrl">syncloud.it</a>
            </template>
          </i18n-t>
        </div>
        <div class="sc-feature">
          <h3>{{ $t('index.opensource_title') }}</h3>
          <p>{{ $t('index.opensource_summary') }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { withGclid } from '../attribution'
import { site } from '../data/site'

export default {
  name: 'IndexView',
  data () {
    return {
      active: 0,
      timer: null,
      slides: [
        { src: '/images/screenshot/device.webp', alt: 'Device' },
        { src: '/images/screenshot/activate.webp', alt: 'Activate' },
        { src: '/images/screenshot/app-store.webp', alt: 'App Center' },
        { src: '/images/screenshot/settings.webp', alt: 'Settings' },
        { src: '/images/screenshot/nextcloud.webp', alt: 'Nextcloud' },
        { src: '/images/screenshot/collabora.webp', alt: 'Collabora Office' },
        { src: '/images/screenshot/bitwarden.webp', alt: 'Bitwarden Passwords' },
        { src: '/images/screenshot/matrix.webp', alt: 'Matrix Messenger' },
        { src: '/images/screenshot/mastodon.webp', alt: 'Mastodon Social Network' },
        { src: '/images/screenshot/standard-notes.webp', alt: 'Standard Notes' }
      ]
    }
  },
  computed: {
    accountUrl () {
      return withGclid(site.account)
    }
  },
  mounted () {
    this.timer = setInterval(this.next, 3000)
  },
  unmounted () {
    clearInterval(this.timer)
  },
  methods: {
    go (i) {
      this.active = i
    },
    next () {
      this.active = (this.active + 1) % this.slides.length
    }
  }
}
</script>
