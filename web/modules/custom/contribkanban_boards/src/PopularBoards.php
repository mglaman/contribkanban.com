<?php

declare(strict_types=1);

namespace Drupal\contribkanban_boards;

use Drupal\contribkanban_boards\Entity\BoardInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;

/**
 * Loads and orders the boards curated as popular searches.
 */
final class PopularBoards {

  /**
   * Constructs a PopularBoards.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   *   The entity type manager.
   */
  public function __construct(
    private readonly EntityTypeManagerInterface $entityTypeManager,
  ) {}

  /**
   * Loads the popular boards.
   *
   * @return \Drupal\contribkanban_boards\Entity\BoardInterface[]
   *   The boards, in order.
   */
  public function load(): array {
    $storage = $this->entityTypeManager->getStorage('board');
    $ids = $storage->getQuery()
      ->accessCheck(FALSE)
      ->exists('popular_weight')
      ->sort('popular_weight')
      ->execute();
    return array_values(array_filter(
      $storage->loadMultiple($ids),
      static fn ($board) => $board instanceof BoardInterface,
    ));
  }

  /**
   * Makes the given boards the popular ones, in order.
   *
   * @param int[]|string[] $ids
   *   The board IDs, in order. Boards that are popular now and missing from
   *   the list stop being popular.
   */
  public function set(array $ids): void {
    $weights = array_flip(array_values($ids));
    foreach ($this->load() as $board) {
      if (!isset($weights[$board->id()])) {
        $board->set('popular_weight', NULL)->save();
      }
    }
    foreach ($this->entityTypeManager->getStorage('board')->loadMultiple($ids) as $id => $board) {
      assert($board instanceof BoardInterface);
      // Saving reindexes the board, so skip boards that keep their place.
      $current = $board->get('popular_weight')->value;
      if ($current === NULL || (int) $current !== $weights[$id]) {
        $board->set('popular_weight', $weights[$id])->save();
      }
    }
  }

}
