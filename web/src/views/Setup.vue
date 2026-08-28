<template>
  <div>
    <section
      class="sc-hero sc-hero-compact"
    >
      <div class="sc-container">
        <h1>{{ $t('setup.heading') }}</h1>
      </div>
    </section>

    <section
      class="sc-section sc-section-compact sc-wizard"
    >
      <div class="sc-container">
        <h2 class="sc-step">
          {{ stepNo('start') }}. {{ $t('setup.start_title') }}
        </h2>
        <div class="sc-grid sc-grid-2">
          <button
            class="sc-card sc-pick"
            :class="{ 'sc-pick-on': path === 'build' }"
            data-testid="path-build"
            @click="choose('build')"
          >
            <h3>{{ $t('setup.path_build') }}</h3>
            <p>{{ $t('setup.path_build_desc') }}</p>
          </button>
          <button
            class="sc-card sc-pick"
            :class="{ 'sc-pick-on': path === 'buy' }"
            data-testid="path-buy"
            @click="choose('buy')"
          >
            <h3>{{ $t('setup.path_buy') }}</h3>
            <p>{{ $t('setup.path_buy_desc') }}</p>
          </button>
        </div>

        <template v-if="path === 'buy'">
          <h2 class="sc-step">
            {{ stepNo('order') }}. {{ $t('setup.order_title') }}
          </h2>
          <div
            class="sc-card sc-panel"
            data-testid="setup-step-order"
          >
            <p>{{ $t('setup.order_desc') }}</p>
            <a
              class="sc-btn sc-btn-primary"
              href="https://store.syncloud.org"
              data-testid="setup-store-link"
            >{{ $t('setup.buy_it') }}</a>
          </div>
        </template>

        <template v-if="path === 'build'">
          <h2 class="sc-step">
            {{ stepNo('board') }}. {{ $t('download.choose_title') }}
          </h2>
          <div
            class="sc-card sc-panel"
            data-testid="setup-needs"
          >
            <p class="sc-panel-lead">
              {{ $t('download.need_title') }}
            </p>
            <ul class="sc-needs">
              <li>{{ $t('download.need_device') }}</li>
              <li>{{ $t('download.need_power') }}</li>
              <li>{{ $t('download.need_cable') }}</li>
              <li>{{ $t('download.need_disk') }}</li>
              <li>{{ $t('download.need_computer') }}</li>
            </ul>
          </div>

          <div class="sc-boards">
            <button
              v-for="entry in popular"
              :key="entry.name + entry.note"
              class="sc-board"
              :class="{ 'sc-board-on': isSelected(entry) }"
              :data-testid="'board-' + entry.board + (entry.format ? '-' + entry.format : '')"
              @click="select(entry)"
            >
              <span class="sc-board-name">{{ entry.name }}</span>
              <span
                v-if="entry.note"
                class="sc-board-note"
              >{{ entry.note }}</span>
            </button>
          </div>

          <div style="text-align:center; margin-top:16px">
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
            class="sc-boards"
            style="margin-top:16px"
          >
            <button
              v-for="entry in others"
              :key="entry.name + entry.note"
              class="sc-board"
              :class="{ 'sc-board-on': isSelected(entry) }"
              :data-testid="'board-' + entry.board"
              @click="select(entry)"
            >
              <span class="sc-board-name">{{ entry.name }}</span>
              <span
                v-if="entry.note"
                class="sc-board-note"
              >{{ entry.note }}</span>
            </button>
          </div>

          <h2 class="sc-step">
            {{ stepNo('download') }}. {{ $t('download.get') }}
          </h2>
          <div
            class="sc-card sc-panel"
            data-testid="setup-step-download"
          >
            <template v-if="selected">
              <p class="sc-panel-lead">
                {{ selected.name }}<template v-if="selected.note">
                  · {{ selected.note }}
                </template>
              </p>
              <p class="sc-muted-small">
                {{ $t('download.version', { version }) }}
              </p>
              <a
                class="sc-btn sc-btn-primary"
                data-testid="setup-download-link"
                :href="link(selected)"
              >{{ $t('download.get') }}</a>
            </template>
            <p
              v-else
              data-testid="setup-download-prompt"
            >
              {{ $t('download.choose_prompt') }}
            </p>
          </div>

          <h2 class="sc-step">
            {{ stepNo('write') }}. {{ $t('download.write_title') }}
          </h2>
          <div
            class="sc-card sc-panel"
            data-testid="setup-step-write"
          >
            <i18n-t
              keypath="download.write_desc"
              tag="p"
              scope="global"
            >
              <template #etcher>
                <a href="https://etcher.io">Etcher</a>
              </template>
            </i18n-t>
            <p class="sc-warn">
              {{ $t('download.write_warning') }}
            </p>
          </div>

          <h2 class="sc-step">
            {{ stepNo('boot') }}. {{ $t('download.boot_title') }}
          </h2>
          <div
            class="sc-card sc-panel"
            data-testid="setup-step-boot"
          >
            <p>{{ $t('download.boot_desc') }}</p>
          </div>
        </template>

        <template v-if="path">
          <h2 class="sc-step">
            {{ stepNo('activate') }}. {{ $t('setup.activate_title') }}
          </h2>
          <div
            class="sc-card sc-panel"
            data-testid="setup-step-activate"
          >
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

          <h2 class="sc-step">
            {{ stepNo('after') }}. {{ $t('download.after_title') }}
          </h2>
          <div
            class="sc-card sc-panel"
            data-testid="setup-step-after"
          >
            <ul class="sc-needs">
              <li>{{ $t('download.after_disk') }}</li>
              <li>{{ $t('download.after_access') }}</li>
            </ul>
          </div>

          <p class="sc-help">
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
        </template>
      </div>
    </section>
  </div>
