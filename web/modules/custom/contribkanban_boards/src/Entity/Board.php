<?php

namespace Drupal\contribkanban_boards\Entity;

use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Field\BaseFieldDefinition;

/**
 * Defines the 'board' entity class.
 *
 * @ContentEntityType(
 *   id = "board",
 *   label = @Translation("Board"),
 *   bundle_label = @Translation("Board provider"),
 *   bundle_plugin_type = "board_provider",
 *   base_table = "board",
 *   admin_permission = "administer content",
 *   fieldable = TRUE,
 *   admin_permission = "administer board",
 *   permission_granularity = "bundle",
 *   entity_keys = {
 *     "id" = "board_id",
 *     "uuid" = "uuid",
 *     "bundle" = "type",
 *     "label" = "title",
 *   },
 *   handlers = {
 *     "access" = "\Drupal\Core\Entity\EntityAccessControlHandler",
 *     "permission_provider" = "\Drupal\entity\EntityPermissionProvider",
 *     "form" = {
 *       "default" = "\Drupal\Core\Entity\ContentEntityForm",
 *       "add" = "\Drupal\Core\Entity\ContentEntityForm",
 *       "edit" = "\Drupal\Core\Entity\ContentEntityForm",
 *       "delete" = "\Drupal\Core\Entity\EntityDeleteForm",
 *     },
 *     "route_provider" = {
 *       "html" = "\Drupal\Core\Entity\Routing\DefaultHtmlRouteProvider",
 *     },
 *     "list_builder" = "\Drupal\Core\Entity\EntityListBuilder",
 *   },
 *   links = {
 *     "add-page" = "/board/add",
 *     "add-form" = "/board/add/{type}",
 *     "edit-form" = "/board/{board}/edit",
 *     "canonical" = "/board/{board}",
 *     "collection" = "/boards",
 *   },
 * )
 */
class Board extends ContentEntityBase implements BoardInterface {

  /**
   * {@inheritdoc}
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type) {
    $fields = parent::baseFieldDefinitions($entity_type);
    $fields['title'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Title'))
      ->setDescription(t('The board title'));
    $fields['lists'] = BaseFieldDefinition::create('entity_reference')
      ->setSetting('target_type', 'board_list')
      ->setCardinality(BaseFieldDefinition::CARDINALITY_UNLIMITED)
      ->setLabel(t('Lists'))
      ->setDisplayOptions('form', [
        'type' => 'inline_entity_form_complex',
        'weight' => 10,
        'settings' => [
          'override_labels' => TRUE,
          'label_singular' => 'list',
          'label_plural' => 'lists',
        ],
      ])
      ->setRequired(TRUE);
    return $fields;
  }

  /**
   * {@inheritdoc}
   */
  public static function bundleFieldDefinitions(EntityTypeInterface $entity_type, $bundle, array $base_field_definitions) {
    $fields = parent::bundleFieldDefinitions($entity_type, $bundle, $base_field_definitions);

    // Force the lists bundle to match current bundle.
    $fields['lists'] = clone $base_field_definitions['lists'];
    $fields['lists']->setSetting('handler', 'default');
    $fields['lists']->setSetting('handler_settings', [
      'target_bundles' => [$bundle],
    ]);
    return $fields;
  }


}
