import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import en from '../src/locales/en.json'
import Setup from '../src/views/Setup.vue'

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } })
const RouterLinkStub = { template: '<a><slot /></a>' }

const VERSION = '26.07.01'
const IMAGES = [
  { board: 'raspberrypi-64', format: 'img' },
  { board: 'amd64', format: 'img' },
  { board: 'amd64', format: 'vdi' },
  { board: 'helios4', format: 'img' },
  { board: 'odroid-n2', format: 'img' }
]

function releaseOk () {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ version: VERSION, images: IMAGES })
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

  it('leads with our picks and hides the rest of the release', async () => {
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

  it('names the image from the release rather than a hardcoded version', async () => {
    const wrapper = await render()
    await wrapper.find('[data-testid="path-build"]').trigger('click')
    await wrapper.find('[data-testid="board-raspberrypi-64"]').trigger('click')
    const link = wrapper.find('[data-testid="setup-download-link"]')
    expect(link.text()).toBe(`syncloud-raspberrypi-64-${VERSION}.img.xz`)
    expect(link.attributes('href')).toContain('/api/image/raspberrypi-64')
    expect(link.attributes('href')).toContain(`version=${VERSION}`)
    expect(link.attributes('href')).not.toContain('github.com')
  })

  it('keeps the vdi format distinct from the plain amd64 image', async () => {
    const wrapper = await render()
    await wrapper.find('[data-testid="path-build"]').trigger('click')
    await wrapper.find('[data-testid="board-amd64-vdi"]').trigger('click')
    expect(wrapper.find('[data-testid="setup-download-link"]').attributes('href')).toContain('format=vdi')
    await wrapper.find('[data-testid="board-amd64"]').trigger('click')
    expect(wrapper.find('[data-testid="setup-download-link"]').attributes('href')).not.toContain('format=')
  })

  it('carries a stored click id into the download', async () => {
    window.localStorage.setItem('syncloud.gclid',
      JSON.stringify({ gclid: 'TESTGCLID', at: Date.now() }))
    const wrapper = await render()
    await wrapper.find('[data-testid="path-build"]').trigger('click')
    await wrapper.find('[data-testid="board-raspberrypi-64"]').trigger('click')
    expect(wrapper.find('[data-testid="setup-download-link"]').attributes('href')).toContain('gclid=TESTGCLID')
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

  it('does not number the steps', async () => {
    const wrapper = await render()
    await wrapper.find('[data-testid="path-build"]').trigger('click')
    await wrapper.find('[data-testid="board-raspberrypi-64"]').trigger('click')
    for (const h of wrapper.findAll('.sc-step')) {
      expect(h.text(), h.text()).not.toMatch(/^\d+\./)
    }
  })
})
