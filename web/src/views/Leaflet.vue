<template>
  <div>
    <section class="sc-hero sc-hero-compact sc-leaflet-screen">
      <div class="sc-container">
        <h1>{{ $t('leaflet.heading') }}</h1>
        <p class="sc-intro">
          {{ $t('leaflet.intro') }}
        </p>
      </div>
    </section>

    <section class="sc-section sc-section-compact sc-leaflet-screen">
      <div
        class="sc-container"
        style="max-width:820px"
      >
        <h2 class="sc-part">
          {{ $t('leaflet.download_title') }}
        </h2>
        <div
          class="sc-leaflet-pdfs"
          data-testid="leaflet-pdfs"
        >
          <a
            v-for="language in languages"
            :key="language.code"
            class="sc-btn sc-btn-ghost"
            :href="language.pdf"
            :hreflang="language.code"
            :lang="language.code"
            :data-testid="`leaflet-pdf-${language.code}`"
          >{{ language.name }}</a>
        </div>
        <p class="sc-lead">
          {{ $t('leaflet.print') }}
        </p>
      </div>
    </section>

    <section class="sc-section sc-section-compact sc-leaflet-preview">
      <div class="sc-container">
        <h2 class="sc-part sc-leaflet-screen">
          {{ $t('leaflet.preview_title') }}
        </h2>
        <QuickStartLeaflet />
      </div>
    </section>
  </div>
</template>

<script>
import QuickStartLeaflet from '../components/QuickStartLeaflet.vue'
import { leafletPdf } from '../data/leaflet'
import { SUPPORTED_LOCALES } from '../i18n'

export default {
  name: 'LeafletView',
  components: {
    QuickStartLeaflet
  },
  computed: {
    languages () {
      return SUPPORTED_LOCALES.map(language => ({ ...language, pdf: leafletPdf(language.code) }))
    }
  }
}
</script>

<style>
@media print {
  body:has(.sc-leaflet-preview) { background: #fff; min-width: 0; }
  body:has(.sc-leaflet-preview) .sc-header,
  body:has(.sc-leaflet-preview) .sc-footer,
  .sc-leaflet-screen { display: none !important; }
  .sc-leaflet-preview,
  .sc-leaflet-preview .sc-container { padding: 0; margin: 0; max-width: none; }
}
</style>

<style scoped>
.sc-leaflet-pdfs { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 18px; }
</style>
