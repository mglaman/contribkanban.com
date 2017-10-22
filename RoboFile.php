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
    $this->cr();
    $this->drush('cim', TRUE)->run();
    $this->drush('updatedb', TRUE)->run();
    $this->drush('entup', TRUE)->run();
  }

  public function cr() {
    $this->drush('cr')->run();
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
