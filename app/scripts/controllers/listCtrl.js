(function (angular) {
  'use strict';

  angular.module('appContribkanban').controller('listCtrl', ['$scope', '$timeout', '$window', '$q', '$location', 'issueService', function ($scope, $timeout, $window, $q, $location, issueService) {
    $scope.noTags = $location.search().noTags || false;
    $scope.filteredListIssues = [];
    $scope.param = $scope.list.param;
    $scope.listIssues = [];
    $scope.processing = true;
    var counter = 0;

    $scope.filterIssues = function (statuses) {
      return function (issue) {
        if (statuses.length === 0) {
          return true;
        }
        for (var i in statuses) {
          if (statuses.indexOf(issue.status)) {
            return true;
          }
        }
        return false;
      };
    };

    $scope.filterIssuePriority = function () {

    };

    $scope.openIssue = function (nid) {
      $window.open('https://www.drupal.org/node/' + nid, '_blank');
    };

    // Get the issues for this state.
    var getListIssues = function () {
      $scope.processing = true;

      issueService.requestIssues(
        $scope.projectID,
        $scope.list.statuses,
        $scope.list.tag,
        $scope.list.category,
        $scope.list.parentIssue,
        $scope.list.priority,
        $scope.list.version,
        $scope.list.component
      ).then(function (issues) {
        var issueBuffer = [];
        angular.forEach(issues, function (val, key) {
          issueBuffer.push(val);
        });
        $scope.listIssues.concat(issueBuffer);
        $scope.processing = false;
      });

      $timeout(getListIssues, 60000);

    };
    
    getListIssues();
  }]);
})(window.angular);
