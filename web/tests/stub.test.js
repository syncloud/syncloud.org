import { describe, it, expect } from 'vitest'
import { imageStub } from '../stub/image'

function middleware () {
  let handler
  imageStub().configureServer({ middlewares: { use: (fn) => { handler = fn } } })
  return handler
}

function request (url) {
  const res = { statusCode: 200, headers: {}, ended: false,
    setHeader (k, v) { this.headers[k] = v }, end () { this.ended = true } }
  let passed = false
  middleware()({ url }, res, () => { passed = true })
  return { res, passed }
}

describe('image dev stub', () => {
  it('mirrors the backend redirect', () => {
    const { res } = request('/image/raspberrypi-64?version=26.07.01')
    expect(res.statusCode).toBe(302)
    expect(res.headers.location).toBe(
      'https://github.com/syncloud/image/releases/download/26.07.01/syncloud-raspberrypi-64-26.07.01.img.xz')
  })

  it('serves the vdi format', () => {
    const { res } = request('/image/amd64?version=26.07.01&format=vdi')
    expect(res.headers.location).toContain('syncloud-amd64-26.07.01.vdi.xz')
  })

  it('rejects what the backend rejects', () => {
    for (const url of [
      '/image/amd64?version=latest',
      '/image/amd64?version=26.6.1',
      '/image/amd64',
      '/image/amd64?version=26.07.01&format=exe',
      '/image/Raspberry?version=26.07.01',
      '/image/pi_64?version=26.07.01'
    ]) {
      expect(request(url).res.statusCode, url).toBe(404)
    }
  })

  it('never redirects off github', () => {
    const { res } = request('/image/amd64?version=26.07.01&url=https://evil.example.com')
    expect(res.headers.location).toMatch(/^https:\/\/github\.com\/syncloud\/image\//)
  })

  it('leaves every other path to vite', () => {
    for (const url of ['/', '/download', '/image', '/image/a/b', '/setup']) {
      expect(request(url).passed, url).toBe(true)
    }
  })
})
