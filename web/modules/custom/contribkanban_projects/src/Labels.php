<?php

declare(strict_types=1);

namespace Drupal\contribkanban_projects;

use Drupal\Component\Serialization\Json;
use GuzzleHttp\Client;

class Labels {

  /**
   * Constructs a Labels object.
   *
   * @param \GuzzleHttp\Client $client
   *   An HTTP client for the git.drupalcode.org API.
   */
  public function __construct(
    private readonly Client $client,
  ) {}

  /**
   * Checks whether any drupal.org project's work item has a label.
   *
   * GitLab labels belong to each project, so there is no list of every
   * project's labels to search. A label on at least one work item, open or
   * closed, is one people use.
   *
   * @param string $label
   *   The label, like `ai::outside`. Labels are case-sensitive.
   *
   * @return bool
   *   TRUE if a work item has the label.
   *
   * @throws \GuzzleHttp\Exception\GuzzleException
   *   When git.drupalcode.org can't be reached.
   */
  public function hasWorkItems(string $label): bool {
    // GitLab reads a comma as a list of labels, which all must match.
    if ($label === '' || str_contains($label, ',')) {
      return FALSE;
    }
    $response = $this->client->get('groups/project/issues?' . http_build_query([
      'labels' => $label,
      'state' => 'all',
      'per_page' => 1,
    ]));
    $data = Json::decode($response->getBody()->getContents());
    return is_array($data) && $data !== [];
  }

}
