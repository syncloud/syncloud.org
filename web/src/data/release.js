export async function fetchCatalog () {
  const response = await fetch('/api/releases')
  if (!response.ok) {
    throw new Error(`releases returned ${response.status}`)
  }
  return response.json()
}

export function downloadUrl (entry, gclid, landing, language) {
  let url = entry.url
  if (gclid) {
    url += `&gclid=${encodeURIComponent(gclid)}`
  }
  if (landing) {
    url += `&landing=${encodeURIComponent(landing)}`
  }
  if (language) {
    url += `&language=${encodeURIComponent(language)}`
  }
  return url
}
