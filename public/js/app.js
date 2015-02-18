/*
Name:
	app.js
	
Description:
	Defines the main application module for the Inventory Management application along with all application
	dependencies.

Author:
	Tim "KetsuN" Butler
*/

angular.module('InventoryApplication', ['ngRoute', 'appRoutes', 'HomeCtrl', 'QueryCtrl', 'QueryService', 'AddCtrl', 'AddService']);
