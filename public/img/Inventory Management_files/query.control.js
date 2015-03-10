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
	
	function PopupHandler () {
		this.heading = "";
		this.windowShow = false;
		this.windowType = ""
		this.response = "";
		this.responseStyle = "";
		this.editItem = {};
		
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
		
		this.closeAllWindows = function () {
			this.windowShow = false;
			this.windowType = "";
		};
		
		this.getChildren = function () {
			return this.editItem.children;
		}
		
		this.setResponse = function (message, color ) {
			this.responseStyle = {"color" : color};
			this.response = message;
		}
	}
	
	vm.popupHandler = new PopupHandler ();
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
		});
	}
	
	
	vm.openAddWindow = function (part) {
		vm.containerStyle = {'opacity': '0.4', 'filter': 'alpha(opacity=40)'};
		vm.popupHandler.openAddWindow();
		vm.popupHandler.editItem = part;
		$scope.popupPartNumber = part.partNumber;
		$scope.popupDescription = part.desc;
		$scope.popupQuantity = 0;
		$scope.popupCost = undefined;
	}
	
	
	vm.openSubtractWindow = function (part) {
		vm.containerStyle = {'opacity': '0.4', 'filter': 'alpha(opacity=40)'};
		vm.popupHandler.openSubtractWindow();
		vm.popupHandler.editItem = part;
		$scope.popupPartNumber = part.partNumber;
		$scope.popupDescription = part.desc;
		$scope.popupQuantity = 0;
		$scope.popupCost = undefined;
	}
	
	
	vm.openEditWindow = function (part) {
		vm.containerStyle = {'opacity': '0.4', 'filter': 'alpha(opacity=40)'};
		vm.popupHandler.openEditWindow();
		vm.popupHandler.editItem = part;
		$scope.popupPartNumber = part.partNumber;
		$scope.popupDescription = part.desc;
	}
	
	
	vm.closePopupWindow = function (part) {
		vm.popupHandler.closeAllWindows();
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
		if (typeof($scope.popupDescription) == "undefined") {
			vm.popupHandler.setResponse ("Invalid Description  --  required", "red");;
		} else if ((typeof($scope.popupCost) == "undefined") || isNaN($scope.popupCost)) {
			vm.popupHandler.setResponse ("Invalid Cost  --  required number", "red");;
		} else {
		
			var partChildren = vm.popupHandler.editItem.children;
			
			for (i = 0; i < partChildren.length; i ++) {
				console.log(partChildren[i]);
			}
			
			if (partChildren.length == 0) {
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
	}
	
	
	vm.addParts = function () {
		if ((typeof($scope.popupQuantity) == "undefined") || isNaN($scope.popupQuantity)) {
			vm.popupHandler.setResponse ("Invalid # Parts to Add  --  required number", "red");;
		} else {
			var idArray = []
			var part = vm.popupHandler.editItem;
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
					vm.displayResponse ("Added " + $scope.popupQuantity + " of part " + $scope.popupPartNumber, "green");
					vm.closePopupWindow();
					
					getPartArray (databaseServiceFactory, function (currentParts) {
						vm.parts = currentParts;
						$scope.newChildrenSelect = vm.parts[0];
					});
				});
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
