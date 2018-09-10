<?php
/**
 * @file
 * Contains \Drupal\biopama_user_migrate\Plugin\migrate\source\User.
 */
 
namespace Drupal\biopama_user_migrate\Plugin\migrate\source;
 
use Drupal\migrate\Row;
use Drupal\migrate_drupal\Plugin\migrate\source\DrupalSqlBase;

 
/**
 * Extract users from Drupal 7 database.
 *
 * @MigrateSource(
 *   id = "custom_user"
 * )
 */
class User extends DrupalSqlBase {
 
  /**
   * {@inheritdoc}
   */
  public function query() {
    return $this->select('users', 'u')
      ->fields('u', array_keys($this->baseFields()))
      ->condition('uid', 0, '>');
  }
 
  /**
   * {@inheritdoc}
   */
  public function fields() {
    $fields = $this->baseFields();
    $fields['field_firstname'] = $this->t('First name');
    $fields['field_lastname'] = $this->t('Last name');
    $fields['field_user_bio'] = $this->t('Biography');
    return $fields;
  }
 
  /**
   * {@inheritdoc}
   */
  public function prepareRow(Row $row) {
    $uid = $row->getSourceProperty('uid');
 
    // first_name
    $result = $this->getDatabase()->query('
      SELECT
        fld.field_firstname_value
      FROM
        {field_data_field_firstname} fld
      WHERE
        fld.entity_id = :uid
    ', array(':uid' => $uid));
    foreach ($result as $record) {
      $row->setSourceProperty('first_name', $record->field_firstname_value );
    }
 
    // last_name
    $result = $this->getDatabase()->query('
      SELECT
        fld.field_lastname_value
      FROM
        {field_data_field_lastname} fld
      WHERE
        fld.entity_id = :uid
    ', array(':uid' => $uid));
    foreach ($result as $record) {
      $row->setSourceProperty('last_name', $record->field_lastname_value );
    }
 
    // biography
    $result = $this->getDatabase()->query('
      SELECT
        fld.field_user_bio_value,
        fld.field_user_bio_format
      FROM
        {field_data_field_user_bio} fld
      WHERE
        fld.entity_id = :uid
    ', array(':uid' => $uid));
    foreach ($result as $record) {
      $row->setSourceProperty('biography_value', $record->field_user_bio_value );
      $row->setSourceProperty('biography_format', $record->field_user_bio_format );
    }
 
    return parent::prepareRow($row);
  }
 
  /**
   * {@inheritdoc}
   */
  public function getIds() {
    return array(
      'uid' => array(
        'type' => 'integer',
        'alias' => 'u',
      ),
    );
  }
 
  /**
   * Returns the user base fields to be migrated.
   *
   * @return array
   *   Associative array having field name as key and description as value.
   */
  protected function baseFields() {
    $fields = array(
      'uid' => $this->t('User ID'),
      'name' => $this->t('Username'),
      'pass' => $this->t('Password'),
      'mail' => $this->t('Email address'),
      'signature' => $this->t('Signature'),
      'signature_format' => $this->t('Signature format'),
      'created' => $this->t('Registered timestamp'),
      'access' => $this->t('Last access timestamp'),
      'login' => $this->t('Last login timestamp'),
      'status' => $this->t('Status'),
      'timezone' => $this->t('Timezone'),
      'language' => $this->t('Language'),
      'picture' => $this->t('Picture'),
      'init' => $this->t('Init'),
    );
    return $fields;
 
}
 
  /**
   * {@inheritdoc}
   */
  public function bundleMigrationRequired() {
    return FALSE;
  }
 
  /**
   * {@inheritdoc}
   */
  public function entityTypeId() {
    return 'user';
  }
  
}
?>