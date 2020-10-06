<?php

namespace Drupal\contribkanban_boards\Plugin\BoardProvider;

use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\entity\BundlePlugin\BundlePluginInterface;

/**
 * Interface BoardProviderInterface.
 *
 * @package Drupal\contribkanban_boards\Plugin\BoardProvider
 */
interface BoardProviderInterface extends BundlePluginInterface {

  /**
   * Alter the bundle field definitions for the entity.
   *
   * @param \Drupal\Core\Entity\EntityTypeInterface $entity_type
   *   The entity type definition. Useful when a single class is used for
   *   multiple, possibly dynamic entity types.
   * @param string $bundle
   *   The bundle.
   * @param \Drupal\Core\Field\BaseFieldDefinition[] $base_field_definitions
   *   The list of base field definitions.
   *
   * @return \Drupal\Core\Field\BaseFieldDefinition[]
   *   An array of bundle field definitions, keyed by field name.
   */
  public function bundleFieldDefinitionsAlter(EntityTypeInterface $entity_type, $bundle, array $base_field_definitions);

}
