'use strict';

projectKanbanApp.controller('headerCtrl', ['$scope', '$location', 'ModalService', function ($scope, $location, ModalService) {
  $scope.branding = 'Contrib Kanban';
  $scope.embed = $location.search().embed || false;


  $scope.openHelp = function() {
    ModalService.showModal({
      templateUrl: "views/help.html",
      controller: "ModalController"
    }).then(function(modal) {
      modal.element.modal();
    });
  };
}]);
