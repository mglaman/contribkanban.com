<?php

/**
 * @file
 * Post update functions for contribkanban_api.
 */

declare(strict_types=1);

/**
 * Implements hook_removed_post_updates().
 */
function contribkanban_api_removed_post_updates(): array {
  return [
    'contribkanban_api_post_update_ensure_consumer' => '1.0.0',
    'contribkanban_api_post_update_remove_consumer_secret' => '1.0.0',
    'contribkanban_api_post_update_simple_oauth_password_grant' => '1.0.0',
  ];
}

/**
 * Delete the OAuth2 key pair, which nothing signs tokens with anymore.
 */
function contribkanban_api_post_update_delete_oauth_keys(): void {
  if (\Drupal::service('stream_wrapper_manager')->isValidScheme('private') && is_dir('private://keys')) {
    \Drupal::service('file_system')->deleteRecursive('private://keys');
  }
}
