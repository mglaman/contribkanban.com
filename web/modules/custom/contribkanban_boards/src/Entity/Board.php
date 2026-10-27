<?php

namespace Drupal\contribkanban_boards\Entity;

use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\Core\Field\EntityReferenceFieldItemListInterface;
use Drupal\Core\Field\Plugin\Field\FieldType\StringItem;

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
   * {@inheritdoc}
   */
  public static function preCreate(EntityStorageInterface $storage, array &$values) {
    parent::preCreate($storage, $values);
    // Derive the machine name now, so validation sees it.
    $bundle = $values['type'] ?? NULL;
    $title = $values['title'] ?? NULL;
    if (!isset($values['machine_name']) && is_string($bundle) && is_string($title)) {
      $values['machine_name'] = self::deriveMachineName($title, $bundle);
    }
  }

  /**
   * {@inheritdoc}
   */
  public function onChange($name) {
    parent::onChange($name);
    // The admin form sets the title after the board is created.
    if ($name === 'title' && $this->isNew() && $this->get('machine_name')->isEmpty()) {
      $this->set('machine_name', self::deriveMachineName((string) $this->label(), $this->bundle()));
    }
  }

  /**
   * Derives a machine name from a board title.
   *
   * Tag board names end in -tag. drupal.org project machine names can't
   * contain a hyphen, so a tag board never takes a project board's name.
   */
  private static function deriveMachineName(string $title, string $bundle): string {
    $machine_name = (string) preg_replace('/\s/', '', $title);
    return $bundle === 'drupalorg_sprint' ? $machine_name . '-tag' : $machine_name;
  }

  /**
   * {@inheritdoc}
   */
  public function toUrl($rel = 'canonical', array $options = []) {
    if ($rel == 'canonical' && $this->bundle() == 'drupalorg_sprint') {
      $rel = 'canonical_alternative';
    }
    return parent::toUrl($rel, $options);
  }

  /**
   * {@inheritdoc}
   */
  protected function urlRouteParameters($rel) {
    if ($rel == 'canonical' && $this->bundle() == 'drupalorg_sprint') {
      $rel = 'canonical_alternative';
    }
    $uri_route_parameters = parent::urlRouteParameters($rel);
    if (isset($uri_route_parameters[$this->getEntityTypeId()])) {
      if (!$this->get('machine_name')->isEmpty()) {
        $machine_name_field = $this->get('machine_name')->first();
        assert($machine_name_field instanceof StringItem);
        $uri_route_parameters[$this->getEntityTypeId()] = $machine_name_field->get('value')->getValue();
      }
    }
    return $uri_route_parameters;
  }

  /**
   * {@inheritdoc}
   */
  public function postSave(EntityStorageInterface $storage, $update = TRUE) {
    parent::postSave($storage, $update);
    // Ensure each list references its board.
    $lists = $this->get('lists');
    assert($lists instanceof EntityReferenceFieldItemListInterface);
    foreach ($lists->referencedEntities() as $board_list) {
      assert($board_list instanceof BoardListInterface);
      if ($board_list->get('board_id')->isEmpty()) {
        $board_list->set('board_id', $this->id());
        $board_list->save();
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public static function postDelete(EntityStorageInterface $storage, array $entities) {
    /** @var \Drupal\contribkanban_boards\Entity\Board[] $entities */
    parent::postDelete($storage, $entities);
    foreach ($entities as $board) {
      $lists = $board->get('lists');
      assert($lists instanceof EntityReferenceFieldItemListInterface);
      foreach ($lists->referencedEntities() as $board_list) {
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
      ->setLabel(t('Machine name'))
      ->setDescription(t('Used in the board URL.'))
      ->addConstraint('UniqueField')
      ->setReadOnly(TRUE);

    $fields['gitlab_work_items'] = self::gitlabWorkItemsFieldDefinition();
    $fields['popular_weight'] = self::popularWeightFieldDefinition();

    return $fields;
  }

  /**
   * Defines the field that switches a project board to GitLab work items.
   *
   * Shared with the update hook that installs the field.
   */
  public static function gitlabWorkItemsFieldDefinition(): BaseFieldDefinition {
    return BaseFieldDefinition::create('boolean')
      ->setLabel(t('Use GitLab work items'))
      ->setDescription(t('Load issues from the project on git.drupalcode.org instead of Drupal.org.'))
      ->setDefaultValue(FALSE)
      ->setDisplayOptions('form', [
        'type' => 'boolean_checkbox',
        'weight' => -5,
      ]);
  }

  /**
   * Defines the field that orders the popular searches on the board listing.
   *
   * Shared with the update hook that installs the field.
   */
  public static function popularWeightFieldDefinition(): BaseFieldDefinition {
    return BaseFieldDefinition::create('integer')
      ->setLabel(t('Popular search weight'))
      ->setDescription(t('Orders popular searches on the board listing. Empty for boards that are not popular.'));
  }

  /**
   * {@inheritdoc}
   */
  public static function bundleFieldDefinitions(EntityTypeInterface $entity_type, $bundle, array $base_field_definitions) {
    /** @var \Drupal\Core\Field\BaseFieldDefinition[] $base_field_definitions */

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
