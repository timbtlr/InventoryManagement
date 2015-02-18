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

calculateQuantity = function (partArray) {
	var lookup = {};
	for (var i = 0, len = partArray.length; i < len; i++) {
		lookup[partArray[i].partNumber] = partArray[i];
	}
	
	for (i = 0; i < partArray.length; i++) {
		var part = partArray[i];
		
		if (part.children.length != 0) {
			var minQuantity = null;
			
			for (j = 0; j < part.children.length; j++) {
				var child = part.children[j];
				var tempQuantity = lookup[child.partNumber].quantity / child.ppi; 
				if ((tempQuantity < minQuantity) || (minQuantity == null)) {
					minQuantity = tempQuantity
				}
			}
				
			part.quantity = minQuantity;
		}
	}
}

angular.module('QueryCtrl', []).controller('QueryController', function($scope, queryServiceFactory) {
    var vm = this;
    vm.title = "Current Inventory on File";
    vm.searchInput = '';
	vm.badgeShow = true;
	
	//  Ordering definitions for database results
	vm.orders = [{id: 1,title: 'Part Number Ascending',key: 'partNumber',reverse: false},
    			 {id: 2,title: 'Part Number Descending',key: 'partNumber',reverse: true},
    			 {id: 3,title: 'Cost Ascending',key: 'cost',reverse: false},
    			 {id: 4,title: 'Cost Descending',key: 'cost',reverse: true},
    			 {id: 3,title: 'Quantity Ascending',key: 'quantity',reverse: false},
    			 {id: 4,title: 'Quantity Descending',key: 'quantity',reverse: true}];
	vm.order = vm.orders[0];
	
	//  Retrieve all inventory results from the database
	/*vm.items = [];
	queryServiceFactory.get().then(function(result) {
		vm.items = result.data;
	});*/
	
	vm.parts = [{partNumber: "PartA", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:0, 
				 children: [{partNumber: "PartB", desc: "This is some item!", cost:25.23, ppi:2}, {partNumber: "PartC", desc: "This is some item!", cost:25.23, ppi:3}]},
				 {partNumber: "PartB", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:18, 
				 children: []},
				 {partNumber: "PartC", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:6, 
				 children: []}]
				 
	calculateQuantity (vm.parts);
	
	//  If no results were found then report that fact
	if (vm.parts.length == 0) {
		vm.parts = [{partNumber: 'No parts found.', desc: "Enter parts in the add inventory section to see them here"}]
		vm.badgeShow = false;
	} else {
		vm.badgeShow = true;
	}
	
	vm.expand = function(item) {
	   item.show = !item.show;
	}
});
