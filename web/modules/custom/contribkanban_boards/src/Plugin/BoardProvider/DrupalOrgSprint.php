<?php

namespace Drupal\contribkanban_boards\Plugin\BoardProvider;

use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Plugin\PluginBase;

/**
 * Provides the first bundle plugin.
 *
 * @BoardProvider(
 *   id = "drupalorg_sprint",
 *   label = @Translation("Sprint"),
 *   description = @Translation("Add a board for a Drupal.org issue tag."),
 * )
 */
class DrupalOrgSprint extends PluginBase implements BoardProviderInterface {

  /**
   * {@inheritdoc}
   */
  public function buildFieldDefinitions() {
    $fields = [];
    return $fields;
  }

  /**
   * {@inheritdoc}
   */
  public function bundleFieldDefinitionsAlter(EntityTypeInterface $entity_type, $bundle, array $base_field_definitions) {
    $fields = [];
    if (isset($base_field_definitions['tag'])) {
      $fields['tag'] = clone $base_field_definitions['tag'];
      $fields['tag']->setDisplayOptions('form', []);
    }
    return $fields;
  }

}
