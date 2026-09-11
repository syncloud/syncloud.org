import { headTags } from '../src/seo.js'

export function page (template, body, seo) {
  const shell = seo.lang
    ? template.replace(/<html lang="[^"]*"/, `<html lang="${seo.lang}"`)
    : template
  return shell
    .replace(/\s*<title>[^<]*<\/title>/, '')
    .replace(/\s*<meta name="description" content="[^"]*">/, '')
    .replace(/\s*<link rel="canonical" href="[^"]*">/, '')
    .replace('</head>', headTags(seo).map(tag => `    ${tag}\n`).join('') + '  </head>')
    .replace('<div id="app"></div>', `<div id="app">${body}</div>`)
}
