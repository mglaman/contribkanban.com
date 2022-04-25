# amazeeio/drupal_integrations

Add this project to any Drupal distribution based on drupal/core-composer-scaffold to enable it for use on Lagoon.

This project enables the following Lagoon integrations:

- Injects the Lagoon database credentials for the Drupal site
- Demonstrates how to turn on twig debugging on non-production Lagoon environments
- Sets the path to:
  - Configuration import / export directory
  - Private files
  - Temporary files
  - Twig cache files
- Establishes a secure, random hash salt for Drupal
- Prevents the user from updating Drupal core with Drush
- Configures the trusted host patterns to avoid a warning that is not applicable to Lagoon
- Ignores large cache directories (e.g. node modules and bower components)
- Installs lagoon wildcard drush alias file
- Drush commands for lagoon

## Enabling this project

This project must be enabled in the top-level composer.json file, or it will be ignored and will not perform any of its functions.
```
{
    ...
    "require": {
        "amazeeio/drupal_integrations"
    },
    ...
    "extra": {
        "drupal-scaffold": {
            "allowed-packages": [
                "amazeeio/drupal_integrations"
            ]
        }
    }
}
```

## Drush commands for Lagoon

```
   lagoon:aliases (la)                  Get all remote aliases from lagoon API.
   lagoon:jwt (jwt)                     Generate a JWT token for the lagoon API.
   lagoon:post-rollout-tasks            Run post-rollout tasks.
   lagoon:pre-rollout-tasks             Run pre-rollout tasks.
```

## Tests

Tests will run PHPCS across all files within the `assets` and `src` directories.

```
composer install
composer test
```

## Site-Wide Drush Commands

Installing this module requires that the installer-paths in the Drupal site's composer.json file contains "drush/Commands/contrib/{$name}": ["type:drupal-drush"].

```
    "extra": {
        "installer-paths": {
            "drush/Commands/contrib/{$name}": ["type:drupal-drush"]
        }
    }
```

## Credits

Big thanks goes out to [Greg Anderson](https://github.com/greg-1-anderson) from [Pantheon](https://pantheon.io/) all his hard work that went into improving drupal's composer integration allows us to manage platform settings via a composer project.