</template>

<script>
import { IMAGE_VERSION, POPULAR, OTHERS, downloadUrl } from '../data/images'
import { storedGclid } from '../attribution'

const BUY = ['start', 'order', 'activate', 'after']
const BUILD = ['start', 'board', 'download', 'write', 'boot', 'activate', 'after']

export default {
  name: 'SetupView',
  data () {
    return {
      version: IMAGE_VERSION,
      popular: POPULAR,
      others: OTHERS,
      showOthers: false,
      selected: null,
      path: null
    }
  },
  computed: {
    steps () {
      if (this.path === 'buy') return BUY
      if (this.path === 'build') return BUILD
      return ['start']
    }
  },
  methods: {
    choose (path) {
      this.path = path
    },
    stepNo (key) {
      return this.steps.indexOf(key) + 1
    },
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
.sc-step {
  font-size: 1.15rem;
  margin: 40px 0 14px;
}

.sc-step:first-of-type {
  margin-top: 0;
}

.sc-wizard :deep(.sc-card) {
  padding: 20px 22px;
}

.sc-panel p {
  margin: 0 0 12px;
}

.sc-panel p:last-child {
  margin-bottom: 0;
}

.sc-panel-lead {
  font-weight: 600;
}

.sc-muted-small {
  color: var(--sc-muted);
  font-size: 0.9rem;
}

.sc-needs {
  margin: 0;
  padding-left: 20px;
  color: var(--sc-muted);
}

.sc-warn {
  color: var(--sc-warning, #b45309);
}

.sc-help {
  margin: 36px 0 0;
  text-align: center;
  color: var(--sc-muted);
}

.sc-pick {
  cursor: pointer;
  text-align: left;
  font: inherit;
  color: inherit;
  width: 100%;
}

.sc-pick h3 {
  margin: 0 0 6px;
  font-size: 1.05rem;
}

.sc-pick p {
  margin: 0;
  color: var(--sc-muted);
}

.sc-pick-on {
  border-color: var(--sc-accent, #2563eb);
  box-shadow: 0 0 0 2px var(--sc-accent, #2563eb) inset;
}

.sc-boards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.sc-board {
  display: flex;
  flex-direction: column;
  gap: 2px;
  cursor: pointer;
  text-align: left;
  font: inherit;
  color: inherit;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid var(--sc-border-soft);
  background: var(--sc-surface);
}

.sc-board-name {
  font-weight: 600;
  font-size: 0.95rem;
}

.sc-board-note {
  color: var(--sc-muted);
  font-size: 0.82rem;
}

.sc-board-on {
  border-color: var(--sc-accent, #2563eb);
  box-shadow: 0 0 0 2px var(--sc-accent, #2563eb) inset;
}

@media (max-width: 860px) {
  .sc-step {
    margin: 28px 0 10px;
    font-size: 1.05rem;
  }

  .sc-wizard :deep(.sc-card) {
    padding: 16px;
  }

  .sc-boards {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 10px;
  }
}
</style>
