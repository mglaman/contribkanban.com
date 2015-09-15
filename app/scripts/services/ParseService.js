/*global projectKanbanApp, Parse*/
'use strict';

/**
 * parseService Factory.
 *
 * Provides a service for interacting with Parse.com.
 */
projectKanbanApp
  .factory('parseService', [
    '$q',
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
        objectQuery: function (type) {
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
        attributeQuery: function (type, attribute, value) {
          var deferred = $q.defer();
          var parseQuery = new Parse.Query(this.parseObject(type));
          parseQuery.equalTo(attribute, value);
          parseQuery.first({
            success: function (object) {
              if (object !== undefined) {
                deferred.resolve(object);
              }
              else {
                deferred.resolve(null);
              }
            }
          });
          return deferred.promise;
        }
      };
    }
  ]);
