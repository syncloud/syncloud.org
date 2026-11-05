import { storedGclid, storedLanding } from './attribution'
import { locale } from './i18n'

export function track (event, detail) {
  try {
    const step = {
      event,
      gclid: storedGclid() != null,
      landing: storedLanding(),
      language: locale()
    }
    if (detail) {
      step.detail = detail
    }
    const body = JSON.stringify(step)
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
  } catch {
    return
  }
}
