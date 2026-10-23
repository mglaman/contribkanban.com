<?php

declare(strict_types=1);

namespace Drupal\contribkanban_api\Controller;

use Drupal\contribkanban_boards\Entity\BoardInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

trait BoardResponseTrait {

  /**
   * Saves a new board and responds with its machine name.
   *
   * @param \Drupal\contribkanban_boards\Entity\BoardInterface $board
   *   An existing board, or a new one from the board factory.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   The board's machine name, with 201 if created or 200 if it existed, or
   *   the validation errors with 422.
   */
  protected function saveBoard(BoardInterface $board): JsonResponse {
    if (!$board->isNew()) {
      return new JsonResponse(['machine_name' => $board->get('machine_name')->value], 200);
    }
    $violations = $board->validate();
    if ($violations->count() > 0) {
      $errors = [];
      foreach ($violations as $violation) {
        $errors[$violation->getPropertyPath()] = strip_tags((string) $violation->getMessage());
      }
      return new JsonResponse(['errors' => $errors], 422);
    }
    $board->save();
    return new JsonResponse(['machine_name' => $board->get('machine_name')->value], 201);
  }

}
