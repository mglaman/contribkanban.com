<?php

namespace Drupal\contribkanban_boards\Entity;

use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\Core\StringTranslation\TranslatableMarkup;
use Drupal\user\EntityOwnerInterface;
use Drupal\user\EntityOwnerTrait;

/**
 * Defines the 'board' entity class.
 *
 * @ContentEntityType(
 *   id = "node_board",
 *   label = @Translation("Issue collection"),
 *   base_table = "node_board",
 *   fieldable = FALSE,
 *   admin_permission = "administer node_board",
 *   entity_keys = {
 *     "id" = "board_id",
 *     "uuid" = "uuid",
 *     "label" = "title",
 *     "owner" = "uid",
 *   },
 *   handlers = {
 *     "access" = "\Drupal\contribkanban_boards\NodeBoardAccessControlHandler",
 *     "permission_provider" = "\Drupal\entity\UncacheableEntityPermissionProvider",
 *     "query_access" = "\Drupal\entity\QueryAccess\QueryAccessHandler",
 *     "views_data" = "\Drupal\views\EntityViewsData",
 *     "form" = {
 *       "default" = "\Drupal\contribkanban_boards\Form\NodeBoardForm",
 *       "add" = "\Drupal\contribkanban_boards\Form\NodeBoardForm",
 *       "edit" = "\Drupal\contribkanban_boards\Form\NodeBoardForm",
 *       "delete" = "\Drupal\Core\Entity\ContentEntityDeleteForm"
 *     },
 *     "route_provider" = {
 *       "html" = "\Drupal\contribkanban_boards\Routing\NodeBoardHtmlRouterProvider",
 *     },
 *     "list_builder" = "\Drupal\contribkanban_boards\BoardListBuilder",
 *   },
 *   links = {
 *     "delete-form" = "/node-board/{node_board}/delete",
 *     "canonical" = "/node-board/{node_board}",
 *     "collection" = "/admin/node-boards",
 *   },
 * )
 */
class NodeBoard extends ContentEntityBase implements BoardInterface, EntityOwnerInterface {
  use EntityOwnerTrait;

  const IS_PRIVATE = 'private';
  const IS_SHARED = 'shared';
  const IS_PUBLIC = 'public';

  /**
   *
   */
  protected function urlRouteParameters($rel) {
    $uri_route_parameters = parent::urlRouteParameters($rel);
    if (isset($uri_route_parameters[$this->getEntityTypeId()])) {
      $uri_route_parameters[$this->getEntityTypeId()] = $this->uuid();
    }
    return $uri_route_parameters;
  }

  /**
   * {@inheritdoc}
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type) {
    $fields = parent::baseFieldDefinitions($entity_type);
    $fields += static::ownerBaseFieldDefinitions($entity_type);
    $fields['title'] = BaseFieldDefinition::create('string')
      ->setLabel(new TranslatableMarkup('Title'))
      ->setRequired(TRUE)
      ->setDescription(new TranslatableMarkup('The board title'))
      ->setSetting('max_length', 255)
      ->setDisplayOptions('form', [
        'type' => 'string_textfield',
        'weight' => -5,
      ]);
    $fields['nids'] = BaseFieldDefinition::create('string')
      ->setLabel(new TranslatableMarkup('Issue Node IDs'))
      ->setDescription(new TranslatableMarkup('The node IDs for issues on this board'))
      ->setCardinality(BaseFieldDefinition::CARDINALITY_UNLIMITED)
      ->setRequired(FALSE)
      ->setSetting('max_length', 255)
      ->setDisplayOptions('form', [
        'type'   => 'string_textfield',
        'weight' => 0,
      ]);

    $fields['collaboration'] = BaseFieldDefinition::create('list_string')
      ->setLabel(new TranslatableMarkup('Collaboration'))
      ->setDescription(new TranslatableMarkup('Collaboration settings for the board.'))
      ->setRequired(TRUE)
      ->setSetting('allowed_values', [
        self::IS_PRIVATE => new TranslatableMarkup('Private: only accessible to you, when logged in'),
        self::IS_SHARED => new TranslatableMarkup('Shared: only you may edit, but anyone can view via link access'),
        self::IS_PUBLIC => new TranslatableMarkup('Public: anyone with the link can view and edit'),
      ])
      ->setDisplayOptions('form', [
        'type' => 'options_buttons',
        'weight' => 4,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDefaultValue(self::IS_SHARED);
    return $fields;
  }

}
