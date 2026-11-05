<?php

declare(strict_types=1);

namespace Drupal\contribkanban_boards\Plugin\BoardProvider;

use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Plugin\PluginBase;

/**
 * Provides boards for every project a drupal.org user maintains.
 *
 * @BoardProvider(
 *   id = "drupalorg_maintainer",
 *   label = @Translation("Maintainer"),
 *   description = @Translation("Add a board for the projects a drupal.org user maintains"),
 * )
 */
class DrupalOrgMaintainer extends PluginBase implements BoardProviderInterface {

  /**
   * {@inheritdoc}
   */
  public function buildFieldDefinitions() {
    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function bundleFieldDefinitionsAlter(EntityTypeInterface $entity_type, $bundle, array $base_field_definitions) {
    $fields = [];
    /** @var \Drupal\Core\Field\BaseFieldDefinition[] $base_field_definitions */
    if (isset($base_field_definitions['project_nid'])) {
      $fields['project_nid'] = clone $base_field_definitions['project_nid'];
      $fields['project_nid']->setDisplayOptions('form', []);
    }
    return $fields;
  }

}
