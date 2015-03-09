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
angular.module('QueryCtrl', []).controller('QueryController', function($scope, globalServiceFactory, queryServiceFactory, databaseServiceFactory) {
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
	
	//  Retrieve all inventory results from the database
	vm.parts = [];
	
	vm.queryForInventory = function () {
		databaseServiceFactory.get().then(function(result) {
			vm.parts = result.data;
			
			if (vm.parts.length > 0) {
				//  Inventory database results were found
				//  Calculate the quantity and cost of each item in the database.
				//  Quantities and costs are calculated outside of storage because some parts are comprised of other parts.
				//calculateQtyAndCost (vm.parts);
				vm.badgeShow = true;
			}
		});
	}
	
	vm.openEditWindow = function (part) {
		vm.editWindowShow = true;
		vm.containerStyle = {'opacity': '0.4', 'filter': 'alpha(opacity=40)'};
		vm.editItem = part;
		vm.editChildren = vm.editItem.children;
		$scope.oldPartNumber = part.partNumber;
		$scope.oldDescription = part.desc;
	}
	
	vm.openAddWindow = function (part) {
		vm.addWindowShow = true;
		vm.containerStyle = {'opacity': '0.4', 'filter': 'alpha(opacity=40)'};
		vm.addItem = part;
		vm.addChildren = vm.addItem.children;
		$scope.addPartNumber = part.partNumber;
		$scope.addDescription = part.desc;
		$scope.addQuantity = 0;
	}
	
	vm.closePopupWindow = function (part) {
		vm.editWindowShow = false;
		vm.addWindowShow = false;
		vm.containerStyle = {};
		vm.queryForInventory();
	}
	
	vm.removePart = function (part) {
		databaseServiceFactory.remove(part.partNumber).then(function(result) {
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
	
	vm.addParts = function () {
		var idArray = []
		var part = vm.addItem;
		part.quantity = Number(part.quantity) + Number($scope.addQuantity);
		
		for (var i = 0; i < part.children.length; i ++) {
			idArray.push(part.children[i].partNumber);
		}
		
		databaseServiceFactory.getByArray(idArray).then(function(result) {
			results = result.data;
			
			for (var i = 0; i < part.children.length; i ++) {
				for (var j = 0; j < results.length; j ++) {
					if ((part.children[i].partNumber == results[j].partNumber) && ((part.children[i].ppi * $scope.addQuantity) > results[j].quantity)) {
						vm.popupResponse ("Not enough children parts to make " + $scope.addQuantity + " parts." , "red");
						return;
					}
				}
			}
			
			//  Add the formatted part to the inventory
			queryServiceFactory.edit(part).then(function(result) {
				for (var i = 0; i < part.children.length; i ++) {
					var removePart = {partNumber: part.children[i].partNumber,
									  subtract: (part.children[i].ppi * $scope.addQuantity)}
					
					//  Add the formatted part to the inventory
					databaseServiceFactory.subtractFromPart(removePart).then(function(result) { });
				}
				
				//  Display response for the user
				vm.displayResponse ("Added " + $scope.addQuantity + " of part " + $scope.addPartNumber, "green");
				vm.closePopupWindow();
				
				getPartArray (databaseServiceFactory, function (currentParts) {
					vm.parts = currentParts;
					$scope.newChildrenSelect = vm.parts[0];
				});
			});
		});
	}
	
	vm.queryForInventory();
	
	
	vm.displayResponse = function (message, color) {
		vm.responseStyle = {"color" : color}
		vm.actionResponse = message;
	}
	
	
	vm.popupResponse = function (message, color) {
		vm.popupResponseStyle = {"color" : color}
		vm.popupActionResponse = message;
	}
});
