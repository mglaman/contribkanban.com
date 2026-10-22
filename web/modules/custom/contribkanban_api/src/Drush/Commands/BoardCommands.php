<?php

declare(strict_types=1);

namespace Drupal\contribkanban_api\Drush\Commands;

use Drupal\contribkanban_api\Projects;
use Drupal\contribkanban_boards\Entity\BoardInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drush\Attributes as CLI;
use Drush\Commands\DrushCommands;
use Symfony\Component\DependencyInjection\ContainerInterface;

final class BoardCommands extends DrushCommands {

  public function __construct(
    private readonly EntityTypeManagerInterface $entityTypeManager,
    private readonly Projects $projects,
  ) {
    parent::__construct();
  }

  /**
   * Creates the command with its services.
   */
  public static function create(ContainerInterface $container): self {
    return new self(
      $container->get('entity_type.manager'),
      $container->get('drupalorg_projects'),
    );
  }

  /**
   * Flags project boards whose project moved to GitLab work items.
   *
   * Only sets the flag, never clears it. Boards created before their project
   * migrated are unchecked, so they are checked again on each run.
   *
   * @param array{dry-run: bool} $options
   *   The command options.
   */
  #[CLI\Command(name: 'contribkanban:flag-gitlab-boards', aliases: ['ck-gitlab'])]
  #[CLI\Option(name: 'dry-run', description: 'List the boards without saving them.')]
  #[CLI\Usage(name: 'drush contribkanban:flag-gitlab-boards --dry-run', description: 'Show which boards would be flagged.')]
  public function flagGitlabBoards(array $options = ['dry-run' => FALSE]): void {
    $storage = $this->entityTypeManager->getStorage('board');
    $query = $storage->getQuery()
      ->accessCheck(FALSE)
      ->condition('type', 'drupalorg_project');
    $unflagged = $query->orConditionGroup()
      ->notExists('gitlab_work_items')
      ->condition('gitlab_work_items', FALSE);
    $ids = $query->condition($unflagged)->execute();

    /** @var \Drupal\contribkanban_boards\Entity\BoardInterface[] $boards */
    $boards = $storage->loadMultiple($ids);
    $nids = array_map(
      static fn (BoardInterface $board): string => (string) $board->get('project_nid')->value,
      $boards
    );
    $migrated = $this->projects->getMigratedProjectNids(array_filter($nids));

    $flagged = 0;
    foreach ($boards as $id => $board) {
      if (!in_array($nids[$id], $migrated, TRUE)) {
        continue;
      }
      $this->logger()->notice(dt('@machine_name (@nid)', [
        '@machine_name' => $board->get('machine_name')->value,
        '@nid' => $nids[$id],
      ]));
      if (!$options['dry-run']) {
        $board->set('gitlab_work_items', TRUE)->save();
      }
      $flagged++;
    }

    $message = $options['dry-run'] ? 'Would flag @count of @total unflagged project boards.' : 'Flagged @count of @total unflagged project boards.';
    $this->logger()->success(dt($message, [
      '@count' => $flagged,
      '@total' => count($boards),
    ]));
  }

}
