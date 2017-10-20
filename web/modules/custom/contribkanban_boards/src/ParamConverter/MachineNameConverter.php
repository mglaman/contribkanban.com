<?php

namespace Drupal\contribkanban_boards\ParamConverter;

use Drupal\Core\ParamConverter\EntityConverter;
use Symfony\Component\Routing\Route;

class MachineNameConverter extends EntityConverter {

  /**
   * {@inheritdoc}
   */
  public function convert($value, $definition, $name, array $defaults) {
    $entity_type_id = $this->getEntityTypeFromDefaults($definition, $name, $defaults);
    if ($storage = $this->entityManager->getStorage($entity_type_id)) {
      if (!$entities = $storage->loadByProperties(['machine_name' => $value])) {
        return NULL;
      }
      $entity = reset($entities);
      return $entity;
    }
    return NULL;
  }

  public function applies($definition, $name, Route $route) {
    // @todo boards do not have a machine name.
    return FALSE;
    if (!empty($definition['type']) && strpos($definition['type'], 'entity:') === 0) {
      $entity_type_id = substr($definition['type'], strlen('entity:'));
      return $entity_type_id == 'board';
    }
    return FALSE;
  }

}
