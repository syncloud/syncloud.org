const KEY = 'syncloud.gclid'
const MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000

export function captureGclid (search) {
  const query = search === undefined ? window.location.search : search
  const gclid = new URLSearchParams(query).get('gclid')
  if (!gclid) {
    return
  }
  store(JSON.stringify({ gclid, at: Date.now() }))
}

function store (value) {
  try {
    window.localStorage.setItem(KEY, value)
    return true
  } catch {
    return false
  }
}

export function storedGclid () {
  let entry
  try {
    entry = JSON.parse(window.localStorage.getItem(KEY))
  } catch {
    return null
  }
  if (!entry || !entry.gclid || !entry.at) {
    return null
  }
  if (Date.now() - entry.at > MAX_AGE_MS) {
    return null
  }
  return entry.gclid
}

export function withGclid (url) {
  const gclid = storedGclid()
  if (!gclid) {
    return url
  }
  try {
    const parsed = new URL(url)
    parsed.searchParams.set('gclid', gclid)
    return parsed.toString()
  } catch {
    return url
  }
}
