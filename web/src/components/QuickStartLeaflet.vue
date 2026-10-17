<template>
  <div
    class="ql"
    data-testid="leaflet-sheets"
  >
    <section class="ql-side">
      <div class="ql-side-label">
        {{ $t('leaflet.sheet.outside') }}
      </div>
      <div class="ql-sheet">
        <div class="ql-panels">
          <div class="ql-panel">
            <div class="ql-kicker">
              {{ $t('leaflet.sheet.need_kicker') }}
            </div>
            <h2>{{ $t('leaflet.sheet.need_title') }}</h2>
            <ul>
              <li>{{ $t('leaflet.sheet.need_device') }}</li>
              <li>{{ $t('leaflet.sheet.need_power') }}</li>
              <li>{{ $t('leaflet.sheet.need_cable') }}</li>
              <li>{{ $t('leaflet.sheet.need_router') }}</li>
              <li>{{ $t('leaflet.sheet.need_phone') }}</li>
              <li>{{ $t('leaflet.sheet.need_email') }}</li>
            </ul>
            <div class="ql-box ql-green">
              <div class="ql-kicker">
                {{ $t('leaflet.sheet.optional_kicker') }}
              </div>
              <p>{{ $t('leaflet.sheet.optional_desc') }}</p>
            </div>
            <p class="ql-foot">
              {{ $t('leaflet.sheet.first_start') }}
            </p>
          </div>

          <div class="ql-panel">
            <div class="ql-kicker">
              {{ $t('leaflet.sheet.sub_kicker') }}
            </div>
            <h3>{{ $t('leaflet.sheet.sub_title') }}</h3>
            <p>
              <b>{{ $t('leaflet.sheet.sub_why') }}</b>
              {{ $t('leaflet.sheet.sub_intro') }}
            </p>
            <ul>
              <i18n-t
                keypath="leaflet.sheet.sub_name"
                tag="li"
                scope="global"
              >
                <template #addr>
                  <span class="ql-addr">{{ name }}.syncloud.it</span>
                </template>
              </i18n-t>
              <li>{{ $t('leaflet.sheet.sub_cert') }}</li>
              <li>{{ $t('leaflet.sheet.sub_relay') }}</li>
              <li>{{ $t('leaflet.sheet.sub_mail') }}</li>
            </ul>
            <p class="ql-soft">
              {{ $t('leaflet.sheet.sub_note') }}
            </p>
            <div class="ql-box ql-blue">
              <div class="ql-kicker">
                {{ $t('leaflet.sheet.help_kicker') }}
              </div>
              <dl class="ql-contacts">
                <dt>{{ $t('leaflet.sheet.help_email') }}</dt>
                <dd>support@syncloud.it</dd>
                <dt>{{ $t('leaflet.sheet.help_forum') }}</dt>
                <dd>syncloud.discourse.group</dd>
                <dt>{{ $t('leaflet.sheet.help_wiki') }}</dt>
                <dd>github.com/syncloud/platform/wiki</dd>
              </dl>
            </div>
            <div class="ql-stamp">
              {{ $t('leaflet.sheet.supplied_by') }}
            </div>
          </div>

          <div class="ql-panel ql-cover">
            <div class="ql-brand">
              <img
                src="/syncloud-logo.svg"
                alt=""
              >
              <span>Syncloud</span>
            </div>
            <h2>{{ $t('leaflet.sheet.cover_title') }}</h2>
            <p class="ql-lede">
              {{ $t('leaflet.sheet.cover_lede') }}
            </p>
            <div class="ql-qr">
              <QrCode
                :value="setupUrl"
                data-testid="leaflet-qr-setup"
              />
              <p>
                {{ $t('leaflet.sheet.cover_qr') }}
                <b>syncloud.org/setup</b>
              </p>
            </div>
          </div>
        </div>
        <div class="ql-marks" />
      </div>
    </section>

    <section class="ql-side">
      <div class="ql-side-label">
        {{ $t('leaflet.sheet.inside') }}
      </div>
      <div class="ql-sheet">
        <div class="ql-panels">
          <div class="ql-panel ql-step">
            <div class="ql-step-head">
              <div class="ql-step-no">
                1
              </div>
              <h2>{{ $t('leaflet.sheet.step1_title') }}</h2>
            </div>
            <ol>
              <li>{{ $t('leaflet.sheet.step1_card') }}</li>
              <li>{{ $t('leaflet.sheet.step1_cable') }}</li>
              <li>{{ $t('leaflet.sheet.step1_power') }}</li>
              <li>{{ $t('leaflet.sheet.step1_wait') }}</li>
            </ol>
            <div
              class="ql-art"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 200 120"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect
                  x="12"
                  y="44"
                  width="62"
                  height="40"
                  rx="6"
                  fill="#ffffff"
                  stroke="#2b7bd6"
                  stroke-width="3"
                />
                <circle
                  cx="26"
                  cy="64"
                  r="3"
                  fill="#4f9e33"
                />
                <rect
                  x="126"
                  y="50"
                  width="62"
                  height="28"
                  rx="6"
                  fill="#ffffff"
                  stroke="#17263a"
                  stroke-width="3"
                />
                <path
                  d="M140 50 L134 32 M174 50 L180 32"
                  stroke="#17263a"
                  stroke-width="3"
                />
                <circle
                  cx="140"
                  cy="64"
                  r="2.5"
                  fill="#4f9e33"
                />
                <circle
                  cx="150"
                  cy="64"
                  r="2.5"
                  fill="#4f9e33"
                />
                <path
                  d="M74 70 C 96 70, 104 92, 126 70"
                  stroke="#2b7bd6"
                  stroke-width="3"
                />
                <path
                  d="M43 84 L43 104 L20 104"
                  stroke="#4a5d75"
                  stroke-width="3"
                />
              </svg>
            </div>
          </div>

          <div class="ql-panel ql-step">
            <div class="ql-step-head">
              <div class="ql-step-no">
                2
              </div>
              <h2>{{ $t('leaflet.sheet.step2_title') }}</h2>
            </div>
            <ol>
              <li>{{ $t('leaflet.sheet.step2_find') }}</li>
              <i18n-t
                keypath="leaflet.sheet.step2_open"
                tag="li"
                scope="global"
              >
                <template #addr>
                  <span class="ql-addr">https://192.168.1.20</span>
                </template>
              </i18n-t>
              <li>{{ $t('leaflet.sheet.step2_account') }}</li>
              <li>{{ $t('leaflet.sheet.step2_credentials') }}</li>
            </ol>
            <div class="ql-app-qr">
              <QrCode
                :value="playUrl"
                data-testid="leaflet-qr-play"
              />
              <p>
                {{ $t('leaflet.sheet.app_qr') }}
                <b>Google Play</b>
              </p>
            </div>
            <div class="ql-box ql-blue ql-end">
              <div class="ql-kicker">
                {{ $t('leaflet.sheet.notfound_kicker') }}
              </div>
              <i18n-t
                keypath="leaflet.sheet.notfound_desc"
                tag="p"
                scope="global"
              >
                <template #addr>
                  <span class="ql-addr">syncloud.org/setup</span>
                </template>
              </i18n-t>
            </div>
          </div>

          <div class="ql-panel ql-step">
            <div class="ql-step-head">
              <div class="ql-step-no">
                3
              </div>
              <h2>{{ $t('leaflet.sheet.step3_title') }}</h2>
            </div>
            <ol>
              <i18n-t
                keypath="leaflet.sheet.step3_open"
                tag="li"
                scope="global"
              >
                <template #addr>
                  <span class="ql-addr">https://{{ name }}.syncloud.it</span>
                </template>
              </i18n-t>
              <i18n-t
                keypath="leaflet.sheet.step3_apps"
                tag="li"
                scope="global"
              >
                <template #addr>
                  <span class="ql-addr">nextcloud.{{ name }}.syncloud.it</span>
                </template>
              </i18n-t>
              <li>{{ $t('leaflet.sheet.step3_access') }}</li>
            </ol>
            <div class="ql-box ql-green">
              <div class="ql-kicker">
                {{ $t('leaflet.sheet.store_kicker') }}
              </div>
              <p>Nextcloud · Home Assistant · WordPress · Bitwarden · Jellyfin · Paperless-ngx · Pi-hole · Syncthing · {{ $t('leaflet.sheet.store_more') }}</p>
            </div>
          </div>
        </div>
        <div class="ql-marks" />
      </div>
    </section>
  </div>
