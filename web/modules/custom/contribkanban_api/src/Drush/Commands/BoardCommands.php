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
   * Flags projects and project boards that moved to GitLab work items.
   *
   * Tag boards and issue collections read the project flags to load moved
   * projects' issues from GitLab. Project boards switch to GitLab.
   *
   * Only sets flags, never clears them. Unflagged projects and boards are
   * checked again on each run.
   *
   * @param array{dry-run: bool} $options
   *   The command options.
   */
  #[CLI\Command(name: 'contribkanban:flag-gitlab-boards', aliases: ['ck-gitlab'])]
  #[CLI\Option(name: 'dry-run', description: 'Report what would be flagged without saving.')]
  #[CLI\Usage(name: 'drush contribkanban:flag-gitlab-boards --dry-run', description: 'Show which projects and boards would be flagged.')]
  public function flagGitlabBoards(array $options = ['dry-run' => FALSE]): void {
    $moved = [];
    foreach ($this->projects->listMigratedProjects() as $project) {
      $moved[$project['nid']] = $project;
    }
    $this->logger()->notice(dt('@count projects on drupal.org have their issues on GitLab.', ['@count' => count($moved)]));
    $this->flagProjects($moved, $options['dry-run']);
    $this->flagBoards(array_keys($moved), $options['dry-run']);
  }

  /**
   * Flags project entities whose issues moved to GitLab.
   *
   * Creates the projects the scraper hasn't stored yet, so tag boards and
   * issue collections know about every moved project.
   *
   * @param array<string, array{nid: string, title: string, machine_name: string, project_type: string}> $moved
   *   The projects whose issues moved, by node ID.
   * @param bool $dry_run
   *   Whether to only count them.
   */
  private function flagProjects(array $moved, bool $dry_run): void {
    $storage = $this->entityTypeManager->getStorage('project');
    $flagged = 0;
    $created = 0;
    foreach (array_chunk($moved, 500, TRUE) as $chunk) {
      $ids = $storage->getQuery()
        ->accessCheck(FALSE)
        ->condition('nid', array_map('strval', array_keys($chunk)), 'IN')
        ->execute();
      foreach ($storage->loadMultiple($ids) as $project) {
        unset($chunk[$project->get('nid')->value]);
        if ($project->get('gitlab_issues')->value) {
          continue;
        }
        $flagged++;
        if (!$dry_run) {
          $project->set('gitlab_issues', TRUE)->save();
        }
      }
      $created += count($chunk);
      if (!$dry_run) {
        foreach ($chunk as $data) {
          $storage->create([
            'nid' => $data['nid'],
            'name' => $data['title'],
            'machine_name' => $data['machine_name'],
            'project_type' => $data['project_type'],
            'gitlab_issues' => TRUE,
          ])->save();
        }
      }
    }
    $message = $dry_run ? 'Would flag @flagged projects and create @created.' : 'Flagged @flagged projects and created @created.';
    $this->logger()->success(dt($message, ['@flagged' => $flagged, '@created' => $created]));
  }

  /**
   * Flags project boards whose project moved to GitLab.
   *
   * @param string[] $moved
   *   Node IDs of projects whose issues moved.
   * @param bool $dry_run
   *   Whether to only list them.
   */
  private function flagBoards(array $moved, bool $dry_run): void {
    $storage = $this->entityTypeManager->getStorage('board');
    $query = $storage->getQuery()
      ->accessCheck(FALSE)
      ->condition('type', 'drupalorg_project');
    $unflagged = $query->orConditionGroup()
      ->notExists('gitlab_work_items')
      ->condition('gitlab_work_items', 0);
    $ids = $query->condition($unflagged)->execute();

    $moved = array_flip($moved);
    $flagged = 0;
    foreach ($storage->loadMultiple($ids) as $board) {
      assert($board instanceof BoardInterface);
      $nid = (string) $board->get('project_nid')->value;
      if (!isset($moved[$nid])) {
        continue;
      }
      $this->logger()->notice(dt('@machine_name (@nid)', [
        '@machine_name' => $board->get('machine_name')->value,
        '@nid' => $nid,
      ]));
      if (!$dry_run) {
        $board->set('gitlab_work_items', TRUE)->save();
      }
      $flagged++;
    }

    $message = $dry_run ? 'Would flag @count of @total unflagged project boards.' : 'Flagged @count of @total unflagged project boards.';
    $this->logger()->success(dt($message, [
      '@count' => $flagged,
      '@total' => count($ids),
    ]));
  }

}
