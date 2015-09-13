/*global projectKanbanApp*/
'use strict';

projectKanbanApp
  .factory('UrlService', function () {

    function UrlService() {
      /**
       * Base API URL for retrieving projects
       * @type {string}
       */
      var baseURL = 'https://www.drupal.org/api-d7';

      var entityType = '';
      var parameters = [];

      /**
       *
       * @returns {string}
       */
      this.getBaseUrl = function () {
        return baseURL;
      };

      /**
       *
       * @param type
       * @returns {UrlService}
       */
      this.setEntityEndpoint = function (type) {
        entityType = type;
        return this;
      };

      /**
       *
       * @param parameter
       * @param value
       * @returns {UrlService}
       */
      this.addParameter = function (parameter, value) {
        parameters.push(parameter + '=' + value);
        return this;
      };

      /**
       *
       * @returns {string}
       */
      this.getEndpointUrl = function () {
        var builderUrl = baseURL;
        builderUrl += '/' + entityType + '.json?';
        builderUrl += parameters.join('&');
        return builderUrl;
      };

      this.build = function () {
        return new UrlService();
      };
    }

    return UrlService;
  });
