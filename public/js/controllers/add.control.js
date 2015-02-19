
angular.module('AddCtrl', []).controller('AddController', function($scope, queryServiceFactory) {
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
					 
	vm.parts = [{partNumber: "PartA", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:0, 
				 children: [{partNumber: "PartB", desc: "This is some item!", cost:25.23, ppi:2}, {partNumber: "PartC", desc: "This is some item!", cost:25.23, ppi:3}]},
				 {partNumber: "PartB", 
				 desc: "This is some item!", 
				 cost:4.75, 
				 quantity:18, 
				 children: []},
				 {partNumber: "PartC", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:47, 
				 children: []}]
				 
	vm.addChildToPart = function (newChild, newPpi) {
		var newChildRecord = {partNumber: newChild.partNumber,
							  desc: newChild.desc,
							  cost: newChild.cost,
							  ppi: newPpi}
							  
		vm.removeChildFromPart(newChild);
		vm.childrenToAdd.push(newChildRecord)
	}
	
	
	vm.removeChildFromPart = function (newChild) {
		for (i = 0; i < vm.childrenToAdd.length; i ++) {
			if (vm.childrenToAdd[i].partNumber == newChild.partNumber) {
				vm.childrenToAdd.splice(i, 1);
				return;
			}
		}
	}
});
