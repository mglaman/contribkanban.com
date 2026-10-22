# ContribKanban

Kanban board app for Drupal.org contribution issue tracking. Monorepo with a Drupal 10 backend and a React 19 frontend.

## Project structure

- `/web` — Drupal 10 application root; custom modules in `web/modules/custom/`
- `/frontend` — React 19 SPA (Vite, JSX, MUI v9, React Router, Vitest)
- `/config` — Drupal configuration exports (version-controlled, must stay in sync)

## Local development

Everything runs through DDEV. Do not use native PHP or a standalone Node server.

```bash
ddev start              # start the full stack
ddev composer install   # install PHP deps
ddev frontend start     # start Vite dev server (port 5173, proxied to :9443)
```

URLs:
- Backend: `https://contribkanban.com.ddev.site`
- Frontend: `https://contribkanban.com.ddev.site:9443/`

## Frontend

```bash
ddev frontend start    # dev server
ddev frontend build    # production build
ddev frontend test     # run Vitest

# or, inside frontend/ in the web container
npm run start | build | test
```

State management is React Context API only (no Redux/Zustand). Do not introduce external state libraries.

Auth tokens are stored in localStorage under the key `"oauth"` and managed by `frontend/src/context/auth.jsx`. The token refresh logic (401 handling) is subtle — be careful when touching auth flows.

API utilities are in `frontend/src/api/index.js`. The base URL is environment-aware:
- Local: `https://contribkanban.com.ddev.site`
- Production: `https://api.contribkanban.com`

## Drupal backend

### Rules
- All data is exposed via **JSON:API only** — no custom REST controllers.
- All Drupal config must be exported to `/config` and committed. After config changes: `ddev drush cim` to import, `ddev drush cex` to export.
- **Simple OAuth** handles authentication. Do not modify OAuth config without care; the client ID is hardcoded in the frontend.
- **Search API** powers board search. Schema/field changes may require an index rebuild: `ddev drush sapi-r all && ddev drush sapi-i all`.

### Code quality (run before marking Drupal work done)

```bash
./bin/phpcs web/modules/custom     # coding standards
./bin/phpstan analyse              # static analysis
```

PHPStan is enforced in CI (GitHub Actions, `.github/workflows/ci.yml`). PHPCS is not yet; it currently reports violations.

## Testing

Frontend tests use Vitest + Testing Library:
```bash
ddev exec "cd frontend && npx vitest --run"
```

Tests live in `frontend/src/__tests__/` and `frontend/src/components/**/__tests__/`. Page-level tests in `frontend/src/__tests__/pages/` render the whole app with `renderApp()` and `mockFetch()` from `frontend/src/test-utils.jsx`; add one when changing a page.

Style with `sx` or `styled()` from `@mui/material/styles`. `@mui/styles` (`withStyles`, `makeStyles`) is gone and does not work with React 19.

## Deployment

Push to `master` → GitHub Actions runs build + test → Lagoon auto-deploys to production (`https://contribkanban.com`).

Do not force-push master.

## Key cautions

- **No unnecessary dependencies.** Do not add npm packages or Composer packages without a clear need.
- **OAuth flow is fragile.** Token refresh logic in `auth.jsx` handles 401s transparently; changes here need careful testing.
- **Config must stay in sync.** Any Drupal config change not exported and committed will be lost on next deploy.
