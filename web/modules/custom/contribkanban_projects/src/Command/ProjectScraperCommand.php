<?php

namespace Drupal\contribkanban_projects\Command;

use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Drupal\Console\Core\Command\Command;
use Drupal\Console\Core\Style\DrupalStyle;
use Drupal\Console\Annotations\DrupalCommand;
use Drupal\contribkanban_projects\Scraper;

/**
 * Class ProjectScraperCommand.
 *
 * @DrupalCommand (
 *     extension="contribkanban_projects",
 *     extensionType="module"
 * )
 */
class ProjectScraperCommand extends Command {

  /**
   * Drupal\contribkanban_projects\Scraper definition.
   *
   * @var \Drupal\contribkanban_projects\Scraper
   */
  protected $contribkanbanProjectsScraper;

  /**
   * Constructs a new ProjectScraperCommand object.
   */
  public function __construct(Scraper $contribkanban_projects_scraper) {
    $this->contribkanbanProjectsScraper = $contribkanban_projects_scraper;
    parent::__construct();
  }
  /**
   * {@inheritdoc}
   */
  protected function configure() {
    $this
      ->setName('projects:scrape')
      ->setDescription($this->trans('commands.projects.scrape.description'));
  }

  /**
   * {@inheritdoc}
   */
  protected function execute(InputInterface $input, OutputInterface $output) {
    $io = new DrupalStyle($input, $output);
    $this->contribkanbanProjectsScraper->scrape();
    $io->info($this->trans('commands.projects.scrape.messages.success'));
    return 0;
  }


}
