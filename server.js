// MODULES =================================================
var express        	= require('express');
var app            	= express();
var bodyParser     	= require('body-parser');
var methodOverride 	= require('method-override');
var mongoose 		= require('mongoose');

// Use bodyParser() to get information from POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 


// CONFIGURATION ===========================================
var db = require('./config/db');

// connect to our mongoDB database 
mongoose.connect('mongodb://invenuser:invenpassword@ds045021.mongolab.com:45021/inventory'); 
app.use(methodOverride('X-HTTP-Method-Override')); 


// ROUTES ==================================================
require('./app/routes/inventory.model.route')(app); // configure our routes


// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public')); 


// START APPLICATION =====================================
// startup our app at http://localhost:8080
var port = process.env.PORT || 8080; 
app.listen(port);               
console.log('Use port ' + port + ' to connect to this server');

// expose app           
exports = module.exports = app; 