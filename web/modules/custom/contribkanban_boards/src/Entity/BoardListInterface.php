<?php

namespace Drupal\contribkanban_boards\Entity;

use Drupal\Core\Entity\ContentEntityInterface;

interface BoardListInterface extends ContentEntityInterface {

  /**
   * Gets the board this list belongs to.
   *
   * @return \Drupal\contribkanban_boards\Entity\BoardInterface
   *   The board.
   */
  public function getBoard();

  /**
   * Gets the list's project node IDs, including the board's.
   *
   * @return \Drupal\Core\Field\FieldItemListInterface
   *   The project_nid field items.
   */
  public function getProjects();

  /**
   * Gets the issue component filter.
   *
   * @return \Drupal\Core\Field\FieldItemListInterface
   *   The component field items.
   */
  public function getComponent();

  /**
   * Gets the issue statuses this list shows.
   *
   * @return \Drupal\Core\Field\FieldItemListInterface
   *   The statuses field items.
   */
  public function getStatuses();

  /**
   * Gets the issue tag filter, including the board's.
   *
   * @return \Drupal\Core\Field\FieldItemListInterface
   *   The tag field items.
   */
  public function getTags();

  /**
   * Gets the version filter, including the board's.
   *
   * @return \Drupal\Core\Field\FieldItemListInterface
   *   The version field items.
   */
  public function getVersion();

}
