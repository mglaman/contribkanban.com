(function (angular) {
  'use strict';
  angular.module('appContribkanban').directive('appHeader', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/components/app-header.html',
      controllerAs: 'HeaderController',
      controller: ['$scope', '$location', '$mdSidenav', '$mdDialog','TitleService', function ($scope, $location, $mdSidenav, $mdDialog, TitleService) {
        $scope.embed = $location.search().embed || false;
        $scope.titleService = TitleService;
        $scope.toggleSidenav = function () {
          $mdSidenav('left').toggle();
        };

        $scope.openHelp = function () {
          $mdDialog.show({
            templateUrl: 'views/help.html',
            controller: function () {
            },
            parent: angular.element(document.body),
            // targetEvent: ev,
            clickOutsideToClose: true
          });
        };
      }]
    };
  });
})(window.angular);
