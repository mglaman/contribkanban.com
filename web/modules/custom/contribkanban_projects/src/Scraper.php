<?php

namespace Drupal\contribkanban_projects;

use Drupal\contribkanban_api\Projects;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\State\StateInterface;
use Psr\Log\LoggerInterface;

class Scraper {

  /**
   * The api-d7 page to fetch next.
   *
   * @var int
   */
  protected $currentPage = 0;

  /**
   * The number of pages fetched in this run.
   *
   * @var int
   */
  protected $processedPages = 0;

  /**
   * The most pages to fetch in one run.
   *
   * @var int
   */
  protected $pageLimit = 10;

  /**
   * Constructs a Scraper.
   *
   * @param \Drupal\contribkanban_api\Projects $projectsHelper
   *   Looks up projects on drupal.org.
   * @param \Drupal\Core\State\StateInterface $state
   *   Stores the page to resume from.
   * @param \Psr\Log\LoggerInterface $logger
   *   The scraper's logger.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   *   The entity type manager.
   */
  public function __construct(
    protected Projects $projectsHelper,
    protected StateInterface $state,
    protected LoggerInterface $logger,
    protected EntityTypeManagerInterface $entityTypeManager,
  ) {
    $this->currentPage = $this->state->get('project_scraper_last_page', 0);
  }

  /**
   * Imports projects from drupal.org, up to the page limit.
   */
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

  /**
   * Creates a project entity for each project node not stored yet.
   *
   * @param array $data
   *   The project nodes from one api-d7 page.
   */
  protected function processList(array $data) {
    $project_storage = $this->entityTypeManager->getStorage('project');
    foreach ($data as $project) {
      $exists = $project_storage->loadByProperties([
        'machine_name' => $project['field_project_machine_name'],
      ]);
      if (empty($exists)) {
        $project_storage->create([
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
