<?php

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
