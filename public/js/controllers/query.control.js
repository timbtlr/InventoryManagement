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


/*
Angular Module Name:
	QueryCtrl
	
Controller Name:
	QueryController
	
Description:
	Defines the QueryCtrl/QueryController used to query for inventory items and update the Query view.

Author:
	Tim "KetsuN" Butler
*/
angular.module('QueryCtrl', []).controller('QueryController', function($scope, $interval, queryServiceFactory) {
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
	
	//  Function used to expand/collapse a part containing children
	vm.expand = function(item) {
		if (item.children.length > 0){
			item.show = !item.show;
		}
	}
	
	//  Retrieve all inventory results from the database
	vm.parts = [];
	$interval(function(){
		vm.queryForInventory();
	},300);
		
	
	vm.queryForInventory = function () {
		queryServiceFactory.get().then(function(result) {
			vm.parts = result.data;
			
			if (vm.parts.length == 0) {
				//  No inventory results were found then report that fact
				vm.parts = [{partNumber: 'No parts found', desc: "Enter parts in the add inventory section to see them here"}]
			} else { 
				//  Inventory database results were found
				//  Calculate the quantity and cost of each item in the database.
				//  Quantities and costs are calculated outside of storage because some parts are comprised of other parts.
				calculateQtyAndCost (vm.parts);
			}
		});
	}
});


/*
Function Name:
	calculateQtyAndCost
	
Description:
	Calculates the quantity and cost of inventory parts in an array.  
	Quantity calculation:
		Quantity for a part with no children is the raw value of the part quantity.
		Quantity for a part with children is the lowest number based on the quantities of children available
		
	Cost calculation:
		Cost is calculated based on the number of each child contributing to the quantity of a part.

Author:
	Tim "KetsuN" Butler
*/
calculateQtyAndCost = function (partArray) {
	//  Create an item lookup map for the part array
	var lookup = {};
	for (var i = 0, len = partArray.length; i < len; i++) {
		lookup[partArray[i].partNumber] = partArray[i];
	}
	
	//  Iterate through each part in the part array
	for (i = 0; i < partArray.length; i++) {
		var part = partArray[i];
		
		//  Determine if the part has children.  If so, calculate cost and quantity
		if (part.children.length != 0) {
			var maxQuantity = null;
			var totalCost = 0;
			
			//  Iterate through each child in the current part
			for (j = 0; j < part.children.length; j++) {
				//  Append child cost and available quantity from the lookup
				var child = part.children[j];
				child.cost = lookup[child.partNumber].cost;
				child.quantity = lookup[child.partNumber].quantity;
				
				//  Determine the maximum part quantity available based on available child quantities
				var tempQuantity = lookup[child.partNumber].quantity / child.ppi; 
				if ((tempQuantity < maxQuantity) || (maxQuantity == null)) {
					maxQuantity = tempQuantity
				}
			}
			
			//  Round part quantity down to nearest whole number
			maxQuantity = Math.floor(maxQuantity);
			
			//  Calculate part cost based on child quantities contributing to total part quantity
			for (j = 0; j < part.children.length; j++) {
				var child = part.children[j];
				totalCost = totalCost + (lookup[child.partNumber].cost * (maxQuantity * child.ppi))
				totalCost = Math.ceil(totalCost * 100)/100;
			}
				
			//  Store quantity and cost for display
			part.quantity = maxQuantity;
			part.cost = totalCost;
		}
	}
}
