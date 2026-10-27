<?php

declare(strict_types=1);

namespace Drupal\Tests\contribkanban_boards\Kernel;

use Drupal\contribkanban_boards\Entity\Board;
use Drupal\contribkanban_boards\PopularBoards;
use Drupal\KernelTests\KernelTestBase;
use PHPUnit\Framework\Attributes\CoversClass;

#[CoversClass(PopularBoards::class)]
final class PopularBoardsTest extends KernelTestBase {

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
   * Tests picking, reordering, and removing popular boards.
   */
  public function testSetAndLoad(): void {
    $ids = [];
    foreach (['Webform', 'Novice', 'Gin'] as $title) {
      $board = Board::create(['type' => 'drupalorg_sprint', 'title' => $title]);
      $board->save();
      $ids[$title] = $board->id();
    }
    $popular = $this->container->get('contribkanban_boards.popular_boards');
    self::assertSame([], $popular->load());

    $popular->set([$ids['Gin'], $ids['Webform']]);
    self::assertSame(['Gin', 'Webform'], $this->titles($popular->load()));

    $popular->set([$ids['Webform'], $ids['Novice']]);
    self::assertSame(['Webform', 'Novice'], $this->titles($popular->load()));
    $this->container->get('entity_type.manager')->getStorage('board')->resetCache();
    $gin = Board::load($ids['Gin']);
    self::assertNotNull($gin);
    self::assertTrue($gin->get('popular_weight')->isEmpty());

    $popular->set([]);
    self::assertSame([], $popular->load());
  }

  /**
   * Gets board titles.
   *
   * @param \Drupal\contribkanban_boards\Entity\BoardInterface[] $boards
   *   The boards.
   *
   * @return string[]
   *   Their titles.
   */
  private function titles(array $boards): array {
    return array_map(static fn ($board) => (string) $board->label(), $boards);
  }

}
