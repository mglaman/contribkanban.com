<?php

namespace Drupal\contribkanban_pages\Controller;

use Drupal\Core\Controller\ControllerBase;

class PagesController extends ControllerBase
{

  public function on404(\Exception $exception = null)
  {
    return [
      '#theme' => 'page_not_found',
      '#previous' => $exception ? get_class($exception->getPrevious()) : null,
      '#message' => '',
    ];
  }
}
