'use strict';

projectKanbanApp.factory('projectService', ['$http', '$q', function($http, $q) {
  var factory = {};
  //taxonomy_vocabulary_9=31228
  var baseURL = 'https://www.drupal.org/api-d7/node.json?field_project_machine_name=';

  var ParseObject = Parse.Object.extend('Project');

  var project = {};

  factory.requestProject = function(machineName) {
    var deferred = $q.defer();
    $http.get(baseURL + machineName)
      .success(function (d) {
        // We did a search
        var returnedObject = d.list[0];
        project = {
          changed: returnedObject.changed || '',
          machine_name: returnedObject.field_project_machine_name,
          type: returnedObject.field_project_type,
          versionFormat: returnedObject.field_release_version_format,
          nid: returnedObject.nid,
          title: returnedObject.title,
          projectType: returnedObject.type,
          hasIssues: returnedObject.field_project_has_issue_queue,
          projectCategory: returnedObject.taxonomy_vocabulary_3,
          projectActivity: returnedObject.taxonomy_vocabulary_44,
          projectMaintainership: returnedObject.taxonomy_vocabulary_46
        };

        deferred.resolve(project);
      });
    return deferred.promise;
  };

  factory.addProject = function(machineName) {
    return $http.get(baseURL + machineName).then(function(response) {
      return response.data;
    });
  };

  factory.loadProject = function(nid) {
    var deferred = $q.defer();
    var parseQuery = new Parse.Query(ParseObject);
    parseQuery.equalTo('nid', nid);
    parseQuery.first({
      success: function(object) {
        if (typeof object !== undefined) {
          deferred.resolve(object.attributes);
        }
      }
    });
    return deferred.promise;
  };

  factory.getProject = function() {
    return project;
  };

  return factory;
}]);