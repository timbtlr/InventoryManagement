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
angular.module('AddCtrl', []).controller('AddController', function($scope, $window, databaseServiceFactory, globalServiceFactory) {
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
		if (typeof($scope.newPpi) == "undefined" || isNaN($scope.newPpi)) {
			vm.responseStyle = {"color" : "red"}
			vm.actionResponse = "Part per Item (PPI) field is invalid  (required number field)";
		} else {
			var newChildRecord = {partNumber: newChild.partNumber,
								  desc: newChild.desc,
								  cost: newChild.cost,
								  ppi: newPpi};
								  
			vm.removeChildFromPart(newChild);
			vm.childrenToAdd.push(newChildRecord);
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
				return;
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
		if (typeof($scope.newPartNumber) == "undefined") {
			vm.responseStyle = {"color" : "red"}
			vm.actionResponse = "Part number field is invalid  (required field)";
		} else if (typeof($scope.newDescription) == "undefined") {
			vm.responseStyle = {"color" : "red"}
			vm.actionResponse = "Description field is invalid  (required field)";
		} else if ((vm.childrenToAdd.length == 0) && ((typeof($scope.newQuantity) == "undefined") || isNaN($scope.newQuantity))) {
			vm.responseStyle = {"color" : "red"}
			vm.actionResponse = "Quantity field is invalid  (required number field)";
		} else if ((vm.childrenToAdd.length == 0) && ((typeof($scope.newCost) == "undefined") || isNaN($scope.newCost))) {
			vm.responseStyle = {"color" : "red"}
			vm.actionResponse = "Cost field is invalid  (required number field)";
		} else {
			//  Query to inventory to determine if the part already exists
			databaseServiceFactory.getOne($scope.newPartNumber).then(function(result) {
				if (result.data != null) {
					//  The part exists already.  Alert the user.
					vm.responseStyle = {"color" : "red"}
					vm.actionResponse = "Part number \"" + $scope.newPartNumber + "\" exists in the inventory already";
				} else {
					//  The part does not exist.  Add it.
					var newPart = {}
			
					if (vm.childrenToAdd.length == 0) {
						//  Format the new part without a children attribute.
						var newPart = {partNumber: $scope.newPartNumber, 
									   desc: $scope.newDescription, 
									   quantity: $scope.newQuantity, 
									   cost: $scope.newCost, 
									   uom: $scope.newUomSelect.abbr}
					} else {
						//  Format the new part with a children attribute.  
						//  This part does not have a cost, quantity, nor UOM value.
						var childrenList = [];
					
						for (var i = 0; i < vm.childrenToAdd.length; i++) {
							childrenList.push (vm.childrenToAdd[i]);
						}
						
						var newPart = {partNumber: $scope.newPartNumber, 
									   desc: $scope.newDescription, 
									   children: childrenList}
					}		
					
					//  Add the formatted part to the inventory
					databaseServiceFactory.post(newPart).then(function(result) {
						//  Display response for the user
						vm.responseStyle = {"color" : "green"}
						vm.actionResponse = "Part number \"" + $scope.newPartNumber + "\" added to the inventory";
						
						//  Clear data fields
						$scope.newPartNumber = "";
						$scope.newDescription = "";
						$scope.newQuantity = "";
						$scope.newCost = "";
						$scope.newUomSelect = vm.uomOptions[0];
						vm.childrenToAdd = []
						
						getPartArray (databaseServiceFactory, function (currentParts) {
							vm.parts = currentParts;
						});
					});
				}
			});
		}		
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
