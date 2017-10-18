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
   * @ingroup plugin_translatable
   *
   * @var \Drupal\Core\Annotation\Translation
   */
  public $label;

}
