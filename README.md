# [ContribKanban](https://contribkanban.com) &middot; [![CI](https://github.com/mglaman/contribkanban.com/actions/workflows/ci.yml/badge.svg)](https://github.com/mglaman/contribkanban.com/actions/workflows/ci.yml)

ContribKanban is an application which mirrors Drupal.org issues into kanban boards.

🚀 Hosting for ContribKanban.com provided by [Amazee.io](https://amazee.io)

## Local development

Want to contrib to ContribKanban? Local development is powered by [DDEV](https://ddev.com/).

```shell
ddev start

ddev composer install

ddev frontend build
```

The site is at `https://contribkanban.com.ddev.site`. `ddev frontend build` builds the board island, the React app that renders each board.

