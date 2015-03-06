'use strict';

projectKanbanApp.controller('listCtrl', ['$scope', '$timeout', '$window', 'issueService', function($scope, $timeout, $window, issueService) {

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

  $scope.openIssue = function(nid) {
    $window.open('https://www.drupal.org/node/' + nid, '_blank');
  };

  var apiCall = function(status, tag) {
    issueService.requestIssues($scope.projectID, status, tag, $scope.list.category, $scope.list.parentIssue).then(function(issues) {
        angular.forEach(issues, function(val, key) {
          $scope.listIssues.push(val);
        });
        $scope.processing = false;
      }
    );
  };

  // Get the issues for this state.
  var getListIssues = function() {
    $scope.processing = true;

    // If there is a parent issue, we're just querying for children.
    if ($scope.list.parentIssue) {
      apiCall(null, $scope.list.tag.length);
    } else {
      // Cycle through all statuses
      if (counter < $scope.list.statuses.length) {
        apiCall($scope.list.statuses[counter], $scope.list.tag);
        console.log($scope.list);
        counter++;
        $timeout(getListIssues, 1200);
      }
      else {
        $timeout(getListIssues, 600000);
        $scope.processing = false;
      }
    }

    /*
    else if ($scope.list.tag.length > 0) {
      if (counter < $scope.list.tag.length) {
        apiCall(null, $scope.list.tag[counter]);
        counter++;
        $timeout(getListIssues, 1200);
      }
      else {
        $timeout(getListIssues, 600000);
        $scope.processing = false;
      }
    }
    else if ($scope.list.statuses.length > 0) {
      if (counter < $scope.list.statuses.length) {
        apiCall($scope.list.statuses[counter]);
        counter++;
        $timeout(getListIssues, 1200);
      }
      else {
        $timeout(getListIssues, 600000);
        $scope.processing = false;
      }
    }*/

    // @todo: Support pagination. Convert old status cycling.
  };
  $timeout(getListIssues, 500);
}]);
