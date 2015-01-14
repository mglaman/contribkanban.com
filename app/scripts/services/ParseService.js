'use strict';

/**
 * parseProjectService Factory.
 *
 * Provides a service for interacting with Parse.com and Project class.
 */
projectKanbanApp.factory('parseProjectService', ['$http', '$q', function($http, $q) {
  var factory = {};
  factory.ParseObject = Parse.Object.extend('Project');

  /**
   * Adds a new Project object row
   * @param object
   * @returns {Parse.Promise}
   */
  factory.addRow = function(object) {
    var newObject = new factory.ParseObject();
    return newObject.save(object);
  };

  factory.updateRow = function(object) {
    var newObject = new ParseObject();
    return newObject.save(object);
  };

  /**
   * Queries Project class by attribute.
   *
   * @param attribute
   * @param value
   * @returns {Parse.Promise}
   */
  factory.attributeQuery = function(attribute, value) {
    var deferred = $q.defer();
    var parseQuery = new Parse.Query(factory.ParseObject);
    parseQuery.equalTo(attribute, value);
    parseQuery.first({
      success: function(object) {
        deferred.resolve(object);
      }
    });
    return deferred.promise;
  };

  /**
   * Queries Project class by node ID.
   *
   * @param nid
   * @returns {Parse.Promise}
   */
  factory.loadByNid = function(nid) {
    return this.attributeQuery('nid', nid);
  };

  /**
   * Queries Project class by machine name.
   * @param machineName
   * @returns {Parse.Promise}
   */
  factory.loadByMachineName = function(machineName) {
    var wtf = this.attributeQuery('machine_name', machineName);
    console.log(wtf);
    return wtf;
    //return this.attributeQuery('machine_name', machineName);
  };

  return factory;
}]);