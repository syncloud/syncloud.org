export const IMAGE_VERSION = '26.07.01'

export const POPULAR = [
  { board: 'raspberrypi-64', name: 'Raspberry Pi', note: '' },
  { board: 'amd64', name: 'PC', note: '' },
  { board: 'amd64', name: 'VirtualBox', note: '', format: 'vdi' }
]

export const OTHERS = [
  { board: 'raspberrypi', name: 'Raspberry Pi 2 / 3 / 4', note: 'older 32-bit build' },
  { board: 'raspberrypi2', name: 'Raspberry Pi 2', note: '' },
  { board: 'odroid-hc4', name: 'Odroid HC4', note: '' },
  { board: 'odroid-hc4-legacy', name: 'Odroid HC4', note: 'legacy, non-LCD' },
  { board: 'odroid-xu3and4', name: 'Odroid XU3 / XU4 / HC1 / HC2', note: 'SATA' },
  { board: 'odroid-xu3and4-sd', name: 'Odroid HC1 / HC2', note: 'SD' },
  { board: 'odroid-n2', name: 'Odroid N2', note: '' },
  { board: 'odroid-c2', name: 'Odroid C2', note: '' },
  { board: 'odroid-u3', name: 'Odroid U3', note: '' },
  { board: 'bananapim1', name: 'Banana Pi M1 / M1+', note: '' },
  { board: 'bananapim2', name: 'Banana Pi M2', note: '' },
  { board: 'bananapim3', name: 'Banana Pi M3', note: '' },
  { board: 'cubieboard', name: 'Cubieboard', note: '' },
  { board: 'cubieboard2', name: 'Cubieboard 2', note: '' },
  { board: 'cubietruck', name: 'Cubietruck', note: '' },
  { board: 'beagleboneblack', name: 'BeagleBone Black', note: '' },
  { board: 'rock64', name: 'Rock64', note: '' },
  { board: 'tinker', name: 'Asus Tinker Board', note: '' },
  { board: 'helios4', name: 'Helios4', note: '' },
  { board: 'helios64', name: 'Helios64', note: '' },
  { board: 'jetson-nano', name: 'Jetson Nano', note: '' },
  { board: 'lime2', name: 'Olimex Lime2', note: '' },
  { board: 'btt-cb1', name: 'BigTreeTech CB1', note: '' }
]

export function imageName (entry) {
  return `syncloud-${entry.board}-${IMAGE_VERSION}.${entry.format || 'img'}.xz`
}

export function downloadUrl (entry, gclid) {
  const url = new URL(`/api/image/${entry.board}`, window.location.origin)
  url.searchParams.set('version', IMAGE_VERSION)
  if (entry.format) {
    url.searchParams.set('format', entry.format)
  }
  if (gclid) {
    url.searchParams.set('gclid', gclid)
  }
  return url.toString()
}
