<?php

declare(strict_types=1);

namespace Drupal\Tests\contribkanban_boards\Kernel;

use Drupal\Core\Routing\RouteObjectInterface;
use Drupal\Core\Site\Settings;
use Drupal\KernelTests\KernelTestBase;
use PHPUnit\Framework\Attributes\Group;
use PHPUnit\Framework\Attributes\RunTestsInSeparateProcesses;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Route;

/**
 * Verifies which pages load Fathom.
 */
#[Group('contribkanban_boards')]
#[RunTestsInSeparateProcesses]
final class FathomAttachmentTest extends KernelTestBase {

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'contribkanban_boards',
    'contribkanban_projects',
    'entity',
    'options',
    'user',
  ];

  /**
   * Builds a page's attachments as if the given route served it.
   *
   * @return array<string, mixed>
   *   The attachments.
   */
  private function attachmentsFor(string $route_name, string $path): array {
    new Settings(['fathom_site_id' => 'SITE'] + Settings::getAll());
    $request = Request::create($path);
    $request->attributes->set(RouteObjectInterface::ROUTE_NAME, $route_name);
    $request->attributes->set(RouteObjectInterface::ROUTE_OBJECT, new Route($path));
    $this->container->get('request_stack')->push($request);
    $attachments = [];
    contribkanban_boards_page_attachments($attachments);
    $this->container->get('request_stack')->pop();
    return $attachments;
  }

  /**
   * Tests that other pages load Fathom.
   */
  public function testOtherPages(): void {
    $attachments = $this->attachmentsFor('contribkanban_boards.roulette', '/roulette');
    self::assertNotEmpty($attachments['#attached']['html_head'] ?? []);
  }

  /**
   * Tests that the page holding a viewer's GitLab token doesn't load Fathom.
   */
  public function testMyProjectsPage(): void {
    $attachments = $this->attachmentsFor('contribkanban_boards.my_projects', '/my-projects');
    self::assertEmpty($attachments['#attached']['html_head'] ?? []);
    self::assertContains('route.name', $attachments['#cache']['contexts'] ?? []);
  }

}
