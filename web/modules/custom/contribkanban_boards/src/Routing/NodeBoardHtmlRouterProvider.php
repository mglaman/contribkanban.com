<?php

namespace Drupal\contribkanban_boards\Routing;

use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Entity\Routing\AdminHtmlRouteProvider;

class NodeBoardHtmlRouterProvider extends AdminHtmlRouteProvider {

  use NonIntegerIdRoutesTrait;

  /**
   * {@inheritdoc}
   */
  public function getRoutes(EntityTypeInterface $entity_type) {
    // Node boards are routed by UUID.
    return $this->removeIntegerIdRequirement(parent::getRoutes($entity_type), $entity_type->id());
  }

}
