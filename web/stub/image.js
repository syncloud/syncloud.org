const RELEASE_URL = 'https://github.com/syncloud/image/releases/download/%v/syncloud-%b-%v.%f.xz'

const BOARD = /^[a-z0-9]([a-z0-9-]{0,30}[a-z0-9])?$/
const VERSION = /^[0-9]{2}\.[0-9]{2}\.[0-9]{2}$/
const FORMATS = ['img', 'vdi']

export function imageStub () {
  return {
    name: 'image-stub',
    configureServer (server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url, 'http://localhost')
        const match = url.pathname.match(/^\/image\/([^/]+)$/)
        if (!match) {
          return next()
        }
        const board = decodeURIComponent(match[1])
        const version = url.searchParams.get('version') || ''
        const format = url.searchParams.get('format') || 'img'
        const source = url.searchParams.get('gclid') ? 'ad' : 'direct'

        if (!BOARD.test(board) || !VERSION.test(version) || !FORMATS.includes(format)) {
          res.statusCode = 404
          res.end('unknown image')
          return
        }

        const target = RELEASE_URL
          .replaceAll('%v', version)
          .replace('%b', board)
          .replace('%f', format)
        console.log(`[image-stub] ${board} ${format} source=${source} -> ${target}`)
        res.statusCode = 302
        res.setHeader('location', target)
        res.end()
      })
    }
  }
}
