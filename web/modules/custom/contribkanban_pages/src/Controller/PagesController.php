<?php

namespace Drupal\contribkanban_pages\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Render\Markup;
use Drupal\Core\Routing\RouteMatch;
use Drupal\Core\Routing\RouteMatchInterface;
use Symfony\Component\HttpFoundation\Request;

class PagesController extends ControllerBase {

  public function on404(\Exception $exception, Request $request, RouteMatchInterface $match) {
    return [
      '#theme' => 'page_not_found',
      '#previous' => get_class($exception->getPrevious()),
      '#message' => '',
    ];
  }

}
