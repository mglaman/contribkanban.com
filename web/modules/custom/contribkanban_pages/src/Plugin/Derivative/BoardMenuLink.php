<?php

namespace Drupal\contribkanban_pages\Plugin\Derivative;

use Drupal\Component\Plugin\Derivative\DeriverBase;
use Drupal\Component\Plugin\PluginManagerInterface;
use Drupal\Core\Plugin\Discovery\ContainerDeriverInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Derivative class that provides the menu links for the Products.
 */
class BoardMenuLink extends DeriverBase implements ContainerDeriverInterface {

  /**
   * @var \Drupal\Component\Plugin\PluginManagerInterface
   */
  protected $boardProvider;

  /**
   * Creates a ProductMenuLink instance.
   *
   * @param $base_plugin_id
   * @param \Drupal\Component\Plugin\PluginManagerInterface $board_provider
   */
  public function __construct($base_plugin_id, PluginManagerInterface $board_provider) {
    $this->boardProvider = $board_provider;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, $base_plugin_id) {
    return new static(
      $base_plugin_id,
      $container->get('plugin.manager.board_provider')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getDerivativeDefinitions($base_plugin_definition) {
    $links = [];

    // We assume we don't have too many...
    $definitions = $this->boardProvider->getDefinitions();
    foreach ($definitions as $id => $definition) {
      $links[$id] = [
          'title' => $definition['label'],
          'route_name' => 'contribkanban_pages.boards_controller_list',
          'route_parameters' => ['type' => str_replace('drupalorg_', '', $definition['id'])],
        ] + $base_plugin_definition;
    }

    return $links;
  }
}
