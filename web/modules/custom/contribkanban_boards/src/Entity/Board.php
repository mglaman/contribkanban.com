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
 *       "default" = "\Drupal\contribkanban_boards\Form\BoardForm",
 *       "add" = "\Drupal\contribkanban_boards\Form\BoardForm",
 *       "edit" = "\Drupal\contribkanban_boards\Form\BoardForm",
 *       "delete" = "\Drupal\Core\Entity\ContentEntityDeleteForm"
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
 *     "delete-form" = "/board/{board}/delete",
 *     "canonical" = "/board/{board}",
 *     "collection" = "/admin/boards",
 *    "canonical_alternative" = "/sprint/{board}"
 *   },
 * )
 */
class Board extends ContentEntityBase implements BoardInterface {

  /**
   *
   */
  public function preSave(EntityStorageInterface $storage) {
    parent::preSave($storage);
    if ($this->get('machine_name')->isEmpty()) {
      $this->get('machine_name')->setValue(preg_replace("/\s/", '', $this->label()));
    }
  }

  /**
   * {@inheritdoc}
   */
  public function url($rel = 'canonical', $options = []) {
    if ($rel == 'canonical' && $this->bundle() == 'drupalorg_sprint') {
      $rel = 'canonical_alternative';
    }
    return parent::url($rel, $options);
  }

  /**
   *
   */
  public function toUrl($rel = 'canonical', array $options = []) {
    if ($rel == 'canonical' && $this->bundle() == 'drupalorg_sprint') {
      $rel = 'canonical_alternative';
    }
    return parent::toUrl($rel, $options);
  }

  /**
   *
   */
  protected function urlRouteParameters($rel) {
    if ($rel == 'canonical' && $this->bundle() == 'drupalorg_sprint') {
      $rel = 'canonical_alternative';
    }
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
   *
   */
  public static function postDelete(EntityStorageInterface $storage, array $entities) {
    /** @var \Drupal\contribkanban_boards\Entity\Board[] $entities */
    parent::postDelete($storage, $entities);
    foreach ($entities as $board) {
      foreach ($board->get('lists') as $item) {
        /** @var \Drupal\contribkanban_boards\Entity\BoardListInterface $board_list */
        $board_list = $item->entity;
        $board_list->delete();
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
    $fields['tag'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Tags'))
      ->setDescription(t('Issues tagged with this tag.'))
      ->setCardinality(BaseFieldDefinition::CARDINALITY_UNLIMITED);

    $fields['parent_issue'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Parent issue'))
      ->setDescription(t('A parent issue to restrict issues to.'))
      ->setSetting('max_length', 255)
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
    $board_provider_manager = \Drupal::getContainer()->get('plugin.manager.board_provider');
    /** @var \Drupal\contribkanban_boards\Plugin\BoardProvider\BoardProviderInterface $bundle_plugin */
    $bundle_plugin = $board_provider_manager->createInstance($bundle);
    $fields = $bundle_plugin->bundleFieldDefinitionsAlter($entity_type, $bundle, $base_field_definitions);

    // Force the lists bundle to match current bundle.
    $fields['lists'] = clone $base_field_definitions['lists'];
    $fields['lists']->setSetting('handler', 'default');
    $fields['lists']->setSetting('handler_settings', [
      'target_bundles' => [$bundle],
    ]);

    return $fields;
  }

}
