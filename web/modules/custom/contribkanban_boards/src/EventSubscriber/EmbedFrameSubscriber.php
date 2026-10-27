<?php

declare(strict_types=1);

namespace Drupal\contribkanban_boards\EventSubscriber;

use Drupal\Core\Routing\RouteMatchInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

final class EmbedFrameSubscriber implements EventSubscriberInterface {

  /**
   * Constructs an EmbedFrameSubscriber.
   *
   * @param \Drupal\Core\Routing\RouteMatchInterface $routeMatch
   *   The current route match.
   */
  public function __construct(
    private readonly RouteMatchInterface $routeMatch,
  ) {}

  /**
   * Lets any site put an embedded board in an iframe.
   *
   * Core sends X-Frame-Options: SAMEORIGIN on every page. Embedded boards
   * have no forms or links that act for the viewer, so framing them is safe.
   *
   * @param \Symfony\Component\HttpKernel\Event\ResponseEvent $event
   *   The response event.
   */
  public function onResponse(ResponseEvent $event): void {
    if ($event->isMainRequest() && $this->routeMatch->getRouteName() === 'entity.board.embed') {
      $event->getResponse()->headers->remove('X-Frame-Options');
    }
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents(): array {
    // After FinishResponseSubscriber::onRespond(), which adds the header.
    return [KernelEvents::RESPONSE => ['onResponse', -10]];
  }

}
