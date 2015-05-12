'use strict';

projectKanbanApp
  .service('urlService', [
    '', function () {
      /**
       * Base API URL for retrieving projects
       * @type {string}
       */
      var baseURL = 'https://www.drupal.org/api-d7';

      var entityType = '';
      var parameters = [];


      return {
        /**
         *
         * @returns {string}
         */
        getBaseUrl: function () {
          return baseURL;
        },
        /**
         *
         * @param type
         * @returns {urlService}
         */
        setEntityEndpoint: function (type) {
          entityType = type;
          return this;
        },
        /**
         *
         * @param parameter
         * @param value
         * @returns {urlService}
         */
        addParameter: function (parameter, value) {
          parameters.push(parameter + '=' + value);
          return this;
        },
        /**
         *
         * @returns {string}
         */
        getEndpointUrl: function () {
          var builderUrl = baseURL;
          builderUrl += '/' + entityType + '.json?';
          builderUrl += parameters.join('&');
          return builderUrl;
        }
      };
    }
  ]);