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
        <div class="sc-filters">
          <input
            v-model="query"
            class="sc-filter"
            type="search"
            enterkeyhint="search"
            autocomplete="off"
            :placeholder="$t('hardware.search')"
            :aria-label="$t('hardware.search')"
            data-testid="hardware-search"
          >
          <select
            v-model="country"
            class="sc-filter"
            :aria-label="$t('hardware.all_countries')"
            data-testid="hardware-country"
          >
            <option value="">
              {{ $t('hardware.all_countries') }}
            </option>
            <option
              v-for="option in countries"
              :key="option.code"
              :value="option.code"
            >
              {{ option.name }}
            </option>
          </select>
        </div>

        <p
          v-if="shown.length === 0"
          class="sc-lead"
          data-testid="hardware-empty"
        >
          {{ $t('hardware.no_match') }}
        </p>

        <div
          class="sc-sellers"
          data-testid="hardware-sellers"
        >
          <a
            v-for="seller in shown"
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

const UNION = 'EU'
const UNION_MEMBERS = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT',
  'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE']

function sellsIn (seller, country) {
  return seller.regions.includes(country) ||
    (seller.regions.includes(UNION) && UNION_MEMBERS.includes(country))
}

export default {
  name: 'HardwareView',
  data () {
    const { q, country } = this.$route.query
    return {
      query: typeof q === 'string' ? q : '',
      country: resellers.some(seller => seller.regions.includes(country)) && country !== UNION ? country : ''
    }
  },
  computed: {
    countries () {
      const names = new Intl.DisplayNames([locale()], { type: 'region' })
      const codes = new Set(resellers.flatMap(seller => seller.regions))
      codes.delete(UNION)
      return [...codes]
        .map(code => ({ code, name: names.of(code) }))
        .sort((a, b) => a.name.localeCompare(b.name, locale()))
    },
    shown () {
      const words = this.query.trim().toLowerCase()
      return resellers.filter(seller =>
        (words === '' || `${seller.name} ${seller.board}`.toLowerCase().includes(words)) &&
        (this.country === '' || sellsIn(seller, this.country)))
    },
    buyUrl () {
      return withGclid(`${site.account}/shop`)
    }
  },
  watch: {
    query: 'remember',
    country: 'remember'
  },
  methods: {
    remember () {
      const query = {}
      if (this.query.trim() !== '') query.q = this.query.trim()
      if (this.country !== '') query.country = this.country
      this.$router.replace({ query })
    },
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

.sc-filters {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 14px;
}

.sc-filter {
  width: 100%;
  min-height: 44px;
  padding: 10px 14px;
  font: inherit;
  font-size: 16px;
  color: inherit;
  border-radius: 12px;
  border: 1px solid var(--sc-border-soft);
  background: var(--sc-surface);
}

.sc-filter:focus {
  outline: none;
  border-color: var(--sc-accent, #2563eb);
}

@media (max-width: 560px) {
  .sc-filters {
    grid-template-columns: 1fr;
  }
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
