# syncloud.org website

The public marketing site, a Vue 3 + Vite single-page app that shares the
Syncloud brand design system with the platform UI.

## Develop

```
cd web
npm install
npm run dev      # local dev server
npm run test     # vitest
npm run lint     # eslint --fix
npm run build    # production build -> web/dist
npm run test:e2e # playwright, against PLAYWRIGHT_BASE_URL
```

`npm run build` is three steps: the client build, an SSR build of
`src/entry-server.js` into `web/dist-ssr`, and `tools/prerender.js`, which
renders every path the router serves into `dist/<path>/index.html` with the
body copy and head tags in place, plus `dist/404.html` and `sitemap.xml`. The
site is static; `web/dist` is what gets deployed.

`web/src/router/routes.js` is the single list everything else follows: the page
metadata in `seo.js`, the sitemap, the Caddy path list, and whether a page gets
the site header and footer. `meta: { noindex: true }` keeps a route out of the
sitemap and takes its chrome away, because a page we keep out of search is one
that is only ever reached from a link we placed. Add a route and
`web/tests/seo.test.js` tells you what else to update.

## Translations

Locales live in `web/src/locales/<code>.json` and are lazy-loaded. `en.json`
is the source of truth; every other locale must have the exact same keys
(the vitest suite enforces this). To add a language:

1. Add `{ code, name }` to `SUPPORTED_LOCALES` and a loader entry to
   `APP_LOCALE_FILES` in `web/src/i18n/index.js`.
2. Add `web/src/locales/<code>.json` with the same keys as `en.json`,
   preserving every `{placeholder}` verbatim.
3. `npm run test` to verify key parity, then open a pull request.

Landing copy is part of the same system but lives in
`web/src/locales/landing/<code>.json`, English and German only, merged into the
message tree under `landing`.

A route that fixes a language, `/de/...` or `/en/...`, decides the language of
the whole page: the router applies `meta.language` ahead of anything stored and
does not write it to `localStorage`, so such a path reads the same for everyone
without changing what the rest of the site is shown in.

## Deploy

CI (`.drone.jsonnet`) deploys **uat** (`test.syncloud.org`) on every push and
**prod** (`syncloud.org`) on push to `stable`. Each deploy unpacks `web/dist`
into `/var/www/syncloud.org/<build#>`, flips the `current` symlink, keeps the
last 5 builds and reloads Caddy (`deploy/deploy.sh`). Hosts and keys come from
the Drone secrets `uat_deploy_host|user|key|url` and `prod_…`.

`config/env/<env>/site.env` sets `SITE_INDEXABLE`, `true` for prod and `false`
for uat. A site that is not indexable serves `X-Robots-Tag: noindex` on every
response, loses `sitemap.xml`, and loses the `Sitemap:` line from `robots.txt`.
Two things there are not obvious:

- `robots.txt` still allows crawling everywhere, deliberately. A `Disallow: /`
  stops a crawler fetching the page at all, so it never sees the `noindex` and
  an already indexed URL stays indexed. The header is what removes it.
- the header comes from a Caddy snippet installed as
  `/etc/caddy/conf.d/00-syncloud.org-robots.caddy`, and the `00-` prefix is
  load bearing: `conf.d/*.caddy` is imported in filename order, and a snippet
  has to be defined before the block that imports it.

`ci/deploy-verify.sh` checks only what a real deployment can prove — the site
answered, an unknown path is a real 404, and those three follow
`SITE_INDEXABLE`. Page content belongs in vitest and Playwright, not there.
