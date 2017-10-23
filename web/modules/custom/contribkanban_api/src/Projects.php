<?php

namespace Drupal\contribkanban_api;

use Drupal\Component\Serialization\Json;
use GuzzleHttp\ClientInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class Projects {

  /**
   * @var \GuzzleHttp\Client
   */
  protected $client;

  public function __construct(ClientInterface $client) {
    $this->client = $client;
  }

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
      'projectComponents' => $project_data['field_project_components'] || [],
    ];
    return $project;
  }

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
