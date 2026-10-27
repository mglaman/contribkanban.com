<?php

declare(strict_types=1);

namespace Drupal\Tests\contribkanban_boards\Kernel;

use Drupal\contribkanban_boards\Entity\Board;
use Drupal\contribkanban_boards\Form\PopularBoardsForm;
use Drupal\contribkanban_boards\PopularBoards;
use Drupal\Core\Form\FormState;
use Drupal\KernelTests\KernelTestBase;
use PHPUnit\Framework\Attributes\CoversClass;

#[CoversClass(PopularBoards::class)]
#[CoversClass(PopularBoardsForm::class)]
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
    // Provides the autocomplete route the form links to.
    'system',
    'user',
  ];

  /**
   * The board IDs, keyed by title.
   *
   * @var array<string, int|string|null>
   */
  private array $ids = [];

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();
    $this->installEntitySchema('board');
    $this->installEntitySchema('board_list');
    foreach (['Webform', 'Novice', 'Gin'] as $title) {
      $board = Board::create(['type' => 'drupalorg_sprint', 'title' => $title]);
      $board->save();
      $this->ids[$title] = $board->id();
    }
  }

  /**
   * Tests that the list keeps its order and skips deleted boards.
   */
  public function testSetAndLoad(): void {
    $popular = $this->container->get('contribkanban_boards.popular_boards');
    self::assertSame([], $popular->load());

    $popular->set([$this->ids['Gin'], $this->ids['Webform'], $this->ids['Novice']]);
    self::assertSame(['Gin', 'Webform', 'Novice'], $this->titles($popular->load()));

    Board::load($this->ids['Webform'])?->delete();
    self::assertSame(['Gin', 'Novice'], $this->titles($popular->load()));
  }

  /**
   * Tests saving the form while the list is empty.
   */
  public function testFormAddsToEmptyList(): void {
    $this->submit(['add' => "Gin ({$this->ids['Gin']})"]);
    self::assertSame(['Gin'], $this->titles($this->container->get('contribkanban_boards.popular_boards')->load()));
  }

  /**
   * Tests reordering, removing, and adding boards in one save.
   */
  public function testFormReordersRemovesAndAdds(): void {
    $popular = $this->container->get('contribkanban_boards.popular_boards');
    $popular->set([$this->ids['Webform'], $this->ids['Novice'], $this->ids['Gin']]);

    $this->submit([
      'boards' => [
        $this->ids['Webform'] => ['weight' => 2, 'remove' => 0],
        $this->ids['Novice'] => ['weight' => 0, 'remove' => 1],
        $this->ids['Gin'] => ['weight' => 1, 'remove' => 0],
      ],
      'add' => "Novice ({$this->ids['Novice']})",
    ]);
    self::assertSame(['Gin', 'Webform', 'Novice'], $this->titles($popular->load()));
  }

  /**
   * Submits the popular boards form.
   *
   * @param array<string, mixed> $values
   *   The submitted values.
   */
  private function submit(array $values): void {
    $form_state = (new FormState())->setValues($values + ['op' => 'Save']);
    $this->container->get('form_builder')->submitForm(PopularBoardsForm::class, $form_state);
    self::assertSame([], $form_state->getErrors());
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
