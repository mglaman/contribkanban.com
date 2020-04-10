<?php

declare(strict_types=1);

use Drupal\user\UserInterface;
use Drupal\user\UserStorageInterface;

/**
 * Fix usernames from email_registration.
 */
function contribkanban_users_post_update_fix_usernames()
{
    $user_storage = \Drupal::entityTypeManager()->getStorage('user');
    assert($user_storage instanceof UserStorageInterface);
    $query = $user_storage->getQuery();
    $query->accessCheck(FALSE);
    $query->condition('uid', 1, '>');
    $uids = $query->execute();
    $users = $user_storage->loadMultiple($uids);
    foreach ($users as $user) {
        assert($user instanceof UserInterface);
        $user->setUsername($user->getEmail());
        $user->save();
    }
}
