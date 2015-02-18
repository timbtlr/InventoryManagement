/*
Name:
	inventory.model.route
	
Description:
	Defines the API routing to handle http requests to the MongoDB involving inventory models.  The
	following actions are possible through an api:
		- Add a new inventory item (http.post on api/inventory)
		- Query for all inventory items (http.get on apt/inventory)
		- Query for a single inventory item (http.get on api/inventory/part_id)
		- Update a single inventory item (http.put on api/inventory/part_id)
		
	For testing purposes, all actions performed through this route setup are logged in the console.

Author:
	Tim "KetsuN" Butler
*/

// grab the inventory model
var Inventory = require('../models/inventory.model');

module.exports = function(router) {
	//  All requests through this route are logged in console
	router.use(function(req, res, next) {
		console.log('Logger action');
		next(); 
	});
			
	//  Route for unspecific Inventory API requests
	router.route('/inventory')
		// POST request to add an item to inventory
		.post(function(req, res) {
			//  Instantiate a new Inventory object with proper item field values
			var inventory = new Inventory(); 
			
			inventory.partNumber = req.body.partNumber;
			inventory.desc = req.body.desc;
			inventory.quantity = req.body.quantity;
			inventory.uom = req.body.uom;
			inventory.cost = req.body.cost;
			inventory.children = req.body.children;

			// Save the item in the inventory document
			inventory.save(function(err) {
				//  Check for and report errors
				if (err)
					res.send(err);
				
				res.json({ message: 'Inventory item created!' });
			});
		})
		 
		// GET request for all inventory items
		.get(function(req, res) {
			//  Query for inventory items
			Inventory.find(function(err, inventoryItems) {
				//  Check for and report query errors
				if (err)
					res.send(err);
				
				//  Return results via JSON
				res.json(inventoryItems);
			});
		});

		
	//  Route for specific Inventory API requests (by item ID)
	router.route('/inventory/:part_id')
		//  GET reuqest for a specific item
		.get(function(req, res) {
			//  Query for a specific item with the item ID
			inventory.findById(req.params.part_id, function(err, inventory) {
				//  Check for and report query errors
				if (err) {
					res.send(err);
				} else {
					//  Return results via JSON
					res.json(inventory);
				}
			});
		})
		
		//  PUT request to update a specific item
		.put(function(req, res) {
			//  Query for a specific item with the item ID
			inventory.findById(req.params.part_id, function(err, inventory) {
				//  Check for and report query errors
				if (err) {
					res.send(err);
				} else {
					inventory.name = req.body.name;  // Update name information
					inventory.desc = req.body.desc;  // Update description information
	
					// save the bear
					inventory.save(function(err) {
						//  Check for and report update errors
						if (err)
							res.send(err);
						
						
						res.json({ message: 'Inventory item modified!' });
					});
				}
			});
		});
}




