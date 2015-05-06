'use strict';

/**
 * projectService Factory
 *
 * Factory for working with projects.
 */
projectKanbanApp.factory('projectService', [
  '$http', '$q', 'parseService', function ($http, $q, parseService) {
    var factory = {};

    /**
     * Base API URL for retrieving projects
     * @type {string}
     */
    var baseURL = 'https://www.drupal.org/api-d7/node.json?field_project_machine_name=';

    /**
     * Base API URL for retrieving project release nodes.
     * @type {string}
     */
    var releaseURL = 'https://www.drupal.org/api-d7/node.json?type=project_release&field_release_update_status=0&field_release_version_extra=dev&field_release_project=';

    /**
     * Returns project release nodes.
     *
     * @param nid
     * @returns {ng.IPromise<T>}
     */
    factory.requestProjectRelease = function (nid) {
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
          }
          deferred.resolve(branchLabels);
        })
        .error(function (d) {
          console.log(d);
        });
      return deferred.promise;
    };

    /**
     * Retrieves a project node from Drupal.org
     *
     * @param machineName
     * @returns {ng.IPromise<T>}
     */
    factory.requestProject = function (machineName) {
      var deferred = $q.defer();
      $http.get(baseURL + machineName)
        .success(function (d) {
          // We did a search
          var returnedObject = d.list[0];
          var project = {
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
            projectMaintainership: returnedObject.taxonomy_vocabulary_46,
            projectComponents: returnedObject.field_project_components || []
          };

          factory.requestProjectRelease(project.nid).then(function (releases) {
            project.releaseBranches = releases;
            deferred.resolve(project);
          });
        });
      return deferred.promise;
    };

    /**
     * Returns returns a project.
     *
     * @param nid
     * @returns {Parse.Promise}
     */
    factory.loadProject = function (nid) {
      return parseService.attributeQuery('Project', 'nid', nid);
    };

    /**
     * Returns a project board configuration.
     *
     * @param nid
     * @returns {Parse.Promise}
     */
    factory.loadProjectConfig = function (nid) {
      return parseService.attributeQuery('ProjectConfig', 'nid', nid);
    };

    return factory;
  }
]);
