angular.module("InventoryApplication").controller("QueryController", function(){
    var vm = this;
    vm.title = "Current Inventory on File";
    vm.searchInput = '';
	
	vm.items = [
        {	
			itemName: 'Item 1',
			itemNumber: 1,
            quantity: 2011,
            favorite: true},
        {
            itemName: 'Item 2',
			itemNumber: 2,
            quantity: 2010,
            favorite: false
        },
        {
            itemName: 'Item 3',
			itemNumber: 3,
            quantity: 2002,
            favorite: true
        },
        {
            itemName: 'Item 4',
			itemNumber: 4,
            quantity: 2013,
            favorite: true
        },
        {
            itemName: 'Item 5',
			itemNumber: 5,
            quantity: 2005,
            favorite: false
        }
    ];
	
	vm.orders = [
    {
        id: 1,
        title: 'Name Ascending',
        key: 'itemName',
        reverse: false
    },
    {
        id: 2,
        title: 'Name Descending',
        key: 'itemName',
        reverse: true
    },
    {
        id: 3,
        title: 'Item Number Ascending',
        key: 'itemNumber',
        reverse: false
    },
    {
        id: 4,
        title: 'Item Number Ascending',
        key: 'itemNumber',
        reverse: true
    }
];
vm.order = vm.orders[0];
});