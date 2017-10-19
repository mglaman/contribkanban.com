<?php
/**
 * This is project's console commands configuration for Robo task runner.
 *
 * @see http://robo.li/
 */
class RoboFile extends \Robo\Tasks
{
    public function runServer() {
        $this->taskServer(8080)
        ->dir('web')
        ->run();
    }
}