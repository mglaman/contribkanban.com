'use strict';

projectKanbanApp.controller('browseCtrl', [
    '$q',
    '$scope',
    '$routeParams',
    '$location',
    'parseService',
    'projectService',
    function ($q, $scope, $routeParams, $location, parseService) {
      $scope.location = $location;
      $scope.projects = [];
      $scope.routePath = 'board';

      $scope.queryProjects = function () {
        var deferred = $q.defer();
        var parseQuery = parseService.objectQuery('Project');

        // If passed a type, filter by that.
        if ($routeParams.type !== undefined) {
          parseQuery.equalTo('projectType', 'project_' + $routeParams.type);
        }
        // @todo: Need to come up with a paging solution.
        parseQuery.limit(200);

        parseQuery.find({}).then(function (results) {
          var projectBuffer = [];
          angular.forEach(results, function(val, key) {
            projectBuffer.push(val.attributes);
          });

          deferred.resolve(projectBuffer);
        }, function () {

        });

        return deferred.promise;
      };
      $scope.queryProjects().then(function (projectBuffer) {
        $scope.projects = projectBuffer;
      })
    }
  ]
);
