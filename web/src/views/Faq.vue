<template>
  <div>
    <section
      class="sc-hero sc-hero-compact"
    >
      <div class="sc-container">
        <h1>{{ $t('faq.heading') }}</h1>
      </div>
    </section>

    <section
      class="sc-section sc-section-compact"
    >
      <div
        class="sc-container"
        style="max-width:820px"
      >
        <div class="sc-faq-item">
          <button
            class="sc-faq-q"
            data-testid="faq-q1"
            @click="toggle(1)"
          >
            <span>{{ $t('faq.q1') }}</span><span>{{ open === 1 ? '−' : '+' }}</span>
          </button>
          <i18n-t
            v-if="open === 1"
            keypath="faq.a1"
            tag="div"
            class="sc-faq-a"
            scope="global"
          >
            <template #link>
              <a :href="`${account}/privacy`">www.syncloud.it</a>
            </template>
          </i18n-t>
        </div>

        <div class="sc-faq-item">
          <button
            class="sc-faq-q"
            data-testid="faq-q2"
            @click="toggle(2)"
          >
            <span>{{ $t('faq.q2') }}</span><span>{{ open === 2 ? '−' : '+' }}</span>
          </button>
          <div
            v-if="open === 2"
            class="sc-faq-a"
          >
            {{ $t('faq.a2') }}
          </div>
        </div>

        <div class="sc-faq-item">
          <button
            class="sc-faq-q"
            data-testid="faq-q3"
            @click="toggle(3)"
          >
            <span>{{ $t('faq.q3') }}</span><span>{{ open === 3 ? '−' : '+' }}</span>
          </button>
          <i18n-t
            v-if="open === 3"
            keypath="faq.a3"
            tag="div"
            class="sc-faq-a"
            scope="global"
          >
            <template #link>
              <a :href="accountUrl">www.syncloud.it</a>
            </template>
          </i18n-t>
        </div>

        <div class="sc-faq-item">
          <button
            class="sc-faq-q"
            data-testid="faq-q4"
            @click="toggle(4)"
          >
            <span>{{ $t('faq.q4') }}</span><span>{{ open === 4 ? '−' : '+' }}</span>
          </button>
          <div
            v-if="open === 4"
            class="sc-faq-a"
          >
            {{ $t('faq.a4') }}
          </div>
        </div>

        <div class="sc-faq-item">
          <button
            class="sc-faq-q"
            data-testid="faq-q5"
            @click="toggle(5)"
          >
            <span>{{ $t('faq.q5') }}</span><span>{{ open === 5 ? '−' : '+' }}</span>
          </button>
          <i18n-t
            v-if="open === 5"
            keypath="faq.a5"
            tag="div"
            class="sc-faq-a"
            scope="global"
          >
            <template #know>
              <a href="https://github.com/syncloud/platform/wiki/Things-to-know-before-buying-a-device">{{ $t('faq.a5_know') }}</a>
            </template>
            <template #here>
              <a href="https://github.com/syncloud/platform/wiki/External-access">{{ $t('faq.a5_here') }}</a>
            </template>
          </i18n-t>
        </div>

        <div class="sc-faq-item">
          <button
            class="sc-faq-q"
            data-testid="faq-q6"
            @click="toggle(6)"
          >
            <span>{{ $t('faq.q6') }}</span><span>{{ open === 6 ? '−' : '+' }}</span>
          </button>
          <div
            v-if="open === 6"
            class="sc-faq-a"
          >
            {{ $t('faq.a6') }}
          </div>
        </div>

        <div class="sc-faq-item">
          <button
            class="sc-faq-q"
            data-testid="faq-q7"
            @click="toggle(7)"
          >
            <span>{{ $t('faq.q7') }}</span><span>{{ open === 7 ? '−' : '+' }}</span>
          </button>
          <div
            v-if="open === 7"
            class="sc-faq-a"
          >
            {{ $t('faq.a7') }}
          </div>
        </div>

        <div class="sc-faq-item">
          <button
            class="sc-faq-q"
            data-testid="faq-q8"
            @click="toggle(8)"
          >
            <span>{{ $t('faq.q8') }}</span><span>{{ open === 8 ? '−' : '+' }}</span>
          </button>
          <div
            v-if="open === 8"
            class="sc-faq-a"
          >
            {{ $t('faq.a8') }}
          </div>
        </div>

        <div class="sc-faq-item">
          <button
            class="sc-faq-q"
            data-testid="faq-q9"
            @click="toggle(9)"
          >
            <span>{{ $t('faq.q9') }}</span><span>{{ open === 9 ? '−' : '+' }}</span>
          </button>
          <i18n-t
            v-if="open === 9"
            keypath="faq.a9"
            tag="div"
            class="sc-faq-a"
            scope="global"
          >
            <template #wiki>
              <a href="https://github.com/syncloud/platform/wiki">{{ $t('faq.a9_wiki') }}</a>
            </template>
            <template #discourse>
              <a href="https://syncloud.discourse.group">{{ $t('faq.a9_discourse') }}</a>
            </template>
          </i18n-t>
        </div>

        <div class="sc-faq-item">
          <button
            class="sc-faq-q"
            data-testid="faq-q10"
            @click="toggle(10)"
          >
            <span>{{ $t('faq.q10') }}</span><span>{{ open === 10 ? '−' : '+' }}</span>
          </button>
          <div
            v-if="open === 10"
            class="sc-faq-a"
          >
            {{ $t('faq.a10') }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { withGclid } from '../attribution'
import { site } from '../data/site'

export default {
  name: 'FaqView',
  data () {
    return { open: 1 }
  },
  computed: {
    account () {
      return site.account
    },
    accountUrl () {
      return withGclid(site.account)
    }
  },
  methods: {
    toggle (n) {
      this.open = this.open === n ? 0 : n
    }
  }
}
</script>
