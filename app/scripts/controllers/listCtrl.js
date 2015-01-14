'use strict';

projectKanbanApp.controller('listCtrl', ['$scope', '$timeout', 'issueService', function($scope, $timeout, issueService) {

  $scope.param = $scope.list.param;
  $scope.listIssues = [];
  $scope.processing = true;
  var counter = 0;

  $scope.filterIssues = function(statuses) {
    return function(issue) {
      if (statuses.length == 0) {
        return true;
      }
      for(var i in statuses) {
        if (issue['status'] == statuses[i]) {
          return true;
        }
      }
      return false;
    };
  };

  $scope.filterIssuePriority = function() {

  };

  var apiCall = function(status) {
    issueService.requestIssues($scope.project.nid, status, $scope.list.tag, $scope.list.category, $scope.list.parentIssue).then(function(issues) {
        // Move issues to scope
        if ($scope.listIssues.length == 0) {
          $scope.listIssues = issues;
        } else {
          $scope.listIssues.concat(issues);
        }
        $scope.processing = false;
      }
    );
  };

  // Get the issues for this state.
  var getListIssues = function() {
    apiCall(null);
    // @todo: Support pagination. Convert old status cycling.
    /*
    if (counter <= $scope.list.statuses.length) {
      apiCall($scope.list.statuses[counter]);
      counter++;
      $timeout(getListIssues, 1200);
    }
    else {
      $scope.processing = false;
    }*/
  };
  $timeout(getListIssues, 500);
}])
  .filter('priorityLabelFilter', function() {
    var statusCodes = {
      400: 'Critical',
      300: 'Major',
      200: 'Normal',
      100: 'Minor'
    };

    return function(input) {
      if (!input) {
        return '';
      }

      return statusCodes[input];
    }
  })
  .filter('priorityClassFilter', function() {
    var statusCodes = {
      400: 'danger',
      300: 'warning',
      200: 'info',
      100: 'active'
    };
    return function(input) {
      if (!input) {
        return '';
      }

      return statusCodes[input];
    }
  });
