<?php

declare(strict_types=1);

namespace Drupal\Tests\contribkanban_projects\Unit;

use Drupal\contribkanban_projects\Maintainers;
use Drupal\Tests\UnitTestCase;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\TransferException;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Middleware;
use GuzzleHttp\Psr7\Response;
use PHPUnit\Framework\Attributes\CoversClass;

#[CoversClass(Maintainers::class)]
final class MaintainersTest extends UnitTestCase {

  /**
   * The markup of a drupal.org profile, trimmed to the parts that matter.
   */
  private const PROFILE = <<<HTML
    <html><body>
    <a href="/project/project_module">Modules</a>
    <h3>Projects maintained</h3>
    <div class="view view-users-maintained-projects view-id-users_maintained_projects view-display-id-block_1 view-dom-id-da49">
      <div class="view-content">
        <div class="views-row views-row-1"><div class="views-field views-field-title"><span class="field-content"><a href="/project/acquia_ai">Acquia AI</a></span></div></div>
        <div class="views-row views-row-2"><div class="views-field views-field-title"><span class="field-content"><a href="/project/geoip">GeoIP</a></span></div></div>
        <div class="views-row views-row-3"><div class="views-field views-field-title"><span class="field-content"><a href="/project/geoip">GeoIP</a></span></div></div>
      </div>
    </div>
    <div class="view view-id-other"><a href="/project/commerce">Not maintained</a></div>
    </body></html>
    HTML;

  /**
   * Requests the client under test sent.
   *
   * @var list<array{request: \Psr\Http\Message\RequestInterface}>
   */
  private array $history = [];

  /**
   * Creates the service with an HTTP client that gives these responses.
   *
   * @param list<\GuzzleHttp\Psr7\Response|\Throwable> $responses
   *   The responses, in order.
   */
  private function createMaintainers(array $responses): Maintainers {
    $stack = HandlerStack::create(new MockHandler($responses));
    $stack->push(Middleware::history($this->history));
    return new Maintainers(new Client([
      'handler' => $stack,
      'base_uri' => 'https://www.drupal.org/api-d7/',
    ]));
  }

  /**
   * Builds the api-d7 response for a user lookup.
   *
   * @param array<string, string> $user
   *   The user's fields.
   */
  private function userResponse(array $user): Response {
    return new Response(200, [], (string) json_encode(['list' => [$user]]));
  }

  /**
   * Gets the URI of a request the client sent.
   */
  private function requestedUri(int $index): string {
    return (string) $this->history[$index]['request']->getUri();
  }

  /**
   * Tests reading a user's projects from their profile.
   */
  public function testFind(): void {
    $maintainers = $this->createMaintainers([
      $this->userResponse(['uid' => '8389', 'name' => 'kristen pol', 'url' => 'https://www.drupal.org/u/kristen-pol']),
      new Response(200, [], self::PROFILE),
    ]);

    self::assertSame([
      'name' => 'kristen pol',
      'slug' => 'kristen-pol',
      'projects' => ['acquia_ai', 'geoip'],
    ], $maintainers->find('Kristen Pol'));
    self::assertSame('https://www.drupal.org/api-d7/user.json?name=Kristen%20Pol', str_replace('+', '%20', $this->requestedUri(0)));
    self::assertSame('https://www.drupal.org/user/8389', $this->requestedUri(1));
  }

  /**
   * Tests a user without a profile alias.
   */
  public function testFindWithoutAlias(): void {
    $maintainers = $this->createMaintainers([
      $this->userResponse(['uid' => '42', 'name' => 'someone', 'url' => 'https://www.drupal.org/user/42']),
      new Response(200, [], self::PROFILE),
    ]);

    self::assertSame('user-42', $maintainers->find('someone')['slug'] ?? NULL);
  }

  /**
   * Tests a user whose profile has no maintained projects.
   */
  public function testFindWithoutProjects(): void {
    $maintainers = $this->createMaintainers([
      $this->userResponse(['uid' => '42', 'name' => 'someone', 'url' => 'https://www.drupal.org/u/someone']),
      new Response(200, [], '<html><body><a href="/project/commerce">Commerce</a></body></html>'),
    ]);

    self::assertSame([], $maintainers->find('someone')['projects'] ?? NULL);
  }

  /**
   * Tests a username drupal.org doesn't know.
   */
  public function testFindUnknownUser(): void {
    $maintainers = $this->createMaintainers([
      new Response(200, [], '{"list":[]}'),
    ]);

    self::assertNull($maintainers->find('nobody'));
    self::assertCount(1, $this->history);
  }

  /**
   * Tests that a failed request reaches the caller.
   */
  public function testFindFailure(): void {
    $maintainers = $this->createMaintainers([
      new TransferException('drupal.org returned 403 Forbidden.'),
    ]);

    $this->expectException(TransferException::class);
    $maintainers->find('someone');
  }

}
