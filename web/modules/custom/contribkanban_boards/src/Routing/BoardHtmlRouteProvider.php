<?php

namespace Drupal\contribkanban_boards\Routing;

use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Entity\Routing\AdminHtmlRouteProvider;

class BoardHtmlRouteProvider extends AdminHtmlRouteProvider {

  use NonIntegerIdRoutesTrait;

  /**
   * {@inheritdoc}
   */
  public function getRoutes(EntityTypeInterface $entity_type) {
    $collection = parent::getRoutes($entity_type);
    $entity_type_id = $entity_type->id();
    if ($canonical_route = $this->getCanonicalRoute($entity_type)) {
      $canonical_route->setPath('/sprint/{board}');
      $collection->add("entity.{$entity_type_id}.canonical_alternative", $canonical_route);
    }

    // Boards are routed by machine name.
    return $this->removeIntegerIdRequirement($collection, $entity_type_id);
  }

}
