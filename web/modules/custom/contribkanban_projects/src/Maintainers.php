<?php

declare(strict_types=1);

namespace Drupal\contribkanban_projects;

use Drupal\Component\Serialization\Json;
use Drupal\Component\Utility\Html;
use GuzzleHttp\Client;

class Maintainers {

  /**
   * Constructs a Maintainers object.
   *
   * @param \GuzzleHttp\Client $client
   *   An HTTP client for drupal.org, based at the api-d7 endpoint.
   */
  public function __construct(
    private readonly Client $client,
  ) {}

  /**
   * Looks up a drupal.org user and the projects they maintain.
   *
   * No API lists a user's projects. api-d7 only filters by a project's author,
   * which misses co-maintainers, and GitLab only shows memberships to the
   * member. So this reads the "Projects maintained" block on the user's
   * profile.
   *
   * @param string $name
   *   The drupal.org username.
   *
   * @return array{name: string, slug: string, projects: list<string>}|null
   *   The username as drupal.org spells it, a URL-safe name, and the machine
   *   names of their projects. NULL if drupal.org has no such user.
   *
   * @throws \GuzzleHttp\Exception\GuzzleException
   *   When drupal.org can't be reached.
   */
  public function find(string $name): ?array {
    $response = $this->client->get('user.json?' . http_build_query(['name' => $name]));
    $data = Json::decode($response->getBody()->getContents());
    $user = is_array($data) ? ($data['list'][0] ?? NULL) : NULL;
    if (!is_array($user) || !is_numeric($user['uid'] ?? NULL) || !is_string($user['name'] ?? NULL)) {
      return NULL;
    }
    $uid = (string) $user['uid'];
    $url = is_string($user['url'] ?? NULL) ? $user['url'] : '';
    // Users without a profile alias have a URL with their user ID.
    $slug = preg_match('#/u/([a-z0-9-]+)$#', $url, $matches) === 1 ? $matches[1] : "user-$uid";
    $profile = $this->client->get("/user/$uid", ['headers' => ['Accept' => 'text/html']]);
    return [
      'name' => $user['name'],
      'slug' => $slug,
      'projects' => self::parseProjects($profile->getBody()->getContents()),
    ];
  }

  /**
   * Reads project machine names from a profile page.
   *
   * @param string $html
   *   The profile page.
   *
   * @return list<string>
   *   The machine names. Empty if the user maintains nothing, or if drupal.org
   *   changed the block's markup.
   */
  private static function parseProjects(string $html): array {
    $links = (new \DOMXPath(Html::load($html)))->query(
      "//*[contains(@class, 'view-id-users_maintained_projects')]//a[starts-with(@href, '/project/')]"
    );
    $projects = [];
    foreach ($links === FALSE ? [] : $links as $link) {
      if ($link instanceof \DOMElement && preg_match('#^/project/([a-z0-9_]+)$#', $link->getAttribute('href'), $matches) === 1) {
        $projects[$matches[1]] = $matches[1];
      }
    }
    return array_values($projects);
  }

}
