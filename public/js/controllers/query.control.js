/*
Name:
	query.control
	
Description:
	Controls the dynamic content of the Query view.  The query view displays items from inventory.  
	All inventory items are queried and loaded here and each item is loaded into an element of an array.
	Further, an order array is created to allow the user to order the queried data in specific ways.
	The order list is initially selected to order the items by item name (ascending).

Author:
	Tim "KetsuN" Butler
*/

angular.module('QueryCtrl', []).controller('QueryController', function($scope, queryServiceFactory) {
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
	
	vm.orders = [{id: 1,title: 'Name Ascending',key: 'itemName',reverse: false},
    			 {id: 2,title: 'Name Descending',key: 'itemName',reverse: true},
    			 {id: 3,title: 'Item Number Ascending',key: 'itemNumber',reverse: false},
    			 {id: 4,title: 'Item Number Ascending',key: 'itemNumber',reverse: true}];
	vm.order = vm.orders[0];
});
