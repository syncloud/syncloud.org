<template>
  <div>
    <section
      class="sc-hero"
      style="padding-bottom:20px"
    >
      <div class="sc-container">
        <h1>{{ $t('setup.heading') }}</h1>
        <p>{{ $t('setup.subtitle') }}</p>
      </div>
    </section>

    <section
      class="sc-section"
      style="padding-top:20px"
    >
      <div class="sc-container">
        <div
          class="sc-card"
          data-testid="setup-needs"
          style="max-width:760px; margin:0 auto 48px"
        >
          <h2 style="margin:0 0 12px; font-size:1.15rem">
            {{ $t('download.need_title') }}
          </h2>
          <ul style="margin:0; padding-left:20px; color:var(--sc-muted)">
            <li>{{ $t('download.need_device') }}</li>
            <li>{{ $t('download.need_power') }}</li>
            <li>{{ $t('download.need_cable') }}</li>
            <li>{{ $t('download.need_disk') }}</li>
            <li>{{ $t('download.need_computer') }}</li>
          </ul>
        </div>

        <h2 class="sc-step-title">
          1. {{ $t('download.choose_title') }}
        </h2>
        <p
          class="sc-prose"
          style="max-width:760px; margin:0 auto 24px; text-align:center; color:var(--sc-muted)"
        >
          {{ $t('download.version', { version }) }}
        </p>

        <div class="sc-grid sc-grid-3">
          <button
            v-for="entry in popular"
            :key="entry.name + entry.note"
            class="sc-card sc-feature sc-board"
            :class="{ 'sc-board-on': isSelected(entry) }"
            :data-testid="'board-' + entry.board + (entry.format ? '-' + entry.format : '')"
            @click="select(entry)"
          >
            <h3 style="margin:0 0 6px">
              {{ entry.name }}
            </h3>
            <p
              v-if="entry.note"
              style="margin:0; color:var(--sc-muted)"
            >
              {{ entry.note }}
            </p>
          </button>
        </div>

        <div style="text-align:center; margin-top:28px">
          <button
            class="sc-btn sc-btn-ghost"
            data-testid="board-toggle-others"
            @click="showOthers = !showOthers"
          >
            {{ showOthers ? $t('download.hide_others') : $t('download.show_others', { count: others.length }) }}
          </button>
        </div>

        <div
          v-if="showOthers"
          data-testid="board-others"
          class="sc-grid sc-grid-3"
          style="margin-top:24px"
        >
          <button
            v-for="entry in others"
            :key="entry.name + entry.note"
            class="sc-card sc-board"
            :class="{ 'sc-board-on': isSelected(entry) }"
            :data-testid="'board-' + entry.board"
            @click="select(entry)"
          >
            <h3 style="margin:0 0 6px; font-size:1rem">
              {{ entry.name }}
            </h3>
            <p
              v-if="entry.note"
              style="margin:0; color:var(--sc-muted); font-size:0.9rem"
            >
              {{ entry.note }}
            </p>
          </button>
        </div>

        <div
          class="sc-grid sc-grid-2"
          style="margin-top:56px"
        >
          <div
            class="sc-card sc-feature"
            data-testid="setup-step-download"
          >
            <h3 style="margin:0 0 10px">
              2. {{ $t('download.get') }}
            </h3>
            <template v-if="selected">
              <p style="margin:0 0 16px; color:var(--sc-muted)">
                {{ selected.name }}<template v-if="selected.note">
                  ({{ selected.note }})
                </template>
              </p>
              <a
                class="sc-btn sc-btn-primary"
                data-testid="setup-download-link"
                :href="link(selected)"
              >{{ $t('download.get') }}</a>
            </template>
            <p
              v-else
              style="margin:0; color:var(--sc-muted)"
              data-testid="setup-download-prompt"
            >
              {{ $t('download.choose_prompt') }}
            </p>
          </div>

          <div
            class="sc-card sc-feature"
            data-testid="setup-step-write"
          >
            <h3 style="margin:0 0 10px">
              3. {{ $t('download.write_title') }}
            </h3>
            <i18n-t
              keypath="download.write_desc"
              tag="p"
              scope="global"
            >
              <template #etcher>
                <a href="https://etcher.io">Etcher</a>
              </template>
            </i18n-t>
            <p style="margin:12px 0 0; color:var(--sc-warning, #b45309)">
              {{ $t('download.write_warning') }}
            </p>
          </div>

          <div
            class="sc-card sc-feature"
            data-testid="setup-step-boot"
          >
            <h3 style="margin:0 0 10px">
              4. {{ $t('download.boot_title') }}
            </h3>
            <p style="margin:0">
              {{ $t('download.boot_desc') }}
            </p>
          </div>

          <div
            class="sc-card sc-feature"
            data-testid="setup-step-activate"
          >
            <h3 style="margin:0 0 10px">
              5. {{ $t('setup.activate_title') }}
            </h3>
            <i18n-t
              keypath="setup.activate_desc"
              tag="p"
              scope="global"
            >
              <template #video>
                <a href="https://youtu.be/xI_I8yNOzNE">{{ $t('setup.step3_video') }}</a>
              </template>
            </i18n-t>
          </div>

          <div
            class="sc-card sc-feature"
            data-testid="setup-step-after"
          >
            <h3 style="margin:0 0 10px">
              6. {{ $t('download.after_title') }}
            </h3>
            <ul style="margin:0; padding-left:20px; color:var(--sc-muted)">
              <li>{{ $t('download.after_disk') }}</li>
              <li>{{ $t('download.after_access') }}</li>
            </ul>
          </div>

          <div
            class="sc-card sc-feature"
            data-testid="setup-step-buy"
          >
            <h3 style="margin:0 0 10px">
              {{ $t('setup.step1_title') }}
            </h3>
            <p style="margin:0 0 16px; color:var(--sc-muted)">
              {{ $t('setup.buy_desc') }}
            </p>
            <a
              class="sc-btn sc-btn-ghost"
              href="https://store.syncloud.org"
            >{{ $t('setup.buy_it') }}</a>
          </div>
        </div>

        <p
          class="sc-prose"
          style="max-width:760px; margin:40px auto 0; text-align:center; color:var(--sc-muted)"
        >
          <i18n-t
            keypath="download.help"
            tag="span"
            scope="global"
          >
            <template #forum>
              <a
                href="https://syncloud.discourse.group"
                data-testid="setup-forum-link"
              >{{ $t('download.help_forum') }}</a>
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
  name: 'SetupView',
  data () {
    return {
      version: IMAGE_VERSION,
      popular: POPULAR,
      others: OTHERS,
      showOthers: false,
      selected: null
    }
  },
  methods: {
    select (entry) {
      this.selected = entry
    },
    isSelected (entry) {
      return this.selected != null &&
        this.selected.board === entry.board &&
        this.selected.format === entry.format
    },
    link (entry) {
      return downloadUrl(entry, storedGclid())
    }
  }
}
</script>

<style scoped>
.sc-step-title {
  text-align: center;
  margin: 0 0 8px;
  font-size: 1.3rem;
}

.sc-board {
  cursor: pointer;
  text-align: left;
  font: inherit;
  color: inherit;
  border: 1px solid var(--sc-border, rgba(128, 128, 128, 0.3));
  background: none;
  width: 100%;
}

.sc-board-on {
  border-color: var(--sc-primary, #2563eb);
  box-shadow: 0 0 0 2px var(--sc-primary, #2563eb) inset;
}
</style>
