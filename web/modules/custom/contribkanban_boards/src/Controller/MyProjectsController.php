<?php

declare(strict_types=1);

namespace Drupal\contribkanban_boards\Controller;

final class MyProjectsController {

  /**
   * Builds the page for a board across the projects a viewer maintains.
   *
   * The page is the same for everyone. The board island reads the viewer's
   * GitLab token from their browser, and asks GitLab for their projects.
   *
   * @return array<string, mixed>
   *   A render array.
   */
  public function page(): array {
    return [
      '#type' => 'component',
      '#component' => 'contribkanban:my-projects',
    ];
  }

}
