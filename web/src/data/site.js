import { reactive } from 'vue'

export const site = reactive({ account: '' })

export async function loadSite () {
  const response = await fetch('/api/config')
  if (!response.ok) {
    throw new Error(`config returned ${response.status}`)
  }
  const config = await response.json()
  site.account = config.account
}
