'use strict';

projectKanbanApp.controller('listCtrl', ['$scope', '$timeout', 'issueService', function($scope, $timeout, issueService) {
  $scope.list = $scope.$parent.list;
  $scope.ids = $scope.list.ids;
  $scope.listIssues = [];
  $scope.processing = true;

  // Get the issues for this state.
  var counter = 0;
  var getListIssues = function() {
    if (counter < $scope.ids.length) {
      // That lack of pagination tho.
      issueService.requestIssues($scope.$parent.project.nid, $scope.ids[counter]).then(function(issues) {
          if ($scope.listIssues.length == 0) {
            $scope.listIssues = issues;
          } else {
            $scope.listIssues.concat(issues);
          }
        }
      );
      counter++;
      $timeout(getListIssues, 1000);
    }
    else {
      $scope.processing = false;
    }
  };
  $timeout(getListIssues, 1000);
}]);
