// MODULES =================================================
var express        	= require('express');
var app            	= express();
var bodyParser     	= require('body-parser');
var methodOverride 	= require('method-override');
var mongoose 		= require('mongoose');
var db 				= require('./config/db');  //  Database configuration

// Use bodyParser() to get information from POST
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override')); 
app.use(express.static(__dirname + '/public')); 

// CONFIGURATION ===========================================

// connect to our mongoDB database 
mongoose.connect(db.url);  //  mongoDB database  

// ROUTES ==================================================
var router = express.Router();         
require('./app/routes/inventory.model.route')(router); // configure routes for the inventory model
app.use('/api', router);

require('./app/routes/routes')(app); // configure our routes

// set the static files location /public/img will be /img for users

// START APPLICATION =====================================
// startup our app at http://localhost:8080
var port = process.env.PORT || 8080; 
app.listen(port);               
console.log('Use port ' + port + ' to connect to this server');

// expose app           
exports = module.exports = app; 