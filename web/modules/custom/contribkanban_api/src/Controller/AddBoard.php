<?php

namespace Drupal\contribkanban_api\Controller;

use Drupal\contribkanban_api\Projects;
use Drupal\contribkanban_boards\BoardProviderManager;
use Drupal\contribkanban_boards\Entity\Board;
use Drupal\contribkanban_boards\Entity\BoardInterface;
use Drupal\contribkanban_boards\Entity\BoardList;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\HttpException;

final class AddBoard implements ContainerInjectionInterface {

  /**
   * Constructs an AddBoard controller.
   *
   * @param \Drupal\contribkanban_api\Projects $projectsHelper
   *   Looks up projects on drupal.org.
   * @param \Drupal\contribkanban_boards\BoardProviderManager $boardProvider
   *   The board provider plugin manager.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   *   The entity type manager.
   */
  public function __construct(
    private readonly Projects $projectsHelper,
    private readonly BoardProviderManager $boardProvider,
    private readonly EntityTypeManagerInterface $entityTypeManager,
  ) {}

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new self(
      $container->get('drupalorg_projects'),
      $container->get('plugin.manager.board_provider'),
      $container->get('entity_type.manager')
    );
  }

  /**
   * Creates a board for a drupal.org project, or returns the existing one.
   *
   * @param string $machine_name
   *   The project's machine name.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   The board's machine name, with 201 if created or 200 if it existed, or
   *   the validation errors with 422.
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

    $board_storage = $this->entityTypeManager->getStorage('board');
    $existing_board = $board_storage->loadByProperties(['project_nid' => $project['nid'], 'type' => $bundle]);
    if (!empty($existing_board)) {
      $existing_board = reset($existing_board);
      assert($existing_board instanceof BoardInterface);
      return new JsonResponse([
        'machine_name' => $existing_board->get('machine_name')->value,
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
      // Projects without a Drupal.org issue queue have moved to GitLab.
      'gitlab_work_items' => $project['hasIssues'] === FALSE,
      'lists' => [
        $backlog,
        $active,
        $needs_work,
        $needs_review,
        $rtbc,
        $fixed,
      ],
    ]);
    $violations = $board->validate();
    if ($violations->count() > 0) {
      $errors = [];
      foreach ($violations as $violation) {
        $errors[$violation->getPropertyPath()] = strip_tags((string) $violation->getMessage());
      }
      return new JsonResponse(['errors' => $errors], 422);
    }
    $board->save();

    return new JsonResponse([
      'machine_name' => $board->get('machine_name')->value,
    ], 201);
  }

}
