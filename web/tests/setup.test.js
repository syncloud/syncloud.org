import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import en from '../src/locales/en.json'
import Setup from '../src/views/Setup.vue'
import { POPULAR, OTHERS, IMAGE_VERSION } from '../src/data/images'

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } })
const RouterLinkStub = { template: '<a><slot /></a>' }

function render () {
  return mount(Setup, {
    global: { plugins: [i18n], stubs: { RouterLink: RouterLinkStub, 'i18n-t': true } }
  })
}

describe('setup flow', () => {
  beforeEach(() => window.localStorage.clear())

  it('shows only the fork until a path is picked', () => {
    const wrapper = render()
    expect(wrapper.find('[data-testid="path-build"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="path-buy"]').exists()).toBe(true)
    for (const step of ['step-write', 'step-boot', 'step-activate', 'step-after', 'step-order']) {
      expect(wrapper.find(`[data-testid="setup-${step}"]`).exists(), step).toBe(false)
    }
  })

  it('buying skips the image steps entirely', async () => {
    const wrapper = render()
    await wrapper.find('[data-testid="path-buy"]').trigger('click')
    expect(wrapper.find('[data-testid="setup-step-order"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="setup-step-activate"]').exists()).toBe(true)
    for (const step of ['step-write', 'step-boot']) {
      expect(wrapper.find(`[data-testid="setup-${step}"]`).exists(), step).toBe(false)
    }
  })

  it('waits for a device, then shows the whole build at once', async () => {
    const wrapper = render()
    await wrapper.find('[data-testid="path-build"]').trigger('click')
    expect(wrapper.find('[data-testid="board-raspberrypi-64"]').exists()).toBe(true)
    for (const step of ['step-write', 'step-boot', 'step-activate', 'step-after']) {
      expect(wrapper.find(`[data-testid="setup-${step}"]`).exists(), step).toBe(false)
    }

    await wrapper.find('[data-testid="board-raspberrypi-64"]').trigger('click')
    for (const step of ['step-write', 'step-boot', 'step-activate', 'step-after']) {
      expect(wrapper.find(`[data-testid="setup-${step}"]`).exists(), step).toBe(true)
    }
    expect(wrapper.find('[data-testid="setup-step-order"]').exists()).toBe(false)
  })

  it('starts the build over when the path changes', async () => {
    const wrapper = render()
    await wrapper.find('[data-testid="path-build"]').trigger('click')
    await wrapper.find('[data-testid="board-raspberrypi-64"]').trigger('click')
    await wrapper.find('[data-testid="path-buy"]').trigger('click')
    await wrapper.find('[data-testid="path-build"]').trigger('click')
    expect(wrapper.find('[data-testid="setup-step-write"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="setup-step-boot"]').exists()).toBe(false)
  })

  it('shows the steps each path actually has', async () => {
    const wrapper = render()
    await wrapper.find('[data-testid="path-buy"]').trigger('click')
    expect(wrapper.findAll('.sc-step')).toHaveLength(4)
    await wrapper.find('[data-testid="path-build"]').trigger('click')
    await wrapper.find('[data-testid="board-raspberrypi-64"]').trigger('click')
    expect(wrapper.findAll('.sc-step')).toHaveLength(6)
  })

  it('does not number the steps', async () => {
    const wrapper = render()
    await wrapper.find('[data-testid="path-build"]').trigger('click')
    await wrapper.find('[data-testid="board-raspberrypi-64"]').trigger('click')
    for (const h of wrapper.findAll('.sc-step')) {
      expect(h.text(), h.text()).not.toMatch(/^\d+\./)
    }
  })

  it('offers the chosen board its own image', async () => {
    const wrapper = render()
    await wrapper.find('[data-testid="path-build"]').trigger('click')
    await wrapper.find('[data-testid="board-raspberrypi-64"]').trigger('click')
    const link = wrapper.find('[data-testid="setup-download-link"]')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toContain('/api/image/raspberrypi-64')
    expect(link.attributes('href')).toContain(`version=${IMAGE_VERSION}`)
    expect(link.attributes('href')).not.toContain('github.com')
  })

  it('keeps the vdi format distinct from the plain amd64 image', async () => {
    const wrapper = render()
    await wrapper.find('[data-testid="path-build"]').trigger('click')
    await wrapper.find('[data-testid="board-amd64-vdi"]').trigger('click')
    expect(wrapper.find('[data-testid="setup-download-link"]').attributes('href')).toContain('format=vdi')
    await wrapper.find('[data-testid="board-amd64"]').trigger('click')
    expect(wrapper.find('[data-testid="setup-download-link"]').attributes('href')).not.toContain('format=')
  })

  it('hides the long tail until asked', async () => {
    const wrapper = render()
    await wrapper.find('[data-testid="path-build"]').trigger('click')
    expect(wrapper.find('[data-testid="board-others"]').exists()).toBe(false)
    await wrapper.find('[data-testid="board-toggle-others"]').trigger('click')
    expect(wrapper.find('[data-testid="board-helios4"]').exists()).toBe(true)
  })

  it('carries a stored click id into the download', async () => {
    window.localStorage.setItem('syncloud.gclid',
      JSON.stringify({ gclid: 'TESTGCLID', at: Date.now() }))
    const wrapper = render()
    await wrapper.find('[data-testid="path-build"]').trigger('click')
    await wrapper.find('[data-testid="board-raspberrypi-64"]').trigger('click')
    expect(wrapper.find('[data-testid="setup-download-link"]').attributes('href')).toContain('gclid=TESTGCLID')
  })

  it('sends nobody to the wiki to finish', async () => {
    const wrapper = render()
    await wrapper.find('[data-testid="path-build"]').trigger('click')
    await wrapper.find('[data-testid="board-raspberrypi-64"]').trigger('click')
    const html = wrapper.html()
    expect(html).not.toContain('github.com/syncloud/platform/wiki')
  })

  it('covers every board the wiki listed', () => {
    expect(POPULAR.length + OTHERS.length).toBeGreaterThanOrEqual(24)
  })
})
