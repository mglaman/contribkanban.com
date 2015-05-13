'use strict';

/**
 * issueService Factory
 */
projectKanbanApp.factory('issueService', [
  '$http', '$q', 'parseService', 'urlService', function ($http, $q, parseService, urlService) {
    var factory = {};

    /**
     * Base API URL for retrieving issues
     * @type {UrlService}
     */
    var baseURL = new urlService().setEntityEndpoint('node')
      .addParameter('limit', '50')
      .addParameter('type', 'project_issue');


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
        version: object.field_issue_version
      }
    };

    /**
     * Retrieves issues.
     *
     * This will first check Parse.com for a cached response. If one exists,
     * that will be returned. Otherwise it will request the API query from
     * Drupal.org.
     *
     * @param projectNid
     * @param status
     * @param tag
     * @param category
     * @param parentIssue
     * @param priority
     * @param version
     * @param component
     * @param cache
     * @returns {*}
     */
    factory.requestIssues = function (projectNid, status, tag, category, parentIssue, priority, version, component, cache) {
      var deferred = $q.defer();

      // Normalize cache bool.
      cache = (cache === undefined);

      var apiQuery = baseURL;

      // If there was a projectNid, add it as a query option.
      if (projectNid) {
        apiQuery.addParameter('field_project', projectNid);
      }

      // If there was a status, add it as a query option.
      // @todo: Should we validate this (when custom boards exposed)
      if (status) {
        apiQuery.addParameter('field_issue_status', status);
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
        .addParameter('sort', 'changed')
        .addParameter('direction', 'DESC');

      // First check Parse if there is a cached response matching this URL.
      parseService.attributeQuery('IssueQueries', 'self', apiQuery.getEndpointUrl()).then(function (object) {
        // Check if query cache exists
        if (object !== null) {
          // It does exist, check if older than 10 minutes
          var now = new Date();
          if ((now.getTime() - object.updatedAt.getTime()) < 600000) {
            deferred.resolve(responseListProcess(object.attributes.list));
          }
          else {
            // Update the row
            $http.get(apiQuery.getEndpointUrl(), {cache: cache})
              .success(function (response) {
                object.set('list', response.list);
                object.save();
                deferred.resolve(responseListProcess(response.list));
              });
          }
        }
        else {
          // New request
          console.log(apiQuery.getEndpointUrl());
          $http.get(apiQuery.getEndpointUrl(), {cache: cache})
            .success(function (response) {
              //parseService.saveObject('IssueQueries', response);
              deferred.resolve(responseListProcess(response.list));
            });
        }
      }, function () {
        // error reaching parse.
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

      angular.forEach(list, function (v, k) {
        responseIssues.push(apiToStorage(v));
      });
      return responseIssues;
    };

    return factory;
  }
]);
