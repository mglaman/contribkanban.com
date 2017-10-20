<?php

namespace Drupal\contribkanban_boards\Entity;

use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Field\BaseFieldDefinition;

/**
 * Defines the 'board' entity class.
 *
 * @ContentEntityType(
 *   id = "board_list",
 *   label = @Translation("Board list"),
 *   bundle_label = @Translation("Board provider"),
 *   bundle_plugin_type = "board_provider",
 *   base_table = "board_list",
 *   fieldable = TRUE,
 *   admin_permission = "administer board_list",
 *   permission_granularity = "bundle",
 *   entity_keys = {
 *     "id" = "board_list_id",
 *     "uuid" = "uuid",
 *     "bundle" = "type",
 *     "label" = "title",
 *   },
 *   handlers = {
 *     "access" = "\Drupal\entity\EntityAccessControlHandler",
 *     "permission_provider" = "\Drupal\entity\EntityPermissionProvider",
 *     "form" = {
 *       "default" = "\Drupal\contribkanban_boards\Form\BoardListForm",
 *     },
 *   },
 * )
 */
class BoardList extends ContentEntityBase implements BoardListInterface {

  /**
   * {@inheritdoc}
   */
  public function getBoard() {
    return $this->get('board_id')->entity;
  }

  /**
   * {@inheritdoc}
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type) {
    $fields = parent::baseFieldDefinitions($entity_type);
    $fields['title'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Title'))
      ->setDescription(t('The list title'))
      ->setRequired(TRUE)
      ->setSetting('max_length', 255)
      ->setDisplayOptions('form', [
        'type' => 'string_textfield',
        'weight' => -5,
      ]);

    $fields['board_id'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('Board'))
      ->setDescription(t('The board product.'))
      ->setSetting('target_type', 'board')
      ->setReadOnly(TRUE);

    // @todo Convert to entity reference for all imported projects.
    $fields['project_nid'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Projects'))
      ->setDescription(t('Additional projects to query for this list'))
      ->setCardinality(BaseFieldDefinition::CARDINALITY_UNLIMITED)
      ->setSetting('max_length', 255)
      ->setDisplayOptions('form', [
        'type' => 'string_textfield',
        'weight' => -5,
      ]);

    $fields['category'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Category'))
      ->setDescription(t('The issue category'))
      ->setSetting('max_length', 255)
      ->setDisplayOptions('form', [
        'type'   => 'category_options',
        'weight' => -5,
      ]);

    $fields['component'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Component'))
      ->setDescription(t('The issue component'))
      ->setSetting('max_length', 255)
      ->setDisplayOptions('form', [
        'type'   => 'string_textfield',
        'weight' => -5,
      ]);

    $fields['parent_issue'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Parent issue'))
      ->setDescription(t('A parent issue to restrict issues to.'))
      ->setSetting('max_length', 255)
      ->setDisplayOptions('form', [
        'type'   => 'string_textfield',
        'weight' => -5,
      ]);

    $fields['priority'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Priority'))
      ->setDescription(t('The issue priority'))
      ->setSetting('max_length', 255)
      ->setDisplayOptions('form', [
        'type'   => 'priority_options',
        'weight' => -5,
      ]);

    $fields['statuses'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Statuses'))
      ->setDescription(t('The issue statuses'))
      ->setCardinality(BaseFieldDefinition::CARDINALITY_UNLIMITED)
      ->setDisplayOptions('form', [
        'type'   => 'status_options',
        'weight' => -5,
      ]);

    $fields['tag'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Tags'))
      ->setDescription(t('Issues tagged with this tag.'))
      ->setCardinality(BaseFieldDefinition::CARDINALITY_UNLIMITED)
      ->setDisplayOptions('form', [
        'type'   => 'string_textfield',
        'weight' => -5,
      ]);

    $fields['version'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Version constraint'))
      ->setDescription(t('Issues for this version.'))
      ->setCardinality(BaseFieldDefinition::CARDINALITY_UNLIMITED)
      ->setDisplayOptions('form', [
        'type'   => 'string_textfield',
        'weight' => -5,
      ]);

    return $fields;
  }

  /**
   * {@inheritdoc}
   */
  public static function bundleFieldDefinitions(EntityTypeInterface $entity_type, $bundle, array $base_field_definitions) {
    $board_provider_manager = \Drupal::getContainer()->get('plugin.manager.board_provider');
    /** @var \Drupal\contribkanban_boards\Plugin\BoardProvider\BoardProviderInterface $bundle_plugin */
    $bundle_plugin = $board_provider_manager->createInstance($bundle);
    $fields = $bundle_plugin->bundleFieldDefinitionsAlter($entity_type, $bundle, $base_field_definitions);
    return $fields;
  }

}
