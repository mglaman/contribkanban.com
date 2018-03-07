<?php

namespace Drupal\contribkanban_boards\Controller;

use Drupal\Core\Render\Markup;

class CreateForm {
  public function form() {
    $build['#attached']['library'][] = 'contribkanban_boards/app';
    $build['output'] = [
      '#markup' => Markup::create('<div id="CreateBoardForm"></div>'),
    ];
    return $build;
  }
}
