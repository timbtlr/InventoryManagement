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
angular.module('QueryCtrl', []).controller('QueryController', function($scope, globalServiceFactory, databaseServiceFactory) {
    var vm = this;
    vm.title = "Current Inventory on File";
    vm.searchInput = '';
	vm.badgeShow = true;
	vm.editWindowShow = false;
	vm.containerStyle = {};
	vm.editChildren = []
	
	vm.uomOptions = globalServiceFactory.getGlobalVars().uomOptions;
	
	//  Ordering definitions for database results
	vm.orders = globalServiceFactory.getGlobalVars().searchOrders;
	vm.order = vm.orders[0];
	
	//  Function used to expand/collapse a part containing children
	vm.expand = function(item) {
		if (item.children.length > 0){
			item.show = !item.show;
		}
	}
	
	//  Retrieve all inventory results from the database
	vm.parts = [];
	
	vm.queryForInventory = function () {
		databaseServiceFactory.get().then(function(result) {
			vm.parts = result.data;
			
			if (vm.parts.length > 0) {
				//  Inventory database results were found
				//  Calculate the quantity and cost of each item in the database.
				//  Quantities and costs are calculated outside of storage because some parts are comprised of other parts.
				calculateQtyAndCost (vm.parts);
				vm.badgeShow = true;
			}
		});
	}
	
	vm.openEditWindow = function (part) {
		vm.editWindowShow = true;
		vm.containerStyle = {'opacity': '0.4', 'filter': 'alpha(opacity=40)'};
		vm.editItem = part;
		vm.editChildren = vm.editItem.children;
		
		if (vm.editItem.children.length == 0) {
			$scope.oldPartNumber = part.partNumber;
			$scope.oldDescription = part.desc;
			$scope.oldCost = part.cost;
			$scope.oldQuantity = part.quantity;
			$scope.oldUom = part.uom;
		} else {
			$scope.oldPartNumber = part.partNumber;
			$scope.oldDescription = part.desc;
		}
	}
	
	vm.cancelEditPart = function (part) {
		vm.editWindowShow = false;
		vm.containerStyle = {};
		vm.queryForInventory();
	}
	
	vm.addChildToPart = function (newChild, newPpi) {
		var newChildRecord = {partNumber: newChild.partNumber,
							  desc: newChild.desc,
							  cost: newChild.cost,
							  ppi: newPpi};
							  
		vm.removeChildFromPart(newChild);
		vm.editChildren.push(newChildRecord);
	}
	
	vm.removeChildFromPart = function (oldChild) {
		for (i = 0; i < vm.editChildren.length; i ++) {
			if (vm.editChildren[i].partNumber == oldChild.partNumber) {
				vm.editChildren.splice(i, 1);
			}
		}
	}
	
	vm.removePart = function () {
		databaseServiceFactory.remove($scope.oldPartNumber).then(function(result) {
			console.log("Removed part")
		});
		
		vm.editWindowShow = false;
		vm.containerStyle = {};
		vm.queryForInventory();
	}
	
	vm.editPart = function (part) {
		for (i = 0; i < vm.editChildren.length; i ++) {
			console.log(vm.editChildren[i]);
		}
		
		if (vm.editChildren.length == 0) {
			var newPart = {partNumber: $scope.oldPartNumber, 
						   desc: $scope.oldDescription, 
						   quantity: $scope.oldQuantity, 
						   cost: $scope.oldCost, 
						   uom: $scope.oldUomSelect.abbr}
		} else {
			var newPart = {partNumber: $scope.oldPartNumber, 
						   desc: $scope.oldDescription, 
						   children: vm.editChildren}
		}
		
		databaseServiceFactory.edit(newPart).then(function(result) {
			console.log("Edited part!")
		});
		
		vm.editWindowShow = false;
		vm.containerStyle = {};
		vm.queryForInventory();
	}
	
	vm.queryForInventory();
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
