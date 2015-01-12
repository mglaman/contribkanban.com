'use strict';

projectKanbanApp.factory('projectService', ['$http', '$q', function($http, $q) {
  var factory = {};
  var baseURL = 'https://www.drupal.org/api-d7/node.json?field_project_machine_name=';
  var releaseURL = 'https://www.drupal.org/api-d7/node.json?type=project_release&field_release_update_status=0&field_release_version_extra=dev&field_release_project=';

  var ParseObject = Parse.Object.extend('Project');

  var project = {};

  factory.requestProjectRelease = function(nid) {
    var deferred = $q.defer();
    var branchLabels = [];
    $http.get(releaseURL + nid)
      .success(function (d) {
        var releases = d.list;
        if (releases.length > 0) {
          angular.forEach(releases, function (object, key) {
            branchLabels.push({
              name: object.field_release_vcs_label,
              label: object.field_release_vcs_label
            });
          });

          deferred.resolve(branchLabels);
        }
      });
    return deferred.promise;
  };

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
        if (object !== undefined) {
          deferred.resolve(object.attributes);
        }
      }
    });
    return deferred.promise;
  };

  factory.getProject = function() {
    return project;
  };

  factory.loadProjectConfig = function(nid) {
    var deferred = $q.defer();
    var ParseObject = Parse.Object.extend('ProjectConfig');
    var parseQuery = new Parse.Query(ParseObject);
    parseQuery.equalTo('nid', nid);
    parseQuery.first({
      success: function(object) {
        if (object !== undefined) {
          deferred.resolve(object.attributes);
        } else {
          deferred.resolve(null);
        }
      }
    });
    return deferred.promise;
  };

  return factory;
}]);
