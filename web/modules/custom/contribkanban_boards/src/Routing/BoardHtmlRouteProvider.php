<?php

namespace Drupal\contribkanban_boards\Routing;

use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Entity\Routing\AdminHtmlRouteProvider;

class BoardHtmlRouteProvider extends AdminHtmlRouteProvider {

  /**
   * {@inheritdoc}
   *
   * Lie and say its a string for `machine_name` support.
   */
  protected function getEntityTypeIdKeyType(EntityTypeInterface $entity_type) {
    return 'string';
  }
}
