const RELEASE_BASE = 'https://github.com/syncloud/image/releases/download'
const VERSION = '26.07.01'

const PICKS = [
  { board: 'raspberrypi-64', format: 'img', label: 'Raspberry Pi' },
  { board: 'amd64', format: 'img', label: 'PC' },
  { board: 'amd64', format: 'vdi', label: 'VirtualBox' }
]
const BOARDS = [
  { board: 'raspberrypi-64', format: 'img' },
  { board: 'raspberrypi', format: 'img' },
  { board: 'amd64', format: 'img' },
  { board: 'amd64', format: 'vdi' },
  { board: 'odroid-hc4', format: 'img' },
  { board: 'helios4', format: 'img' },
  { board: 'rock64', format: 'img' }
]

function name (image) {
  return `syncloud-${image.board}-${VERSION}.${image.format}.xz`
}

function entry (image, label, note) {
  return {
    ...image,
    name: name(image),
    label,
    note,
    url: `/api/image/${image.board}?version=${VERSION}&format=${image.format}`
  }
}

function catalog () {
  const isPick = image => PICKS.some(p => p.board === image.board && p.format === image.format)
  return {
    version: VERSION,
    picked: PICKS
      .filter(pick => BOARDS.some(i => i.board === pick.board && i.format === pick.format))
      .map(pick => entry(pick, pick.label, '')),
    others: BOARDS
      .filter(image => !isPick(image))
      .map(image => entry(image, image.board, image.format === 'img' ? '' : image.format))
  }
}

export function apiStub () {
  return {
    name: 'api-stub',
    configureServer (server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url, 'http://localhost')

        if (url.pathname === '/api/releases') {
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify(catalog()))
          return
        }

        const match = url.pathname.match(/^\/api\/image\/([^/]+)$/)
        if (!match) {
          return next()
        }
        const board = decodeURIComponent(match[1])
        const version = url.searchParams.get('version') || ''
        const format = url.searchParams.get('format') || ''
        const source = url.searchParams.get('gclid') ? 'ad' : 'direct'

        const image = version === VERSION &&
          BOARDS.find(i => i.board === board && i.format === format)
        if (!image) {
          res.statusCode = 404
          res.end('unknown image')
          return
        }

        const target = `${RELEASE_BASE}/${VERSION}/${name(image)}`
        console.log(`[api-stub] ${board} ${format} source=${source} -> ${target}`)
        res.statusCode = 302
        res.setHeader('location', target)
        res.end()
      })
    }
  }
}
