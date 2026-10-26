<?php

namespace Drupal\contribkanban_projects;

use Drupal\Component\Serialization\Json;
use GuzzleHttp\Client;

class Tags {

  /**
   * Constructs a Tags object.
   *
   * @param \GuzzleHttp\Client $client
   *   An HTTP client for the drupal.org api-d7 endpoint.
   */
  public function __construct(
    protected Client $client,
  ) {}

  /**
   * Loads an issue tag from drupal.org by name.
   *
   * @param string $tag
   *   The tag name.
   *
   * @return array
   *   The taxonomy term, or an empty array if it does not exist.
   */
  public function getTag($tag) {
    $params = [
      'limit' => 1,
      'name' => $tag,
      'sort' => 'tid',
      'direction' => 'ASC',
    ];
    $params = array_filter($params);
    $uri = 'taxonomy_term.json?' . http_build_query($params);
    $response = $this->client->get($uri);
    $data = Json::decode($response->getBody()->getContents());
    if (empty($data['list'])) {
      return [];
    }

    return $data['list'][0];
  }

}