</template>

<script>
import QrCode from './QrCode.vue'
import { playUrl, setupUrl } from '../data/leaflet'

export default {
  name: 'QuickStartLeaflet',
  components: {
    QrCode
  },
  data () {
    return { playUrl, setupUrl }
  },
  computed: {
    name () {
      return this.$t('leaflet.sheet.example_name')
    }
  }
}
</script>

<style>
@font-face { font-family: "Sora"; src: url("/fonts/sora.woff2") format("woff2"); font-weight: 100 800; font-display: swap; }
@font-face { font-family: "Figtree"; src: url("/fonts/figtree.woff2") format("woff2"); font-weight: 300 900; font-display: swap; }
@font-face { font-family: "JetBrains Mono"; src: url("/fonts/jetbrains-mono.woff2") format("woff2"); font-weight: 100 800; font-display: swap; }
@font-face { font-family: "Noto Sans"; src: url("/fonts/noto-sans-cyrillic.woff2") format("woff2"); font-weight: 300 800; font-display: swap; unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
@font-face { font-family: "Noto Sans Arabic"; src: url("/fonts/noto-sans-arabic.woff2") format("woff2"); font-weight: 300 800; font-display: swap; unicode-range: U+0600-06FF, U+0750-077F, U+0870-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FEFC; }
@font-face { font-family: "Noto Sans Devanagari"; src: url("/fonts/noto-sans-devanagari.woff2") format("woff2"); font-weight: 300 800; font-display: swap; unicode-range: U+0900-097F, U+1CD0-1CF9, U+200C-200D, U+20A8, U+20B9, U+20F0, U+25CC, U+A830-A839, U+A8E0-A8FF; }

@media print {
  @page { size: A4 landscape; margin: 0; }
}
</style>

<style scoped>
.ql {
  --paper: #ffffff;
  --ink: #17263a;
  --ink-soft: #4a5d75;
  --blue: #2b7bd6;
  --blue-wash: #eaf3fd;
  --green: #4f9e33;
  --green-wash: #edf7e8;
  --rule: #d3dce7;
  --script: "Noto Sans", "Noto Sans Arabic", "Noto Sans Devanagari", "WenQuanYi Zen Hei", "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", "IPAPGothic", "Hiragino Sans", "Yu Gothic", "Noto Sans CJK JP";
  --display: "Sora", var(--script), system-ui, sans-serif;
  --body: "Figtree", var(--script), system-ui, sans-serif;
  --mono: "JetBrains Mono", ui-monospace, Menlo, monospace;
  display: grid;
  gap: 28px;
  color: var(--ink);
  font-family: var(--body);
  color-scheme: light;
}
.ql:lang(ja) {
  --script: "IPAPGothic", "Hiragino Sans", "Yu Gothic", "Noto Sans CJK JP", "Noto Sans";
}
.ql-side { display: grid; gap: 10px; }
.ql-side-label { font: 600 12px var(--body); letter-spacing: .08em; text-transform: uppercase; color: var(--sc-muted); }

.ql-sheet { container-type: inline-size; width: 100%; aspect-ratio: 297 / 210; background: var(--paper); box-shadow: 0 18px 40px -18px rgba(23, 38, 58, .35); position: relative; overflow: hidden; }
.ql-panels { position: absolute; inset: 0; display: grid; grid-template-columns: repeat(3, 1fr); }
.ql-panel { --mm: calc(100cqw / 297); position: relative; padding: calc(var(--mm) * 11) calc(var(--mm) * 9); display: flex; flex-direction: column; gap: calc(var(--mm) * 4.5); font-size: calc(var(--mm) * 3.35); line-height: 1.42; min-width: 0; overflow: hidden; }
.ql-panel + .ql-panel::before { content: ""; position: absolute; inset-inline-start: 0; top: calc(var(--mm) * 6); bottom: calc(var(--mm) * 6); border-inline-start: 1px dashed var(--rule); }
.ql-sheet::before, .ql-sheet::after { content: ""; position: absolute; top: 0; height: calc(100cqw / 297 * 4); border-left: 1px solid var(--ink-soft); }
.ql-sheet::before { left: 33.333%; }
.ql-sheet::after { left: 66.666%; }
.ql-marks { position: absolute; inset: auto 0 0 0; height: calc(100cqw / 297 * 4); }
.ql-marks::before, .ql-marks::after { content: ""; position: absolute; bottom: 0; height: 100%; border-left: 1px solid var(--ink-soft); }
.ql-marks::before { left: 33.333%; }
.ql-marks::after { left: 66.666%; }

.ql-kicker { font: 600 calc(var(--mm) * 2.7) var(--body); letter-spacing: .12em; text-transform: uppercase; color: var(--blue); }
.ql:lang(ja) :is(h2, h3, p, li) { word-break: auto-phrase; }
.ql:is(:lang(ar), :lang(hi), :lang(ja), :lang(zh)) .ql-kicker { letter-spacing: 0; font-size: calc(var(--mm) * 3); }
.ql-panel h2 { font: 600 calc(var(--mm) * 6.4)/1.15 var(--display); margin: 0; text-wrap: balance; letter-spacing: -.01em; color: var(--ink); }
.ql-panel h3 { font: 600 calc(var(--mm) * 3.9)/1.25 var(--display); margin: 0; color: var(--ink); }
.ql-panel p { margin: 0; }
.ql-panel ul, .ql-panel ol { margin: 0; padding-inline-start: 1.15em; display: grid; gap: calc(var(--mm) * 1.6); }
.ql-panel li::marker { color: var(--blue); font-weight: 600; }
.ql-addr { font-family: var(--mono); font-size: .92em; background: var(--blue-wash); color: var(--ink); padding: .05em .35em; border-radius: .3em; white-space: nowrap; direction: ltr; unicode-bidi: isolate; }
.ql-soft { color: var(--ink-soft); }
.ql-box { border-radius: calc(var(--mm) * 2.5); padding: calc(var(--mm) * 4) calc(var(--mm) * 4.5); display: grid; gap: calc(var(--mm) * 2); }
.ql-blue { background: var(--blue-wash); }
.ql-green { background: var(--green-wash); }
.ql-green .ql-kicker { color: var(--green); }
.ql-end { margin-top: auto; }
.ql-contacts { margin: 0; display: grid; grid-template-columns: auto 1fr; column-gap: calc(var(--mm) * 3); row-gap: calc(var(--mm) * 1.6); align-items: baseline; }
.ql-contacts dt { color: var(--ink-soft); }
.ql-contacts dd { margin: 0; font-family: var(--mono); font-size: .84em; min-width: 0; overflow-wrap: anywhere; direction: ltr; text-align: start; unicode-bidi: isolate; }
.ql-app-qr { display: flex; align-items: center; gap: calc(var(--mm) * 4); }
.ql-app-qr svg { flex: none; width: calc(var(--mm) * 22); height: calc(var(--mm) * 22); }
.ql-app-qr p { font-size: .9em; color: var(--ink-soft); }
.ql-app-qr b { display: block; color: var(--ink); font-weight: 600; }
.ql-stamp { margin-top: auto; border: 1px dashed var(--rule); border-radius: calc(var(--mm) * 2.5); min-height: calc(var(--mm) * 30); padding: calc(var(--mm) * 3) calc(var(--mm) * 4); color: var(--ink-soft); font-size: .85em; }
.ql-foot { margin-top: auto; font-size: .82em; color: var(--ink-soft); }

.ql-step-head { display: flex; align-items: center; gap: calc(var(--mm) * 3.5); }
.ql-step-no { flex: none; width: calc(var(--mm) * 11); height: calc(var(--mm) * 11); border-radius: 50%; background: var(--blue); color: #fff; display: grid; place-items: center; font: 700 calc(var(--mm) * 5.4) var(--display); }
.ql-art { margin-top: auto; height: calc(var(--mm) * 44); border-radius: calc(var(--mm) * 3); background: var(--blue-wash); display: grid; place-items: center; }
.ql-art svg { width: 78%; height: 78%; }

.ql-cover { background: linear-gradient(165deg, #f4f9ff 0%, #e3effc 62%, #d6eacd 100%); }
.ql-brand { display: flex; align-items: center; gap: calc(var(--mm) * 3); font: 700 calc(var(--mm) * 6) var(--display); letter-spacing: -.01em; direction: ltr; }
.ql-brand img { width: calc(var(--mm) * 13); height: auto; }
.ql-cover h2 { font-size: calc(var(--mm) * 10.5); line-height: 1.05; margin-top: calc(var(--mm) * 14); }
.ql-lede { font-size: calc(var(--mm) * 3.9); color: var(--ink-soft); }
.ql-qr { margin-top: auto; display: flex; align-items: flex-end; gap: calc(var(--mm) * 4); }
.ql-qr svg { flex: none; width: calc(var(--mm) * 27); height: calc(var(--mm) * 27); background: #fff; padding: calc(var(--mm) * 2); border-radius: calc(var(--mm) * 1.5); }
.ql-qr p { font-size: .9em; }
.ql-qr b { display: block; font-family: var(--mono); font-weight: 500; color: var(--ink); }

@media print {
  .ql { gap: 0; }
  .ql-side-label { display: none; }
  .ql-sheet { width: 297mm; height: 210mm; aspect-ratio: auto; box-shadow: none; break-after: page; }
  .ql-cover, .ql-box, .ql-addr, .ql-step-no, .ql-art { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
</style>
