<?php

namespace Drupal\contribkanban_api\Controller;

use Drupal\contribkanban_api\BoardFactory;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\Component\Serialization\Json;

final class AddTag implements ContainerInjectionInterface {

  use BoardResponseTrait;

  /**
   * Constructs an AddTag controller.
   *
   * @param \Drupal\contribkanban_api\BoardFactory $boardFactory
   *   Gets boards for drupal.org issue tags.
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
   * Creates a sprint board for an issue tag, or returns the existing one.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The request, whose JSON body may hold the tag's term ID as "tid".
   * @param string $tag
   *   The tag name.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   The board's machine name, with 201 if created or 200 if it existed, 404
   *   if drupal.org has no such tag, or the validation errors with 422.
   */
  public function handle(Request $request, $tag) {
    $tag_name = urldecode($tag);
    $payload = Json::decode($request->getContent());
    $tid = !empty($payload['tid']) ? (string) $payload['tid'] : NULL;
    $board = $this->boardFactory->forTag($tag_name, $tid);
    if ($board === NULL) {
      return new JsonResponse(['errors' => ['tag' => "drupal.org has no issue tag named $tag_name."]], 404);
    }
    return $this->saveBoard($board);
  }

}
