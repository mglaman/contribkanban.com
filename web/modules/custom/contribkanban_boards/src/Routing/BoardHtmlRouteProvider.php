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

  public function getRoutes(EntityTypeInterface $entity_type) {
    $collection = parent::getRoutes($entity_type);
    $entity_type_id = $entity_type->id();
    if ($canonical_route = $this->getCanonicalRoute($entity_type)) {
      $canonical_route->setPath('/sprint/{board}');
      $collection->add("entity.{$entity_type_id}.canonical_alternative", $canonical_route);
    }

    return $collection;
  }

}
