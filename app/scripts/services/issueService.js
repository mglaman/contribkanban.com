'use strict';

projectKanbanApp.factory('issueService', ['$http', '$q', 'parseIssueQueriesService', function($http, $q, parseIssueQueriesService) {
  var factory = {};
  var baseURL = 'https://www.drupal.org/api-d7/node.json?limit=50&type=project_issue';
  var apiSort = '&sort=changed&direction=DESC';

  var apiToStorage = function(object) {
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

  factory.requestIssues = function(projectNid, status, tag, category, parentIssue, cache) {
    var deferred = $q.defer();
    var cachedInParse = false;

    // Normalize cache bool.
    cache = (cache === undefined);

    var apiQuery = baseURL;
    if (projectNid) {
      apiQuery += '&field_project=' + projectNid;
    }

    if (status) {
      apiQuery += '&field_issue_status=' + status;
    }
    if (category) {
      apiQuery += '&field_issue_category=' + category;
    }
    if (tag){
      apiQuery += '&taxonomy_vocabulary_9=' + tag;
    }
    if (parentIssue) {
      apiQuery += '&field_issue_parent=' + parentIssue;
    }

    apiQuery += apiSort;
    //console.log(apiQuery);

    parseIssueQueriesService.loadApiURL(apiQuery).then(function (object) {
      // Check if query cache exists
      if (object !== undefined) {
        // It does exist, check if older than 10 minutes
        var now = new Date();
        if ((now.getTime() - object.updatedAt.getTime()) < 600000) {
          deferred.resolve(responseListProcess(object.attributes.list));
        } else {
          // Update the row
          $http.get(apiQuery, {cache: cache})
            .success(function (response) {
              object.set('list', response.list);
              object.save();
              deferred.resolve(responseListProcess(response.list));
            });
        }
      } else {
        // New request
        $http.get(apiQuery, {cache: cache})
          .success(function (response) {
            parseIssueQueriesService.addRow(response);
            deferred.resolve(responseListProcess(response.list));
          });
      }
    }, function () {
      // error reaching parse.
    });
    return deferred.promise;
  };

  var responseListProcess = function(list) {
    var responseIssues = [];

    angular.forEach(list, function(v,k) {
      responseIssues.push(apiToStorage(v));
    });

    return responseIssues;
  };

  return factory;
}]);
