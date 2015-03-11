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
	vm.popupHandler = new PopupHandler ();
	
	//  Unit of Measurement options
	vm.uomOptions = globalServiceFactory.getGlobalVars().uomOptions;
	
	//  Part ordering options
	vm.orders = globalServiceFactory.getGlobalVars().searchOrders;
	vm.order = vm.orders[0];
	
	//  Retrieve all inventory results from the database
	vm.parts = [];
	
	/*
	Function name:
		queryForInventory
		
	Description:
		Queries for all inventory parts from the inventory database.
		
	Parameters:
		None
	
	Author:
		Tim "KetsuN" Butler
	*/
	vm.queryForInventory = function () {
		databaseServiceFactory.get().then(function(result) {
			vm.parts = result.data;
		});
	}
	
	
	/*
	Function name:
		openAddWindow
		
	Description:
		Signals the popup handler object to open a popup window for an add quantity request.
		
	Parameters:
		part	- Part to be edited.  It's attributes will be filled into the popup elements.
	
	Author:
		Tim "KetsuN" Butler
	*/
	vm.openAddWindow = function (part) {
		vm.popupHandler.backgroundStyle = {'opacity': '0.4', 'filter': 'alpha(opacity=40)'};
		vm.popupHandler.openAddWindow();
		vm.popupHandler.editPart = part;
		$scope.popupPartNumber = part.partNumber;
		$scope.popupDescription = part.desc;
		$scope.popupQuantity = 0;
		$scope.popupCost = undefined;
	}
	
	
	/*
	Function name:
		openSubtractWindow
		
	Description:
		Signals the popup handler object to open a popup window for a subtract quantity request.
		
	Parameters:
		part	- Part to be edited.  It's attributes will be filled into the popup elements.
	
	Author:
		Tim "KetsuN" Butler
	*/
	vm.openSubtractWindow = function (part) {
		vm.popupHandler.backgroundStyle = {'opacity': '0.4', 'filter': 'alpha(opacity=40)'};
		vm.popupHandler.openSubtractWindow();
		vm.popupHandler.editPart = part;
		$scope.popupPartNumber = part.partNumber;
		$scope.popupDescription = part.desc;
		$scope.popupQuantity = 0;
		$scope.popupCost = undefined;
	}
	
	
	/*
	Function name:
		openEditWindow
		
	Description:
		Signals the popup handler object to open a popup window for an edit part request.
		
	Parameters:
		part	- Part to be edited.  It's attributes will be filled into the popup elements.
	
	Author:
		Tim "KetsuN" Butler
	*/
	vm.openEditWindow = function (part) {
		vm.popupHandler.backgroundStyle = {'opacity': '0.4', 'filter': 'alpha(opacity=40)'};
		vm.popupHandler.openEditWindow();
		vm.popupHandler.editPart = part;
		$scope.popupPartNumber = part.partNumber;
		$scope.popupDescription = part.desc;
		$scope.popupCost = part.cost;
	}
	
	
	/*
	Function name:
		openRemoveWindow
		
	Description:
		Signals the popup handler object to open a popup window to confirm a part removal request.
		
	Parameters:
		part	- Part to be edited.  It's attributes will be filled into the popup elements.
	
	Author:
		Tim "KetsuN" Butler
	*/
	vm.openRemoveWindow = function (part) {
		vm.popupHandler.backgroundStyle = {'opacity': '0.4', 'filter': 'alpha(opacity=40)'};
		vm.popupHandler.openRemoveWindow();
		vm.popupHandler.setResponse ("Removing Part  --  Are you sure?", "red");;
		vm.popupHandler.editPart = part;
		$scope.popupPartNumber = part.partNumber;
		$scope.popupDescription = part.desc;
	}
	
	
	/*
	Function name:
		removePart
		
	Description:
		Removes the part currently loaded into the popupHandler.  If the part removal is successful
		then the popup window is closed and the user is alerted with success.
		
	Parameters:
		None
	
	Author:
		Tim "KetsuN" Butler
	*/
	vm.removePart = function () {
		databaseServiceFactory.remove(vm.popupHandler.editPart.partNumber).then(function(result) { 
			vm.popupHandler.closeAllWindows();
			vm.queryForInventory();
			vm.displayResponse ("Removed " + $scope.popupPartNumber + " from inventory", "green");
		});;
	}
	
	
	/*
	Function name:
		editPart
		
	Description:
		Edits the part currently loaded into the popupHandler.  The description and part cost
		values are updated in the inventory database.  Those fields in the popup are verified
		for correctness before editing.  
		
	Parameters:
		None
	
	Author:
		Tim "KetsuN" Butler
	*/
	vm.editPart = function () {
		//  Verify editing inputs
		if (typeof($scope.popupDescription) == "undefined") {
			vm.popupHandler.setResponse ("Invalid Description  --  required", "red");
		} else if ((typeof($scope.popupCost) == "undefined") || isNaN($scope.popupCost)) {
			vm.popupHandler.setResponse ("Invalid Cost  --  required number", "red");
		} else {
			//  Edit description and cost fields of the editing part.
			vm.popupHandler.editPart.desc = $scope.popupDescription;
			vm.popupHandler.editPart.cost = $scope.popupCost;
			
			//  
			addServiceFactory.edit(vm.popupHandler.editPart).then(function(result) { 
				vm.popupHandler.closeAllWindows();
				vm.popupHandler.backgroundStyle = {};
				vm.queryForInventory();
			});
		}
	}
	
	
	/*
	Function name:
		addParts
		
	Description:
		Adds quantity to the part currently loaded into the popupHandler.  The quantity
		value is updated in the inventory database.  Quantity is removed from each child
		related to the part based on the PPI value of the child.  If a child does not have
		enough quantity to remove then the user is alerted of the problem. 
		
		Child quantities are queried from the inventory before performing any updates.
		This could be done from the apps current understanding of the inventory,
		but querying from the database better ensures that there is no lapse in 
		inventory integrity/correctness.
		
	Parameters:
		None
	
	Author:
		Tim "KetsuN" Butler
	*/
	vm.addParts = function () {
		//  Verify quantity input
		if ((typeof($scope.popupQuantity) == "undefined") || isNaN($scope.popupQuantity)) {
			vm.popupHandler.setResponse ("Invalid # Parts to Add  --  required number", "red");;
		} else {
			//  Prepare a child part number array
			var idArray = []
			var part = vm.popupHandler.editPart;
			part.quantity = Number($scope.popupQuantity);
			
			for (var i = 0; i < part.children.length; i ++) {
				idArray.push(part.children[i].partNumber);
			}
			
			//  Search for the quantities of children from the inventory database
			databaseServiceFactory.getByArray(idArray).then(function(result) {
				results = result.data;
				
				//  Determine if any of the children do not have sufficient parts to remove.  Alert if insufficient.
				for (var i = 0; i < part.children.length; i ++) {
					for (var j = 0; j < results.length; j ++) {
						if ((part.children[i].partNumber == results[j].partNumber) && ((part.children[i].ppi * $scope.popupQuantity) > results[j].quantity)) {
							vm.popupHandler.setResponse ("Not enough children parts to make " + $scope.popupQuantity + " parts." , "red");
							return;
						}
					}
				}
				
				//  Add update the quantity of the part.  
				queryServiceFactory.edit(part).then(function(result) {
					//  Iterate through all children parts and remove the appropriate quantity from each (based on PPI).
					for (var i = 0; i < part.children.length; i ++) {
						var removePart = {partNumber: part.children[i].partNumber,
										  subtract: (part.children[i].ppi * $scope.popupQuantity)}
						
						//  Add the formatted part to the inventory
						databaseServiceFactory.subtractFromPart(removePart).then(function(result) { });
					}
					
					//  Display response for the user, close popup window, update inventory for view
					vm.displayResponse ($scope.popupQuantity + " quantity added to " + $scope.popupPartNumber, "green");
					vm.popupHandler.closeAllWindows();
					vm.queryForInventory();
				});
			});
		}
	}
	
	
	/*
	Function name:
		subtractParts
		
	Description:
		Removes quantity from the part currently loaded into the popupHandler.  The quantity
		value is updated in the inventory database.  
		
	Parameters:
		None
	
	Author:
		Tim "KetsuN" Butler
	*/
	vm.subtractParts = function () {
		//  Verify quantity input
		if ((typeof($scope.popupQuantity) == "undefined") || isNaN($scope.popupQuantity)) {
			vm.popupHandler.setResponse ("Invalid # Parts to Remove  --  required number", "red");
		} else if ($scope.popupQuantity > vm.popupHandler.editPart.quantity) {
			vm.popupHandler.setResponse ("Cannot remove more quantity than the inventory contains", "red");
		} else {
			//  Format a JSON object for the part removal
			var removePart = {partNumber: vm.popupHandler.editPart.partNumber,
							  subtract: $scope.popupQuantity};
						
			//  Subtract quantity from the inventory, alert user, update inventory for view
			databaseServiceFactory.subtractFromPart(removePart).then(function(result) { 
				vm.displayResponse(removePart.subtract + " quantity removed from " + removePart.partNumber, "green");
				vm.popupHandler.closeAllWindows();
				vm.queryForInventory();
			});
		}
	}
	
	
	/*
	Function name:
		displayResponse
		
	Description:
		Displays a response to the user on the view.
		
	Parameters:
		message	-	String to be displayed for the user
		color	-	Color of the message to be displayed
	
	Author:
		Tim "KetsuN" Butler
	*/
	vm.displayResponse = function (message, color) {
		vm.responseStyle = {"color" : color}
		vm.actionResponse = message;
	}
	
	
	//  Initial inventory query for all parts
	vm.queryForInventory();
});


	
	
/*
Class name:
	PopupHandler
	
Description:
	Contains options used for a query popup window.  Helps to control the query view through directives.

Author:
	Tim "KetsuN" Butler
*/
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
