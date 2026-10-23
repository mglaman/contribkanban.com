<?php

declare(strict_types=1);

namespace Drupal\contribkanban_boards;

use Drupal\Core\Entity\EntityTypeManagerInterface;

/**
 * Picks a machine name no other board uses.
 *
 * Boards are routed by machine name, so two boards with the same name make
 * one of them unreachable. Project and tag boards can collide, such as the
 * mongodb project and the mongodb issue tag.
 */
final class BoardMachineNames {

  /**
   * Constructs a BoardMachineNames service.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   *   The entity type manager.
   */
  public function __construct(
    private readonly EntityTypeManagerInterface $entityTypeManager,
  ) {}

  /**
   * Returns the machine name, or a suffixed one if a board already uses it.
   *
   * @param string $machine_name
   *   The preferred machine name.
   * @param string $suffix
   *   Appended when the preferred name is taken, such as "tag".
   * @param int|null $exclude_id
   *   A board ID to ignore, for renaming an existing board.
   *
   * @return string
   *   A machine name no other board uses.
   */
  public function unique(string $machine_name, string $suffix, ?int $exclude_id = NULL): string {
    $candidate = $machine_name;
    $counter = 1;
    while ($this->isTaken($candidate, $exclude_id)) {
      $candidate = $machine_name . '-' . $suffix . ($counter > 1 ? '-' . $counter : '');
      $counter++;
    }
    return $candidate;
  }

  /**
   * Checks whether a board other than the excluded one uses a machine name.
   */
  private function isTaken(string $machine_name, ?int $exclude_id): bool {
    $query = $this->entityTypeManager->getStorage('board')->getQuery()
      ->accessCheck(FALSE)
      ->condition('machine_name', $machine_name);
    if ($exclude_id !== NULL) {
      $query->condition('board_id', $exclude_id, '<>');
    }
    return (bool) $query->count()->execute();
  }

}
