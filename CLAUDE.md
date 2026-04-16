# ContribKanban

Kanban board app for Drupal.org contribution issue tracking. Monorepo with a Drupal 10 backend, React 18 frontend, and a Chrome extension.

## Project structure

- `/web` — Drupal 10 application root; custom modules in `web/modules/custom/`
- `/frontend` — React 18 SPA (Vite, JSX, MUI v5, Vitest)
- `/extension` — Chrome extension in **maintenance mode** (React 16, MUI v4, Webpack 4)
- `/config` — Drupal configuration exports (version-controlled, must stay in sync)

## Local development

Everything runs through DDEV. Do not use native PHP or a standalone Node server.

```bash
ddev start              # start the full stack
ddev composer install   # install PHP deps
ddev frontend start     # start Vite dev server (port 3000 via DDEV proxy)
```

URLs:
- Backend: `https://contribkanban.com.ddev.site`
- Frontend: `https://contribkanban.com.ddev.site:9443/`

## Frontend

```bash
yarn workspace @contribkanban/frontend start    # dev server
yarn workspace @contribkanban/frontend build    # production build
yarn workspace @contribkanban/frontend test     # run Vitest
```

State management is React Context API only (no Redux/Zustand). Do not introduce external state libraries.

Auth tokens are stored in localStorage under the key `"oauth"` and managed by `frontend/src/context/auth.jsx`. The token refresh logic (401 handling) is subtle — be careful when touching auth flows.

API utilities are in `frontend/src/api/index.js`. The base URL is environment-aware:
- Local: `https://contribkanban.com.ddev.site`
- Production: `https://api.contribkanban.com`

## Chrome extension

The extension is in **maintenance mode**. It uses React 16 and MUI v4 — do not apply React 18 or MUI v5 patterns here. Build with:

```bash
yarn workspace @contribkanban/chrome-extension build
```

## Drupal backend

### Rules
- All data is exposed via **JSON:API only** — no custom REST controllers.
- All Drupal config must be exported to `/config` and committed. After config changes: `ddev drush cim` to import, `ddev drush cex` to export.
- **Simple OAuth** handles authentication. Do not modify OAuth config without care; client IDs are hardcoded in the frontend and extension.
- **Search API** powers board search. Schema/field changes may require an index rebuild: `ddev drush sapi-r all && ddev drush sapi-i all`.

### Code quality (run before marking Drupal work done)

```bash
./bin/phpcs web/modules/custom     # coding standards
./bin/phpstan analyse              # static analysis
```

These are also enforced in CI (CircleCI).

## Testing

Frontend tests use Vitest + Testing Library:
```bash
yarn workspace @contribkanban/frontend test
```

Tests live in `frontend/src/__tests__/` and `frontend/src/components/**/__tests__/`.

## Deployment

Push to `master` → CircleCI runs build + test → Lagoon auto-deploys to production (`https://contribkanban.com`).

Do not force-push master.

## Key cautions

- **No unnecessary dependencies.** Do not add npm packages or Composer packages without a clear need.
- **Extension uses older React/MUI.** React 16 + MUI v4 only in `/extension` — don't mix with v5 patterns.
- **OAuth flow is fragile.** Token refresh logic in `auth.jsx` handles 401s transparently; changes here need careful testing.
- **Config must stay in sync.** Any Drupal config change not exported and committed will be lost on next deploy.
