<?php

namespace Drupal\contribkanban_boards;

use Drupal\Component\Serialization\Json;
use Drupal\Core\Field\FieldItemListInterface;

final class FieldHelper {

  /**
   * Converts a string field to JSON.
   *
   * @param \Drupal\Core\Field\FieldItemListInterface $item_list
   *   The field item list.
   *
   * @return null|int|string
   *   The values as JSON.
   */
  public static function stringAsJson(FieldItemListInterface $item_list) {
    $items = array_map(function ($value) {
      return $value['value'];
    }, $item_list->getValue());

    if ($item_list->getFieldDefinition()->getFieldStorageDefinition()->getCardinality() == 1) {
      $items = reset($items);
    }

    if (empty($items)) {
      return NULL;
    }

    if (is_string($items)) {
      return $items;
    }
    elseif (is_int($items)) {
      return (int) $items;
    }

    return Json::encode($items);
  }

}
