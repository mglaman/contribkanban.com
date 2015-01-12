'use strict';

projectKanbanApp.controller('listCtrl', ['$scope', '$timeout', 'issueService', function($scope, $timeout, issueService) {
  $scope.list = $scope.$parent.list;
  $scope.param = $scope.list.param;
  $scope.ids = $scope.list.ids;
  $scope.listIssues = [];
  $scope.processing = true;
  var counter = 0;

  $scope.filterIssues = function(ids) {
    return function(issue) {
      for(var i in ids) {
        if (issue[$scope.param.substring(12)] == ids[i]) {
          return true;
        }
      }
      return false;
    };
  };

  $scope.filterIssuePriority = function() {

  };

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
