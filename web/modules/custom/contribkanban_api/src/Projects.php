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
   * Lists the projects that moved their issues to GitLab work items.
   *
   * Drupal.org clears `field_project_has_issue_queue` when a project's issues
   * move, and api-d7 can filter on it.
   *
   * @return \Generator<int, array{nid: string, title: string, machine_name: string, project_type: string}>
   *   The projects, loaded a page of 50 at a time.
   */
  public function listMigratedProjects(): \Generator {
    $types = [
      'project_module',
      'project_theme',
      'project_distribution',
      'project_general',
      'project_theme_engine',
      'project_drupalorg',
    ];
    foreach ($types as $type) {
      $page = 0;
      do {
        $uri = 'node.json?' . http_build_query([
          'type' => $type,
          'field_project_has_issue_queue' => 0,
          'limit' => 50,
          'page' => $page,
        ]);
        $data = Json::decode($this->client->get($uri)->getBody()->getContents());
        foreach ($data['list'] ?? [] as $node) {
          yield [
            'nid' => (string) $node['nid'],
            'title' => (string) $node['title'],
            'machine_name' => (string) $node['field_project_machine_name'],
            'project_type' => (string) ($node['field_project_type'] ?? ''),
          ];
        }
        $page++;
      } while (!empty($data['next']));
    }
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
