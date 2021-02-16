<?php
/**
 * @file
 * Loaded on all environments.
 */

$settings['config_sync_directory'] = '../config';
$settings['class_loader_auto_detect'] = FALSE;

// Private directory.
$settings['file_private_path'] = 'sites/default/files/private';

if (getenv('LAGOON_GIT_SHA')) {
  $settings['deployment_identifier'] = getenv('LAGOON_GIT_SHA');
}

if (getenv('LAGOON_ENVIRONMENT_TYPE') !== 'production') {
  /**
   * Skip file system permissions hardening.
   *
   * The system module will periodically check the permissions of your site's
   * site directory to ensure that it is not writable by the website user. For
   * sites that are managed with a version control system, this can cause problems
   * when files in that directory such as settings.php are updated, because the
   * user pulling in the changes won't have permissions to modify files in the
   * directory.
   */
  $settings['skip_permissions_hardening'] = TRUE;
}

### Lagoon Redis connection
// @todo get this added back.
if (getenv('LAGOON')) {
  $settings['redis.connection']['interface'] = 'PhpRedis';
  $settings['redis.connection']['host'] = getenv('REDIS_HOST') ?: 'redis';
  $settings['redis.connection']['port'] = 6379;
  $settings['cache_prefix']['default'] = getenv('LAGOON_PROJECT') . '_' . getenv('LAGOON_GIT_SAFE_BRANCH');
  # Do not set the cache during installations of Drupal
  if (FALSE && !drupal_installation_attempted() && extension_loaded('redis')) {
    $settings['cache']['default'] = 'cache.backend.redis';
    // Include the default example.services.yml from the module, which will
    // replace all supported backend services (that currently includes the cache tags
    // checksum service and the lock backends, check the file for the current list)
    $settings['container_yamls'][] = 'modules/contrib/redis/example.services.yml';
    // Allow the services to work before the Redis module itself is enabled.
    $settings['container_yamls'][] = 'modules/contrib/redis/redis.services.yml';
    // Manually add the classloader path, this is required for the container cache bin definition below
    // and allows to use it without the redis module being enabled.
    $class_loader->addPsr4('Drupal\\redis\\', 'modules/contrib/redis/src');
    // Use redis for container cache.
    // The container cache is used to load the container definition itself, and
    // thus any configuration stored in the container itself is not available
    // yet. These lines force the container cache to use Redis rather than the
    // default SQL cache.
    $settings['bootstrap_container_definition'] = [
      'parameters' => [],
      'services' => [
        'redis.factory' => [
          'class' => 'Drupal\redis\ClientFactory',
        ],
        'cache.backend.redis' => [
          'class' => 'Drupal\redis\Cache\CacheBackendFactory',
          'arguments' => ['@redis.factory', '@cache_tags_provider.container', '@serialization.phpserialize'],
        ],
        'cache.container' => [
          'class' => '\Drupal\redis\Cache\PhpRedis',
          'factory' => ['@cache.backend.redis', 'get'],
          'arguments' => ['container'],
        ],
        'cache_tags_provider.container' => [
          'class' => 'Drupal\redis\Cache\RedisCacheTagsChecksum',
          'arguments' => ['@redis.factory'],
        ],
        'serialization.phpserialize' => [
          'class' => 'Drupal\Component\Serialization\PhpSerialize',
        ],
      ],
    ];
  }
}
