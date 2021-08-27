<?php

declare(strict_types=1);

namespace Drupal\contribkanban_api\Resource;

use Drupal\Core\Cache\CacheableMetadata;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\jsonapi\CacheableResourceResponse;
use Drupal\jsonapi_resources\Resource\EntityResourceBase;
use Drupal\user\UserInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Request;

/**
 * Processes a request for the authenticated user's information.
 *
 * @internal
 */
class Me extends EntityResourceBase implements ContainerInjectionInterface {

  private $currentUser;

  /**
   *
   */
  public function __construct(AccountInterface $account) {
    $this->currentUser = $account;
  }

  /**
   *
   */
  public static function create(ContainerInterface $container) {
    return new self(
          $container->get('current_user')
      );
  }

  /**
   * Process the resource request.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The request.
   *
   * @return \Drupal\jsonapi\ResourceResponse
   *   The response.
   *
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   */
  public function process(Request $request) {
    $user_storage = $this->entityTypeManager->getStorage('user');
    $current_user = $user_storage->load($this->currentUser->id());
    assert($current_user instanceof UserInterface);
    $top_level_data = $this->createIndividualDataFromEntity($current_user);
    $response = $this->createJsonapiResponse($top_level_data, $request);
    if ($response instanceof CacheableResourceResponse) {
      $response->addCacheableDependency((new CacheableMetadata())->addCacheContexts(['user']));
    }
    return $response;
  }

}
