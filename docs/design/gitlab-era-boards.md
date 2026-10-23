# Boards in the GitLab era

Drupal.org projects are moving their issues to GitLab work items on git.drupalcode.org. ContribKanban was built around drupal.org's api-d7 issue queue. This document proposes what a board is from here on, which configuration survives, and where the app fetches and renders issues.

Data is from production on 2026-10-23.

## What boards use today

| Board type | Boards | Notes |
|---|---|---|
| Project | 484 | 159 flagged `gitlab_work_items` and loading from GitLab |
| Sprint (tag) | 105 | 55 tags have open GitLab issues under the same label name |
| Core | 18 | Core is still on the drupal.org issue queue |
| Custom | 17 | Built in Drupal's admin UI, all from the D8 era |
| Issue collection (`node_board`) | 146 | Lists of specific issue IDs |

Settings, by number of boards using them:

| Setting | Boards | Used by |
|---|---|---|
| List `component` | 12 | 11 core component boards (Claro, Layout Builder, SDC...) and Getting Involved Guide |
| Board `version` | 11 | |
| Board `parent_issue` | 3 | |
| Several projects on one board | 2 | |
| List `category` / `priority` | 3 | Drupal Core Novice (priority Normal on every list) and Commerce Stock |
| Non-default list statuses | ~25 lists | |

Accounts: 285, with 9 signed in during the past year.

The tags with the most open GitLab issues: Drupal 10 compatibility (649), Drupal 9 compatibility (376), AI Initiative Sprint (342), Novice (220), Coding standards (190), Accessibility (189). The 50 tags without GitLab issues are past events and sprints: MidCamp 2017, SprintWeekend2018, dcmuc19.

## Board types

Each board type maps to one query against each issue source.

| Type | drupal.org (api-d7) | GitLab (`/api/v4`) |
|---|---|---|
| Project | `field_project=<nid>` | `projects/project%2F<name>/issues` |
| Tag | `taxonomy_vocabulary_9=<tid>` | `groups/project/issues?labels=<tag>` |
| Core component | `field_project=3060&field_issue_component=<name>` | core is not on GitLab yet |
| Issue collection | `nid[]=...` | per issue, `projects/<path>/issues/<iid>` |

Columns stay status-based. On GitLab, a column matches `state::` labels. `state::` labels are now consistent across projects, so the mapping in `frontend/src/api/gitlab.js` holds for tag boards too.

A board reads drupal.org, GitLab, or both:

- **Project boards** read one source, set by `gitlab_work_items`. `drush ck-gitlab` flags boards as projects migrate.
- **Tag boards** read both and merge. A tag covers migrated and unmigrated projects, so a GitLab-only board would hide the unmigrated half. GitLab's REST API treats several labels as AND, so a column with two statuses needs one request per `state::` label, merged in the browser.
- **Core component boards** stay on drupal.org until core migrates. Then a component becomes a label on one project, which is a project board with a label filter.

## Configuration to remove

| Setting | Proposal | Why |
|---|---|---|
| Custom boards | Delete all 17 | Dead D8-era boards. 8 are Commerce Stock attempts with typos and duplicate machine names. |
| List `category`, `priority` | Remove | Only Drupal Core Novice (Normal everywhere) and the Commerce Stock junk use them. The board-level Type and Priority filters cover this. |
| Board `parent_issue` | Remove after checking the 3 boards | Probably stale |
| Several projects on one board | Convert the 2 boards to tag boards, then allow one project | Simplifies queries and the GitLab mapping |
| Free-form list statuses | Replace with the default column set per board type | ~25 lists differ, and a fixed set maps cleanly to `state::` labels |
| `machine_name` | Make unique | Three boards share `CommercStockD8`, so only one is reachable |

Keep: `version` (11 boards), `component` (core boards), and the default column set.

## Re-coupling

The app is split today:

- The React frontend runs on `contribkanban.com`, served by its own Lagoon service.
- Drupal serves JSON:API on `api.contribkanban.com`.
- Sign-in goes through OAuth: simple_oauth with the password grant module, a consumer, scopes, and keys.

That split causes real costs:

- #600: the board page queries the search index before the new board is indexed, and the API marks the empty answer cacheable.
- The OAuth stack needed three PRs to survive the simple_oauth 6 upgrade.
- CORS, two hostnames, and a separate frontend image to build and deploy.

Options:

| Option | What changes | Cost |
|---|---|---|
| A. Drupal serves the React build | One origin. Drupal session cookies replace OAuth, so simple_oauth, consumers, scopes, and keys go away. JSON:API and issue fetching stay as they are. | A catch-all route that returns the SPA's `index.html`, a JSON login endpoint (core's `/user/login?_format=json`), and dropping the frontend Lagoon service. |
| B. Drupal renders boards | Twig plus a little JavaScript. Drupal fetches issues and caches them. | Rewrites the frontend that was just upgraded. Server-side fetching shares one rate limit across all viewers, so it needs caching. |
| C. Keep the split | Fix #600 and move on | Keeps OAuth, CORS, and two deploy targets |

**Recommendation: A.** It removes the most moving parts for the least rewriting. Issue fetching stays in the browser, so each viewer keeps their own GitLab rate limit and tag boards don't need a server cache. #600's race is fixed separately either way: `AddBoard` indexes the new board before it responds.

## Plan

1. **Prune configuration.** Delete custom boards, remove list `category` and `priority`, resolve `parent_issue` and the multi-project boards, and make `machine_name` unique. Post-update hooks migrate the data, and the frontend tests cover the remaining settings.
2. **Re-couple (A).** Same origin, session authentication, and removal of the OAuth stack and the frontend service.
3. **Tag boards on GitLab.** Merge `groups/project/issues?labels=<tag>` with drupal.org results. Start with the 55 tags that have GitLab issues.
4. **Issue collections on GitLab.** Collections store drupal.org node IDs. A migrated issue keeps its number as its GitLab IID, and api-d7 returns its `new_url`, which gives the project path. Resolve each ID once and store project plus IID.

## Open questions

- Can the 9 active accounts keep their issue collections across the switch to session login? Their passwords already live in Drupal, so yes, unless OAuth-only clients exist.
- Should past-event tag boards (50 with no GitLab issues) stay as drupal.org-only boards or be deleted?
- When core's queue moves, will components become `component::` scoped labels? That decides how core component boards map.
