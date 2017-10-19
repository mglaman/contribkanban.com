<?php

namespace Drupal\contribkanban_api\Controller;

use Drupal\Component\Serialization\Json;
use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Http\ClientFactory;
use Psr\Http\Message\ResponseInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class Issues implements ContainerInjectionInterface {

  protected $client;

  public function __construct(ClientFactory $factory) {
    $this->client = $factory->fromOptions([
      'base_uri' => 'https://www.drupal.org/api-d7/',
      'headers' => [
        'Accept' => 'application/json',
      ],
    ]);
  }

  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('http_client_factory')
    );
  }

  public function handle(Request $request) {
    $received = Json::decode($request->getContent());
    if (empty($received) || $request->isMethodSafe()) {
      return new JsonResponse();
    }

    $params = [
      'limit' => 100,
      'type' => 'project_issue',
      'field_issue_category' => $received['category'],
      'field_issue_component' => $received['component'],
      'field_issue_parent' => $received['parent'],
      'field_issue_priority' => $received['priority'],
      'field_project[target_id]' => $received['projects'],
      'field_issue_status[value][]' => $received['statuses'],
      'taxonomy_vocabulary_9[tid]' => $received['tag'],
      'field_issue_version' => $received['version'],
      'sort' => 'field_issue_priority',
      'direction' => 'DESC',
    ];
    $params = array_filter($params);
    $uri = 'node.json?' . http_build_query($params);
    $response = $this->client->get($uri);
    $response = $this->processApiResponse($response);

    return new JsonResponse($response, 200, [
      'X-Drupal-API-Request' => $uri,
    ]);
  }

  protected function processApiResponse(ResponseInterface $response) {
    $content = $response->getBody()->getContents();
    $content = Json::decode($content);
    $issues = [];
    foreach ($content['list'] as $item) {
      $issues[] = [
        'nid' => $item['nid'],
        'changed' => DrupalDateTime::createFromTimestamp($item['changed'])->format(\DateTime::ISO8601),
        'summary' => $item['title'],
        'status' => (int) $item['field_issue_status'],
        'category' => $this->issueCategoryMapping((int) $item['field_issue_category']),
        'component' => $item['field_issue_component'],
        'priority' => $this->issuePriorityMapping((int) $item['field_issue_priority']),
        'tags' => (empty($item['taxonomy_vocabulary_9'])) ? NULL : (int) $item['taxonomy_vocabulary_9'],
        'version' => $item['field_issue_version'],
        'assigned' => (!empty($item['field_issue_assigned'])) ? $item['field_issue_assigned'] : ['id' => ''],
        'project' => $item['field_project']['id'],
      ];
    }
    return $issues;
  }

  protected function issuePriorityMapping($value) {
    $mapping = [
      0 => 'Any',
      100 => 'Minor',
      200 => 'Normal',
      300 => 'Major',
      400 => 'Critical',
    ];
    return $mapping[$value];
  }

  protected function issueCategoryMapping($value) {
    $mapping = [
      0 => 'Any',
      1 => 'Bug report',
      2 => 'Task',
      3 => 'Feature request',
      4 => 'Support request',
      5 => 'Plan',
    ];
    return $mapping[$value];
  }

}
