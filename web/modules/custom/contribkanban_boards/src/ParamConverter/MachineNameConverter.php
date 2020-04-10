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
      $params = ['machine_name' => $value];
      if ($defaults['_route'] == 'entity.board.canonical_alternative') {
        $params['type'] = 'drupalorg_sprint';
      }
      if (!$entities = $storage->loadByProperties($params)) {
        return $storage->load($value);
      }
      $entity = reset($entities);
      return $entity;
    }
    return NULL;
  }

  /**
   *
   */
  public function applies($definition, $name, Route $route) {
    if (!empty($definition['type']) && strpos($definition['type'], 'entity:') === 0) {
      $entity_type_id = substr($definition['type'], strlen('entity:'));
      return $entity_type_id == 'board';
    }
    return FALSE;
  }

}
