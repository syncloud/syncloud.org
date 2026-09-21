import { landingVariants } from './router/routes.js'

const MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000

const GCLID = { key: 'syncloud.gclid', field: 'gclid' }
const LANDING = { key: 'syncloud.landing', field: 'landing' }

export const NO_LANDING = 'none'

function remember (slot, value) {
  const record = { at: Date.now() }
  record[slot.field] = value
  try {
    window.localStorage.setItem(slot.key, JSON.stringify(record))
    return true
  } catch {
    return false
  }
}

function recall (slot) {
  let record
  try {
    record = JSON.parse(window.localStorage.getItem(slot.key))
  } catch {
    return null
  }
  if (!record || !record[slot.field] || !record.at) {
    return null
  }
  if (Date.now() - record.at > MAX_AGE_MS) {
    return null
  }
  return record[slot.field]
}

export function captureGclid (search) {
  const query = search === undefined ? window.location.search : search
  const gclid = new URLSearchParams(query).get('gclid')
  if (!gclid) {
    return
  }
  remember(GCLID, gclid)
}

export function storedGclid () {
  return recall(GCLID)
}

export function captureLanding (variant) {
  if (!landingVariants().includes(variant)) {
    return
  }
  remember(LANDING, variant)
}

export function storedLanding () {
  return recall(LANDING) || NO_LANDING
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
