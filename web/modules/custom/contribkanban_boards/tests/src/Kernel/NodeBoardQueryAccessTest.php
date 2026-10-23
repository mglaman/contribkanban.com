<?php

declare(strict_types=1);

namespace Drupal\Tests\contribkanban_boards\Kernel;

use Drupal\contribkanban_boards\Entity\NodeBoard;
use Drupal\KernelTests\Core\Entity\EntityKernelTestBase;
use PHPUnit\Framework\Attributes\Group;
use PHPUnit\Framework\Attributes\RunTestsInSeparateProcesses;

/**
 * Verifies entity queries return the issue collections a user owns.
 */
#[Group('contribkanban_boards')]
#[RunTestsInSeparateProcesses]
class NodeBoardQueryAccessTest extends EntityKernelTestBase {

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
    $this->installEntitySchema('node_board');
  }

  /**
   * Tests that "view own" covers queries, not just loaded entities.
   */
  public function testOwnerQuery(): void {
    // User 1 bypasses access checks.
    $this->createUser();
    $owner = $this->createUser(['view own node_board']);
    $other = $this->createUser(['view own node_board']);
    foreach ([NodeBoard::IS_PRIVATE, NodeBoard::IS_SHARED, NodeBoard::IS_PUBLIC] as $collaboration) {
      NodeBoard::create([
        'title' => $collaboration,
        'uid' => $owner->id(),
        'collaboration' => $collaboration,
      ])->save();
    }
    $query = fn () => $this->container->get('entity_type.manager')
      ->getStorage('node_board')
      ->getQuery()
      ->accessCheck(TRUE)
      ->execute();

    $this->setCurrentUser($owner);
    $this->assertCount(3, $query());
    $this->setCurrentUser($other);
    $this->assertCount(0, $query());
  }

}
