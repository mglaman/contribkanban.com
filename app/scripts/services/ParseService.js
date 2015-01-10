'use strict';

/**
 * parseProjectService Factory.
 *
 * Provides a service for interacting with Parse.com and Project class.
 */
projectKanbanApp.factory('parseProjectService', ['$http', '$q', function($http, $q) {
  var factory = {};
  var ParseObject = Parse.Object.extend('Project');

  /**
   * Adds a new Project object row
   * @param object
   * @returns {Parse.Promise}
   */
  factory.addRow = function(object) {
    var newObject = new ParseObject();
    return newObject.save(object);
  };

  /**
   * Queries Project class by attribute.
   *
   * @param attribute
   * @param value
   * @returns {ng.IPromise<T>}
   */
  factory.attributeQuery = function(attribute, value) {
    var deferred = $q.defer();
    var parseQuery = new Parse.Query(ParseObject);
    parseQuery.equalTo(attribute, value);
    parseQuery.first({
      success: function(object) {
        if (typeof object != 'undefined') {
          deferred.resolve(object.attributes);
        }
        else {
          deferred.resolve(object);
        }
      }
    });
    return deferred.promise;
  };

  /**
   * Queries Project class by node ID.
   *
   * @param nid
   * @returns {ng.IPromise.<T>}
   */
  factory.loadByNid = function(nid) {
    return this.attributeQuery('nid', nid);
  };

  /**
   * Queries Project class by machine name.
   * @param machineName
   * @returns {ng.IPromise.<T>}
   */
  factory.loadByMachineName = function(machineName) {
    var wtf = this.attributeQuery('machine_name', machineName);
    console.log(wtf);
    return wtf;
    //return this.attributeQuery('machine_name', machineName);
  };

  return factory;
}]);