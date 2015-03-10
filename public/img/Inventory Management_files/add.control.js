/*
Name:
	add.control
	
Description:
	Controls the dynamic content of the Add view.  The Add view displays options to add
	a new item to the inventory.  

Author:
	Tim "KetsuN" Butler
*/


/*
Angular Module Name:
	AddCtrl
	
Controller Name:
	AddController
	
Description:
	Defines the AddCtrl/AddController used to query for inventory items and update the Query view.

Author:
	Tim "KetsuN" Butler
*/
angular.module('AddCtrl', []).controller('AddController', function($scope, $window, databaseServiceFactory, addServiceFactory, globalServiceFactory) {
    var vm = this;
    vm.title = "Add Items to Inventory";
	
	vm.actionResponse = ""
	vm.responseStyle = {}
	
    vm.searchInput = '';
	vm.hasChildrenShow = false;
	vm.childrenToAdd = [];
	vm.order = {key: 'partNumber',reverse: false};
	vm.marginStyle = {};
	
	//  Get dropdown options for unit of measurement values
	vm.uomOptions = globalServiceFactory.getGlobalVars().uomOptions;
	$scope.newUomSelect = vm.uomOptions[0];

	getPartArray (databaseServiceFactory, function (currentParts) {
		vm.parts = currentParts;
		$scope.newChildrenSelect = vm.parts[0];
	});
	
	
	/*
	Function name:
		addChildToPart
		
	Description:
		Adds a new child part to the current part array for the part being added.
	
	Author:
		Tim "KetsuN" Butler
	*/
	vm.addChildToPart = function (newChild, newPpi) {
		
		if (vm.validateChildInputs()) {
			vm.removeChildFromPart(newChild);
			vm.childrenToAdd.push({partNumber: newChild.partNumber,
								   desc: newChild.desc,
								   ppi: newPpi});
			$scope.newPpi = undefined;
			
			vm.displayResponse (newChild.partNumber + " added as a child", "green");
		}
	}	
	
	/*
	Function name:
		removeChildFromPart
		
	Description:
		Removes a child from the children array for the current part being added.
	
	Author:
		Tim "KetsuN" Butler
	*/
	vm.removeChildFromPart = function (newChild) {
		for (i = 0; i < vm.childrenToAdd.length; i ++) {
			if (vm.childrenToAdd[i].partNumber == newChild.partNumber) {
				vm.childrenToAdd.splice(i, 1);
				vm.displayResponse (newChild.partNumber + " removed as a child", "green");
			}
		}
	}
	
	
	/*
	Function name:
		addPartToInventory
		
	Description:
		Adds a new part to inventory.  The new part contains the following attributes:
			Part Number - Part ID number (required)
			Description - Part description string (required)
			Quantity	- Part quantity on record (if no children)
			Cost		- Part cost per unit (if no children)
			UOM			- Unit of measurement for part (if no children)
			Children	- Part references making up the current part
			
		Inclusion of ANY child part negates value of quantity, cost and UOM for part.  
		Children have the following attributes:
			Part Number - Part ID number
			PPI			- Number of children parts contributing to a single parent part unit.
	
	Author:
		Tim "KetsuN" Butler
	*/
	vm.addPartToInventory = function () {
		if (vm.validateMainInputs()) {
			//  Query to inventory to determine if the part already exists
			databaseServiceFactory.getOne($scope.newPartNumber).then(function(result) {
				if (result.data != null) {
					//  The part exists already.  Alert the user.
					vm.displayResponse ("Part number \"" + $scope.newPartNumber + "\" exists in the inventory already", "red");
				} else {
					//  The part does not exist.  Add it.
					var newPart = {partNumber: $scope.newPartNumber, 
								   desc: $scope.newDescription, 
								   quantity: $scope.newQuantity,
								   children: []}
			
					if (vm.childrenToAdd.length == 0) {
						//  Format the new part without a children attribute.
						newPart.cost = $scope.newCost;
						newPart.uom = $scope.newUomSelect.abbr;
					} else {
						//  Format the new part with a children attribute.  
						newPart.children = vm.childrenToAdd;
					}		
					
					console.log("new part children");
					console.log(newPart.children);
					
					vm.insertPart (newPart);
				}
			});
		}		
	}
	
	
	vm.validateMainInputs = function () {
		if (typeof($scope.newPartNumber) == "undefined") {
			vm.displayResponse ("Part number field is invalid  --  required", "red");
			return false;
		} else if (typeof($scope.newDescription) == "undefined") {
			vm.displayResponse ("Description field is invalid  --  required", "red");
			return false;
		} else if ((typeof($scope.newQuantity) == "undefined") || isNaN($scope.newQuantity) || $scope.newQuantity < 0) {
			vm.displayResponse ("Quantity field is invalid  --  positive numbers only", "red");
			return false;
		} else if ((vm.childrenToAdd.length == 0) && ((typeof($scope.newCost) == "undefined") || isNaN($scope.newCost) || $scope.newCost < 0)) {
			vm.displayResponse ("Cost field is invalid  --  positive numbers only", "red");
			return false;
		} else {
			vm.displayResponse ("", "");
			return true;
		}
	}
	
	vm.validateChildInputs = function () {
		if (typeof($scope.newPpi) == "undefined" || isNaN($scope.newPpi) || $scope.newPpi < 0) {
			vm.displayResponse ("Child Parts per Unit field is invalid  --  positive numbers only", "red");
			return false;
		} else {
			vm.displayResponse ("", "");
			return true;
		}
	}
	
	
	vm.insertPart = function (newPart) {
		var idArray = []
		
		for (var i = 0; i < newPart.children.length; i ++) {
			idArray.push(newPart.children[i].partNumber);
		}
		
		databaseServiceFactory.getByArray(idArray).then(function(result) {
			results = result.data;
			
			for (var i = 0; i < newPart.children.length; i ++) {
				for (var j = 0; j < results.length; j ++) {
					if ((newPart.children[i].partNumber == results[j].partNumber) && ((newPart.children[i].ppi * newPart.quantity) > results[j].quantity)) {
						vm.displayResponse ("Not enough children parts to make this item.", "red");
						return;
					}
				}
			}
			console.log("doing some posting");
			//  Add the formatted part to the inventory
			addServiceFactory.addNewPart(newPart).then(function(result) {
				console.log("posted");
				for (var i = 0; i < newPart.children.length; i ++) {
					var removePart = {partNumber: newPart.children[i].partNumber,
									  subtract: (newPart.children[i].ppi * newPart.quantity)}
					
					//  Add the formatted part to the inventory
					databaseServiceFactory.subtractFromPart(removePart).then(function(result) {
						console.log("subtracted from ");
						console.log(newPart.children[i]);
					});
				}
				
				//  Display response for the user
				vm.displayResponse ("Part number " + $scope.newPartNumber + " added to the inventory", "green");
				vm.clearFields();
				
				getPartArray (databaseServiceFactory, function (currentParts) {
					vm.parts = currentParts;
					$scope.newChildrenSelect = vm.parts[0];
				});
			});
		});
	}
	
	
	vm.clearFields = function () {
		//  Clear data fields
		$scope.newPartNumber = undefined;
		$scope.newDescription = undefined;
		$scope.newQuantity = undefined;
		$scope.newCost = undefined;
		$scope.newUomSelect = vm.uomOptions[0];
		$scope.newPpi = undefined;
		$scope.newChildrenSelect = vm.parts[0]
		vm.childrenToAdd = [];
	}
	
	
	vm.displayResponse = function (message, color) {
		vm.responseStyle = {"color" : color}
		vm.actionResponse = message;
	}
});




/*
Function name:
	fillPartArray
	
Description:
	Fills the parts

Author:
	Tim "KetsuN" Butler
*/
getPartArray = function (databaseService, callback) {
	//  Retrieve all parts from
	databaseService.get().then(function(result) {
		if (typeof callback === "function") {
			callback (result.data);
		} else {
			return result.data;
		}
	});
}
