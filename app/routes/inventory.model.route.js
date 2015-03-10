/*
Name:
	inventory.model.route
	
Description:
	Defines the API routing to handle http requests to the MongoDB involving inventory models.  The
	following actions are possible through an api:
		- Add a new inventory part (http.post on api/inventory)
		- Query for all inventory parts (http.get on apt/inventory)
		- Remove a single part from invantory (http.delete on api/inventory/part_id)
		- Query for a single inventory part (http.get on api/inventory/part_id)
		- Update a single inventory part (http.put on api/inventory/part_id)
		
	For testing purposes, all actions performed through this route setup are logged in the console.
Author:
	Tim "KetsuN" Butler
*/

// grab the inventory model
var Inventory = require('../models/inventory.model');

module.exports = function(router) {
	//  All requests through this route are logged in console
	router.use(function(req, res, next) {
		//  This console logging function can be saved to a file later.  
		//  For now it is for testing.
		console.log('Logger action');
		next(); 	 
	});
	
	
	router.route('/query/addQuantity/:partNumber')
		/*
			PUT HTTP REQUEST - Updates a single part in the inventory.
			
			 Updates a single part in the inventory using the provided part properties.
			 The HTTP request body property contains the following values:
				partNumber 	- Part ID string used to find an existing part in inventory
				desc		- Part description
				quantity	- Part quantity on file
				uom			- Part unit of measurement
				cost		- Part cost per unit
				children	- Any children that this part is made of
		*/
		.put(function(req, res) {
			//  Find a single existing part with the specified part number
			Inventory.findOne({partNumber: req.body.partNumber}, function(err, inventory) {
				if (err) {
					res.send(err);
				} else {
					//  Alter existing part properties
					inventory.cost = req.body.cost.toFixed(2);
					inventory.desc = req.body.desc;
					inventory.quantity = inventory.quantity + req.body.quantity;
					inventory.uom = req.body.uom;
					inventory.children = req.body.children;					
	
					//  Save the updated part
					inventory.save(function(err) {
						if (err) {
							res.send(err);
						} else {
							res.json({message: req.body.partNumber + ' modified' });
						}
						
					});
				}
			});
		});
	
	
	router.route('/add/addNewPart/')
		/*
			POST HTTP REQUEST - Add a new part to inventory
			
			A new part is added to inventory to inventory.
			The HTTP request contains the following values:
				partNumber 	- Part ID string
				desc		- Part description
				quantity	- Part quantity on file
				uom			- Part unit of measurement
				cost		- Part cost per unit
				children	- Any children that this part is made of
		*/
		.post(function(req, res) {
			var inventory = new Inventory(); 
			
			inventory.partNumber = req.body.partNumber;
			inventory.desc = req.body.desc;
			inventory.quantity = req.body.quantity;
			inventory.uom = req.body.uom;
			inventory.cost = req.body.cost;
			inventory.children = req.body.children;
				
			if (inventory.children.length > 0) {
				var idArray = [];
				inventory.cost = 0;
				for (var i = 0; i < inventory.children.length; i ++) {
					idArray.push(inventory.children[i].partNumber);
				}
				
				Inventory.aggregate([{$match: {partNumber: {$in: idArray}}},
									 {$group: {_id: "$partNumber", totalCost: {$sum: "$cost"}}}], function(err, inventoryItems) {
					if (err) {
						res.send(err);
					} 
					
					inventoryItems.forEach(function (entry,index,object) {
						var index = inventory.children.map(function(e) {return e.partNumber;}).indexOf(entry._id);
						inventory.cost = inventory.cost + (entry.totalCost * inventory.children[index].ppi);
					});
					
					//  Save the part in the inventory
					inventory.save(function(err) {
						if (err) {
							res.send(err);
						} else {
							res.json({message: req.body.partNumber + ' created!' });
						}
					});
				});
			} else {
				//  Save the part in the inventory
				inventory.save(function(err) {
					if (err) {
						res.send(err);
					} else {
						res.json({message: req.body.partNumber + ' created!' });
					}
				});
			}
		})
			
			
	//  Route for unspecific Inventory API requests
	router.route('/inventory')
		/*
			GET HTTP REQUEST - Get all items from inventory
			
			Returns all parts from the part inventory.
			All parts will be returned as a promise object and must be handled
			appropriately by the calling party.
		*/
		.get(function(req, res) {
			//  Query for all inventory items
			Inventory.find(function(err, inventoryItems) {
				if (err) {
					res.send(err);
				} 
				
				res.json(inventoryItems);
			});
		});

		
	//  Route for specific Inventory API requests (by item ID)
	router.route('/inventory/:partNumber')
		/*
			DELETE HTTP REQUEST - Remove an item with the specified part number
			
			Removed the part from the inventory containing the part number specified
			in the HTTP request.  The HTTP request query field has a single value:
				partNumber	- Part ID number 
				
			By nature of the inventory, parts can made of other parts.  If a part is removed
			from the inventory as a whole then all of its references as children of other
			parts must be removed as well.  
		*/
		.delete(function(req, res) {
			//  Remove a single part from the inventory with the specified part number
			Inventory.remove({partNumber: req.params.partNumber}, function(err, inventory) {
				//  Check for and report query errors
				if (err) {
					res.send(err);
				}
			});
			
			//  Remove all child references matching the part number that was removed
			Inventory.update(
                 {}, 
                 {$pull: {children: {partNumber: req.params.partNumber}}},  
                 { multi: true },
                 function(err, data){
					res.send(err);
                 }
			);
		})
	
		/*
			GET HTTP REQUEST - Find a single part with the part number specified
			
			Returns a single part from the inventory that contains the part number
			specified by the HTTP request.  The HTTP request query property contains
			the following values:
				partNumber	- Part ID number
		*/
		.get(function(req, res) {
			//  Query for a specific item with the item ID
			Inventory.findOne({partNumber: req.params.partNumber}, function(err, inventory) {
				if (err) {
					res.send(err);
				} 
				//  Return single item via JSON
				res.json(inventory);
			});
		})
	
		/*
			PUT HTTP REQUEST - Updates a single part in the inventory.
			
			 Updates a single part in the inventory using the provided part properties.
			 The HTTP request body property contains the following values:
				partNumber 	- Part ID string used to find an existing part in inventory
				desc		- Part description
				quantity	- Part quantity on file
				uom			- Part unit of measurement
				cost		- Part cost per unit
				children	- Any children that this part is made of
		*/
		.put(function(req, res) {
			//  Find a single existing part with the specified part number
			Inventory.findOne({partNumber: req.body.partNumber}, function(err, inventory) {
				if (err) {
					res.send(err);
				} else {
					//  Alter existing part properties
					inventory.desc = req.body.desc;
					inventory.quantity = req.body.quantity;
					inventory.uom = req.body.uom;
					inventory.cost = req.body.cost;
					inventory.children = req.body.children;
	
					//  Save the updated part
					inventory.save(function(err) {
						if (err) {
							res.send(err);
						}
						
						res.json({message: req.body.partNumber + ' modified' });
					});
				}
			});
		});
		
		
	//  Route for specific Inventory API requests (by item ID)
	router.route('/inventory/fromArray/:idArray')
		//  delete request for a specific item
		.get(function(req, res) {
			partNumberArray = req.params.idArray.split(",")
			Inventory.find({partNumber : { $in: partNumberArray}}, function(err, result){
				 res.json(result);
			});
		});
		
		
	//  Route for specific Inventory API requests (by item ID)
	router.route('/inventory/subtract/:part')
		//  delete request for a specific item
		.put(function(req, res) {			
			Inventory.update({partNumber : req.body.partNumber}, { $inc: { quantity: -req.body.subtract} }, function(err, result){
				 res.json(result);
			});
		});
}




