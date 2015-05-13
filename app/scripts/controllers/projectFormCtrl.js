'use strict';

projectKanbanApp.controller('projectFormCtrl', [
  '$scope',
  'parseService',
  'projectService',
  function ($scope, parseService, projectService) {
    $scope.updateScopeProject = function (object, project) {
      $scope.queryProjects();
      project.machine_name = null;
    };

    $scope.newProject = function (project) {
      // Query Parse if machine name exists.
      parseService.attributeQuery('Project', 'machine_name', project.machine_name).then(
        function (object) {
          // If the project does not exist, save it.
          if (object === null) {
            projectService.requestProject(project.machine_name).then(function (response) {
              // New Parse object.
              parseService.saveObject('Project', response).then(function (parseObject) {
                // Update the scope.
                $scope.updateScopeProject(parseObject.attributes, project);
                $scope.$apply();
              }, function () {
              });
            });
          } else {
            projectService.requestProject(project.machine_name).then(function (response) {
              object.set('releaseBranches', response.releaseBranches);
              object.save();
              $scope.updateScopeProject(object.attributes, project);
            });
          }

        },
        function (error) {
          console.log(error)
        });
    }
  }
]);
