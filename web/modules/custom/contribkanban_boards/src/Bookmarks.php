<?php

declare(strict_types=1);

namespace Drupal\contribkanban_boards;

use Drupal\contribkanban_boards\Entity\BoardInterface;
use Drupal\Core\Cache\CacheTagsInvalidatorInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\user\UserDataInterface;

final class Bookmarks {

  /**
   * Constructs a Bookmarks object.
   *
   * @param \Drupal\user\UserDataInterface $userData
   *   The user data store.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   *   The entity type manager.
   * @param \Drupal\Core\Cache\CacheTagsInvalidatorInterface $cacheTagsInvalidator
   *   Invalidates the cache tag for a user's bookmarks.
   */
  public function __construct(
    private readonly UserDataInterface $userData,
    private readonly EntityTypeManagerInterface $entityTypeManager,
    private readonly CacheTagsInvalidatorInterface $cacheTagsInvalidator,
  ) {}

  /**
   * Gets the cache tag for a user's bookmarks.
   *
   * @param \Drupal\Core\Session\AccountInterface $account
   *   The user.
   *
   * @return string
   *   The cache tag.
   */
  public static function cacheTag(AccountInterface $account): string {
    return 'contribkanban_bookmarks:' . $account->id();
  }

  /**
   * Gets the IDs of the boards a user bookmarked.
   *
   * Bookmarks live in core's user data, which drops them when the user is
   * deleted. Deleted boards drop out in ::boards().
   *
   * @param \Drupal\Core\Session\AccountInterface $account
   *   The user.
   *
   * @return list<int>
   *   The board IDs, most recent first.
   */
  public function ids(AccountInterface $account): array {
    if ($account->isAnonymous()) {
      return [];
    }
    $ids = $this->userData->get('contribkanban_boards', (int) $account->id(), 'bookmarks');
    return is_array($ids) ? array_values(array_map('intval', $ids)) : [];
  }

  /**
   * Loads the boards a user bookmarked, skipping deleted boards.
   *
   * @param \Drupal\Core\Session\AccountInterface $account
   *   The user.
   *
   * @return list<\Drupal\contribkanban_boards\Entity\BoardInterface>
   *   The boards, most recent first.
   */
  public function boards(AccountInterface $account): array {
    $boards = $this->entityTypeManager->getStorage('board')->loadMultiple($this->ids($account));
    return array_values(array_filter(
      $boards,
      static fn ($board): bool => $board instanceof BoardInterface,
    ));
  }

  /**
   * Checks whether a user bookmarked a board.
   *
   * @param \Drupal\Core\Session\AccountInterface $account
   *   The user.
   * @param \Drupal\contribkanban_boards\Entity\BoardInterface $board
   *   The board.
   *
   * @return bool
   *   TRUE if the board is bookmarked.
   */
  public function has(AccountInterface $account, BoardInterface $board): bool {
    return in_array((int) $board->id(), $this->ids($account), TRUE);
  }

  /**
   * Bookmarks a board, or removes its bookmark.
   *
   * @param \Drupal\Core\Session\AccountInterface $account
   *   The user, who must be logged in.
   * @param \Drupal\contribkanban_boards\Entity\BoardInterface $board
   *   The board.
   *
   * @return bool
   *   TRUE if the board is now bookmarked.
   */
  public function toggle(AccountInterface $account, BoardInterface $board): bool {
    assert($account->isAuthenticated());
    $id = (int) $board->id();
    $ids = $this->ids($account);
    $bookmarked = !in_array($id, $ids, TRUE);
    $ids = $bookmarked
      ? [$id, ...$ids]
      : array_values(array_diff($ids, [$id]));
    $this->userData->set('contribkanban_boards', (int) $account->id(), 'bookmarks', $ids);
    $this->cacheTagsInvalidator->invalidateTags([self::cacheTag($account)]);
    return $bookmarked;
  }

}
