'use strict';

projectKanbanApp.controller('listCtrl', ['$scope', '$timeout', 'issueService', function($scope, $timeout, issueService) {
  $scope.list = $scope.$parent.list;
  $scope.param = $scope.list.param;
  $scope.ids = $scope.list.ids;
  $scope.listIssues = [];
  $scope.processing = true;
  var counter = 0;

  console.log($scope);

  var apiCall = function(status) {
    issueService.requestIssues($scope.$parent.project.nid, $scope.param, status).then(function(issues) {
        // Move issues to scope
        if ($scope.listIssues.length == 0) {
          $scope.listIssues = issues;
        } else {
          $scope.listIssues.concat(issues);
        }
      }
    );
  };

  // Get the issues for this state.
  var getListIssues = function() {
    if (counter < $scope.ids.length) {
      apiCall($scope.ids[counter]);
      counter++;
      $timeout(getListIssues, 1000);
    }
    else {
      $scope.processing = false;
    }
  };
  $timeout(getListIssues, 1000);
}]);
