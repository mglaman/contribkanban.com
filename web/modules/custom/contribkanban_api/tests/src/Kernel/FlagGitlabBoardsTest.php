<?php

declare(strict_types=1);

namespace Drupal\Tests\contribkanban_api\Kernel;

use Drupal\contribkanban_api\Drush\Commands\BoardCommands;
use Drupal\contribkanban_api\Projects;
use Drupal\contribkanban_boards\Entity\Board;
use Drupal\contribkanban_projects\Entity\Project;
use Drupal\KernelTests\KernelTestBase;
use Drush\Log\DrushLoggerManager;
use PHPUnit\Framework\Attributes\CoversClass;

#[CoversClass(BoardCommands::class)]
final class FlagGitlabBoardsTest extends KernelTestBase {

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'contribkanban_api',
    'contribkanban_boards',
    'contribkanban_projects',
    'entity',
    'inline_entity_form',
    'options',
    'user',
  ];

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();
    $this->installEntitySchema('project');
    $this->installEntitySchema('board');
    $this->installEntitySchema('board_list');
    // Drush defines dt() in a file it loads at runtime.
    require_once DRUPAL_ROOT . '/../vendor/drush/drush/includes/output.inc';
  }

  /**
   * Tests that moved projects and their project boards get flagged.
   */
  public function testFlagsMovedProjectsAndBoards(): void {
    foreach (['2350161' => 'copyscape', '17345' => 'pathauto'] as $nid => $machine_name) {
      Project::create(['nid' => $nid, 'machine_name' => $machine_name, 'name' => $machine_name])->save();
      Board::create([
        'type' => 'drupalorg_project',
        'title' => $machine_name,
        'machine_name' => $machine_name,
        'project_nid' => [$nid],
      ])->save();
    }
    $projects = $this->createMock(Projects::class);
    $projects->method('listMigratedProjects')->willReturnCallback(static function (): \Generator {
      yield ['nid' => '2350161', 'title' => 'Copyscape', 'machine_name' => 'copyscape', 'project_type' => 'full'];
      yield ['nid' => '3500000', 'title' => 'New', 'machine_name' => 'new', 'project_type' => 'full'];
    });
    $command = new BoardCommands($this->container->get('entity_type.manager'), $projects);
    $command->setLogger(new DrushLoggerManager());

    $command->flagGitlabBoards(['dry-run' => FALSE]);

    $flags = [];
    foreach (Project::loadMultiple() as $project) {
      $flags[$project->get('nid')->value] = (bool) $project->get('gitlab_issues')->value;
    }
    // The scraper hadn't stored 3500000 yet.
    self::assertSame(['2350161' => TRUE, '17345' => FALSE, '3500000' => TRUE], $flags);
    $boards = [];
    foreach (Board::loadMultiple() as $board) {
      $boards[$board->get('machine_name')->value] = (bool) $board->get('gitlab_work_items')->value;
    }
    self::assertSame(['copyscape' => TRUE, 'pathauto' => FALSE], $boards);
  }

  /**
   * Tests that a dry run saves nothing.
   */
  public function testDryRun(): void {
    Project::create(['nid' => '2350161', 'machine_name' => 'copyscape', 'name' => 'copyscape'])->save();
    $projects = $this->createMock(Projects::class);
    $projects->method('listMigratedProjects')->willReturnCallback(static function (): \Generator {
      yield ['nid' => '2350161', 'title' => 'Copyscape', 'machine_name' => 'copyscape', 'project_type' => 'full'];
      yield ['nid' => '3500000', 'title' => 'New', 'machine_name' => 'new', 'project_type' => 'full'];
    });
    $command = new BoardCommands($this->container->get('entity_type.manager'), $projects);
    $command->setLogger(new DrushLoggerManager());

    $command->flagGitlabBoards(['dry-run' => TRUE]);

    $projects = Project::loadMultiple();
    self::assertCount(1, $projects);
    self::assertFalse((bool) reset($projects)->get('gitlab_issues')->value);
  }

}
