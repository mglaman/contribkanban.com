<?php

declare(strict_types=1);

namespace Drupal\contribkanban_boards\Controller;

use Drupal\contribkanban_boards\BoardIslandConfig;
use Drupal\contribkanban_boards\Entity\BoardInterface;
use Drupal\Core\DependencyInjection\AutowireTrait;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\HttpFoundation\Request;

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
   * The tags to pick from are the tag boards' tags. With `?project=` naming a
   * project board's machine name, it rolls for that project's issues instead.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The request.
   *
   * @return array<string, mixed>
   *   A render array.
   */
  public function page(Request $request): array {
    $storage = $this->entityTypeManager->getStorage('board');
    $project = NULL;
    $machine_name = $request->query->get('project');
    if (is_string($machine_name) && $machine_name !== '') {
      $ids = $storage->getQuery()
        ->accessCheck(TRUE)
        ->condition('type', 'drupalorg_project')
        ->condition('machine_name', $machine_name)
        ->range(0, 1)
        ->execute();
      $board = $ids ? $storage->load(reset($ids)) : NULL;
      $project = $board instanceof BoardInterface ? $board : NULL;
    }
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
      '#config' => BoardIslandConfig::roulette(array_values($boards), _contribkanban_boards_gitlab_project_nids(), $project),
      '#board' => $project,
      '#cache' => [
        'contexts' => ['url.query_args:project'],
        'tags' => [...$storage->getEntityType()->getListCacheTags(), 'project_list'],
      ],
    ];
  }

}
