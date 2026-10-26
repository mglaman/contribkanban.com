<?php

declare(strict_types=1);

namespace Drupal\Tests\contribkanban_boards\Kernel;

use Drupal\contribkanban_boards\Drush\Commands\BoardCommands;
use Drupal\contribkanban_boards\Entity\Board;
use Drupal\contribkanban_projects\Entity\Project;
use Drupal\contribkanban_projects\Projects;
use Drupal\KernelTests\KernelTestBase;
use Drush\Log\DrushLoggerManager;
use PHPUnit\Framework\Attributes\CoversClass;

#[CoversClass(BoardCommands::class)]
final class FlagGitlabBoardsTest extends KernelTestBase {

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
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

    $command->flagGitlabBoards(['dry-run' => FALSE, 'export' => NULL, 'from' => NULL]);

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

    $command->flagGitlabBoards(['dry-run' => TRUE, 'export' => NULL, 'from' => NULL]);

    $projects = Project::loadMultiple();
    self::assertCount(1, $projects);
    self::assertFalse((bool) reset($projects)->get('gitlab_issues')->value);
  }

  /**
   * Tests that a file exported on one site flags projects on another.
   */
  public function testExportAndFrom(): void {
    $file = tempnam(sys_get_temp_dir(), 'ck-gitlab');
    $projects = $this->createMock(Projects::class);
    $projects->method('listMigratedProjects')->willReturnCallback(static function (): \Generator {
      yield ['nid' => '2350161', 'title' => 'Copyscape', 'machine_name' => 'copyscape', 'project_type' => 'full'];
    });
    $command = new BoardCommands($this->container->get('entity_type.manager'), $projects);
    $command->setLogger(new DrushLoggerManager());

    $command->flagGitlabBoards(['dry-run' => FALSE, 'export' => $file, 'from' => NULL]);
    $count = $this->container->get('entity_type.manager')->getStorage('project')->getQuery()->accessCheck(FALSE)->count()->execute();
    self::assertSame(0, $count, 'Exporting saves nothing.');

    // Production can't reach drupal.org, so it reads the file instead.
    $blocked = $this->createMock(Projects::class);
    $blocked->expects(self::never())->method('listMigratedProjects');
    $command = new BoardCommands($this->container->get('entity_type.manager'), $blocked);
    $command->setLogger(new DrushLoggerManager());

    $command->flagGitlabBoards(['dry-run' => FALSE, 'export' => NULL, 'from' => $file]);
    unlink($file);

    $flags = [];
    foreach (Project::loadMultiple() as $project) {
      $flags[$project->get('machine_name')->value] = (bool) $project->get('gitlab_issues')->value;
    }
    self::assertSame(['copyscape' => TRUE], $flags);
  }

  /**
   * Tests that a malformed file stops the command before saving anything.
   */
  public function testFromRejectsMalformedFile(): void {
    $file = tempnam(sys_get_temp_dir(), 'ck-gitlab');
    file_put_contents($file, '[{"nid": "2350161"}]');
    $command = new BoardCommands($this->container->get('entity_type.manager'), $this->createMock(Projects::class));
    $command->setLogger(new DrushLoggerManager());

    try {
      $command->flagGitlabBoards(['dry-run' => FALSE, 'export' => NULL, 'from' => $file]);
      self::fail('A malformed file should throw.');
    }
    catch (\RuntimeException $e) {
      self::assertStringContainsString('without a numeric nid', $e->getMessage());
    }
    finally {
      unlink($file);
    }
    self::assertCount(0, Project::loadMultiple());
  }

}
