'use strict';

projectKanbanApp.controller('headerCtrl', ['$scope', '$location', '$mdSidenav', '$mdDialog', function ($scope, $location, $mdSidenav, $mdDialog) {
  $scope.embed = $location.search().embed || false;

  $scope.toggleSidenav = function () {
    $mdSidenav('left').toggle();
  };

  $scope.openHelp = function() {
    $mdDialog.show({
      templateUrl: 'views/help.html',
      controller: function () {},
      parent: angular.element(document.body),
      // targetEvent: ev,
      clickOutsideToClose:true
    });
  };
}]);
