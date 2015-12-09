/*global projectKanbanApp, angular, alert*/
'use strict';

/**
 * projectService Factory
 *
 * Factory for working with projects.
 */
projectKanbanApp.factory('projectService', [
  '$http', '$q', 'UrlService', function ($http, $q, UrlService) {
    var factory = {};

    /**
     * Base API URL for retrieving projects
     * @type {UrlService}
     */
    var baseURL = new UrlService().setEntityEndpoint('node');

    /**
     * Base API URL for retrieving project release nodes.
     * @type {UrlService}
     */
    var releaseURL = new UrlService().setEntityEndpoint('node')
      .addParameter('type', 'project_release')
      .addParameter('field_release_update_status', '0')
      .addParameter('field_release_version_extra', 'dev');

    /**
     * Returns project release nodes.
     *
     * @param nid
     * @returns {ng.IPromise<T>}
     */
    factory.requestProjectRelease = function (nid) {
      var deferred = $q.defer();
      var branchLabels = [];
      $http.get(releaseURL.addParameter('field_release_project', nid).getEndpointUrl())
        .success(function (d) {
          var releases = d.list;
          if (releases.length > 0) {
            angular.forEach(releases, function (object) {
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
      $http.get(baseURL.addParameter('field_project_machine_name', machineName).getEndpointUrl())
        .success(function (d) {
          // We did a search
          var returnedObject = d.list[0];
          if (returnedObject === undefined) {
            alert('Invalid project machine name');
          } else {
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
          }
        });
      return deferred.promise;
    };

    /**
     * Saves project to internal API.
     *
     * @param project
     * @returns {HttpPromise}
     */
    factory.saveProject = function (project) {
      return $http.post('/api/project', project);
    };

    /**
     * Returns a project board configuration.
     *
     * @param machineName
     * @param projectType
     * @returns {HttpPromise}
     */
    factory.loadProjectConfig = function (machineName, projectType) {
      var type = projectType.split('project_').pop();
      return $http.get('config/boards/' + type + '/' + machineName + '.json');
    };

    /**
     * Returns returns a project by machine name
     *
     * @param machineName
     * @returns {HttpPromise}
     */
    factory.loadProjectByMachineName = function (machineName) {
      return $http.get('/api/project/' + machineName);
    };

    factory.boardListDefaults = [
      {
        name: 'backlog',
        label: 'Postponed',
        tag: '',
        category: '',
        statuses: [4, 16],
        parentIssue: ''
      },
      {
        name: 'active',
        label: 'Active',
        tag: '',
        category: '',
        statuses: [1],
        parentIssue: ''
      },
      {
        name: 'cnw',
        label: 'Needs Work',
        tag: '',
        category: '',
        statuses: [13],
        parentIssue: ''
      },
      {
        name: 'cnr',
        label: 'Needs Review',
        tag: '',
        category: '',
        statuses: [8],
        parentIssue: ''
      },
      {
        name: 'rtbc',
        label: 'Reviewed & Tested',
        tag: '',
        category: '',
        statuses: [14, 15],
        parentIssue: ''
      },
      {
        name: 'done',
        label: 'Fixed',
        tag: '',
        category: '',
        statuses: [2],
        parentIssue: ''
      }
      // Due to possible performance and query limitations, dropping this.
      // {name: 'wontfix', label: "Won't Fix", statuses: [5,6,3,18]},
      // As mentioned above for perforamance and query issues, no closed() states.
      // {name: 'done', label: 'Fixed', tag: '', statuses: [2,7]}
    ];

    return factory;
  }
]);
