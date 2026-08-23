<template>
  <div class="sc-landing">
    <div class="sc-landing-brand">
      <img
        src="/syncloud-logo.svg"
        alt="Syncloud"
        width="40"
        height="40"
        data-testid="landing-brand"
      >
      <span>Syncloud</span>
    </div>
    <section class="sc-hero">
      <div class="sc-container">
        <h1 data-testid="landing-title">
          {{ copy.title }}
        </h1>
        <p
          class="sc-landing-sub"
          data-testid="landing-subtitle"
        >
          {{ copy.subtitle }}
        </p>
        <div class="sc-hero-actions">
          <a
            class="sc-btn sc-btn-primary sc-landing-cta"
            :href="accountUrl"
            data-testid="landing-cta"
          >{{ copy.cta }}</a>
        </div>
        <p
          class="sc-landing-price"
          data-testid="landing-price"
        >
          {{ copy.price }}
        </p>
      </div>
    </section>

    <section class="sc-container sc-landing-body">
      <img
        class="sc-landing-shot"
        src="/images/screenshot/app-store.webp"
        :alt="copy.shotAlt"
        width="1200"
        height="750"
        data-testid="landing-screenshot"
      >
      <ul
        class="sc-landing-points"
        data-testid="landing-points"
      >
        <li
          v-for="point in copy.points"
          :key="point"
        >
          {{ point }}
        </li>
      </ul>

      <div class="sc-hero-actions">
        <a
          class="sc-btn sc-btn-primary sc-landing-cta"
          :href="accountUrl"
          data-testid="landing-cta-bottom"
        >{{ copy.cta }}</a>
      </div>
      <p
        class="sc-landing-trust"
        data-testid="landing-trust"
      >
        {{ copy.trust }}
      </p>
    </section>
  </div>
</template>

<script>
import { withGclid } from '../attribution'
import { setLocale } from '../i18n'
import { landingCopy, DEFAULT_VARIANT } from '../landing-copy'

export default {
  name: 'LandingView',
  data () {
    return { robots: null }
  },
  computed: {
    variant () {
      return (this.$route.meta && this.$route.meta.variant) || DEFAULT_VARIANT
    },
    copy () {
      return landingCopy(this.variant)
    },
    accountUrl () {
      return withGclid('https://www.syncloud.it')
    }
  },
  async mounted () {
    await setLocale('de')
    if (typeof document === 'undefined') return
    this.robots = document.createElement('meta')
    this.robots.setAttribute('name', 'robots')
    this.robots.setAttribute('content', 'noindex')
    document.head.appendChild(this.robots)
  },
  unmounted () {
    if (this.robots && this.robots.parentNode) {
      this.robots.parentNode.removeChild(this.robots)
    }
  }
}
</script>

<style scoped>
.sc-landing-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 1.5rem 0 0;
  font-weight: 600;
  font-size: 1.15rem;
}
.sc-landing-brand img {
  width: 40px;
  height: 40px;
}
.sc-landing-sub {
  font-size: 1.15rem;
  max-width: 40rem;
  margin: 0 auto 1.5rem;
}
.sc-landing-cta {
  font-size: 1.1rem;
  padding: 0.9rem 2.2rem;
}
.sc-landing-price {
  margin-top: 1rem;
  opacity: 0.85;
}
.sc-landing-body {
  text-align: center;
  padding-bottom: 3rem;
}
.sc-landing-shot {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  margin: 2rem auto;
  display: block;
}
.sc-landing-points {
  list-style: none;
  padding: 0;
  margin: 0 auto 2rem;
  max-width: 34rem;
  text-align: left;
}
.sc-landing-points li {
  padding: 0.55rem 0 0.55rem 1.75rem;
  position: relative;
}
.sc-landing-points li::before {
  content: "✓";
  position: absolute;
  left: 0;
  font-weight: 700;
}
.sc-landing-trust {
  margin-top: 1.5rem;
  opacity: 0.75;
  font-size: 0.95rem;
}
</style>
