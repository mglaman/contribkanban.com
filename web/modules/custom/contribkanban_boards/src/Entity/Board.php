<?php

namespace Drupal\contribkanban_boards\Entity;

use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityStorageInterface;
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
 *     "access" = "\Drupal\entity\EntityAccessControlHandler",
 *     "permission_provider" = "\Drupal\entity\EntityPermissionProvider",
 *     "views_data" = "\Drupal\views\EntityViewsData",
 *     "form" = {
 *       "default" = "\Drupal\Core\Entity\ContentEntityForm",
 *       "add" = "\Drupal\Core\Entity\ContentEntityForm",
 *       "edit" = "\Drupal\Core\Entity\ContentEntityForm",
 *       "delete" = "\Drupal\Core\Entity\EntityDeleteForm",
 *     },
 *     "route_provider" = {
 *       "html" = "\Drupal\contribkanban_boards\Routing\BoardHtmlRouteProvider",
 *     },
 *     "list_builder" = "\Drupal\contribkanban_boards\BoardListBuilder",
 *   },
 *   links = {
 *     "add-page" = "/board/add",
 *     "add-form" = "/board/add/{type}",
 *     "edit-form" = "/board/{board}/edit",
 *     "canonical" = "/board/{board}",
 *     "collection" = "/admin/boards",
 *   },
 * )
 */
class Board extends ContentEntityBase implements BoardInterface {

  protected function urlRouteParameters($rel) {
    $uri_route_parameters = parent::urlRouteParameters($rel);
    if (isset($uri_route_parameters[$this->getEntityTypeId()])) {
      if (!$this->get('machine_name')->isEmpty()) {
        $uri_route_parameters[$this->getEntityTypeId()] = $this->get('machine_name')->value;
      }
    }
    return $uri_route_parameters;
  }

  /**
   * {@inheritdoc}
   */
  public function postSave(EntityStorageInterface $storage, $update = TRUE) {
    parent::postSave($storage, $update);
    // Ensure there's a back-reference on each product board_list.
    foreach ($this->lists as $item) {
      $board_list = $item->entity;
      if ($board_list->board_id->isEmpty()) {
        $board_list->board_id = $this->id();
        $board_list->save();
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type) {
    $fields = parent::baseFieldDefinitions($entity_type);
    $fields['title'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Title'))
      ->setRequired(TRUE)
      ->setDescription(t('The board title'))
      ->setSetting('max_length', 255)
      ->setDisplayOptions('form', [
        'type' => 'string_textfield',
        'weight' => -5,
      ]);
    // @todo Convert to entity reference for all imported projects.
    $fields['project_nid'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Projects'))
      ->setDescription(t('The projects to query for each list'))
      ->setCardinality(BaseFieldDefinition::CARDINALITY_UNLIMITED)
      ->setRequired(TRUE)
      ->setSetting('max_length', 255)
      ->setDisplayOptions('form', [
        'type'   => 'string_textfield',
        'weight' => -5,
      ]);

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
      ->setDisplayOptions('view', [
        'label' => 'hidden',
        'type' => 'entity_reference_entity_view',
        'weight' => 0,
      ])
      ->setRequired(TRUE);

    $fields['machine_name'] = BaseFieldDefinition::create('string')
      ->setLabel(t('The machine name used for routing'))
      ->setReadOnly(TRUE);

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
