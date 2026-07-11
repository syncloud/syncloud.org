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
