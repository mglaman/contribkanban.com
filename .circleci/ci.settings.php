<?php

$databases['default']['default'] = [
  'database' => '../private/db.sqlite',
  'prefix' => '',
  'namespace' => 'Drupal\\Core\\Database\\Driver\\sqlite',
  'driver' => 'sqlite',
];

# TODO come up with a dynamic identifier between branch changes.
# $settings['deployment_identifier'] = getenv('CIRCLE_SHA1');
