export const DEFAULT_LANGUAGE = 'de'
export const DEFAULT_VARIANT = 'cloud'

const COPY = {
  de: {
    cta: 'Kostenlos starten',
    price: 'Erster Monat kostenlos, danach £5 pro Monat. Jederzeit kündbar.',
    shotAlt: 'Syncloud App-Store mit Apps zum Installieren per Klick',
    points: [
      'Über 40 Apps per Klick installieren – Nextcloud, Jellyfin, Bitwarden, Home Assistant und mehr',
      'HTTPS, Anmeldung und Updates werden automatisch eingerichtet',
      'Läuft auf Raspberry Pi, Odroid oder jedem älteren PC',
      'Keine Kommandozeile nötig'
    ],
    trust: 'Open Source. Ihre Daten bleiben auf Ihrer eigenen Hardware.',
    variants: {
      cloud: {
        title: 'Die einfache Alternative zu Google Drive und Dropbox',
        subtitle: 'Dateien, Fotos und Passwörter auf Ihrer eigenen Hardware zuhause – ohne Server-Kenntnisse und ohne monatliche Gebühren an große Anbieter.'
      },
      pi: {
        title: 'Machen Sie Ihren Raspberry Pi zur privaten Cloud',
        subtitle: 'Image aufspielen, einstecken, fertig. Nextcloud, Fotos und Passwort-Manager installieren Sie danach per Klick.'
      }
    }
  }
}

export function landingCopy (variant, language = DEFAULT_LANGUAGE) {
  const copy = COPY[language] || COPY[DEFAULT_LANGUAGE]
  const chosen = copy.variants[variant] || copy.variants[DEFAULT_VARIANT]
  return {
    title: chosen.title,
    subtitle: chosen.subtitle,
    cta: copy.cta,
    price: copy.price,
    shotAlt: copy.shotAlt,
    points: copy.points,
    trust: copy.trust
  }
}
