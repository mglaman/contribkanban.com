<?php

declare(strict_types=1);

namespace Drupal\contribkanban_boards;

use Drupal\contribkanban_boards\Entity\BoardInterface;
use Drupal\Core\Cache\CacheTagsInvalidatorInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\State\StateInterface;

/**
 * Loads and orders the boards curated as popular searches.
 *
 * The board IDs live in state, so config imports on deploy leave them alone.
 */
final class PopularBoards {

  /**
   * The cache tag invalidated when the list changes.
   */
  public const CACHE_TAG = 'contribkanban_popular_boards';

  /**
   * The state key holding the board IDs, in order.
   */
  private const STATE_KEY = 'contribkanban_boards.popular_boards';

  /**
   * Constructs a PopularBoards.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   *   The entity type manager.
   * @param \Drupal\Core\State\StateInterface $state
   *   The state, which holds the board IDs.
   * @param \Drupal\Core\Cache\CacheTagsInvalidatorInterface $cacheTagsInvalidator
   *   Invalidates the listing when the list changes.
   */
  public function __construct(
    private readonly EntityTypeManagerInterface $entityTypeManager,
    private readonly StateInterface $state,
    private readonly CacheTagsInvalidatorInterface $cacheTagsInvalidator,
  ) {}

  /**
   * Loads the popular boards.
   *
   * @return \Drupal\contribkanban_boards\Entity\BoardInterface[]
   *   The boards, in order. Deleted boards are left out.
   */
  public function load(): array {
    $ids = $this->state->get(self::STATE_KEY, []);
    $boards = $this->entityTypeManager->getStorage('board')->loadMultiple($ids);
    return array_values(array_filter(
      $boards,
      static fn ($board) => $board instanceof BoardInterface,
    ));
  }

  /**
   * Makes the given boards the popular ones, in order.
   *
   * @param int[]|string[] $ids
   *   The board IDs, in order.
   */
  public function set(array $ids): void {
    $this->state->set(self::STATE_KEY, array_values($ids));
    $this->cacheTagsInvalidator->invalidateTags([self::CACHE_TAG]);
  }

}
