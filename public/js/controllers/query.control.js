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

angular.module('QueryCtrl', []).controller('QueryController', function($scope, queryServiceFactory) {
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
	
	//  Retrieve all inventory results from the database
	/*vm.items = [];
	queryServiceFactory.get().then(function(result) {
		vm.items = result.data;
	});*/
	
	vm.items = [{partNumber: "STARTERFL106", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:14, 
				 children: [{partNumber: "FFB106", desc: "This is some item!", cost:25.23, quantity:14}, {partNumber: "FFBC106", desc: "This is some item!", cost:25.23, quantity:14}]},
				 {partNumber: "XX106", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:14, 
				 children: [{partNumber: "XXB106", desc: "This is some item!", cost:25.23, quantity:14}, {partNumber: "XXBC106", desc: "This is some item!", cost:25.23, quantity:14}]},
				 {partNumber: "YY106", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:14, 
				 children: [{partNumber: "YYB106", desc: "This is some item!", cost:25.23, quantity:14}, {partNumber: "YYBC106", desc: "This is some item!", cost:25.23, quantity:14}]},
				 {partNumber: "ZZ106", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:14, 
				 children: [{partNumber: "ZZB106", desc: "This is some item!", cost:25.23, quantity:14}, {partNumber: "ZZBC106", desc: "This is some item!", cost:25.23, quantity:14}]},
				 {partNumber: "FL106", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:14, 
				 children: [{partNumber: "FFB106", desc: "This is some item!", cost:25.23, quantity:14}, {partNumber: "FFBC106", desc: "This is some item!", cost:25.23, quantity:14}]},
				 {partNumber: "XX106", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:14, 
				 children: [{partNumber: "XXB106", desc: "This is some item!", cost:25.23, quantity:14}, {partNumber: "XXBC106", desc: "This is some item!", cost:25.23, quantity:14}]},
				 {partNumber: "YY106", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:14, 
				 children: [{partNumber: "YYB106", desc: "This is some item!", cost:25.23, quantity:14}, {partNumber: "YYBC106", desc: "This is some item!", cost:25.23, quantity:14}]},
				 {partNumber: "ZZ106", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:14, 
				 children: [{partNumber: "ZZB106", desc: "This is some item!", cost:25.23, quantity:14}, {partNumber: "ZZBC106", desc: "This is some item!", cost:25.23, quantity:14}]},
				 {partNumber: "FL106", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:14, 
				 children: [{partNumber: "FFB106", desc: "This is some item!", cost:25.23, quantity:14}, {partNumber: "FFBC106", desc: "This is some item!", cost:25.23, quantity:14}]},
				 {partNumber: "XX106", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:14, 
				 children: [{partNumber: "XXB106", desc: "This is some item!", cost:25.23, quantity:14}, {partNumber: "XXBC106", desc: "This is some item!", cost:25.23, quantity:14}]},
				 {partNumber: "YY106", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:14, 
				 children: [{partNumber: "YYB106", desc: "This is some item!", cost:25.23, quantity:14}, {partNumber: "YYBC106", desc: "This is some item!", cost:25.23, quantity:14}]},
				 {partNumber: "ZZ106", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:14, 
				 children: [{partNumber: "ZZB106", desc: "This is some item!", cost:25.23, quantity:14}, {partNumber: "ZZBC106", desc: "This is some item!", cost:25.23, quantity:14}]},
				 {partNumber: "FL106", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:14, 
				 children: [{partNumber: "FFB106", desc: "This is some item!", cost:25.23, quantity:14}, {partNumber: "FFBC106", desc: "This is some item!", cost:25.23, quantity:14}]},
				 {partNumber: "XX106", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:14, 
				 children: [{partNumber: "XXB106", desc: "This is some item!", cost:25.23, quantity:14}, {partNumber: "XXBC106", desc: "This is some item!", cost:25.23, quantity:14}]},
				 {partNumber: "YY106", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:14, 
				 children: [{partNumber: "YYB106", desc: "This is some item!", cost:25.23, quantity:14}, {partNumber: "YYBC106", desc: "This is some item!", cost:25.23, quantity:14}]},
				 {partNumber: "ZZ106", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:14, 
				 children: [{partNumber: "ZZB106", desc: "This is some item!", cost:25.23, quantity:14}, {partNumber: "ZZBC106", desc: "This is some item!", cost:25.23, quantity:14}]},
				 {partNumber: "FL106", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:14, 
				 children: [{partNumber: "FFB106", desc: "This is some item!", cost:25.23, quantity:14}, {partNumber: "FFBC106", desc: "This is some item!", cost:25.23, quantity:14}]},
				 {partNumber: "XX106", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:14, 
				 children: [{partNumber: "XXB106", desc: "This is some item!", cost:25.23, quantity:14}, {partNumber: "XXBC106", desc: "This is some item!", cost:25.23, quantity:14}]},
				 {partNumber: "YY106", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:14, 
				 children: [{partNumber: "YYB106", desc: "This is some item!", cost:25.23, quantity:14}, {partNumber: "YYBC106", desc: "This is some item!", cost:25.23, quantity:14}]},
				 {partNumber: "ZZ106", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:14, 
				 children: [{partNumber: "ZZB106", desc: "This is some item!", cost:25.23, quantity:14}, {partNumber: "ZZBC106", desc: "This is some item!", cost:25.23, quantity:14}]},
				 {partNumber: "FL106", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:14, 
				 children: [{partNumber: "FFB106", desc: "This is some item!", cost:25.23, quantity:14}, {partNumber: "FFBC106", desc: "This is some item!", cost:25.23, quantity:14}]},
				 {partNumber: "XX106", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:14, 
				 children: [{partNumber: "XXB106", desc: "This is some item!", cost:25.23, quantity:14}, {partNumber: "XXBC106", desc: "This is some item!", cost:25.23, quantity:14}]},
				 {partNumber: "YY106", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:14, 
				 children: [{partNumber: "YYB106", desc: "This is some item!", cost:25.23, quantity:14}, {partNumber: "YYBC106", desc: "This is some item!", cost:25.23, quantity:14}]},
				 {partNumber: "ZZ106", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:14, 
				 children: [{partNumber: "ZZB106", desc: "This is some item!", cost:25.23, quantity:14}, {partNumber: "ZZBC106", desc: "This is some item!", cost:25.23, quantity:14}]},
				 {partNumber: "FL106", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:14, 
				 children: [{partNumber: "FFB106", desc: "This is some item!", cost:25.23, quantity:14}, {partNumber: "FFBC106", desc: "This is some item!", cost:25.23, quantity:14}]},
				 {partNumber: "XX106", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:14, 
				 children: [{partNumber: "XXB106", desc: "This is some item!", cost:25.23, quantity:14}, {partNumber: "XXBC106", desc: "This is some item!", cost:25.23, quantity:14}]},
				 {partNumber: "YY106", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:14, 
				 children: [{partNumber: "YYB106", desc: "This is some item!", cost:25.23, quantity:14}, {partNumber: "YYBC106", desc: "This is some item!", cost:25.23, quantity:14}]},
				 {partNumber: "ZZ106", 
				 desc: "This is some item!", 
				 cost:25.23, 
				 quantity:14, 
				 children: [{partNumber: "ZZB106", desc: "This is some item!", cost:25.23, quantity:14}, {partNumber: "ZZBC106", desc: "This is some item!", cost:25.23, quantity:14}]}]
	
	//  If no results were found then report that fact
	if (vm.items.length == 0) {
		vm.items = [{partNumber: 'No parts found.', desc: "Enter parts in the add inventory section to see them here"}]
		vm.badgeShow = false;
	} else {
		vm.badgeShow = true;
	}
	
	vm.expand = function(item) {
	   item.show = !item.show;
	}
});
