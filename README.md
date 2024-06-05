# [ContribKanban](https://contribkanban.com) &middot; [![CircleCI](https://circleci.com/gh/mglaman/contribkanban.com.svg?style=svg)](https://circleci.com/gh/mglaman/contribkanban.com)

ContribKanban is an application which mirrors Drupal.org issues into kanban boards.

🚀 Hosting for ContribKanban.com provided by [Amazee.io](https://amazee.io)

## Local development

Want to contrib to ContribKanban? Local development is powered by [Lando](https://lando.dev/).

### lando

```shell
lando start
```

### ddev

1. Configure frontend app.
    - Create `.env.local` in frontend directory
    - Add following environment variables

      ```
      REACT_APP_API_BASE_URL=https://contribkanban.com.ddev.site
      PORT=4000
      ```

2. Run  `ddev start`
3. Run `ddev setup` to setup your project locally
4. You local should be up and running.
    - Drupal Backend - <https://contribkanban.com.ddev.site/>
    - React Frontend - <https://contribkanban.com.ddev.site:9443/>

## Browser extensions

Browser extensions are available to integrate ContribKanban directly into Drupal.org.

- [Chromium (Chrome/Brave)](https://chrome.google.com/webstore/detail/immmfachnlmchioeaillpamhbfpjmeni/)
- FireFox (TBD)
