<?php

$databases['default']['default'] = [
  'database' => '../private/db.sqlite',
  'prefix' => '',
  'namespace' => 'Drupal\\sqlite\\Driver\\Database\\sqlite',
  'autoload' => 'core/modules/sqlite/src/Driver/Database/sqlite/',
  'driver' => 'sqlite',
];

// The e2e job switches branches with a forced checkout, which reverts the
// hash salt site-install writes into the tracked settings.php.
$settings['hash_salt'] = 'contribkanban-ci';

# TODO come up with a dynamic identifier between branch changes.
# $settings['deployment_identifier'] = getenv('GITHUB_SHA');
