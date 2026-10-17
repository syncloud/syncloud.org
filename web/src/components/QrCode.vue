<template>
  <svg
    :viewBox="`0 0 ${size} ${size}`"
    role="img"
    :aria-label="value"
    shape-rendering="crispEdges"
  >
    <path
      fill="#17263a"
      :d="path"
    />
  </svg>
</template>

<script>
import QRCode from 'qrcode'

export default {
  name: 'QrCode',
  props: {
    value: { type: String, required: true }
  },
  computed: {
    modules () {
      return QRCode.create(this.value, { errorCorrectionLevel: 'M' }).modules
    },
    size () {
      return this.modules.size
    },
    path () {
      const cells = []
      for (let row = 0; row < this.size; row++) {
        for (let col = 0; col < this.size; col++) {
          if (this.modules.get(row, col)) {
            cells.push(`M${col} ${row}h1v1h-1z`)
          }
        }
      }
      return cells.join('')
    }
  }
}
</script>
