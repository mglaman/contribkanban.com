<?php

declare(strict_types=1);

namespace Drupal\Tests\contribkanban_boards\Kernel;

use Drupal\contribkanban_boards\BoardIslandConfig;
use Drupal\contribkanban_boards\Entity\Board;
use Drupal\contribkanban_boards\Entity\BoardInterface;
use Drupal\contribkanban_boards\Entity\BoardList;
use Drupal\KernelTests\KernelTestBase;

/**
 * @coversDefaultClass \Drupal\contribkanban_boards\BoardIslandConfig
 */
final class BoardIslandConfigTest extends KernelTestBase {

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'contribkanban_boards',
    'entity',
    'inline_entity_form',
    'options',
  ];

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();
    $this->installEntitySchema('board');
    $this->installEntitySchema('board_list');
  }

  /**
   * Creates a saved board with lists.
   *
   * @param string $type
   *   The board type.
   * @param array<string, mixed> $values
   *   The board's field values.
   * @param array<int, array<string, mixed>> $lists
   *   Each list's field values.
   *
   * @return \Drupal\contribkanban_boards\Entity\BoardInterface
   *   The board.
   */
  private function createBoard(string $type, array $values, array $lists): BoardInterface {
    $board = Board::create($values + [
      'type' => $type,
      'lists' => array_map(
        static fn (array $list) => BoardList::create($list + ['type' => $type]),
        $lists,
      ),
    ]);
    $board->save();
    return $board;
  }

  /**
   * Tests that lists get the board's projects and versions.
   *
   * @covers ::build
   */
  public function testDrupalOrgProject(): void {
    $board = $this->createBoard('drupalorg_project', [
      'title' => 'Pathauto',
      'project_nid' => ['17345'],
      'version' => ['8.x-1.x'],
    ], [
      ['title' => 'Postponed', 'statuses' => [4, 16], 'version' => ['8.x-1.x', '2.0.0']],
      ['title' => 'Custom', 'statuses' => [3]],
    ]);

    $config = BoardIslandConfig::build($board, '8.x-2.x');

    self::assertSame('drupalorg', $config['source']);
    self::assertNull($config['gitlabProject']);
    self::assertSame([
      [
        'title' => 'Postponed',
        'tone' => 'postponed',
        'statuses' => ['4', '16'],
        'projects' => ['17345'],
        'tags' => [],
        'versions' => ['8.x-1.x-dev', '2.0.0', '8.x-2.x-dev'],
        'component' => NULL,
      ],
      [
        'title' => 'Custom',
        'tone' => 'neutral',
        'statuses' => ['3'],
        'projects' => ['17345'],
        'tags' => [],
        'versions' => ['8.x-1.x-dev', '8.x-2.x-dev'],
        'component' => NULL,
      ],
    ], $config['lists']);
  }

  /**
   * Tests a project board that reads GitLab.
   *
   * @covers ::build
   */
  public function testGitLabProject(): void {
    $board = $this->createBoard('drupalorg_project', [
      'title' => 'Drupal Canvas',
      'machine_name' => 'canvas',
      'project_nid' => ['2431121'],
      'gitlab_work_items' => TRUE,
    ], [
      ['title' => 'Needs review', 'statuses' => [8]],
    ]);

    $config = BoardIslandConfig::build($board);

    self::assertSame('gitlab', $config['source']);
    self::assertSame('project/canvas', $config['gitlabProject']);
    self::assertSame('needs-review', $config['lists'][0]['tone']);
  }

  /**
   * Tests that core component lists keep their component.
   *
   * @covers ::build
   */
  public function testCoreComponent(): void {
    $board = $this->createBoard('drupalorg_core', [
      'title' => 'Layout Builder',
    ], [
      ['title' => 'Active', 'statuses' => [1], 'project_nid' => ['3060'], 'component' => 'layout_builder.module'],
    ]);

    $list = BoardIslandConfig::build($board)['lists'][0];

    self::assertSame(['3060'], $list['projects']);
    self::assertSame('layout_builder.module', $list['component']);
  }

}
