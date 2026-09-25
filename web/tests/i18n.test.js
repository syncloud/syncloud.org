import { readFileSync } from 'node:fs'
import { describe, it, expect } from 'vitest'
import i18n, { SUPPORTED_LOCALES, applyLocale } from '../src/i18n'
import { LANDING_MESSAGES, LANGUAGES, landingCopy } from '../src/landing'
import en from '../src/locales/en.json'

function read (relative) {
  return readFileSync(new URL(relative, import.meta.url), 'utf8')
}

function keys (obj, prefix = '') {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' ? keys(v, prefix + k + '.') : [prefix + k]
  )
}

describe('locales', () => {
  const enKeys = keys(en).sort()

  it('en has the expected top-level namespaces', () => {
    expect(Object.keys(en)).toEqual(
      expect.arrayContaining(['nav', 'index', 'setup', 'download', 'faq', 'privacy'])
    )
  })

  for (const { code } of SUPPORTED_LOCALES) {
    it(`${code} has the same keys as en`, async () => {
      const mod = await import(`../src/locales/${code}.json`)
      expect(keys(mod.default).sort()).toEqual(enKeys)
    })
  }
})

describe('the language allow list', () => {
  it('matches the list the backend will accept as a metric label', () => {
    const go = read('../../backend/config/config.go')
    const block = go.match(/Languages: \[\]string\{([^}]*)\}/)
    expect(block, 'backend/config/config.go must configure Languages').not.toBeNull()
    const configured = [...block[1].matchAll(/"([^"]+)"/g)].map(match => match[1])
    expect(configured.sort()).toEqual(SUPPORTED_LOCALES.map(l => l.code).sort())
  })

  it('never lets a locale code collide with the fallback labels', () => {
    for (const { code } of SUPPORTED_LOCALES) {
      expect(code, code).not.toBe('none')
      expect(code, code).not.toBe('other')
    }
  })
})

describe('landing copy', () => {
  it('is served out of the same message tree as the rest of the site', async () => {
    for (const language of LANGUAGES) {
      await applyLocale(language)
      expect(i18n.global.t('landing.cta'), language)
        .toBe(landingCopy('cloud', language).cta)
      expect(i18n.global.t('landing.variants.cloud.title'), language)
        .toBe(landingCopy('cloud', language).title)
    }
    await applyLocale('en')
  })

  it('lives in the locale files rather than in a module of its own', () => {
    for (const language of LANGUAGES) {
      expect(LANDING_MESSAGES[language], language)
        .toEqual(JSON.parse(read(`../src/locales/landing/${language}.json`)))
    }
    expect(LANGUAGES.sort()).toEqual(['de', 'en'])
  })
})
