(function (angular) {
  'use strict';

  angular.module('appContribkanban').controller('browseCtrl', [
      '$q',
      '$scope',
      '$routeParams',
      '$location',
      '$http',
      'projectService',
      function ($q, $scope, $routeParams, $location, $http, projectService) {
        $scope.location = $location;
        $scope.projects = [];
        $scope.routePath = 'board';
        $scope.addType = 'Project';
        $scope.addPlaceholder = 'Project machine name';

        $scope.queryProjects = function () {
          var deferred = $q.defer();
          var apiPath;
          // If passed a type, filter by that.
          if ($routeParams.type !== undefined) {
            apiPath = '/api/project/type/project_' + $routeParams.type;
          } else {
            apiPath = '/api/projects';
          }

          // @todo: Need to come up with a paging solution.
          $http.get(apiPath).then(function (results) {
            var projectBuffer = [];
            angular.forEach(results.data, function (val) {
              projectBuffer.push(val);
            });

            deferred.resolve(projectBuffer);
          });

          return deferred.promise;
        };
        $scope.queryProjects().then(function (projectBuffer) {
          $scope.projects = projectBuffer;
        });
        $scope.updateScopeProject = function (object, project) {
          $scope.queryProjects();
          project = null;
        };

        $scope.addBoard = function (project) {
          // Query Parse if machine name exists.
          $http.get('/api/project/' + project).then(
            function (object) {
              // If the project does not exist, save it.
              if (object === null) {
                projectService.requestProject(project).then(function (response) {
                  projectService.saveProject(response).then(function () {
                    $location.path('/board/' + project);
                  });
                });
              } else {
                $location.path('/board/' + project);
              }

            },
            function (error) {
              console.log(error);
            });
        };
      }
    ]
  );
})(window.angular);
