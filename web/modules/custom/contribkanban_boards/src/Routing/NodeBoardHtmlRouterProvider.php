<?php

namespace Drupal\contribkanban_boards\Routing;

use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Entity\Routing\AdminHtmlRouteProvider;

class NodeBoardHtmlRouterProvider extends AdminHtmlRouteProvider {

  /**
   * {@inheritdoc}
   *
   * Lie and say its a string for `machine_name` support.
   */
  protected function getEntityTypeIdKeyType(EntityTypeInterface $entity_type) {
    $field_storage_definitions = $this->entityFieldManager->getFieldStorageDefinitions($entity_type->id());
    return $field_storage_definitions[$entity_type->getKey('uuid')]->getType();
  }

}
