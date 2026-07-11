<template>
  <div>
    <section
      class="sc-hero"
      style="padding-bottom:20px"
    >
      <div class="sc-container">
        <h1>{{ $t('hardware.heading') }}</h1>
        <p>{{ $t('hardware.subtitle') }}</p>
      </div>
    </section>

    <section
      class="sc-section"
      style="padding-top:20px"
    >
      <div class="sc-container">
        <p
          class="sc-prose"
          style="max-width:820px; margin:0 auto 36px; text-align:center"
        >
          {{ $t('hardware.description') }}
        </p>
        <div class="sc-grid sc-grid-3">
          <div
            v-for="board in boards"
            :key="board.name"
            class="sc-card"
          >
            <img
              v-if="board.img"
              :src="board.img"
              :alt="board.name"
              loading="lazy"
              width="300"
              height="225"
              style="border-radius:12px; margin-bottom:12px; width:100%; height:auto"
            >
            <h3 style="margin:0 0 10px">
              <a
                v-if="board.url"
                :href="board.url"
              >{{ board.name }}</a>
              <template v-else>
                {{ board.name }}
              </template>
            </h3>
            <p style="margin:0; color:var(--sc-muted)">
              <strong>{{ $t('hardware.cores') }}:</strong> {{ board.cores }}
            </p>
            <p style="margin:4px 0 0; color:var(--sc-muted)">
              <strong>{{ $t('hardware.memory') }}:</strong> {{ board.ram }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HardwareView',
  data () {
    return {
      boards: [
        { name: 'Banana Pi M1', img: '/images/hard_bananapim1.webp', cores: '2 / 1 GHz', ram: '1 GB' },
        { name: 'Banana Pi M1+', img: '/images/hard_bananapim1+.webp', cores: '2 / 1 GHz', ram: '1 GB' },
        { name: 'Banana Pi M2', img: '/images/hard_bananapim2.webp', cores: '4 / 1 GHz', ram: '1 GB' },
        { name: 'Cubieboard', img: '/images/hard_cubieboard.webp', cores: '1 / 1 GHz', ram: '1 GB' },
        { name: 'Cubieboard 2', img: '/images/hard_cubieboard2.webp', cores: '2 / 1 GHz', ram: '2 GB' },
        { name: 'Cubietruck', img: '/images/hard_cubietruck.webp', cores: '2 / 1 GHz', ram: '2 GB' },
        { name: 'BeagleBone Black', img: '/images/hard_beagleboneblack.webp', cores: '1 / 1 GHz', ram: '512 MB' },
        { name: 'Raspberry Pi 2 (B)', img: '/images/hard_raspberrypi2.webp', cores: '4 / 0.9 GHz', ram: '1 GB' },
        { name: 'Raspberry Pi 3 (B)', img: '/images/hard_raspberrypi3.webp', cores: '4 / 1.2 GHz', ram: '1 GB' },
        { name: 'ODROID-C2', img: '/images/hard_odroidc2.webp', cores: '4 / 2 GHz', ram: '2 GB' },
        { name: 'ODROID-XU3', img: '/images/hard_odroidxu3.webp', cores: '8 / 1.3 - 1.9 GHz', ram: '2 GB' },
        { name: 'ODROID-XU4', img: '/images/hard_odroidxu4.webp', cores: '8 / 1.3 - 1.9 GHz', ram: '2 GB' },
        { name: 'ODROID-HC1/2', img: '/images/hard_odroid_hc1.webp', cores: '8 / 2 GHz', ram: '2 GB' },
        { name: 'Helios4', img: '/images/hard_helios4.webp', url: 'http://kobol.io/helios4', cores: '2 / 1.6 GHz', ram: '2 GB' }
      ]
    }
  }
}
</script>
