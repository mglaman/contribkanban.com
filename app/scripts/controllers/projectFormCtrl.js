'use strict';

projectKanbanApp.controller('projectFormCtrl', ['$scope', 'projectService', 'parseProjectService', function($scope, projectService, parseProjectService) {
  $scope.updateScopeProject = function(object, project) {
    $scope.queryProjects();
    project.machine_name = null;
  };

  $scope.newProject = function(project) {
    // Query Parse if machine name exists.
    parseProjectService.attributeQuery('machine_name', project.machine_name)
      .then(
      function(object){
        // If the project does not exist, save it.
        if (object === undefined) {
          projectService.requestProject(project.machine_name).then(function(response) {
            // New Parse object.
            parseProjectService.addRow(response).then(function(parseObject) {
              // Update the scope.
              $scope.updateScopeProject(parseObject.attributes, project);
              $scope.$apply();
            }, function () {

            });
          });
        }
        else {
          projectService.requestProject(project.machine_name).then(function(response) {
            object.set('releaseBranches', response.releaseBranches);
            object.save();
            $scope.updateScopeProject(object.attributes, project);
          });
        }

      },
    function(error) {
      console.log(error)
    });
  }
}]);
