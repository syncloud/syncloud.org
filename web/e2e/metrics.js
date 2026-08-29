const METRICS_URL = process.env.PLAYWRIGHT_METRICS_URL || 'http://site.syncloud.test:9101/metrics'

export async function downloadCount (request, { board, format = 'img', source = 'direct' }) {
  const response = await request.get(METRICS_URL)
  const body = await response.text()
  const wanted = `site_image_download_total{board="${board}",format="${format}",source="${source}"}`
  for (const line of body.split('\n')) {
    if (line.startsWith(wanted)) {
      return Number(line.slice(wanted.length).trim())
    }
  }
  return 0
}
