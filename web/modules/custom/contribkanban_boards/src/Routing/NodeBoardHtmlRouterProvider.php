<?php

namespace Drupal\contribkanban_boards\Routing;

use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Entity\Routing\DefaultHtmlRouteProvider;

class NodeBoardHtmlRouterProvider extends DefaultHtmlRouteProvider {

  use NonIntegerIdRoutesTrait;

  /**
   * {@inheritdoc}
   */
  public function getRoutes(EntityTypeInterface $entity_type) {
    // Node boards are routed by UUID. Their forms use the front-end theme,
    // since their owners edit them.
    return $this->removeIntegerIdRequirement(parent::getRoutes($entity_type), $entity_type->id());
  }

}
