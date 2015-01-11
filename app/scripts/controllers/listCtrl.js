'use strict';

projectKanbanApp.controller('listCtrl', ['$scope', '$timeout', 'issueService', function($scope, $timeout, issueService) {
  $scope.list = $scope.$parent.list;
  $scope.ids = $scope.list.ids;
  $scope.listIssues = [];
  $scope.processing = true;
  var counter = 0;

  var apiCall = function(status) {
    issueService.requestIssues($scope.$parent.project.nid, status).then(function(issues) {
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
