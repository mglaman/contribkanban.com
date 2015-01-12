'use strict';

projectKanbanApp.controller('browseCoreCtrl', ['$scope', '$routeParams', '$location', 'projectService', function($scope, $routeParams, $location, projectService) {
    $scope.location = $location;
    $scope.projects = [];

    projectService.requestProject('drupal').then(function(object) {
      console.log(object);
      angular.forEach(object.projectComponents, function(component, key) {
        $scope.projects.push({
          nid: 'core/' + component,
          machine_name: component.replace(/ /g,"_"),
          title: component
        });
      });
    });
  }]
);
