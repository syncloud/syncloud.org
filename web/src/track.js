import { storedGclid } from './attribution'

export function track (event) {
  const body = JSON.stringify({ event, gclid: storedGclid() != null })
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/event', new Blob([body], { type: 'application/json' }))
    return
  }
  fetch('/api/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true
  }).catch(() => {})
}
