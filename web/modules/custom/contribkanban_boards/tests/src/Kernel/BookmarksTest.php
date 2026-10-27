<?php

declare(strict_types=1);

namespace Drupal\Tests\contribkanban_boards\Kernel;

use Drupal\contribkanban_boards\Bookmarks;
use Drupal\contribkanban_boards\Entity\Board;
use Drupal\contribkanban_boards\Entity\BoardInterface;
use Drupal\Core\Session\AnonymousUserSession;
use Drupal\KernelTests\Core\Entity\EntityKernelTestBase;
use PHPUnit\Framework\Attributes\CoversClass;

#[CoversClass(Bookmarks::class)]
final class BookmarksTest extends EntityKernelTestBase {

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'contribkanban_boards',
    'contribkanban_projects',
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
    $this->installSchema('user', ['users_data']);
  }

  /**
   * Creates a saved project board.
   */
  private function createBoard(string $title): BoardInterface {
    $board = Board::create(['type' => 'drupalorg_project', 'title' => $title, 'project_nid' => ['1']]);
    $board->save();
    return $board;
  }

  /**
   * Tests that each user keeps their own bookmarks, most recent first.
   */
  public function testToggle(): void {
    $bookmarks = $this->container->get('contribkanban_boards.bookmarks');
    $tool = $this->createBoard('Tool API');
    $canvas = $this->createBoard('Canvas');
    $matt = $this->createUser();
    $f0ns = $this->createUser();

    self::assertTrue($bookmarks->toggle($matt, $tool));
    self::assertTrue($bookmarks->toggle($matt, $canvas));
    self::assertSame(['Canvas', 'Tool API'], array_map(
      static fn (BoardInterface $board): string => (string) $board->label(),
      $bookmarks->boards($matt),
    ));
    self::assertTrue($bookmarks->has($matt, $tool));
    self::assertFalse($bookmarks->has($f0ns, $tool));

    self::assertFalse($bookmarks->toggle($matt, $tool));
    self::assertSame([(int) $canvas->id()], $bookmarks->ids($matt));
  }

  /**
   * Tests that deleted boards drop out of a user's bookmarks.
   */
  public function testDeletedBoard(): void {
    $bookmarks = $this->container->get('contribkanban_boards.bookmarks');
    $tool = $this->createBoard('Tool API');
    $matt = $this->createUser();
    $bookmarks->toggle($matt, $tool);
    $tool->delete();

    self::assertSame([], $bookmarks->boards($matt));
  }

  /**
   * Tests that anonymous users have no bookmarks.
   */
  public function testAnonymous(): void {
    $bookmarks = $this->container->get('contribkanban_boards.bookmarks');
    self::assertSame([], $bookmarks->ids(new AnonymousUserSession()));
  }

}
