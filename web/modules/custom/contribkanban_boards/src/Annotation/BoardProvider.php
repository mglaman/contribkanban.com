<?php

namespace Drupal\contribkanban_boards\Annotation;

use Drupal\Component\Annotation\Plugin;

/**
 * Defines the BoardProvider annotation object.
 *
 * Plugin namespace: Plugin\BoardProvider.
 *
 * @see plugin_api
 *
 * @Annotation
 */
class BoardProvider extends Plugin {

  /**
   * The plugin ID.
   *
   * @var string
   */
  public $id;

  /**
   * The plugin label.
   *
   * @var \Drupal\Core\Annotation\Translation
   *
   * @ingroup plugin_translatable
   */
  public $label;

}
