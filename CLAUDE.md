# ContribKanban

Kanban board app for Drupal.org contribution issue tracking. Drupal 11 renders every page; a small React 19 island renders the boards.

## Project structure

- `/web` — Drupal 11 application root; custom modules in `web/modules/custom/`
- `/web/themes/custom/contribkanban` — Front-end theme. Markup lives in single directory components under `components/`; design tokens are CSS custom properties in `css/tokens.css`. Gin stays the admin theme.
- `/frontend` — The board island: React 19, built with Vite, tested with Vitest
- `/config` — Drupal configuration exports (version-controlled, must stay in sync)

## Local development

Everything runs through DDEV. Do not use native PHP or a standalone Node server.

```bash
ddev start              # start the full stack
ddev composer install   # install PHP deps
ddev frontend build     # build the board island
```

The site is at `https://contribkanban.com.ddev.site`.

## Board island

`frontend/src/island/` renders board and issue collection pages. Drupal renders the `board-shell` component with the board configuration in `data-board`, and the island renders the filters and columns into it. It loads issues from drupal.org and GitLab in the browser.

```bash
ddev frontend build    # writes components/board-shell/board-shell.js
ddev frontend watch    # rebuilds on change
ddev frontend test     # runs Vitest
ddev drush cr          # Drupal finds a new component file after a cache rebuild
```

The built file is ignored by Git. `lagoon/Dockerfile.cli` builds it during deploys.

Keep the island small: React and plain elements styled by the theme's CSS. No UI kit, router, or state library.

## Drupal backend

### Rules
- Drupal renders pages with forms, views, and components. The site has no JSON:API or REST endpoints; the board island reads drupal.org and GitLab directly. Don't add endpoints without a clear need.
- All Drupal config must be exported to `/config` and committed. After config changes: `ddev drush cim` to import, `ddev drush cex` to export.
- Drupal core handles accounts and log in with sessions.
- **Search API** powers board search. Schema/field changes may require an index rebuild: `ddev drush sapi-r all && ddev drush sapi-i all`.
- **Which projects moved to GitLab** is stored on project entities (`gitlab_issues`), not checked at view time. `drush ck-gitlab` refreshes it from drupal.org, creates missing projects, and flags project boards (about 10 minutes). Tag boards and issue collections read the flags. Drupal.org's api-d7 blocks production's IP address with a 403, so export the list locally and load it on production:
  ```bash
  ddev drush ck-gitlab --export=moved-projects.json
  lagoon ssh -p contribkanban -e master -C "drush ck-gitlab --from=-" < moved-projects.json
  ```
  The block comes and goes. Production's requests sometimes get through, then get 403s again minutes later, so one success doesn't mean it's lifted.
  Tag name lookups on board list save and the "Start a board" form also call drupal.org, so they usually fail on production too. To add a tag board there, look up the tag's term ID locally and pass it, which skips drupal.org:
  ```bash
  lagoon ssh -p contribkanban -e master -C 'drush php:eval "\$b = \Drupal::service(\"contribkanban_boards.board_factory\")->forTag(\"ai::outside\", \"205948\"); \$b->isNew() && \$b->save();"'
  ```
  GitLab labels drupal.org has no tag for, like `cms::product-analytics`, get tag boards with no term ID that only load GitLab work items. `forTag()` falls back to them, but on production it stops at drupal.org's 403, so use `forLabel()`, which only asks git.drupalcode.org:
  ```bash
  lagoon ssh -p contribkanban -e master -C 'drush php:eval "\$b = \Drupal::service(\"contribkanban_boards.board_factory\")->forLabel(\"cms::product-analytics\"); \$b?->isNew() && \$b->save();"'
  ```

### Code quality (run before marking Drupal work done)

```bash
./bin/phpcs                        # coding standards (phpcs.xml.dist)
./bin/phpstan analyse              # static analysis, no baseline
```

Both run in CI (GitHub Actions, `.github/workflows/ci.yml`) and must stay clean. Class doc comments are not required; method, property, and file doc comments are. Fix PHPStan errors instead of adding a baseline.

## Testing

Island tests use Vitest and Testing Library, and live in `frontend/src/island/__tests__/`:
```bash
ddev exec "cd frontend && npx vitest --run"
```

Drupal code gets Kernel tests in each module's `tests/src/Kernel/`. CI's `e2e_test` job also checks rendered pages with `curl` against an installed site.

## Deployment

Push to `master` → GitHub Actions runs build + test → Lagoon auto-deploys to production (`https://contribkanban.com`). Drupal's nginx serves every hostname; `www`, `app`, and `api` redirect to `contribkanban.com` (`lagoon/Dockerfile.nginx`).

Do not force-push master.

## Key cautions

- **No unnecessary dependencies.** Do not add npm packages or Composer packages without a clear need.
- **Config must stay in sync.** Any Drupal config change not exported and committed will be lost on next deploy.
