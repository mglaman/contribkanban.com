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
  ];
}

/**
 * Keep the frontend's password grant working on simple_oauth 6.
 *
 * Simple OAuth 6 moved the password grant to simple_oauth_password_grant and
 * gives each consumer every grant type available when its update ran, before
 * config import can enable that module. The frontend is a public client that
 * only signs in with a password and refreshes its token.
 */
function contribkanban_api_post_update_simple_oauth_password_grant(): string {
  \Drupal::service('module_installer')->install(['simple_oauth_password_grant']);

  /** @var \Drupal\consumers\Entity\ConsumerInterface[] $consumers */
  $consumers = \Drupal::entityTypeManager()
    ->getStorage('consumer')
    ->loadByProperties(['client_id' => 'd4f7c501-cff9-4a3f-bae7-aec1db19456c']);
  foreach ($consumers as $consumer) {
    $consumer->set('grant_types', ['password', 'refresh_token']);
    $consumer->save();
  }
  return (string) t('Limited the frontend consumer to the password and refresh token grants.');
}
