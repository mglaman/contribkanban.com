<?php

declare(strict_types=1);

namespace Drupal\contribkanban_boards;

use Drupal\contribkanban_boards\Entity\BoardInterface;
use Drupal\Core\Cache\CacheTagsInvalidatorInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\KeyValueStore\KeyValueFactoryInterface;

/**
 * Loads and orders the boards curated as popular searches.
 *
 * The list is site content rather than config, so it lives in key/value and
 * config imports leave it alone.
 */
final class PopularBoards {

  /**
   * The cache tag invalidated when the list changes.
   */
  public const CACHE_TAG = 'contribkanban_popular_boards';

  /**
   * The key/value collection.
   */
  private const COLLECTION = 'contribkanban_boards';

  /**
   * The key for the board IDs.
   */
  private const KEY = 'popular_boards';

  /**
   * Constructs a PopularBoards.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   *   The entity type manager.
   * @param \Drupal\Core\KeyValueStore\KeyValueFactoryInterface $keyValueFactory
   *   The key/value factory, whose collection holds the board IDs.
   * @param \Drupal\Core\Cache\CacheTagsInvalidatorInterface $cacheTagsInvalidator
   *   Invalidates the listing when the list changes.
   */
  public function __construct(
    private readonly EntityTypeManagerInterface $entityTypeManager,
    private readonly KeyValueFactoryInterface $keyValueFactory,
    private readonly CacheTagsInvalidatorInterface $cacheTagsInvalidator,
  ) {}

  /**
   * Loads the popular boards.
   *
   * @return list<\Drupal\contribkanban_boards\Entity\BoardInterface>
   *   The boards, in order. Deleted boards are left out.
   */
  public function load(): array {
    $ids = $this->keyValueFactory->get(self::COLLECTION)->get(self::KEY, []);
    $boards = $this->entityTypeManager->getStorage('board')->loadMultiple($ids);
    return array_values(array_filter(
      $boards,
      static fn ($board): bool => $board instanceof BoardInterface,
    ));
  }

  /**
   * Makes the given boards the popular ones, in order.
   *
   * @param list<int|string> $ids
   *   The board IDs, in order.
   */
  public function set(array $ids): void {
    $this->keyValueFactory->get(self::COLLECTION)->set(self::KEY, array_values($ids));
    $this->cacheTagsInvalidator->invalidateTags([self::CACHE_TAG]);
  }

}
