/*
Name:
    inventory.model
    
Description:
    Defines the model used for the inventory document in the MongoDB.  The inventory document holds all important
    information about specific inventory items.  The inventory document can be queried as a whole to see all items 
    making up a full inventory list.
    
    The inventory document has the following fields:
        - name:     Human readable/understandable name of a specific item
        - id:       Unique item identifier
        - desc:     Description string for the item
        - children: Array of item identifiers making up the item.  
                    Each entry in the array contains an ID and quantity.

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
	cost: Number
});

//  Allows passage to other files when "Inventory" is referenced
module.exports = mongoose.model('Inventory', InventorySchema);
