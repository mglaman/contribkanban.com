<?php

namespace Drupal\contribkanban_projects;

use Drupal\contribkanban_api\Projects;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\State\StateInterface;
use Psr\Log\LoggerInterface;

class Scraper {
  protected $projectsHelper;
  protected $state;
  protected $logger;
  protected $projectStorage;
  protected $currentPage = 0;
  protected $processedPages = 0;
  protected $pageLimit = 10;

  public function __construct(Projects $projectsHelper, StateInterface $state, LoggerInterface $logger, EntityTypeManagerInterface $entity_type_manager) {
    $this->projectsHelper = $projectsHelper;
    $this->state = $state;
    $this->logger = $logger;
    $this->projectStorage = $entity_type_manager->getStorage('project');
    $this->currentPage = $this->state->get('project_scraper_last_page', 0);
  }

  public function scrape() {
    while ($this->processedPages <= $this->pageLimit) {
      $data = $this->projectsHelper->getProjects('full', $this->currentPage, 100);

      if (empty($data)) {
        $this->logger->info(sprintf('There were not projects returned to process. Page %s', $this->currentPage));
        break;
      }

      $this->processList($data['list']);

      // We hit last page. Reset current page and state, exit.
      if (empty($data['next'])) {
        $this->logger->info('Reached end of pages.');
        $this->state->set('project_scraper_last_page', 0);
        return;
      }

      $this->currentPage++;
      $this->processedPages++;
      $this->state->set('project_scraper_last_page', $this->currentPage);
    }
  }

  protected function processList(array $data) {
    foreach ($data as $project) {
      $exists = $this->projectStorage->loadByProperties([
        'machine_name' => $project['field_project_machine_name']
      ]);
      if (empty($exists)) {
        $this->projectStorage->create([
          'name' => $project['title'],
          'machine_name' => $project['field_project_machine_name'],
          'project_type' => $project['field_project_type'],
          'nid' => $project['nid'],
          'components' => $project['field_project_components'],
          'versions' => [],
        ])->save();
      }
    }
  }

}
