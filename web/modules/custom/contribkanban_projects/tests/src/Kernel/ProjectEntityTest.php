<?php

namespace Drupal\Tests\contribkanban_projects\Kernel;

use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\contribkanban_projects\Entity\Project;
use Drupal\KernelTests\Core\Entity\EntityKernelTestBase;

/**
 * Verifies Project entity schema and persistence.
 *
 * @group contribkanban_projects
 */
class ProjectEntityTest extends EntityKernelTestBase {

  protected static $modules = ['contribkanban_projects', 'contribkanban_api', 'entity'];

  protected function setUp(): void {
    parent::setUp();
    $this->installEntitySchema('project');
  }

  public function testProjectBaseFieldsExist(): void {
    $field_definitions = \Drupal::service('entity_field.manager')
      ->getBaseFieldDefinitions('project');

    $this->assertArrayHasKey('name', $field_definitions);
    $this->assertArrayHasKey('machine_name', $field_definitions);
    $this->assertArrayHasKey('project_type', $field_definitions);
    $this->assertArrayHasKey('version_format', $field_definitions);
    $this->assertArrayHasKey('nid', $field_definitions);
    $this->assertArrayHasKey('components', $field_definitions);
    $this->assertArrayHasKey('versions', $field_definitions);
  }

  public function testProjectFieldTypes(): void {
    $field_definitions = \Drupal::service('entity_field.manager')
      ->getBaseFieldDefinitions('project');

    foreach (['name', 'machine_name', 'project_type', 'version_format', 'nid', 'components', 'versions'] as $field_name) {
      $this->assertEquals('string', $field_definitions[$field_name]->getType(), "Field $field_name should be type string.");
    }
  }

  public function testComponentsAndVersionsUnlimitedCardinality(): void {
    $field_definitions = \Drupal::service('entity_field.manager')
      ->getBaseFieldDefinitions('project');

    $this->assertEquals(
      BaseFieldDefinition::CARDINALITY_UNLIMITED,
      $field_definitions['components']->getCardinality()
    );
    $this->assertEquals(
      BaseFieldDefinition::CARDINALITY_UNLIMITED,
      $field_definitions['versions']->getCardinality()
    );
  }

  public function testProjectCreateAndLoad(): void {
    $project = Project::create([
      'name' => 'Drupal',
      'machine_name' => 'drupal',
      'project_type' => 'full',
      'nid' => '3060',
    ]);
    $project->save();

    $storage = \Drupal::entityTypeManager()->getStorage('project');
    $loaded = $storage->load($project->id());

    $this->assertEquals('Drupal', $loaded->get('name')->value);
    $this->assertEquals('drupal', $loaded->get('machine_name')->value);
    $this->assertEquals('full', $loaded->get('project_type')->value);
    $this->assertEquals('3060', $loaded->get('nid')->value);
  }

  public function testProjectMultiValueFields(): void {
    $project = Project::create([
      'name' => 'Views',
      'machine_name' => 'views',
      'project_type' => 'full',
      'nid' => '89747',
      'components' => ['Views UI', 'Views Ajax'],
    ]);
    $project->save();

    $storage = \Drupal::entityTypeManager()->getStorage('project');
    $loaded = $storage->load($project->id());

    $components = array_column($loaded->get('components')->getValue(), 'value');
    $this->assertContains('Views UI', $components);
    $this->assertContains('Views Ajax', $components);
    $this->assertCount(2, $components);
  }

}
