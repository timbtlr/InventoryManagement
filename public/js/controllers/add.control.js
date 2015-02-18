
angular.module('AddCtrl', []).controller('AddController', function($scope, queryServiceFactory) {
    var vm = this;
    vm.title = "Add Items to Inventory";
    vm.searchInput = '';
});
