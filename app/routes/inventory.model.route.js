// grab the inventory model
var Inventory = require('../models/inventory.model');

module.exports = function(router){
	// middleware to use for all requests (logging functionality)
	router.use(function(req, res, next) {
		console.log('Logger action');
		next(); 
	});
			
	//  Route for Inventory API requests
	router.route('/inventory')
		// POST request to add an item to inventory
		.post(function(req, res) {
			var inventory = new Inventory(); 
			
			inventory.name = req.body.name;  //  Item name

			// save the item in inventory
			inventory.save(function(err) {
				//  Check for errors
				if (err)
					res.send(err);

				res.json({ message: 'inventory created!' });
			});
		})
		 
		// GET request for all inventory items
		.get(function(req, res) {
			Inventory.find(function(err, inventoryItems) {
				if (err)
					res.send(err);
				
				res.json(inventoryItems);
			});
		});

		
	// on routes that end in /inventory/:part_id
	// ----------------------------------------------------
	router.route('/inventory/:part_id')
		// get the part ID for a single part in inventory
		.get(function(req, res) {
			inventory.findById(req.params.part_id, function(err, inventory) {
				if (err)
					res.send(err);
				res.json(inventory);
			});
		})
		
		// update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:part_id)
		.put(function(req, res) {
			// use our bear model to find the bear we want
			inventory.findById(req.params.part_id, function(err, inventory) {

				if (err)
					res.send(err);

				inventory.name = req.body.name;  // update the bears info

				// save the bear
				inventory.save(function(err) {
					if (err)
						res.send(err);

					res.json({ message: 'Inventory updated!' });
				});
			});
		});
}




