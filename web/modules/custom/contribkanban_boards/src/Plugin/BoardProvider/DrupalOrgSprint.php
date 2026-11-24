<?php

namespace Drupal\contribkanban_boards\Plugin\BoardProvider;

use Drupal\contribkanban_boards\Attribute\BoardProvider;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Plugin\PluginBase;
use Drupal\Core\StringTranslation\TranslatableMarkup;

/**
 * Provides the first bundle plugin.
 */
#[BoardProvider(
  id: "drupalorg_sprint",
  label: new TranslatableMarkup("Tag"),
  description: new TranslatableMarkup("Add a board for a Drupal.org issue tag."),
)]
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
    /** @var \Drupal\Core\Field\BaseFieldDefinition[] $base_field_definitions */
    $fields = [];
    if (isset($base_field_definitions['tag'])) {
      $fields['tag'] = clone $base_field_definitions['tag'];
      $fields['tag']->setDisplayOptions('form', []);
      // GitLab labels drupal.org has no tag for get boards without a term ID.
    }
    // Tag boards query every project.
    if (isset($base_field_definitions['project_nid'])) {
      $fields['project_nid'] = clone $base_field_definitions['project_nid'];
      $fields['project_nid']->setRequired(FALSE);
    }
    return $fields;
  }

}
