<?php

namespace Drupal\contribkanban_boards\Plugin\BoardProvider;

use Drupal\contribkanban_boards\Annotation\BoardProvider;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Plugin\PluginBase;
use Drupal\entity\BundleFieldDefinition;

/**
 * Provides the first bundle plugin.
 *
 * @BoardProvider(
 *   id = "drupalorg_custom",
 *   label = @Translation("Custom"),
 *   description = @Translation("Add a board for issues from Drupal.org"),
 * )
 */
class DrupalOrgCustom extends PluginBase implements BoardProviderInterface {

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
    return [];
  }

}
