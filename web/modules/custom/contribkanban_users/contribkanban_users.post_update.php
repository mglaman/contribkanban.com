<?php

/**
 * @file
 * Post update functions for contribkanban_users.
 */

declare(strict_types=1);

/**
 * Fix usernames from email_registration.
 */
function contribkanban_users_post_update_fix_usernames() {
  $user_storage = \Drupal::entityTypeManager()->getStorage('user');
  $query = $user_storage->getQuery();
  $query->accessCheck(FALSE);
  $query->condition('uid', 1, '>');
  $uids = $query->execute();
  $users = $user_storage->loadMultiple($uids);
  foreach ($users as $user) {
    $user->setUsername($user->getEmail());
    $user->save();
  }
}
