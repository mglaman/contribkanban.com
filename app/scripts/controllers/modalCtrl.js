'use strict';

projectKanbanApp.controller('ModalController', ['$scope', 'close', function($scope, close) {
  $scope.close = function() {
    close({}, 200);
  };
}]);