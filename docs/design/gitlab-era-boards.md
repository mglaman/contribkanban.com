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
- About 4,000 lines of React, mostly pages Drupal could render: listings, forms, and account screens.

Options:

| Option | What changes | Cost |
|---|---|---|
| A. Drupal serves the React SPA | One origin, with session login replacing OAuth. Every React page stays. | A catch-all route, session and CSRF handling in React, dropping the frontend service. The app stays about the same size. |
| B. Drupal renders everything | Twig, with Drupal fetching and caching issues | Server-side fetching shares one GitLab rate limit across all viewers, so every board needs a cache. Loses the interactive board. |
| C. Drupal pages with a board island | Drupal renders pages with single directory components (SDCs). A small React bundle renders only the board. | A front-end theme, a few Drupal forms and views, and rebuilding the board without MUI |
| D. Keep the split | Fix #600 and move on | Keeps OAuth, CORS, and two deploy targets |

**Recommendation: C.** Drupal does what it's good at: accounts, forms, listings, access, and layout. JavaScript does the one interactive thing, the board. It also returns to the original design: `board.html.twig` is a single `<div id="Board">`, and `contribkanban_boards_board_view()` already passes each list's configuration to `drupalSettings`.

### Pages

| Page | Today (React route) | With C |
|---|---|---|
| Board | `/board/:machineName`, loads the board from the search index | Drupal's board route renders the page shell. The island reads its configuration from the page, so #600's lookup race goes away. |
| Issue collection | `/node-board/:uuid` | Same, on the existing node board route |
| Board listing and search | React list over `/jsonapi/index/boards` | A Search API view with a text filter and a board type filter |
| Create a board | React dialogs posting to `/api/boards/add` | One Drupal form running the `AddBoard` and `AddTag` logic |
| Log in, register, log out, account | React forms over OAuth | Drupal core |
| Forgot password | A stub that says "In progress" | Drupal core, so it starts working |
| Edit an issue collection | React form over JSON:API | Drupal entity form with an issue ID widget |

### What goes away

- React Router, the auth context, and every page component except the board
- simple_oauth, simple_oauth_password_grant, the consumer, scopes, and keys
- CORS, `api.contribkanban.com` as a separate origin, and most of the JSON:API exposure
- The `frontend` Lagoon service and `lagoon/Dockerfile.app`
- MUI and Emotion

### Building pages with SDCs

A small front-end theme replaces Gin as the default theme. Gin, the admin theme, renders the public pages today. The theme's markup lives in single directory components: one directory per component, holding its Twig template, CSS, optional JavaScript, and a schema for its props and slots.

| Component | Used for |
|---|---|
| `page-header`, `layout` | Site chrome and page regions |
| `board-card` | A board in listings |
| `board-shell` | The board page: title, filters, and an empty column per list, with the board configuration in data attributes |
| `issue-card` | The card markup and CSS. The island renders the same classes, so cards look identical however they're rendered. |
| `form-field`, `button` | Restyling Drupal's form elements |

`board-shell` mounts the island. The island is a Vite library build written into the component's directory as its JavaScript file, so Drupal attaches it through the component's own library. No separate frontend build or deploy target.

### Visual design

Direction B ("Open air") from the [design directions canvas](https://claude.ai/artifact/Avf64rYCTUYeP5G8J4TzC8), with direction C's logo: a rounded square outline with three descending bars, in teal and dark gray on a light header.

Tokens, as CSS custom properties shared by the SDCs and the board island:

| Token | Value | Use |
|---|---|---|
| `--ck-font` | Figtree, system-ui, sans-serif | All text. 15px body, 34px page titles. |
| `--ck-ground` | `#F4F6F8` | Page background |
| `--ck-surface` | `#FFFFFF` | Cards, panels, inputs |
| `--ck-text` | `#1F2937` | Body text |
| `--ck-muted` | `#4B5563` | Secondary text (7:1 on white) |
| `--ck-border` | `#D1D5DB` | Inputs, dashed empty states |
| `--ck-accent` | `#0F766E` | Links, primary buttons, focus, logo outline |
| `--ck-accent-strong` | `#134E4A` | Hover and pressed |
| `--ck-radius-card` | `14px` | Issue and board cards |
| `--ck-radius-pill` | `999px` | Buttons, filters, chips |
| `--ck-shadow` | `0 1px 2px rgba(15,23,42,.05), 0 4px 12px rgba(15,23,42,.05)` | Cards and panels |

Status column headers are tinted, never the cards:

| Status | Background | Text |
|---|---|---|
| Postponed | `#E5E7EB` | `#1F2937` |
| Active | `#DBEAFE` | `#1E3A8A` |
| Needs work | `#FFEDD5` | `#7C2D12` |
| Needs review | `#FEF3C7` | `#713F12` |
| Reviewed & tested | `#DCFCE7` | `#14532D` |
| Fixed | `#CCFBF1` | `#134E4A` |

Cards show the title, category (red for bugs), priority only when Major or Critical, the issue number, and an avatar when assigned. Touch targets are at least 44px.

### The board island

- **React 19**, no router and no app state beyond the board. It reads the board configuration from `board-shell`'s data attributes, then fetches issues from drupal.org and GitLab in the browser. Each viewer keeps their own GitLab rate limit, and tag boards need no server cache.
- **No MUI.** Cards, columns, and chips are plain elements styled by the SDCs' CSS and shared custom properties.
- **Base UI** (`@base-ui/react`, from the team behind Radix, MUI, and Floating UI) for the few accessible widgets plain HTML doesn't cover well, such as a filter menu. Native elements come first: `<select>`, `<dialog>`, and the popover API cover most of it.
- **Filters** stay client-side, so changing Type or Priority doesn't reload the page. They also go into the URL, so a filtered board can be shared.
- **Tests:** the existing board tests move with the island. Drupal pages get functional tests instead of Vitest page tests.

Astro isn't needed. Astro wants to own page rendering, statically or through a Node server. With Drupal rendering pages, "islands" just means mounting a component into server-rendered markup, which a component library already does.

## Plan

1. **Prune configuration.** Delete custom boards, remove list `category` and `priority`, resolve `parent_issue` and the multi-project boards, and make `machine_name` unique.
2. **Theme and components.** Create the front-end theme and its SDCs, and render the listing, create form, and issue collection forms in Drupal. The React app keeps running beside it until the board island ships.
3. **Board island.** Rebuild `Board`, `List`, `Card`, and the GitLab loading as the `board-shell` component's JavaScript, without MUI.
4. **Cut over.** Serve everything from `contribkanban.com`, and redirect old React routes to their Drupal pages. Remove OAuth, the frontend service, and the React app.
5. **Tag boards on GitLab.** Merge `groups/project/issues?labels=<tag>` with drupal.org results, starting with the 55 tags that have GitLab issues.
6. **Issue collections on GitLab.** Collections store drupal.org node IDs. A migrated issue keeps its number as its GitLab IID, and api-d7 returns its `new_url`, which gives the project path. Resolve each ID once and store project plus IID.

## Open questions

- Do the 9 active accounts need anything special at cut-over? Their passwords live in Drupal, so session login works for them unchanged.
- Should past-event tag boards (50 with no GitLab issues) stay as drupal.org-only boards or be deleted?
- When core's queue moves, will components become `component::` scoped labels? That decides how core component boards map.
