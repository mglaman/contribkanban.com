<?php

namespace Drupal\contribkanban_boards\Plugin\BoardProvider;

use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Plugin\PluginBase;

/**
 * Provides the first bundle plugin.
 *
 * @BoardProvider(
 *   id = "drupalorg_core",
 *   label = @Translation("Drupal core"),
 *   description = @Translation("Add a board for a module"),
 * )
 */
class DrupalOrgCore extends PluginBase implements BoardProviderInterface {

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

    if (isset($base_field_definitions['project_nid'])) {
      /** @var \Drupal\Core\Field\BaseFieldDefinition $project_nid */
      $project_nid = clone $base_field_definitions['project_nid'];
      $project_nid->setDisplayOptions('form', []);
      $project_nid->setDefaultValue('3060');
      $fields['project_nid'] = $project_nid;
    }

    return $fields;
  }

}
