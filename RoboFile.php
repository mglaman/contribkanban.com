<?php

/**
 * This is project's console commands configuration for Robo task runner.
 *
 * @see http://robo.li/
 */
class RoboFile extends \Robo\Tasks {

  public function setup() {
    $installedLock = __DIR__ . '/private/installed.lock';
    if (file_exists($installedLock)) {
      $this->say('The application was already setup.');
      return 0;
    }

    $this->drush(['si', '--account-pass=admin'], TRUE)->run();
    touch($installedLock);
  }

  public function runServer() {
    $this->drush('rs')
      ->arg('8080')
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
    if (!is_array($command)) {
      $command = [$command];
    }
    $task->arg($command);
    $task->rawArg(sprintf('-r %s/web', __DIR__));
    if ($quiet) {
      $task->option('yes');
    }
    return $task;
  }
}
