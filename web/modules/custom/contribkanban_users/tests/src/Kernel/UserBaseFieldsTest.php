<?php

namespace Drupal\Tests\contribkanban_users\Kernel;

use Drupal\KernelTests\Core\Entity\EntityKernelTestBase;
use Drupal\user\Entity\User;
use GuzzleHttp\Client;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\StreamInterface;

/**
 * Verifies contribkanban_users adds expected base fields to User entity.
 *
 * @group contribkanban_users
 */
class UserBaseFieldsTest extends EntityKernelTestBase {

  protected static $modules = ['contribkanban_users'];

  public function testUserBaseFieldsExist(): void {
    $field_definitions = \Drupal::service('entity_field.manager')
      ->getBaseFieldDefinitions('user');

    $this->assertArrayHasKey('drupalorg_username', $field_definitions);
    $this->assertArrayHasKey('drupalorg_uid', $field_definitions);
    $this->assertArrayHasKey('mail_hash', $field_definitions);
  }

  public function testDrupalorgUsernameFieldDefinition(): void {
    $field_definitions = \Drupal::service('entity_field.manager')
      ->getBaseFieldDefinitions('user');

    $field = $field_definitions['drupalorg_username'];
    $this->assertEquals('string', $field->getType());
    $this->assertEquals(255, $field->getSetting('max_length'));
  }

  public function testDrupalorgUidFieldDefinition(): void {
    $field_definitions = \Drupal::service('entity_field.manager')
      ->getBaseFieldDefinitions('user');

    $field = $field_definitions['drupalorg_uid'];
    $this->assertEquals('string', $field->getType());
    $this->assertEquals(255, $field->getSetting('max_length'));
  }

  public function testMailHashFieldIsComputed(): void {
    $field_definitions = \Drupal::service('entity_field.manager')
      ->getBaseFieldDefinitions('user');

    $field = $field_definitions['mail_hash'];
    $this->assertTrue($field->isComputed());
  }

  public function testMailHashFieldUsesGravatarFieldItemList(): void {
    $mock_client = $this->createMock(Client::class);
    $mock_client->expects($this->never())->method('get');
    $this->container->set('drupalorg_client', $mock_client);

    $user = User::create([
      'name' => 'hashtest',
      'mail' => 'Test@Example.com',
    ]);
    $user->save();

    $field_list = $user->get('mail_hash');
    $this->assertInstanceOf(\Drupal\contribkanban_users\GravatarFieldItemList::class, $field_list);
    $this->assertEquals(md5('test@example.com'), $field_list->first()->value);
  }

  public function testPresaveFetchesDrupalorgUidWhenUsernameSet(): void {
    $stream = $this->createMock(StreamInterface::class);
    $stream->method('getContents')
      ->willReturn(json_encode(['list' => [['uid' => '12345']]]));

    $response = $this->createMock(ResponseInterface::class);
    $response->method('getBody')->willReturn($stream);

    $mock_client = $this->createMock(Client::class);
    $mock_client->expects($this->once())
      ->method('get')
      ->with('user.json?name=mglaman')
      ->willReturn($response);

    $this->container->set('drupalorg_client', $mock_client);

    $user = User::create([
      'name' => 'testuser',
      'mail' => 'test@example.com',
      'drupalorg_username' => 'mglaman',
    ]);
    $user->save();

    $this->assertEquals('12345', $user->get('drupalorg_uid')->value);
  }

  public function testPresaveSkipsApiCallWhenUidAlreadySet(): void {
    $mock_client = $this->createMock(Client::class);
    $mock_client->expects($this->never())->method('get');
    $this->container->set('drupalorg_client', $mock_client);

    $user = User::create([
      'name' => 'testuser2',
      'mail' => 'test2@example.com',
      'drupalorg_username' => 'mglaman',
      'drupalorg_uid' => '12345',
    ]);
    $user->save();

    $this->assertEquals('12345', $user->get('drupalorg_uid')->value);
  }

  public function testPresaveSkipsApiCallWhenUsernameEmpty(): void {
    $mock_client = $this->createMock(Client::class);
    $mock_client->expects($this->never())->method('get');
    $this->container->set('drupalorg_client', $mock_client);

    $user = User::create([
      'name' => 'testuser3',
      'mail' => 'test3@example.com',
    ]);
    $user->save();

    $this->assertTrue($user->get('drupalorg_uid')->isEmpty());
  }

}
