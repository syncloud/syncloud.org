import { describe, it, expect } from 'vitest'
import { SUPPORTED_LOCALES } from '../src/i18n'
import en from '../src/locales/en.json'

function keys (obj, prefix = '') {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' ? keys(v, prefix + k + '.') : [prefix + k]
  )
}

describe('locales', () => {
  const enKeys = keys(en).sort()

  it('en has the expected top-level namespaces', () => {
    expect(Object.keys(en)).toEqual(
      expect.arrayContaining(['nav', 'index', 'setup', 'hardware', 'faq', 'privacy'])
    )
  })

  for (const { code } of SUPPORTED_LOCALES) {
    it(`${code} has the same keys as en`, async () => {
      const mod = await import(`../src/locales/${code}.json`)
      expect(keys(mod.default).sort()).toEqual(enKeys)
    })
  }
})
