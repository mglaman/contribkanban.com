'use strict';

projectKanbanApp.factory('issueService', ['$http', '$q', function($http, $q) {
  var factory = {};
  var baseURL = 'https://www.drupal.org/api-d7/node.json?type=project_issue&field_project=';

  var apiToStorage = function(object) {
    return {
      nid: object.nid,
      changed: object.changed || '',
      summary: object.title,
      status: object.field_issue_status,
      category: object.field_issue_category,
      component: object.field_issue_component,
      priority: object.field_issue_priority,
      tags: object.taxonomy_vocabulary_9 || {},
      version: object.field_issue_version
    }
  };

  factory.requestIssues = function(nid, status, cache) {
    // Normalize cache bool.
    cache = (cache === undefined);

    var deferred = $q.defer();
    $http.get(baseURL + nid + '&field_issue_status=' + status, {cache: cache})
      .success(function (response) {
        // We did a search
        var reponseIssues = [];
        angular.forEach(response.list, function(v,k) {
          reponseIssues.push(apiToStorage(v));
        });
        deferred.resolve(reponseIssues);
      });
    return deferred.promise;
  };

  return factory;
}]);