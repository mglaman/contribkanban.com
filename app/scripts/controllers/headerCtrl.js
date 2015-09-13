'use strict';

projectKanbanApp.controller('headerCtrl', ['$scope', '$location', '$mdSidenav', 'ModalService', function ($scope, $location, $mdSidenav, ModalService) {
  $scope.branding = 'Contrib Kanban';
  $scope.embed = $location.search().embed || false;

  $scope.toggleSidenav = function () {
    $mdSidenav('left').toggle();
  };

  $scope.openHelp = function() {
    ModalService.showModal({
      templateUrl: "views/help.html",
      controller: "ModalController"
    }).then(function(modal) {
      modal.element.modal();
    });
  };
}]);
