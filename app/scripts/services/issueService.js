'use strict';

projectKanbanApp.factory('issueService', ['$http', '$q', function($http, $q) {
  var factory = {};
  var baseURL = 'https://www.drupal.org/api-d7/node.json?type=project_issue&field_project=';
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

  factory.requestIssues = function(projectNid, status, tag, category, cache) {
    var deferred = $q.defer();

    // Normalize cache bool.
    cache = (cache === undefined);

    var apiQuery = baseURL + projectNid;
    apiQuery += '&field_issue_status=' + status;

    if (category) {
      apiQuery += '&field_issue_category=' + category;
    }
    if (tag){
      apiQuery += '&taxonomy_vocabulary_9=' + tag;
    }
    console.log(apiQuery);

    $http.get(apiQuery + apiSort, {cache: cache})
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
