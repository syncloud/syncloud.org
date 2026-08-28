const RELEASE_URL = 'https://github.com/syncloud/image/releases/download/%v/syncloud-%b-%v.%f.xz'

const VERSION = '26.07.01'
const IMAGES = [
  { board: 'raspberrypi-64', format: 'img' },
  { board: 'raspberrypi', format: 'img' },
  { board: 'amd64', format: 'img' },
  { board: 'amd64', format: 'vdi' },
  { board: 'odroid-hc4', format: 'img' },
  { board: 'helios4', format: 'img' },
  { board: 'rock64', format: 'img' }
]

const BOARD = /^[a-z0-9]([a-z0-9-]{0,30}[a-z0-9])?$/
const RELEASE_VERSION = /^[0-9]{2}\.[0-9]{2}\.[0-9]{2}$/
const FORMATS = ['img', 'vdi']

export function apiStub () {
  return {
    name: 'api-stub',
    configureServer (server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url, 'http://localhost')

        if (url.pathname === '/api/releases') {
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify({ version: VERSION, images: IMAGES }))
          return
        }

        const match = url.pathname.match(/^\/api\/image\/([^/]+)$/)
        if (!match) {
          return next()
        }
        const board = decodeURIComponent(match[1])
        const version = url.searchParams.get('version') || ''
        const format = url.searchParams.get('format') || 'img'
        const source = url.searchParams.get('gclid') ? 'ad' : 'direct'

        if (!BOARD.test(board) || !RELEASE_VERSION.test(version) || !FORMATS.includes(format)) {
          res.statusCode = 404
          res.end('unknown image')
          return
        }

        const target = RELEASE_URL
          .replaceAll('%v', version)
          .replace('%b', board)
          .replace('%f', format)
        console.log(`[api-stub] ${board} ${format} source=${source} -> ${target}`)
        res.statusCode = 302
        res.setHeader('location', target)
        res.end()
      })
    }
  }
}
