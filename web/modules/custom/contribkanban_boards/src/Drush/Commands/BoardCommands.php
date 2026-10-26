<?php

declare(strict_types=1);

namespace Drupal\contribkanban_boards\Drush\Commands;

use Drupal\contribkanban_boards\Entity\BoardInterface;
use Drupal\contribkanban_projects\Projects;
use Drupal\Component\Serialization\Json;
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
   * Drupal.org blocks production's IP address, so production can't fetch the
   * list itself. Export it from a machine that can reach drupal.org, then
   * pass the file to production with --from.
   *
   * @param array{dry-run: bool, export: string|null, from: string|null} $options
   *   The command options.
   */
  #[CLI\Command(name: 'contribkanban:flag-gitlab-boards', aliases: ['ck-gitlab'])]
  #[CLI\Option(name: 'dry-run', description: 'Report what would be flagged without saving.')]
  #[CLI\Option(name: 'export', description: 'Write the moved projects from drupal.org to this JSON file and flag nothing.')]
  #[CLI\Option(name: 'from', description: 'Read the moved projects from this JSON file instead of drupal.org. Use - for stdin.')]
  #[CLI\Usage(name: 'drush contribkanban:flag-gitlab-boards --dry-run', description: 'Show which projects and boards would be flagged.')]
  #[CLI\Usage(name: 'drush ck-gitlab --export=moved.json', description: 'Save the moved projects to a file.')]
  #[CLI\Usage(name: 'drush ck-gitlab --from=- < moved.json', description: 'Flag projects and boards from a saved file.')]
  public function flagGitlabBoards(array $options = ['dry-run' => FALSE, 'export' => NULL, 'from' => NULL]): void {
    $moved = [];
    $projects = is_string($options['from']) ? $this->readProjects($options['from']) : $this->projects->listMigratedProjects();
    foreach ($projects as $project) {
      $moved[$project['nid']] = $project;
    }
    $this->logger()->notice(dt('@count projects on drupal.org have their issues on GitLab.', ['@count' => count($moved)]));
    if (is_string($options['export'])) {
      if (file_put_contents($options['export'], Json::encode(array_values($moved))) === FALSE) {
        throw new \RuntimeException(sprintf('Could not write %s.', $options['export']));
      }
      $this->logger()->success(dt('Wrote them to @file.', ['@file' => $options['export']]));
      return;
    }
    $this->flagProjects($moved, $options['dry-run']);
    $this->flagBoards(array_keys($moved), $options['dry-run']);
  }

  /**
   * Reads moved projects from a file written by --export.
   *
   * @param string $path
   *   The file, or "-" for stdin.
   *
   * @return list<array{nid: string, title: string, machine_name: string, project_type: string}>
   *   The projects.
   */
  private function readProjects(string $path): array {
    $contents = file_get_contents($path === '-' ? 'php://stdin' : $path);
    if ($contents === FALSE) {
      throw new \RuntimeException(sprintf('Could not read %s.', $path));
    }
    $data = Json::decode($contents);
    if (!is_array($data)) {
      throw new \RuntimeException(sprintf('%s does not hold a JSON list of projects.', $path));
    }
    $projects = [];
    foreach ($data as $row) {
      if (!is_array($row) || !is_numeric($row['nid'] ?? NULL) || !is_string($row['machine_name'] ?? NULL) || !is_string($row['title'] ?? NULL) || !is_string($row['project_type'] ?? NULL)) {
        throw new \RuntimeException(sprintf('%s has a project without a numeric nid, title, machine_name, and project_type.', $path));
      }
      $projects[] = [
        'nid' => (string) $row['nid'],
        'title' => $row['title'],
        'machine_name' => $row['machine_name'],
        'project_type' => $row['project_type'],
      ];
    }
    return $projects;
  }

  /**
   * Flags project entities whose issues moved to GitLab.
   *
   * Creates the projects that aren't stored yet, so tag boards and
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
