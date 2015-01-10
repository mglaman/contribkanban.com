'use strict';

projectKanbanApp.controller('listCtrl', ['$scope', '$timeout', 'issueService', function($scope, $timeout, issueService) {
  $scope.list = $scope.$parent.list;
  $scope.ids = $scope.list.ids;
  $scope.listIssues = [];

  var counter = 0;
  var getListIssues = function() {
    if (counter < $scope.ids.length) {
      // That lack of pagination tho.
      issueService.requestIssues($scope.$parent.project.nid, $scope.ids[counter]).then(function(issues) {
          console.log(issues);
          $scope.listIssues = issues;
        }
      );
    }
  };
  $timeout(getListIssues, 1000);
}]);
