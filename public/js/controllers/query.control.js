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
	
	vm.popupHandler = new PopupHandler ();
	vm.popupHandler.backgroundStyle = {};
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
		});
	}
	
	
	vm.openAddWindow = function (part) {
		vm.popupHandler.backgroundStyle = {'opacity': '0.4', 'filter': 'alpha(opacity=40)'};
		vm.popupHandler.openAddWindow();
		vm.popupHandler.editPart = part;
		$scope.popupPartNumber = part.partNumber;
		$scope.popupDescription = part.desc;
		$scope.popupQuantity = 0;
		$scope.popupCost = undefined;
	}
	
	
	vm.openSubtractWindow = function (part) {
		vm.popupHandler.backgroundStyle = {'opacity': '0.4', 'filter': 'alpha(opacity=40)'};
		vm.popupHandler.openSubtractWindow();
		vm.popupHandler.editPart = part;
		$scope.popupPartNumber = part.partNumber;
		$scope.popupDescription = part.desc;
		$scope.popupQuantity = 0;
		$scope.popupCost = undefined;
	}
	
	
	vm.openEditWindow = function (part) {
		vm.popupHandler.backgroundStyle = {'opacity': '0.4', 'filter': 'alpha(opacity=40)'};
		vm.popupHandler.openEditWindow();
		vm.popupHandler.editPart = part;
		$scope.popupPartNumber = part.partNumber;
		$scope.popupDescription = part.desc;
		$scope.popupCost = part.cost;
	}
	
	
	vm.openRemoveWindow = function (part) {
		vm.popupHandler.backgroundStyle = {'opacity': '0.4', 'filter': 'alpha(opacity=40)'};
		vm.popupHandler.openRemoveWindow();
		vm.popupHandler.setResponse ("Removing Part  --  Are you sure?", "red");;
		vm.popupHandler.editPart = part;
		$scope.popupPartNumber = part.partNumber;
		$scope.popupDescription = part.desc;
	}
	
	
	vm.removePart = function () {
		databaseServiceFactory.remove(vm.popupHandler.editPart.partNumber).then(function(result) { 
			vm.popupHandler.closeAllWindows();
			vm.queryForInventory();
			vm.displayResponse ("Removed " + $scope.popupPartNumber + " from inventory", "green");
		});;
	}
	
	vm.editPart = function (part) {
		if (typeof($scope.popupDescription) == "undefined") {
			vm.popupHandler.setResponse ("Invalid Description  --  required", "red");;
		} else if ((typeof($scope.popupCost) == "undefined") || isNaN($scope.popupCost)) {
			vm.popupHandler.setResponse ("Invalid Cost  --  required number", "red");;
		} else {
			vm.popupHandler.editPart.desc = $scope.popupDescription;
			vm.popupHandler.editPart.cost = $scope.popupCost;
			
			databaseServiceFactory.edit(vm.popupHandler.editPart);
			
			vm.popupHandler.closeAllWindows();
			vm.popupHandler.backgroundStyle = {};
			vm.queryForInventory();
		}
	}
	
	
	vm.addParts = function () {
		if ((typeof($scope.popupQuantity) == "undefined") || isNaN($scope.popupQuantity)) {
			vm.popupHandler.setResponse ("Invalid # Parts to Add  --  required number", "red");;
		} else {
			var idArray = []
			var part = vm.popupHandler.editPart;
			part.quantity = Number($scope.popupQuantity);
			
			for (var i = 0; i < part.children.length; i ++) {
				idArray.push(part.children[i].partNumber);
			}
			
			databaseServiceFactory.getByArray(idArray).then(function(result) {
				results = result.data;
				
				for (var i = 0; i < part.children.length; i ++) {
					for (var j = 0; j < results.length; j ++) {
						if ((part.children[i].partNumber == results[j].partNumber) && ((part.children[i].ppi * $scope.popupQuantity) > results[j].quantity)) {
							vm.popupResponse ("Not enough children parts to make " + $scope.popupQuantity + " parts." , "red");
							return;
						}
					}
				}
				
				//  Add the formatted part to the inventory
				queryServiceFactory.edit(part).then(function(result) {
					for (var i = 0; i < part.children.length; i ++) {
						var removePart = {partNumber: part.children[i].partNumber,
										  subtract: (part.children[i].ppi * $scope.popupQuantity)}
						
						//  Add the formatted part to the inventory
						databaseServiceFactory.subtractFromPart(removePart).then(function(result) { });
					}
					
					//  Display response for the user
					vm.displayResponse ($scope.popupQuantity + " quantity added to " + $scope.popupPartNumber, "green");
					vm.popupHandler.closeAllWindows();
					
					getPartArray (databaseServiceFactory, function (currentParts) {
						vm.parts = currentParts;
						$scope.newChildrenSelect = vm.parts[0];
						vm.queryForInventory();
					});
				});
			});
		}
		
	}
	
	
	
	vm.subtractParts = function (part) {
		if ((typeof($scope.popupQuantity) == "undefined") || isNaN($scope.popupQuantity)) {
			vm.popupHandler.setResponse ("Invalid # Parts to Remove  --  required number", "red");
		} else if ($scope.popupQuantity > vm.popupHandler.editPart.quantity) {
			vm.popupHandler.setResponse ("Cannot remove more quantity than the inventory contains", "red");
		} else {
			var removePart = {partNumber: vm.popupHandler.editPart.partNumber,
							  subtract: $scope.popupQuantity};
						
			//  Add the formatted part to the inventory
			databaseServiceFactory.subtractFromPart(removePart).then(function(result) { 
				vm.displayResponse(removePart.subtract + " quantity removed from " + removePart.partNumber, "green");
				vm.popupHandler.closeAllWindows();
				vm.queryForInventory();
			});
		}
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


function PopupHandler () {
	this.heading = "";
	this.windowShow = false;
	this.windowType = ""
	this.response = "";
	this.responseStyle = "";
	this.editPart = {};
	this.backgroundStyle = {};
	
	this.openAddWindow = function () {
		this.heading = "Add Parts to Inventory";
		this.windowShow = true;
		this.windowType = "add";
	};
	
	this.openSubtractWindow = function () {
		this.heading = "Subtract Parts from Inventory";
		this.windowShow = true;
		this.windowType = "subtract";
	};
	
	this.openEditWindow = function () {
		this.heading = "Edit a Part";
		this.windowShow = true;
		this.windowType = "edit";
	};
	
	this.openRemoveWindow = function () {
		this.heading = "Remove Part";
		this.windowShow = true;
		this.windowType = "remove";
	};
	
	this.closeAllWindows = function () {
		this.windowShow = false;
		this.windowType = "";
		this.setResponse ("", "");
		this.backgroundStyle = {};
	};
	
	this.getChildren = function () {
		return this.editPart.children;
	}
	
	this.setResponse = function (message, color ) {
		this.responseStyle = {"color" : color};
		this.response = message;
	}
}
