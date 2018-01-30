<?php

/**
 * This is project's console commands configuration for Robo task runner.
 *
 * @see http://robo.li/
 */
class RoboFile extends \Robo\Tasks {

  public function runServer() {
    $this->taskServer(8080)
      ->dir('web')
      ->run();
  }

  public function deploy() {
    $this->drushCr();
    $this->drush('cim', TRUE)->run();
    $this->drush('updatedb', TRUE)->run();
    $this->drush('entup', TRUE)->run();
  }

  public function drushCr() {
    $this->drush('cr')->run();
  }

  public function runScraper() {
    $task = $this->taskExec(__DIR__ . '/bin/drupal');
    $task->arg('projects:scrape');
    $task->rawArg(sprintf('--root=%s/web', __DIR__));
    $task->run();
  }

  protected function drush($command, $quiet = FALSE) {
    $task = $this->taskExec(__DIR__ . '/bin/drush');
    $task->arg($command);
    $task->rawArg(sprintf('-r %s/web', __DIR__));
    if ($quiet) {
      $task->option('yes');
    }
    return $task;
  }
}
