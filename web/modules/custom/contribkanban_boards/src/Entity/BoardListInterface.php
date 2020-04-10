<?php

namespace Drupal\contribkanban_boards\Entity;

use Drupal\Core\Entity\ContentEntityInterface;

interface BoardListInterface extends ContentEntityInterface {

  /**
   * @return \Drupal\contribkanban_boards\Entity\BoardInterface
   */
  public function getBoard();

  /**
   *
   */
  public function getProjects();

  /**
   *
   */
  public function getCategory();

  /**
   *
   */
  public function getComponent();

  /**
   *
   */
  public function getParentIssue();

  /**
   *
   */
  public function getPriority();

  /**
   *
   */
  public function getStatuses();

  /**
   *
   */
  public function getTags();

  /**
   * @return \Drupal\Core\Field\FieldItemListInterface
   */
  public function getVersion();

}
