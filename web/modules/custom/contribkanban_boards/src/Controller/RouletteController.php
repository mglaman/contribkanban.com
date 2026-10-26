<?php

declare(strict_types=1);

namespace Drupal\contribkanban_boards\Controller;

use Drupal\contribkanban_boards\BoardIslandConfig;
use Drupal\contribkanban_boards\Entity\BoardInterface;
use Drupal\Core\DependencyInjection\AutowireTrait;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;

final class RouletteController implements ContainerInjectionInterface {

  use AutowireTrait;

  /**
   * Constructs the controller.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   *   The entity type manager.
   */
  public function __construct(
    private readonly EntityTypeManagerInterface $entityTypeManager,
  ) {}

  /**
   * Builds the issue roulette page, which rolls for an issue with a tag.
   *
   * The tags to pick from are the tag boards' tags.
   *
   * @return array<string, mixed>
   *   A render array.
   */
  public function page(): array {
    $storage = $this->entityTypeManager->getStorage('board');
    $ids = $storage->getQuery()
      ->accessCheck(TRUE)
      ->condition('type', 'drupalorg_sprint')
      ->sort('title')
      ->execute();
    $boards = array_filter(
      $storage->loadMultiple($ids),
      static fn ($board): bool => $board instanceof BoardInterface,
    );
    return [
      '#theme' => 'issue_roulette',
      '#config' => BoardIslandConfig::roulette(array_values($boards), _contribkanban_boards_gitlab_project_nids()),
      '#cache' => ['tags' => [...$storage->getEntityType()->getListCacheTags(), 'project_list']],
    ];
  }

}
