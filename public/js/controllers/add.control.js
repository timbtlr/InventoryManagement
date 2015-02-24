
angular.module('AddCtrl', []).controller('AddController', function($scope, $interval, addServiceFactory) {
    var vm = this;
    vm.title = "Add Items to Inventory";
    vm.searchInput = '';
	vm.hasChildrenShow = false;
	vm.childrenToAdd = []
	vm.order = {key: 'partNumber',reverse: false};
	vm.marginStyle = {}
	
	vm.uomOptions = [{name:"Each", abbr:"EA"},
					 {name:"Roll", abbr:"RL"},
					 {name:"Board Feet", abbr:"BF"},
					 {name:"Sheet", abbr:"SHT"},
					 {name:"Square Yard", abbr:"SYD"},
					 {name:"Square Feet", abbr:"SFT"},
					 {name:"Square Inches", abbr:"SI"},
					 {name:"Linear Feet", abbr:"LFT"},
					 {name:"Linear Yard", abbr:"LYD"},]
				 
	vm.addChildToPart = function (newChild, newPpi) {
		var newChildRecord = {partNumber: newChild.partNumber,
							  desc: newChild.desc,
							  cost: newChild.cost,
							  ppi: newPpi}
							  
		vm.removeChildFromPart(newChild);
		vm.childrenToAdd.push(newChildRecord)
	}
	
	//  Retrieve all inventory results from the database
	addServiceFactory.get().then(function(result) {
		vm.parts = result.data;
		
		
		//  If no inventory results were found then report that fact
		if (vm.parts.length == 0) {
			vm.parts = [{partNumber: 'No parts found', desc: "Enter parts in the add inventory section to see them here"}]
		}
	});
	
	vm.removeChildFromPart = function (newChild) {
		for (i = 0; i < vm.childrenToAdd.length; i ++) {
			if (vm.childrenToAdd[i].partNumber == newChild.partNumber) {
				vm.childrenToAdd.splice(i, 1);
				return;
			}
		}
	}
	
	vm.addPartToInventory = function () {
		var newPart = {partNumber: $scope.newPartNumber, 
					   desc: $scope.newDescription, 
					   quantity: $scope.newQuantity, 
					   cost: $scope.newCost, 
					   uom: $scope.newUomSelect.abbr}
		
		addServiceFactory.post(newPart).then(function(result) {
			console.log("Added new part!")
		});
	}
});
