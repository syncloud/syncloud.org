// the only thing curated here is which images lead and what to call them,
// everything else is whatever the latest release actually shipped
export const PICKS = [
  { board: 'raspberrypi-64', format: 'img', name: 'Raspberry Pi' },
  { board: 'amd64', format: 'img', name: 'PC' },
  { board: 'amd64', format: 'vdi', name: 'VirtualBox' }
]

function same (a, b) {
  return a.board === b.board && a.format === b.format
}

export function picked (images) {
  return PICKS
    .filter(pick => images.some(image => same(image, pick)))
    .map(pick => ({ ...pick }))
}

export function rest (images) {
  return images
    .filter(image => !PICKS.some(pick => same(image, pick)))
    .map(image => ({
      ...image,
      name: image.board,
      note: image.format === 'img' ? '' : image.format
    }))
}

export function imageName (entry, version) {
  return `syncloud-${entry.board}-${version}.${entry.format}.xz`
}

export function downloadUrl (entry, version, gclid) {
  const url = new URL(`/api/image/${entry.board}`, window.location.origin)
  url.searchParams.set('version', version)
  if (entry.format !== 'img') {
    url.searchParams.set('format', entry.format)
  }
  if (gclid) {
    url.searchParams.set('gclid', gclid)
  }
  return url.toString()
}

export async function fetchRelease () {
  const response = await fetch('/api/releases')
  if (!response.ok) {
    throw new Error(`releases returned ${response.status}`)
  }
  return response.json()
}
