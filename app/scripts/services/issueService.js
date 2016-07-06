(function (angular) {
  'use strict';

  /**
   * issueService Factory
   */
  angular.module('appContribkanban').factory('issueService', [
    '$http', '$q', 'UrlService', function ($http, $q, UrlService) {
      var factory = {};

      factory.issuePriorities = {
        0: 'Any',
        100: 'Minor',
        200: 'Normal',
        300: 'Major',
        400: 'Critical'
      };
      factory.issueCategories = {
        0: 'Any',
        1: 'Bug report',
        2: 'Task',
        3: 'Feature request',
        4: 'Support request',
        5: 'Plan'
      };

      /**
       * Helper function to convert Drupal.org API object to Parse.com object.
       * @param object
       * @returns {{nid: *, changed: (*|string), summary: (string|string|*|string|string|string), status: *, category: *, component: *, priority: Number, tags: (*|{}), version: *}}
       */
      var apiToStorage = function (object) {
        return {
          nid: object.nid,
          changed: object.changed || '',
          summary: object.title,
          status: object.field_issue_status,
          category: object.field_issue_category,
          component: object.field_issue_component,
          priority: parseInt(object.field_issue_priority),
          tags: object.taxonomy_vocabulary_9 || {},
          version: object.field_issue_version,
          assigned: object.field_issue_assigned || {id: ''},
          project: object.field_project.id
        };
      };

      /**
       * Retrieves issues.
       *
       * This will first check Parse.com for a cached response. If one exists,
       * that will be returned. Otherwise it will request the API query from
       * Drupal.org.
       *
       * @param projectNid
       * @param statuses
       * @param tag
       * @param category
       * @param parentIssue
       * @param priority
       * @param version
       * @param component
       * @param cache
       * @returns {*}
       */
      factory.requestIssues = function (projectNid, statuses, tag, category, parentIssue, priority, version, component, cache) {
        var deferred = $q.defer();

        // Normalize cache bool.
        cache = (cache === undefined);

        var apiQuery = new UrlService().setEntityEndpoint('node')
          .addParameter('limit', '100')
          .addParameter('type', 'project_issue');

        // If there was a projectNid, add it as a query option.
        if (projectNid) {
          apiQuery.addParameter('field_project', projectNid);
        }

        // If there was a status, add it as a query option.
        // @todo: Should we validate this (when custom boards exposed)
        if (statuses) {
          for (var i = 0; i < statuses.length; i++) {
            apiQuery.addParameter('field_issue_status[value][]', statuses[i]);
          }
        }

        // If there was a category, add it as a query option.
        // @todo: Should we validate this (when custom boards exposed)
        if (category) {
          apiQuery.addParameter('field_issue_category', category);
        }

        // If there was a tag, add it as a query option.
        // @todo: Should we validate this (when custom boards exposed)
        if (tag) {
          apiQuery.addParameter('taxonomy_vocabulary_9', tag);
        }

        // If there was a parent issue, add it as a query option.
        if (parentIssue) {
          apiQuery.addParameter('field_issue_parent', parentIssue);
        }

        // If there was a priority, add it as a query option.
        if (priority) {
          apiQuery.addParameter('field_issue_priority', priority);
        }

        // If there was a version, add it as a query option.
        if (version) {
          apiQuery.addParameter('field_issue_version', version);
        }

        // If there was a version, add it as a query option.
        if (component) {
          apiQuery.addParameter('field_issue_component', component);
        }

        apiQuery
          .addParameter('sort', 'field_issue_priority')
          .addParameter('direction', 'DESC');

        // @todo investigate caching responses.
        $http.get(apiQuery.getEndpointUrl(), {cache: cache})
          .success(function (response) {
            deferred.resolve(responseListProcess(response.list));
          });
        return deferred.promise;
      };

      /**
       * Processes an array of issue objects from Drupal.org API.
       *
       * @param list
       * @returns {Array}
       */
      var responseListProcess = function (list) {
        var responseIssues = [];

        angular.forEach(list, function (v) {
          responseIssues.push(apiToStorage(v));
        });
        return responseIssues;
      };

      return factory;
    }
  ]);
})(window.angular);
