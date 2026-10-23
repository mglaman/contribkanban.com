<?php

namespace Drupal\contribkanban_api\Controller;

use Drupal\contribkanban_api\BoardFactory;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

final class AddBoard implements ContainerInjectionInterface {

  use BoardResponseTrait;

  /**
   * Constructs an AddBoard controller.
   *
   * @param \Drupal\contribkanban_api\BoardFactory $boardFactory
   *   Gets boards for drupal.org projects.
   */
  public function __construct(
    private readonly BoardFactory $boardFactory,
  ) {}

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new self(
      $container->get('contribkanban_api.board_factory'),
    );
  }

  /**
   * Creates a board for a drupal.org project, or returns the existing one.
   *
   * @param string $machine_name
   *   The project's machine name.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   The board's machine name, with 201 if created or 200 if it existed, 404
   *   if drupal.org has no such project, or the validation errors with 422.
   */
  public function handle($machine_name) {
    $machine_name = urldecode($machine_name);
    $board = $this->boardFactory->forProject($machine_name);
    if ($board === NULL) {
      return new JsonResponse(['errors' => ['machine_name' => "drupal.org has no project named $machine_name."]], 404);
    }
    return $this->saveBoard($board);
  }

}
