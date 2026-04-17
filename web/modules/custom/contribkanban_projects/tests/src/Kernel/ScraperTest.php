<?php

namespace Drupal\Tests\contribkanban_projects\Kernel;

use Drupal\contribkanban_api\Projects;
use Drupal\contribkanban_projects\Entity\Project;
use Drupal\contribkanban_projects\Scraper;
use Drupal\KernelTests\Core\Entity\EntityKernelTestBase;

/**
 * Verifies Scraper creates and deduplicates Project entities.
 *
 * @group contribkanban_projects
 */
class ScraperTest extends EntityKernelTestBase {

  protected static $modules = ['contribkanban_projects', 'contribkanban_api', 'entity'];

  protected function setUp(): void {
    parent::setUp();
    $this->installEntitySchema('project');
  }

  protected function createScraper(Projects $mock_projects): Scraper {
    return new Scraper(
      $mock_projects,
      \Drupal::service('state'),
      \Drupal::service('logger.factory')->get('test'),
      \Drupal::service('entity_type.manager')
    );
  }

  protected function projectData(string $machine_name = 'drupal', string $nid = '3060'): array {
    return [
      'title'                      => ucfirst($machine_name),
      'field_project_machine_name' => $machine_name,
      'field_project_type'         => 'full',
      'nid'                        => $nid,
      'field_project_components'   => [],
    ];
  }

  public function testScrapeCreatesProjectsFromList(): void {
    $mock = $this->createMock(Projects::class);
    $mock->method('getProjects')
      ->willReturn(['list' => [$this->projectData()]]);

    $this->createScraper($mock)->scrape();

    $results = \Drupal::entityTypeManager()
      ->getStorage('project')
      ->loadByProperties(['machine_name' => 'drupal']);
    $this->assertCount(1, $results);
  }

  public function testScrapeSkipsExistingProject(): void {
    Project::create([
      'name'         => 'Drupal',
      'machine_name' => 'drupal',
      'project_type' => 'full',
      'nid'          => '3060',
    ])->save();

    $mock = $this->createMock(Projects::class);
    $mock->method('getProjects')
      ->willReturn(['list' => [$this->projectData()]]);

    $this->createScraper($mock)->scrape();

    $results = \Drupal::entityTypeManager()
      ->getStorage('project')
      ->loadByProperties(['machine_name' => 'drupal']);
    $this->assertCount(1, $results);
  }

  public function testScrapeResetsStateOnLastPage(): void {
    \Drupal::state()->set('project_scraper_last_page', 3);

    $mock = $this->createMock(Projects::class);
    $mock->method('getProjects')
      ->willReturn(['list' => [$this->projectData()]]);

    $this->createScraper($mock)->scrape();

    $this->assertEquals(0, \Drupal::state()->get('project_scraper_last_page'));
  }

  public function testScrapeBreaksWhenEmptyData(): void {
    $mock = $this->createMock(Projects::class);
    $mock->method('getProjects')->willReturn([]);

    $this->createScraper($mock)->scrape();

    $results = \Drupal::entityTypeManager()
      ->getStorage('project')
      ->loadMultiple();
    $this->assertCount(0, $results);
  }

  public function testScrapeAdvancesPageState(): void {
    $mock = $this->createMock(Projects::class);
    $mock->method('getProjects')
      ->willReturnOnConsecutiveCalls(
        ['list' => [$this->projectData('drupal', '3060')], 'next' => 'page=1'],
        ['list' => [$this->projectData('views', '89747')]]
      );

    $this->createScraper($mock)->scrape();

    $this->assertEquals(0, \Drupal::state()->get('project_scraper_last_page'));

    $storage = \Drupal::entityTypeManager()->getStorage('project');
    $this->assertCount(1, $storage->loadByProperties(['machine_name' => 'drupal']));
    $this->assertCount(1, $storage->loadByProperties(['machine_name' => 'views']));
  }

}
