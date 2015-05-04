'use strict';

/**
 * parseProjectService Factory.
 *
 * Provides a service for interacting with Parse.com and Project class.
 */
projectKanbanApp
  .factory('parseService', [ '$q',
    function ($q) {
      return {

        /**
         * Returns a Parse.com object.
         *
         * @param classType
         * @returns {*}
         */
        parseObject: function (classType) {
          return Parse.Object.extend(classType);
        },

        /**
         * Adds a new object.
         *
         * @param type
         * @param object
         * @returns {Parse.Promise}
         */
        saveObject: function (type, object) {
          var parseObject = this.parseObject(type);
          var newObject = new parseObject();
          return newObject.save(object);
        },

        /**
         * Returns a new class query.
         *
         * @param type
         * @returns {Parse.Query}
         */
        objectQuery: function(type) {
          var parseObject = this.parseObject(type);
          return new Parse.Query(parseObject);
        },

        /**
         * Queries classes by an attribute.
         *
         * @param type
         * @param attribute
         * @param value
         * @returns {Deferred}
         */
        attributeQuery: function(type, attribute, value) {
          var deferred = $q.defer();
          var parseQuery = new Parse.Query(this.parseObject(type));
          parseQuery.equalTo(attribute, value);
          parseQuery.first({
            success: function (object) {
              if (object !== undefined) {
                deferred.resolve(object);
              } else {
                deferred.resolve(null);
              }
            }
          });
          return deferred.promise;
        }
      };
    }])
  .factory('parseIssueQueriesService', [
    '$http', '$q', function ($http, $q) {
      var factory = {};
      factory.ParseObject = Parse.Object.extend('IssueQueries');

      /**
       * Adds a new IssueQueries object row
       * @param object
       * @returns {Parse.Promise}
       */
      factory.addRow = function (object) {
        var newObject = new factory.ParseObject();
        return newObject.save(object);
      };

      factory.updateRow = function (object) {
        var newObject = new factory.ParseObject();
        return newObject.save(object);
      };

      /**
       * Queries IssueQueries class by attribute.
       *
       * @param attribute
       * @param value
       * @returns {Parse.Promise}
       */
      factory.attributeQuery = function (attribute, value) {
        var deferred = $q.defer();
        var parseQuery = new Parse.Query(factory.ParseObject);
        parseQuery.equalTo(attribute, value);
        parseQuery.first({
          success: function (object) {
            deferred.resolve(object);
          }
        });
        return deferred.promise;
      };

      /**
       * Queries Project class by node ID.
       *
       * @param url
       * @returns {Parse.Promise}
       */
      factory.loadApiURL = function (url) {
        return this.attributeQuery('self', url.replace('.json', ''));
      };

      return factory;
    }
  ])
  .factory('parseSprintService', [
    '$http', '$q', function ($http, $q) {
      var factory = {};
      factory.ParseObject = Parse.Object.extend('Boards');

      /**
       * Adds a new Boards object row
       * @param object
       * @returns {Parse.Promise}
       */
      factory.addRow = function (object) {
        var newObject = new factory.ParseObject();
        return newObject.save(object);
      };

      /**
       * Queries Boards class by attribute.
       *
       * @param attribute
       * @param value
       * @returns {Parse.Promise}
       */
      factory.attributeQuery = function (attribute, value) {
        var deferred = $q.defer();
        var parseQuery = new Parse.Query(factory.ParseObject);
        parseQuery.equalTo(attribute, value);
        parseQuery.first({
          success: function (object) {
            deferred.resolve(object);
          }
        });
        return deferred.promise;
      };

      /**
       * Queries Boards class by node ID.
       *
       * @param nid
       * @returns {Parse.Promise}
       */
      factory.loadApiURL = function (nid) {
        return this.attributeQuery('nid', nid);
      };

      return factory;
    }
  ]);
