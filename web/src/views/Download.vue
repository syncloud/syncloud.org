<template>
  <div>
    <section
      class="sc-hero"
      style="padding-bottom:20px"
    >
      <div class="sc-container">
        <h1>{{ $t('download.heading') }}</h1>
        <p>{{ $t('download.subtitle') }}</p>
      </div>
    </section>

    <section
      class="sc-section"
      style="padding-top:20px"
    >
      <div class="sc-container">
        <p
          class="sc-prose"
          style="max-width:760px; margin:0 auto 32px; text-align:center"
        >
          {{ $t('download.version', { version }) }}
        </p>

        <div class="sc-grid sc-grid-3">
          <div
            v-for="entry in popular"
            :key="entry.name + entry.note"
            class="sc-card sc-feature"
          >
            <h3 style="margin:0 0 6px">
              {{ entry.name }}
            </h3>
            <p
              v-if="entry.note"
              style="margin:0 0 16px; color:var(--sc-muted)"
            >
              {{ entry.note }}
            </p>
            <a
              class="sc-btn sc-btn-primary"
              :data-testid="'download-' + entry.board + (entry.format ? '-' + entry.format : '')"
              :href="link(entry)"
            >{{ $t('download.get') }}</a>
          </div>
        </div>

        <div style="text-align:center; margin-top:32px">
          <button
            class="sc-btn sc-btn-ghost"
            data-testid="download-toggle-others"
            @click="showOthers = !showOthers"
          >
            {{ showOthers ? $t('download.hide_others') : $t('download.show_others', { count: others.length }) }}
          </button>
        </div>

        <div
          v-if="showOthers"
          data-testid="download-others"
          class="sc-grid sc-grid-3"
          style="margin-top:24px"
        >
          <div
            v-for="entry in others"
            :key="entry.name + entry.note"
            class="sc-card"
          >
            <h3 style="margin:0 0 6px; font-size:1rem">
              {{ entry.name }}
            </h3>
            <p
              v-if="entry.note"
              style="margin:0 0 12px; color:var(--sc-muted); font-size:0.9rem"
            >
              {{ entry.note }}
            </p>
            <a
              class="sc-btn sc-btn-ghost"
              :data-testid="'download-' + entry.board"
              :href="link(entry)"
            >{{ $t('download.get') }}</a>
          </div>
        </div>

        <p
          class="sc-prose"
          style="max-width:760px; margin:40px auto 0; text-align:center; color:var(--sc-muted)"
        >
          <i18n-t
            keypath="download.next"
            tag="span"
            scope="global"
          >
            <template #setup>
              <router-link
                to="/setup"
                data-testid="download-setup-link"
              >
                {{ $t('download.next_setup') }}
              </router-link>
            </template>
          </i18n-t>
        </p>
      </div>
    </section>
  </div>
</template>

<script>
import { IMAGE_VERSION, POPULAR, OTHERS, downloadUrl } from '../data/images'
import { storedGclid } from '../attribution'

export default {
  name: 'DownloadView',
  data () {
    return {
      version: IMAGE_VERSION,
      popular: POPULAR,
      others: OTHERS,
      showOthers: false
    }
  },
  methods: {
    link (entry) {
      return downloadUrl(entry, storedGclid())
    }
  }
}
</script>
