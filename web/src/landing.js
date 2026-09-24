import de from './locales/landing/de.json' with { type: 'json' }
import en from './locales/landing/en.json' with { type: 'json' }

export const DEFAULT_LANGUAGE = 'en'
export const DEFAULT_VARIANT = 'cloud'

export const LANDING_MESSAGES = { de, en }

export const LANGUAGES = Object.keys(LANDING_MESSAGES)

export function landingCopy (variant, language = DEFAULT_LANGUAGE) {
  const copy = LANDING_MESSAGES[language] || LANDING_MESSAGES[DEFAULT_LANGUAGE]
  const chosen = copy.variants[variant] || copy.variants[DEFAULT_VARIANT]
  return {
    metaTitle: chosen.metaTitle,
    title: chosen.title,
    subtitle: chosen.subtitle,
    cta: copy.cta,
    price: copy.price,
    shotAlt: copy.shotAlt,
    points: chosen.points || copy.points,
    shots: chosen.shots || [],
    trust: chosen.trust || copy.trust,
    link: chosen.link || null
  }
}
