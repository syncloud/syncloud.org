# syncloud.org website

The public marketing site, a Vue 3 + Vite single-page app that shares the
Syncloud brand design system with the platform UI.

## Develop

```
cd web
npm install
npm run dev      # local dev server
npm run test     # vitest (locale key parity)
npm run lint     # eslint --fix
npm run build    # production build -> web/dist
```

The site is static — `web/dist` is what gets deployed.

## Pages and crawling

Every route carries its own `<title>`, `<meta name="description">`,
`<html lang>` and `rel="canonical"`, all of it from `web/src/seo.js` — keyed by
route name for the site pages and by variant plus language for the landing
pages, so a German route describes itself in German. The router applies it on
each navigation and the build bakes it into the HTML.

The landing routes are `noindex`: they are variants of pages that already rank,
and they are not meant to compete with them. `meta: { noindex: true }` on a
route puts the tag on the page and keeps the route out of `sitemap.xml`, which
is generated from the route table rather than a second list, so the two cannot
disagree.

`npm run build` is three steps: the client build, an SSR build of
`src/entry-server.js` into `web/dist-ssr`, and `tools/prerender.js`. The last
one renders every path the router serves and writes `dist/<path>/index.html`
with the body copy and head tags already in place, plus `dist/404.html` and
`sitemap.xml`. `robots.txt` is a static file in `web/public`.

`config/caddy/syncloud.org.caddy` rewrites only the paths the router serves,
so anything else is a real 404 answered with `dist/404.html`. Its path list is
checked against the router table by `web/tests/seo.test.js` — add a route and
that test tells you what else to update.

## Keeping non-production sites out of search

`config/env/<env>/site.env` sets `SITE_INDEXABLE`. It is `true` for prod and
`false` for uat, and `deploy.sh` acts on it: a site that is not indexable
serves `X-Robots-Tag: noindex` on every response, loses `sitemap.xml`, and
loses the `Sitemap:` line from `robots.txt`.

`robots.txt` still allows crawling everywhere. That is deliberate — a
`Disallow: /` stops a crawler fetching the page at all, so it never sees the
`noindex` and an already indexed URL stays indexed. The header is what removes
it.

The header comes from a Caddy snippet: `deploy.sh` installs either
`config/caddy/robots-indexable.caddy` or `config/caddy/robots-noindex.caddy` as
`/etc/caddy/conf.d/00-syncloud.org-robots.caddy`, which the site vhost pulls in
with `import syncloud_org_robots`. The `00-` prefix is load bearing, since
`/etc/caddy/conf.d/*.caddy` is imported in filename order and a snippet has to
be defined before the block that imports it.

`ci/deploy-verify.sh` asserts both branches against the real deployed site. The
pipeline covers each of them on every push: the throwaway test environment is
indexable like prod, uat is not.

## Translations

Locales live in `web/src/locales/<code>.json` and are lazy-loaded. `en.json`
is the source of truth; every other locale must have the exact same keys
(the vitest suite enforces this). To add a language:

1. Add `{ code, name }` to `SUPPORTED_LOCALES` and a loader entry to
   `APP_LOCALE_FILES` in `web/src/i18n/index.js`.
2. Add `web/src/locales/<code>.json` with the same keys as `en.json`,
   preserving every `{placeholder}` verbatim.
3. `npm run test` to verify key parity, then open a pull request.

## Deploy

CI (`.drone.jsonnet`) builds the web app and deploys it:

- **uat** (`test.syncloud.org`) on every push.
- **prod** (`syncloud.org`) on push to the `stable` branch.

Each deploy unpacks `web/dist` into a versioned directory
`/var/www/syncloud.org/<build#>`, atomically flips the `current` symlink,
keeps the last 5 builds, and reloads Apache (see `deploy/deploy.sh` and
`config/<env>/apache.conf`). Deploy hosts/keys come from Drone secrets:
`uat_deploy_host|user|key|url` and `prod_deploy_host|user|key|url`.
