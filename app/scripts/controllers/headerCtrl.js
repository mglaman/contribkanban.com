'use strict';

projectKanbanApp.controller('headerCtrl', ['$scope', 'ModalService', function ($scope, ModalService) {
  $scope.branding = 'Contrib Kanban';

  $scope.openHelp = function() {
    ModalService.showModal({
      templateUrl: "views/help.html",
      controller: "ModalController"
    }).then(function(modal) {
      modal.element.modal();
    });
  };
}]);