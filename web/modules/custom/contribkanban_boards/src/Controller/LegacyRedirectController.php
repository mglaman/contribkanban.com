<?php

declare(strict_types=1);

namespace Drupal\contribkanban_boards\Controller;

use Drupal\Core\Url;
use Symfony\Component\HttpFoundation\RedirectResponse;

final class LegacyRedirectController {

  /**
   * Redirects a React app path to the Drupal page that replaced it.
   *
   * @param string $route_name
   *   The route of the Drupal page.
   *
   * @return \Symfony\Component\HttpFoundation\RedirectResponse
   *   A permanent redirect.
   */
  public function toRoute(string $route_name): RedirectResponse {
    return $this->redirect(Url::fromRoute($route_name));
  }

  /**
   * Redirects the React app's board type listings to the filtered listing.
   *
   * @param string $type
   *   The board type from the React app's path: project, sprint, or core.
   *
   * @return \Symfony\Component\HttpFoundation\RedirectResponse
   *   A permanent redirect.
   */
  public function toListing(string $type): RedirectResponse {
    return $this->redirect(Url::fromRoute('view.board_listing.page', [], [
      'query' => ['type' => 'drupalorg_' . $type],
    ]));
  }

  /**
   * Creates a permanent redirect.
   *
   * @param \Drupal\Core\Url $url
   *   Where to redirect.
   *
   * @return \Symfony\Component\HttpFoundation\RedirectResponse
   *   The redirect.
   */
  private function redirect(Url $url): RedirectResponse {
    return new RedirectResponse($url->toString(TRUE)->getGeneratedUrl(), 301);
  }

}
