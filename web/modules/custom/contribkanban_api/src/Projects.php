<?php

namespace Drupal\contribkanban_api;

use Drupal\Component\Serialization\Json;
use GuzzleHttp\Client;

class Projects {

  /**
   * Constructs a Projects object.
   *
   * @param \GuzzleHttp\Client $client
   *   An HTTP client for the drupal.org api-d7 endpoint.
   */
  public function __construct(
    protected Client $client,
  ) {}

  /**
   * Loads a project from drupal.org by machine name.
   *
   * @param string $machine_name
   *   The project's machine name.
   *
   * @return array
   *   The project's details, or an empty array if it does not exist.
   */
  public function getProject($machine_name) {
    $params = [
      'field_project_machine_name' => $machine_name,
    ];
    $params = array_filter($params);
    $uri = 'node.json?' . http_build_query($params);
    $response = $this->client->get($uri);
    $data = Json::decode($response->getBody()->getContents());
    if (empty($data['list'])) {
      return [];
    }
    $project_data = $data['list'][0];
    $project = [
      'machine_name' => $project_data['field_project_machine_name'],
      'type' => $project_data['field_project_type'],
      'versionFormat' => $project_data['field_release_version_format'],
      'nid' => $project_data['nid'],
      'title' => $project_data['title'],
      'projectType' => $project_data['type'],
      'hasIssues' => $project_data['field_project_has_issue_queue'],
      'projectCategory' => !empty($project_data['taxonomy_vocabulary_3']) ? $project_data['taxonomy_vocabulary_3'] : '',
      'projectActivity' => $project_data['taxonomy_vocabulary_44'],
      'projectMaintainership' => $project_data['taxonomy_vocabulary_46'],
      'projectComponents' => $project_data['field_project_components'] ?? [],
    ];
    return $project;
  }

  /**
   * Finds which projects moved their issues to GitLab work items.
   *
   * @param string[] $nids
   *   Project node IDs.
   *
   * @return string[]
   *   The node IDs of projects without a Drupal.org issue queue.
   */
  public function getMigratedProjectNids(array $nids): array {
    $migrated = [];
    // api-d7 returns at most 50 nodes per page.
    foreach (array_chunk(array_values(array_unique($nids)), 50) as $chunk) {
      $uri = 'node.json?' . http_build_query(['nid' => $chunk, 'limit' => 50]);
      $response = $this->client->get($uri);
      $data = Json::decode($response->getBody()->getContents());
      foreach ($data['list'] ?? [] as $node) {
        if ($node['field_project_has_issue_queue'] === FALSE) {
          $migrated[] = (string) $node['nid'];
        }
      }
    }
    return $migrated;
  }

  /**
   * Lists projects from drupal.org.
   *
   * @param string $type
   *   The project type, such as "full" or "sandbox".
   * @param int $page
   *   The page to load.
   * @param int $limit
   *   The number of projects per page.
   *
   * @return array
   *   The api-d7 response, or an empty array when there are no results.
   */
  public function getProjects($type = 'full', $page = 1, $limit = 100) {
    $params = [
      'field_project_type' => $type,
      'page' => $page,
      'limit' => $limit,
      'sort' => 'nid',
      'direction' => 'ASC',
    ];
    $params = array_filter($params);
    $uri = 'node.json?' . http_build_query($params);
    $response = $this->client->get($uri);
    $data = Json::decode($response->getBody()->getContents());
    if (empty($data['list'])) {
      return [];
    }

    return $data;
  }

}
