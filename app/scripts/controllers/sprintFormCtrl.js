'use strict';

projectKanbanApp.controller('sprintFormCtrl', [
  '$scope',
  'parseService',
  'projectService',
  function ($scope, parseService, projectService) {
    $scope.updateScopeProject = function (object, project) {
      $scope.queryProjects();
      project.tag_name = null;
    };

    /*
     $http({
     method: 'GET',
     url: 'https://www.drupal.org/api-d7/taxonomy_term.json?name=' + $scope.tagSelected
     })
     */

    $scope.newBoard = function (project) {
      // Query Parse if machine name exists.
      parseService.attributeQuery('Board', 'tid', project.tag_name).then(
        function (object) {
          // If the project does not exist, save it.
          if (object === null) {
            projectService.requestProject(project.tag_name).then(function (response) {
              // New Parse object.
              parseService.saveObject('Project', response).then(function (parseObject) {
                // Update the scope.
                $scope.updateScopeProject(parseObject.attributes, project);
                $scope.$apply();
              }, function () {
              });
            });
          }
        },
        function (error) {
          console.log(error)
        });
    }
  }
]);
