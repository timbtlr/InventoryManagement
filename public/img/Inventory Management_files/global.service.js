angular.module('GlobalService', []).factory('globalServiceFactory', function() {
	var globalVars = {uomOptions : [{name:"Each", abbr:"EA"},
									 {name:"Roll", abbr:"RL"},
									 {name:"Board Feet", abbr:"BF"},
									 {name:"Sheet", abbr:"SHT"},
									 {name:"Square Yard", abbr:"SYD"},
									 {name:"Square Feet", abbr:"SFT"},
									 {name:"Square Inches", abbr:"SI"},
									 {name:"Linear Feet", abbr:"LFT"},
									 {name:"Linear Yard", abbr:"LYD"}],
					  searchOrders : [{id: 1,title: 'Part Number Ascending',key: 'partNumber',reverse: false},
									 {id: 2,title: 'Part Number Descending',key: 'partNumber',reverse: true},
									 {id: 3,title: 'Cost Ascending',key: 'cost',reverse: false},
									 {id: 4,title: 'Cost Descending',key: 'cost',reverse: true},
									 {id: 3,title: 'Quantity Ascending',key: 'quantity',reverse: false},
									 {id: 4,title: 'Quantity Descending',key: 'quantity',reverse: true}]};
	
	return {
		getGlobalVars : function () {
			return globalVars;
		}
	};
});