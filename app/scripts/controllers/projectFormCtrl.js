'use strict';

projectKanbanApp.controller('projectFormCtrl', ['$scope', 'projectService', 'parseProjectService', function($scope, projectService, parseProjectService) {
  $scope.newProject = {};
  var Project = Parse.Object.extend('Project');

  $scope.updateScopeProject = function(object) {
    $scope.newProject = object;
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
              $scope.updateScopeProject(parseObject.attributes);
              project.machine_name = null;
            }, function () {

            });
          });
        }
        else {
          projectService.requestProject(project.machine_name).then(function(response) {
            object.set('releaseBranches', response.releaseBranches);
            object.save();
            $scope.updateScopeProject(object.attributes);
            project.machine_name = null;
          });
        }

      },
    function(error) {
      console.log(error)
    });
  }
}]);
