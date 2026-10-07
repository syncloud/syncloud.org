export const articles = [
  {
    slug: 'syncloud-on-odroid',
    title: 'Your own cloud on an ODROID',
    description: 'Run Nextcloud, a password manager and a media server on an ODROID-H5 or ODROID-M1S you run: which board to pick, how to install Syncloud, what it costs.',
    date: '2026-10-07'
  }
]

export function article (slug) {
  return articles.find(entry => entry.slug === slug)
}
