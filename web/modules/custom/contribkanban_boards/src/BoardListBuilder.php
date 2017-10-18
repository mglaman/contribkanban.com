<?php

namespace Drupal\contribkanban_boards;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityListBuilder;

class BoardListBuilder extends EntityListBuilder {

  /**
   * {@inheritdoc}
   */
  public function buildHeader() {
    $header = [
      'type'  => t('Type'),
      'label' => t('Label'),
    ] + parent::buildHeader();
    return $header;
  }

  /**
   * {@inheritdoc}
   */
  public function buildRow(EntityInterface $entity) {
    $row['type'] = $entity->bundle();
    $row['label'] = $entity->label();
    $row += parent::buildRow($entity);
    return $row;
  }

}
