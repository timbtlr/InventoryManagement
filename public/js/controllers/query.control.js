angular.module('QueryCtrl', []).controller('QueryController', function($scope, queryServiceFactory){
    var vm = this;
    vm.title = "Current Inventory on File";
    vm.searchInput = '';
	
	vm.items = [];
	queryServiceFactory.get().then(function(result) {
		vm.items = result.data;
	});
	
	console.log(vm.items.length)
	
	if (vm.items.length == 0) {
		vm.items = [{name: 'No items found.'}]
	}
	
	console.log(vm.items);
	
	vm.orders = [
    {
        id: 1,
        title: 'Name Ascending',
        key: 'itemName',
        reverse: false
    },
    {
        id: 2,
        title: 'Name Descending',
        key: 'itemName',
        reverse: true
    },
    {
        id: 3,
        title: 'Item Number Ascending',
        key: 'itemNumber',
        reverse: false
    },
    {
        id: 4,
        title: 'Item Number Ascending',
        key: 'itemNumber',
        reverse: true
    }
];
vm.order = vm.orders[0];
});