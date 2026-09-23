export const DEFAULT_LANGUAGE = 'en'
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
        metaTitle: 'Private Cloud zuhause statt Google Drive - Syncloud',
        title: 'Die einfache Alternative zu Google Drive und Dropbox',
        subtitle: 'Dateien, Fotos und Passwörter auf Ihrer eigenen Hardware zuhause – ohne Server-Kenntnisse und ohne monatliche Gebühren an große Anbieter.'
      },
      pi: {
        metaTitle: 'Raspberry Pi als private Cloud einrichten - Syncloud',
        title: 'Machen Sie Ihren Raspberry Pi zur privaten Cloud',
        subtitle: 'Image aufspielen, einstecken, fertig. Nextcloud, Fotos und Passwort-Manager installieren Sie danach per Klick.'
      },
      access: {
        metaTitle: 'Heimserver trotz DS-Lite und CGNAT erreichbar - Syncloud',
        title: 'Ihr Server läuft, ist aber von außen nicht erreichbar?',
        subtitle: 'DS-Lite, CGNAT oder eine wechselnde IP-Adresse: ohne öffentliche IP hilft auch keine Portfreigabe. Syncloud stellt die Verbindung über einen Relay her.',
        points: [
          'Erreichbar ohne Portfreigabe, auch hinter DS-Lite und CGNAT',
          'Eigene Adresse wie ihrname.syncloud.it, die IP-Wechsel automatisch nachzieht',
          'HTTPS-Zertifikat wird ausgestellt und selbstständig erneuert',
          'E-Mail-Versand über einen Relay, damit Ihre Apps nicht im Spam landen'
        ]
      }
    }
  },
  en: {
    cta: 'Start free',
    price: 'First month free, then £5 a month. Cancel anytime.',
    shotAlt: 'Syncloud app store, installing apps with one click',
    points: [
      'Install over 40 apps in one click - Nextcloud, Jellyfin, Bitwarden, Home Assistant and more',
      'HTTPS, logins and updates are handled for you',
      'Runs on a Raspberry Pi, Odroid or any old PC',
      'No command line needed'
    ],
    trust: 'Open source. Your data stays on your own hardware.',
    variants: {
      cloud: {
        metaTitle: 'Private cloud at home, a Google Drive alternative - Syncloud',
        title: 'The simple alternative to Google Drive and Dropbox',
        subtitle: 'Your files, photos and passwords on your own hardware at home. No server knowledge needed, and no monthly fees to the big providers.'
      },
      pi: {
        metaTitle: 'Turn a Raspberry Pi into a private cloud - Syncloud',
        title: 'Turn your Raspberry Pi into a private cloud',
        subtitle: 'Write the image, plug it in, done. Nextcloud, photos and a password manager install with one click afterwards.'
      },
      access: {
        metaTitle: 'Remote access to a home server behind CGNAT - Syncloud',
        title: 'Your server runs, but you cannot reach it from outside',
        subtitle: 'Behind CGNAT, DS-Lite or a changing IP there is no port to forward. Syncloud reaches your server through a relay instead.',
        points: [
          'Reachable with no port forwarding, even behind CGNAT',
          'An address like yourname.syncloud.it that follows your IP when it changes',
          'An HTTPS certificate, issued and renewed for you',
          'An alternative to Tailscale, ZeroTier or a Cloudflare tunnel, with the domain, the certificate and the relay included',
          'Outgoing mail through a relay, so your apps are not treated as spam'
        ]
      },
      password: {
        metaTitle: 'Self hosted password manager on your own server - Syncloud',
        title: 'Your password manager, on a server you own',
        subtitle: 'A complete server OS for a Raspberry Pi or an old PC you supply. Bitwarden is one of its apps, installed in one click. £5 a month, no free tier.',
        points: [
          'You supply the hardware, a Raspberry Pi or an old PC, and write a complete server OS onto it',
          'Bitwarden is one of the apps you install in one click, and the vault it stores stays on your disk',
          'An address like yourname.syncloud.it that follows your IP when it changes, reachable with no port forwarding',
          'An HTTPS certificate, issued and renewed for you, and outgoing mail through a relay',
          'Open source software on a paid service: £5 a month, not a free tier and not a cloud account'
        ]
      },
      games: {
        metaTitle: 'Run a game server on hardware you own - Syncloud',
        title: 'Run a game server on a box you own',
        subtitle: 'A complete server OS for a Raspberry Pi or an old PC you supply. Game Hub installs a server onto it in one click. Not a hosting service.',
        points: [
          'You supply the hardware, a Raspberry Pi or an old PC, and write a complete server OS onto it',
          'Game Hub is one of the apps you install in one click, and the servers it starts run on your box at home, not in a data centre',
          'The catalog lists 2 games as supported today, plus 135 marked experimental, among them a Minecraft Bedrock server',
          'Start a server, stop it and delete it yourself, with the port and the address shown to you',
          'An address like yourname.syncloud.it that follows your IP when it changes, reachable with no port forwarding',
          'Open source software on a paid service: first month free, then £5 a month, not a free tier and not a cloud account'
        ],
        trust: 'Open source. Your data stays on your own hardware. Minecraft and Minecraft Bedrock are trademarks of Mojang Studios; Syncloud is not affiliated with, endorsed by or sponsored by Mojang Studios or Microsoft.',
        shots: [
          {
            src: '/images/screenshot/games-install.webp',
            width: 720,
            height: 827,
            alt: 'The Syncloud app store downloading the Game Hub app onto a device',
            caption: 'Install Game Hub from the Syncloud app store, the same way as every other app.'
          },
          {
            src: '/images/screenshot/games-catalog.webp',
            width: 720,
            height: 1291,
            alt: 'The Game Hub catalog searched for Minecraft, with filters reading Supported 2, Experimental 135 and Disabled 177, and a Minecraft Bedrock entry tagged experimental listening on UDP 19132',
            caption: 'Pick a game from the catalog. Two are supported today. A further 135 are marked experimental, the Minecraft Bedrock server shown here among them.'
          },
          {
            src: '/images/screenshot/games-running.webp',
            width: 720,
            height: 560,
            alt: 'The Game Hub servers view showing a Minecraft Bedrock server marked running at 192.168.1.104 port 19132, with stop and delete buttons',
            caption: 'The server runs on your own box. Game Hub shows its address and port, and you stop or delete it yourself.'
          },
          {
            src: '/images/screenshot/games-play.webp',
            width: 900,
            height: 405,
            alt: 'A Minecraft Bedrock client multiplayer screen listing a server at address 192.168.1.104 port 19132 with a low ping',
            caption: 'Connect from the game. This one is joined over the local network, at 192.168.1.104 port 19132.'
          }
        ]
      }
    }
  }
}

export const LANGUAGES = Object.keys(COPY)

export function landingCopy (variant, language = DEFAULT_LANGUAGE) {
  const copy = COPY[language] || COPY[DEFAULT_LANGUAGE]
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
    trust: chosen.trust || copy.trust
  }
}
