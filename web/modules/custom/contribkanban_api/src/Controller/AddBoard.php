<?php

namespace Drupal\contribkanban_api\Controller;

use Drupal\contribkanban_api\Projects;
use Drupal\contribkanban_boards\BoardProviderManager;
use Drupal\contribkanban_boards\Entity\Board;
use Drupal\contribkanban_boards\Entity\BoardList;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\HttpException;

final class AddBoard implements ContainerInjectionInterface {

  protected $projectsHelper;

  protected $boardProvider;

  protected $boardStorage;

  /**
   *
   */
  public function __construct(Projects $projects, BoardProviderManager $board_provider, EntityTypeManagerInterface $entity_type_manager) {
    $this->projectsHelper = $projects;
    $this->boardProvider = $board_provider;
    $this->boardStorage = $entity_type_manager->getStorage('board');
  }

  /**
   *
   */
  public static function create(ContainerInterface $container) {
    return new self(
      $container->get('drupalorg_projects'),
      $container->get('plugin.manager.board_provider'),
      $container->get('entity_type.manager')
    );
  }

  /**
   *
   */
  public function handle($machine_name) {
    $machine_name = urldecode($machine_name);
    $project = $this->projectsHelper->getProject($machine_name);

    // @todo use this to assign a category.
    /*
    $bundle = str_replace('project_', 'drupalorg_', $project['projectType']);
    if (preg_match('/commerce|commerce_|dc_/', $machine_name) === 1) {
    $bundle = 'drupalorg_commerce';
    }
     */
    // @endtodo
    $bundle = 'drupalorg_project';
    if (!$this->boardProvider->hasDefinition($bundle)) {
      throw new HttpException(500, 'Unable to determine board type for project');
    }

    $existing_board = $this->boardStorage->loadByProperties(['project_nid' => $project['nid'], 'type' => $bundle]);
    if (!empty($existing_board)) {
      $existing_board = reset($existing_board);
      return new JsonResponse([
        'url' => $existing_board->toUrl()->toString(),
      ], 200);
    }

    $backlog = BoardList::create([
      'type' => $bundle,
      'title' => 'Postponed',
      'statuses' => [4, 16],
    ]);
    $active = BoardList::create([
      'type' => $bundle,
      'title' => 'Active',
      'statuses' => [1],
    ]);
    $needs_work = BoardList::create([
      'type' => $bundle,
      'title' => 'Needs Work',
      'statuses' => [13],
    ]);
    $needs_review = BoardList::create([
      'type' => $bundle,
      'title' => 'Needs Review',
      'statuses' => [8],
    ]);
    $rtbc = BoardList::create([
      'type' => $bundle,
      'title' => 'Reviewed & Tested',
      'statuses' => [14, 15],
    ]);
    $fixed = BoardList::create([
      'type' => $bundle,
      'title' => 'Fixed',
      'statuses' => [2],
    ]);

    $board = Board::create([
      'type' => $bundle,
      'title' => $project['title'],
      'project_nid' => [$project['nid']],
      'machine_name' => $machine_name,
      'lists' => [
        $backlog,
        $active,
        $needs_work,
        $needs_review,
        $rtbc,
        $fixed,
      ],
    ]);
    $board->save();

    return new JsonResponse([
      'url' => $board->toUrl()->toString(),
    ], 201);
  }

}
