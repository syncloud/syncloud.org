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
      <div class="sc-container sc-grid sc-grid-2">
        <div class="sc-card sc-feature">
          <h3>1. {{ $t('setup.step1_title') }}</h3>
          <i18n-t
            keypath="setup.step1_desc"
            tag="p"
            scope="global"
          >
            <template #check>
              <a href="https://github.com/syncloud/platform/wiki/Things-to-know-before-buying-a-device">{{ $t('setup.step1_check') }}</a>
            </template>
          </i18n-t>
          <p style="margin-top:16px; display:flex; gap:12px; flex-wrap:wrap">
            <a
              class="sc-btn sc-btn-primary"
              href="https://shop.syncloud.org"
            >{{ $t('setup.buy_it') }}</a>
            <a
              class="sc-btn sc-btn-ghost"
              href="https://github.com/syncloud/platform/wiki"
            >{{ $t('setup.or') }} {{ $t('setup.build_yourself') }}</a>
          </p>
        </div>

        <div class="sc-card sc-feature">
          <h3>2. {{ $t('setup.step2_title') }}</h3>
          <p>{{ $t('setup.step2_desc') }}</p>
        </div>

        <div class="sc-card sc-feature">
          <h3>3. {{ $t('setup.step3_title') }}</h3>
          <i18n-t
            keypath="setup.step3_desc"
            tag="p"
            scope="global"
          >
            <template #video>
              <a href="https://youtu.be/xI_I8yNOzNE">{{ $t('setup.step3_video') }}</a>
            </template>
            <template #here>
              <a href="https://github.com/syncloud/platform/wiki/Device-activation">{{ $t('setup.step3_here') }}</a>
            </template>
          </i18n-t>
        </div>

        <div class="sc-card sc-feature">
          <h3>4. {{ $t('setup.step4_title') }}</h3>
          <p>{{ $t('setup.step4_desc') }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'SetupView'
}
</script>
