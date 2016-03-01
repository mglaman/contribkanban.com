(function (angular) {
  'use strict';

  angular.module('appContribkanban').controller(
    'boardCtrl', [
      '$scope',
      '$routeParams',
      '$location',
      '$http',
      'issueService',
      'projectService',
      'Angularytics',
      function ($scope, $routeParams, $location, $http, issueService, projectService, Angularytics) {
        $scope.project = {};
        $scope.projectID = '';
        $scope.projectMachineName = $routeParams.project;
        $scope.projectType = '';
        $scope.releaseBranches = [];
        $scope.boardLists = [];
        $scope.projectRelease = {name: $routeParams.branch, label: $routeParams.branch} || {};
        $scope.priorities = issueService.issuePriorities;
        $scope.categories = issueService.issueCategories;

        // projectService.loadProject($routeParams.project)
        projectService.loadProjectByMachineName($routeParams.project)
          .then(function (projectApiObject) {
            if (projectApiObject.data === null) {
              projectService.requestProject($routeParams.project).then(function (response) {
                // New Parse object.
                $http.post('/api/project/' + $routeParams.project, response).then(function () {
                  debugger;
                  // Reload so user can see board.
                  window.location.reload();
                }, function (response) {
                  console.log(response);
                });
              });
            }

            // Update the scope's project variable.
            var object = projectApiObject.data;
            $scope.project = object;
            $scope.projectID = object.nid;
            $scope.projectType = object.projectType;
            $scope.releaseBranches = object.releaseBranches;

            // Set the page title to be the project's name.
            $scope.page.setTitle(object.title);
            $scope.setBoardLists();


            // Ping Google.
            Angularytics.trackEvent('Project', 'Viewed project: ' + object.title);
          });

        $scope.setBoardLists = function () {
          // Initiate the board's lists.
          projectService.loadProjectConfig($scope.projectMachineName, $scope.projectType)
            .success(function (data, status, headers, config) {
              $scope.boardLists = data;
            })
            .error(function (data, status, headers, config) {
              $scope.boardLists = projectService.boardListDefaults;
            });
        };

        $scope.updateBoardRoute = function () {
          var pathParts = $location.path().split('/');
          if ($scope.projectRelease === null) {
            $location.path('/' + pathParts[1] + '/' + pathParts[2], false);

          }
          else {
            $location.path('/' + pathParts[1] + '/' + pathParts[2] + '/' + $scope.projectRelease.name, false);
          }
        };
      }
    ]);
})(window.angular);
