<template>
  <div>
    <section class="sc-hero sc-hero-compact">
      <div class="sc-container">
        <h1>{{ $t('hardware.heading') }}</h1>
        <p class="sc-intro">
          {{ $t('hardware.intro') }}
        </p>
      </div>
    </section>

    <section class="sc-section sc-section-compact">
      <div
        class="sc-container"
        style="max-width:820px"
      >
        <h2 class="sc-part">
          {{ $t('hardware.ready_title') }}
        </h2>
        <a
          class="sc-card sc-seller"
          :href="buyUrl"
          data-testid="hardware-store-link"
          @click="track('outbound.shop')"
        >
          <span class="sc-seller-text">
            <span class="sc-seller-name">Syncloud</span>
            <span class="sc-seller-region">{{ $t('hardware.ready_desc') }}</span>
          </span>
          <span class="sc-arch">ARM</span>
        </a>

        <h2 class="sc-part">
          {{ $t('hardware.sellers_title') }}
        </h2>
        <i18n-t
          keypath="hardware.sellers_desc"
          tag="p"
          class="sc-lead"
          scope="global"
        >
          <template #setup>
            <router-link
              to="/setup"
              data-testid="hardware-setup-link"
            >
              {{ $t('hardware.setup_link') }}
            </router-link>
          </template>
        </i18n-t>
        <div
          class="sc-sellers"
          data-testid="hardware-sellers"
        >
          <a
            v-for="seller in resellers"
            :key="seller.id"
            class="sc-card sc-seller"
            :href="seller.url"
            :data-testid="`reseller-${seller.id}`"
            @click="track(`outbound.${seller.id}`)"
          >
            <span class="sc-seller-text">
              <span class="sc-seller-line">
                <span class="sc-seller-name">{{ seller.name }}</span>
                <span class="sc-seller-board">{{ seller.board }}</span>
              </span>
              <span class="sc-seller-region">{{ regionNames(seller.regions) }}</span>
            </span>
            <span class="sc-arch">{{ seller.arch }}</span>
          </a>
        </div>

        <i18n-t
          keypath="hardware.listed"
          tag="p"
          class="sc-note"
          scope="global"
          data-testid="hardware-listed"
        >
          <template #email>
            <a href="mailto:support@syncloud.it">support@syncloud.it</a>
          </template>
        </i18n-t>
      </div>
    </section>
  </div>
</template>

<script>
import { withGclid } from '../attribution'
import { locale } from '../i18n'
import { resellers } from '../data/resellers'
import { site } from '../data/site'
import { track } from '../track'

export default {
  name: 'HardwareView',
  data () {
    return { resellers }
  },
  computed: {
    buyUrl () {
      return withGclid(`${site.account}/shop`)
    }
  },
  methods: {
    track (event) {
      track(event)
    },
    regionNames (codes) {
      const names = new Intl.DisplayNames([locale()], { type: 'region' })
      return codes.map(code => names.of(code)).join(', ')
    }
  }
}
</script>

<style scoped>
.sc-intro {
  max-width: 640px;
  margin: 12px auto 0;
  color: var(--sc-muted);
}

.sc-part {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 32px 0 12px;
}

.sc-part:first-of-type {
  margin-top: 0;
}

.sc-lead {
  margin: 0 0 14px;
  color: var(--sc-muted);
}

.sc-note {
  margin: 20px 0 0;
  color: var(--sc-muted);
  font-size: 0.92rem;
}

.sc-sellers {
  display: grid;
  gap: 12px;
}

.sc-seller {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 22px;
  color: inherit;
  text-decoration: none;
}

.sc-seller:hover {
  border-color: var(--sc-accent, #2563eb);
  color: inherit;
}

.sc-seller-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sc-seller-line {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  column-gap: 10px;
}

.sc-seller-name {
  font-weight: 600;
}

.sc-seller-board {
  color: var(--sc-muted);
}

.sc-seller-region {
  color: var(--sc-muted);
  font-size: 0.85rem;
}

.sc-arch {
  flex-shrink: 0;
  padding: 1px 7px;
  border-radius: 999px;
  border: 1px solid var(--sc-border-soft);
  color: var(--sc-muted);
  font-size: 0.75rem;
}
</style>
