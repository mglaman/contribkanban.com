<?php

namespace Drupal\contribkanban_boards\EventSubscriber;

use Drupal\contribkanban_boards\Entity\Board;
use Drupal\contribkanban_boards\Entity\BoardList;
use Drupal\Core\EventSubscriber\CustomPageExceptionHtmlSubscriber;
use Drupal\Core\ParamConverter\ParamNotConvertedException;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;

class MissingBoardExceptionHtmlSubscriber extends CustomPageExceptionHtmlSubscriber {

  public function on404(GetResponseForExceptionEvent $event) {
    $exception = $event->getException();
    $previous = $exception->getPrevious();
    if (!$previous instanceof ParamNotConvertedException) {
      parent::on404($event);
    }
    $route_name = $previous->getRouteName();
    $params = $previous->getRawParameters();
    if ($route_name != 'entity.board.canonical' || !empty($params['board'])) {
      parent::on404($event);
    }
    $machine_name = $params['board'];
    try {
      $project = \Drupal::getContainer()->get('drupalorg_projects')->getProject($machine_name);
      if (empty($project)) {
        throw new \Exception('Unable to determine board type for project');
      }

      $bundle = str_replace('project_', 'drupalorg_', $project['projectType']);
      if (preg_match("/commerce|commerce_|dc_/", $machine_name) === 1) {
        $bundle = 'drupalorg_commerce';
      }
      if (!\Drupal::getContainer()->get('plugin.manager.board_provider')->hasDefinition($bundle)) {
        throw new \Exception('Unable to determine board type for project');
      }
      $existing_board = \Drupal::entityTypeManager()->getStorage('board')->loadByProperties(['project_nid' => $project['nid'], 'type' => $bundle]);
      if (!empty($existing_board)) {
        $existing_board = reset($existing_board);
        $event->setResponse(new RedirectResponse($existing_board->toUrl()->toString()));
      }
      else {
        $backlog = BoardList::create([
          'type' => $bundle,
          'title' => 'Postponed',
          'statuses' => [4, 16],
        ]);
        $active = BoardList::create([
          'type' => $bundle,
          'title' => 'Active',
          'statuses' => [1],
        ]);
        $needs_work = BoardList::create([
          'type' => $bundle,
          'title' => 'Needs Work',
          'statuses' => [13],
        ]);
        $needs_review = BoardList::create([
          'type' => $bundle,
          'title' => 'Needs Review',
          'statuses' => [8],
        ]);
        $rtbc = BoardList::create([
          'type' => $bundle,
          'title' => 'Reviewed & Tested',
          'statuses' => [14,15],
        ]);
        $fixed = BoardList::create([
          'type' => $bundle,
          'title' => 'Fixed',
          'statuses' => [2],
        ]);

        $board = Board::create([
          'type' => $bundle,
          'title' => $project['title'],
          'project_nid' => [$project['nid']],
          'machine_name' => $machine_name,
          'lists' => [
            $backlog,
            $active,
            $needs_work,
            $needs_review,
            $rtbc,
            $fixed
          ],
        ]);
        $board->save();
        $event->setResponse(new RedirectResponse($board->toUrl()->toString()));
      }
    }
    catch (\Exception $e) {
      parent::on404($event);
    }

  }

  /**
   * {@inheritdoc}
   */
  protected static function getPriority() {
    return -30;
  }

}
