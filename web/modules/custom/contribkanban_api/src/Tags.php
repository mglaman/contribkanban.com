<?php

namespace Drupal\contribkanban_api;

use Drupal\Component\Serialization\Json;
use GuzzleHttp\Client;

class Tags {

  /**
   * @var \GuzzleHttp\Client
   */
  protected $client;

  /**
   *
   */
  public function __construct(Client $client) {
    $this->client = $client;
  }

  /**
   *
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
