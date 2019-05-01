# ConribKanban

[![CircleCI](https://circleci.com/gh/mglaman/contribkanban.com.svg?style=svg)](https://circleci.com/gh/mglaman/contribkanban.com)

ContribKanban is an application which mirrors Drupal.org issues into kanban boards.

🚀 Hosting for ContribKanban.com provided by [Amazee.io](https://amazee.io)

## Installation

All of the necessary configuration to build the site is stored in the `config` directory. The easiest way to get it all running is to build it locally using Composer.

First you need to [install composer](https://getcomposer.org/doc/00-intro.md#installation-linux-unix-osx).

> Note: The instructions below refer to the [global composer installation](https://getcomposer.org/doc/00-intro.md#globally).
You might need to replace `composer` with `php composer.phar` (or similar)
for your setup.

### Installing the application

```
composer run setup
./bin/robo run:server
```

### Installing, explicit

After that all of the composer requirements need to be installed:

```
composer install
```

By default, ContribKanban installs using a SQLite database located in the `private` directory. Running the following commands will install the database, import the application configuration, and let you get up and running:

_Be sure to update the command to use the appropriate email addresses, username and password._

```
cd web
../bin/drush site-install --account-mail="youremail@example.com" --account-name="admin" --account-pass="test"
```

**Note**: a local web server is still necessary.

You can run the following command for a local development server.

```
./bin/robo run:server
```
