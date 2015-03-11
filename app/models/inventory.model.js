/*
Name:
    inventory.model
    
Description:
    Defines the model used for the inventory document in the MongoDB.  The inventory document holds all important
    information about specific inventory items.  The inventory document can be queried as a whole to see all items 
    making up a full inventory list.
    
    The inventory document has the following fields:
        - partNumber:	Unique part identifier of a specific item
        - desc:     	Description string for the item
		- quantity:		Number of parts for this partNumber in the inventory
		- uom:			Unit of part measurement
		- cost:			Cost per part unit
        - children: 	Array of item identifiers making up the item.  
						Each entry in the array contains an ID and PPI value (parts per item).

Author:
    Tim "KetsuN" Butler
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define the Inventory model schema
var InventorySchema  = new Schema({
	partNumber: String,
	desc: String,
	quantity: Number,
	uom: String,
	cost: Number,
	children: Array
});

//  Allows passage to other files when "Inventory" is referenced
module.exports = mongoose.model('Inventory', InventorySchema);
