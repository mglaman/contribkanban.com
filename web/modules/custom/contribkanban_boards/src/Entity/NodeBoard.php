<?php

namespace Drupal\contribkanban_boards\Entity;

use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\user\EntityOwnerInterface;
use Drupal\user\UserInterface;

/**
 * Defines the 'board' entity class.
 *
 * @ContentEntityType(
 *   id = "node_board",
 *   label = @Translation("Board: Node list"),
 *   base_table = "node_board",
 *   fieldable = FALSE,
 *   admin_permission = "administer node board",
 *   entity_keys = {
 *     "id" = "board_id",
 *     "uuid" = "uuid",
 *     "label" = "title",
 *   },
 *   handlers = {
 *     "access" = "\Drupal\entity\EntityAccessControlHandler",
 *     "permission_provider" = "\Drupal\entity\EntityPermissionProvider",
 *     "views_data" = "\Drupal\views\EntityViewsData",
 *     "form" = {
 *       "default" = "\Drupal\contribkanban_boards\Form\NodeBoardForm",
 *       "add" = "\Drupal\contribkanban_boards\Form\NodeBoardForm",
 *       "edit" = "\Drupal\contribkanban_boards\Form\NodeBoardForm",
 *       "delete" = "\Drupal\Core\Entity\ContentEntityDeleteForm"
 *     },
 *     "route_provider" = {
 *       "html" = "\Drupal\Core\Entity\Routing\DefaultHtmlRouteProvider",
 *     },
 *     "list_builder" = "\Drupal\contribkanban_boards\BoardListBuilder",
 *   },
 *   links = {
 *     "add-page" = "/node-board/add",
 *     "add-form" = "/node-board/add/{type}",
 *     "edit-form" = "/node-board/{node_board}/edit",
 *     "delete-form" = "/node-board/{node_board}/delete",
 *     "canonical" = "/node-board/{node_board}",
 *     "collection" = "/admin/node-boards",
 *   },
 * )
 */
class NodeBoard extends ContentEntityBase implements BoardInterface, EntityOwnerInterface {

  /**
   * {@inheritdoc}
   */
  public function getOwner() {
    return $this->get('uid')->entity;
  }

  /**
   * {@inheritdoc}
   */
  public function getOwnerId() {
    return $this->get('uid')->target_id;
  }

  /**
   * {@inheritdoc}
   */
  public function setOwnerId($uid) {
    $this->set('uid', $uid);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function setOwner(UserInterface $account) {
    $this->set('uid', $account->id());
    return $this;
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
    $fields['nids'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Issue Node IDs'))
      ->setDescription(t('The node IDs for issues on this board'))
      ->setCardinality(BaseFieldDefinition::CARDINALITY_UNLIMITED)
      ->setRequired(TRUE)
      ->setSetting('max_length', 255)
      ->setDisplayOptions('form', [
        'type'   => 'string_textfield',
        'weight' => 0,
      ]);
    $fields['uid'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('User ID'))
      ->setDescription(t('The user ID of the file.'))
      ->setSetting('target_type', 'user');
    return $fields;
  }

}
