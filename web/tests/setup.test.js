import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import en from '../src/locales/en.json'
import Setup from '../src/views/Setup.vue'

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } })
const RouterLinkStub = { template: '<a><slot /></a>' }

const VERSION = '26.07.01'

function entry (board, format, label, note) {
  return {
    board,
    format,
    label,
    note: note || '',
    name: `syncloud-${board}-${VERSION}.${format}.xz`,
    url: `/api/image/${board}?version=${VERSION}&format=${format}`
  }
}

const CATALOG = {
  version: VERSION,
  picked: [
    entry('raspberrypi-64', 'img', 'Raspberry Pi'),
    entry('amd64', 'img', 'PC'),
    entry('amd64', 'vdi', 'VirtualBox', 'vdi')
  ],
  others: [
    entry('helios4', 'img', 'helios4'),
    entry('odroid-n2', 'img', 'odroid-n2')
  ]
}

function releaseOk () {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => CATALOG
  })
}

async function render () {
  const wrapper = mount(Setup, {
    global: { plugins: [i18n], stubs: { RouterLink: RouterLinkStub, 'i18n-t': true } }
  })
  await flushPromises()
  return wrapper
}

describe('setup flow', () => {
  beforeEach(() => {
    window.localStorage.clear()
    global.fetch = releaseOk()
    global.navigator.sendBeacon = vi.fn()
  })

  it('shows only the fork until a path is picked', async () => {
    const wrapper = await render()
    expect(wrapper.find('[data-testid="path-build"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="path-buy"]').exists()).toBe(true)
    for (const step of ['step-write', 'step-boot', 'step-activate', 'step-after', 'step-order']) {
      expect(wrapper.find(`[data-testid="setup-${step}"]`).exists(), step).toBe(false)
    }
  })

  it('buying skips the image steps entirely', async () => {
    const wrapper = await render()
    await wrapper.find('[data-testid="path-buy"]').trigger('click')
    expect(wrapper.find('[data-testid="setup-step-order"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="setup-step-activate"]').exists()).toBe(true)
    for (const step of ['step-write', 'step-boot']) {
      expect(wrapper.find(`[data-testid="setup-${step}"]`).exists(), step).toBe(false)
    }
  })

  it('leads with the picks the server made and hides the rest', async () => {
    const wrapper = await render()
    await wrapper.find('[data-testid="path-build"]').trigger('click')
    expect(wrapper.find('[data-testid="board-raspberrypi-64"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="board-amd64"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="board-amd64-vdi"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="board-helios4"]').exists()).toBe(false)

    await wrapper.find('[data-testid="board-toggle-others"]').trigger('click')
    expect(wrapper.find('[data-testid="board-helios4"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="board-odroid-n2"]').exists()).toBe(true)
  })

  it('waits for a device, then shows the whole build at once', async () => {
    const wrapper = await render()
    await wrapper.find('[data-testid="path-build"]').trigger('click')
    for (const step of ['step-write', 'step-boot', 'step-activate', 'step-after']) {
      expect(wrapper.find(`[data-testid="setup-${step}"]`).exists(), step).toBe(false)
    }
    await wrapper.find('[data-testid="board-raspberrypi-64"]').trigger('click')
    for (const step of ['step-write', 'step-boot', 'step-activate', 'step-after']) {
      expect(wrapper.find(`[data-testid="setup-${step}"]`).exists(), step).toBe(true)
    }
  })

  it('shows the image name and link the server sent', async () => {
    const wrapper = await render()
    await wrapper.find('[data-testid="path-build"]').trigger('click')
    await wrapper.find('[data-testid="board-raspberrypi-64"]').trigger('click')
    const link = wrapper.find('[data-testid="setup-download-link"]')
    expect(link.text()).toBe(`syncloud-raspberrypi-64-${VERSION}.img.xz`)
    expect(link.attributes('href')).toBe(CATALOG.picked[0].url)
    expect(link.attributes('href')).not.toContain('github.com')
  })

  it('keeps the vdi format distinct from the plain amd64 image', async () => {
    const wrapper = await render()
    await wrapper.find('[data-testid="path-build"]').trigger('click')
    await wrapper.find('[data-testid="board-amd64-vdi"]').trigger('click')
    expect(wrapper.find('[data-testid="setup-download-link"]').attributes('href')).toContain('format=vdi')
    await wrapper.find('[data-testid="board-amd64"]').trigger('click')
    expect(wrapper.find('[data-testid="setup-download-link"]').attributes('href')).toContain('format=img')
  })

  it('carries a stored click id into the download', async () => {
    window.localStorage.setItem('syncloud.gclid',
      JSON.stringify({ gclid: 'TESTGCLID', at: Date.now() }))
    const wrapper = await render()
    await wrapper.find('[data-testid="path-build"]').trigger('click')
    await wrapper.find('[data-testid="board-raspberrypi-64"]').trigger('click')
    expect(wrapper.find('[data-testid="setup-download-link"]').attributes('href')).toContain('&gclid=TESTGCLID')
  })

  it('says so when the release cannot be read', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 503 })
    const wrapper = await render()
    await wrapper.find('[data-testid="path-build"]').trigger('click')
    expect(wrapper.find('[data-testid="setup-release-failed"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="board-raspberrypi-64"]').exists()).toBe(false)
  })

  it('sends nobody to the wiki to finish', async () => {
    const wrapper = await render()
    await wrapper.find('[data-testid="path-build"]').trigger('click')
    await wrapper.find('[data-testid="board-raspberrypi-64"]').trigger('click')
    expect(wrapper.html()).not.toContain('github.com/syncloud/platform/wiki')
  })

  it('names the boards it actually leads with, not ones behind the expander', async () => {
    const wrapper = await render()
    const blurb = wrapper.find('[data-testid="path-build"]').text()
    for (const entry of CATALOG.picked) {
      expect(blurb, entry.label).toContain(entry.label)
    }
    for (const entry of CATALOG.others) {
      expect(blurb, entry.label).not.toContain(entry.label)
    }
  })

  async function eventsSent () {
    const bodies = await Promise.all(
      global.navigator.sendBeacon.mock.calls.map(call => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsText(call[1])
      })))
    return bodies.map(body => JSON.parse(body).event)
  }

  it('counts a board choice once however many boards are tried', async () => {
    const wrapper = await render()
    await wrapper.find('[data-testid="path-build"]').trigger('click')

    await wrapper.find('[data-testid="board-raspberrypi-64"]').trigger('click')
    await wrapper.find('[data-testid="board-amd64"]').trigger('click')
    await wrapper.find('[data-testid="board-amd64-vdi"]').trigger('click')

    const sent = await eventsSent()
    expect(sent.filter(event => event === 'setup.board')).toHaveLength(1)
    expect(sent).toContain('setup.build')
  })

  it('sends buying to the account site, carrying any click id', async () => {
    window.localStorage.setItem('syncloud.gclid',
      JSON.stringify({ gclid: 'BUYCLICK', at: Date.now() }))
    const wrapper = await render()
    await wrapper.find('[data-testid="path-buy"]').trigger('click')

    const buy = wrapper.find('[data-testid="setup-store-link"]').attributes('href')
    expect(buy).toContain('syncloud.it/device')
    expect(buy).toContain('gclid=BUYCLICK')
    expect(buy).not.toContain('shop.syncloud.org')
  })

  it('does not number the steps', async () => {
    const wrapper = await render()
    await wrapper.find('[data-testid="path-build"]').trigger('click')
    await wrapper.find('[data-testid="board-raspberrypi-64"]').trigger('click')
    for (const h of wrapper.findAll('.sc-step')) {
      expect(h.text(), h.text()).not.toMatch(/^\d+\./)
    }
  })
})
