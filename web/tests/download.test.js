import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import en from '../src/locales/en.json'
import Download from '../src/views/Download.vue'
import { POPULAR, OTHERS, IMAGE_VERSION } from '../src/data/images'

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } })
const RouterLinkStub = { template: '<a><slot /></a>' }

function render () {
  return mount(Download, {
    global: {
      plugins: [i18n],
      stubs: { RouterLink: RouterLinkStub, 'i18n-t': true }
    }
  })
}

describe('download page', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('shows the popular boards up front', () => {
    const wrapper = render()
    expect(wrapper.find('[data-testid="download-raspberrypi-64"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="download-amd64"]').exists()).toBe(true)
  })

  it('hides the long tail until asked', async () => {
    const wrapper = render()
    expect(wrapper.find('[data-testid="download-others"]').exists()).toBe(false)
    await wrapper.find('[data-testid="download-toggle-others"]').trigger('click')
    expect(wrapper.find('[data-testid="download-others"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="download-helios4"]').exists()).toBe(true)
  })

  it('links through our own endpoint, not straight to github', () => {
    const href = render().find('[data-testid="download-raspberrypi-64"]').attributes('href')
    expect(href).toContain('/image/raspberrypi-64')
    expect(href).toContain(`version=${IMAGE_VERSION}`)
    expect(href).not.toContain('github.com')
  })

  it('asks for the vdi format only for the VirtualBox entry', () => {
    const wrapper = render()
    expect(wrapper.find('[data-testid="download-amd64-vdi"]').attributes('href')).toContain('format=vdi')
    expect(wrapper.find('[data-testid="download-amd64"]').attributes('href')).not.toContain('format=')
  })

  it('carries a stored click id through to the download', () => {
    window.localStorage.setItem('syncloud.gclid',
      JSON.stringify({ gclid: 'TESTGCLID', at: Date.now() }))
    const href = render().find('[data-testid="download-raspberrypi-64"]').attributes('href')
    expect(href).toContain('gclid=TESTGCLID')
  })

  it('omits the click id when there is none', () => {
    const href = render().find('[data-testid="download-raspberrypi-64"]').attributes('href')
    expect(href).not.toContain('gclid')
  })

  it('offers every board the wiki listed', () => {
    expect(POPULAR.length + OTHERS.length).toBeGreaterThanOrEqual(24)
  })
})
