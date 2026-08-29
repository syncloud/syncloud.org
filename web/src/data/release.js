export async function fetchCatalog () {
  const response = await fetch('/api/releases')
  if (!response.ok) {
    throw new Error(`releases returned ${response.status}`)
  }
  return response.json()
}

export function downloadUrl (entry, gclid) {
  return gclid ? `${entry.url}&gclid=${encodeURIComponent(gclid)}` : entry.url
}
