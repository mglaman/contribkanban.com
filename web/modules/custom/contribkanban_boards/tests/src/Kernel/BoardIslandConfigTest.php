<?php

declare(strict_types=1);

namespace Drupal\Tests\contribkanban_boards\Kernel;

use Drupal\contribkanban_boards\BoardIslandConfig;
use Drupal\contribkanban_boards\Entity\Board;
use Drupal\contribkanban_boards\Entity\BoardInterface;
use Drupal\contribkanban_boards\Entity\BoardList;
use Drupal\contribkanban_boards\Entity\NodeBoard;
use Drupal\KernelTests\KernelTestBase;
use PHPUnit\Framework\Attributes\CoversClass;

#[CoversClass(BoardIslandConfig::class)]
final class BoardIslandConfigTest extends KernelTestBase {

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

    $config = BoardIslandConfig::build($board, '8.x-2.x', [2350161]);

    self::assertSame('drupalorg', $config['source']);
    self::assertNull($config['gitlabProject']);
    self::assertNull($config['gitlabLabel']);
    self::assertSame([], $config['movedProjects']);
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
   * Tests that tag boards also read GitLab, by a label named after the tag.
   */
  public function testTag(): void {
    $board = $this->createBoard('drupalorg_sprint', [
      'title' => 'Coding standards',
      'tag' => ['1234'],
    ], [
      ['title' => 'Active', 'statuses' => [1]],
    ]);

    $config = BoardIslandConfig::build($board, '', [2350161]);

    self::assertSame('drupalorg', $config['source']);
    self::assertSame('Coding standards', $config['gitlabLabel']);
    self::assertSame([2350161], $config['movedProjects']);
    self::assertSame(['1234'], $config['lists'][0]['tags']);
  }

  /**
   * Tests that core component lists keep their component.
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

  /**
   * Tests an issue collection's fixed lists, node IDs, and work items.
   */
  public function testCollection(): void {
    $collection = NodeBoard::create([
      'title' => 'Looking for work',
      'nids' => ['3512345', 'project/tool#3583123', '2924212', '3512345', 'project/mcp#3587791'],
      'collaboration' => NodeBoard::IS_SHARED,
    ]);

    $config = BoardIslandConfig::collection($collection, [2350161]);

    self::assertSame('drupalorg', $config['source']);
    self::assertSame(['3512345', '2924212'], $config['nids']);
    self::assertSame([
      ['path' => 'project/tool', 'iid' => '3583123'],
      ['path' => 'project/mcp', 'iid' => '3587791'],
    ], $config['workItems']);
    self::assertSame([2350161], $config['movedProjects']);
    self::assertSame(
      ['Postponed', 'Active', 'Needs work', 'Needs review', 'Reviewed & tested', 'Fixed'],
      array_column($config['lists'], 'title'),
    );
    self::assertSame(['14', '15'], $config['lists'][4]['statuses']);
    self::assertSame('rtbc', $config['lists'][4]['tone']);
  }

}
