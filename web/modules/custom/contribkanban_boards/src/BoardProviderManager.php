<?php

namespace Drupal\contribkanban_boards;

use Drupal\Core\Cache\CacheBackendInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Plugin\DefaultPluginManager;

/**
 * Manages discovery and instantiation of BundlePluginTest plugins.
 *
 * @see \Drupal\contribkanban_boards\Annotation\BoardProvider
 * @see plugin_api
 */
class BoardProviderManager extends DefaultPluginManager {

  /**
   * Constructs a new BundlePluginTestManager object.
   *
   * @param \Traversable $namespaces
   *   An object that implements \Traversable which contains the root paths
   *   keyed by the corresponding namespace to look for plugin implementations.
   * @param \Drupal\Core\Cache\CacheBackendInterface $cache_backend
   *   The cache backend.
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $module_handler
   *   The module handler.
   */
  public function __construct(\Traversable $namespaces, CacheBackendInterface $cache_backend, ModuleHandlerInterface $module_handler) {
    parent::__construct('Plugin/BoardProvider', $namespaces, $module_handler, 'Drupal\contribkanban_boards\Plugin\BoardProvider\BoardProviderInterface', 'Drupal\contribkanban_boards\Annotation\BoardProvider');
    $this->alterInfo('board_provider_info');
    $this->setCacheBackend($cache_backend, 'board_provider_plugins');
  }

}
