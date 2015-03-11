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
mongoose.connect(db.url);  //  mongoDB database 

// ROUTES ==================================================
var router = express.Router();         
require('./app/routes/inventory.model.route')(router); // configure routes for the inventory model
require('./app/routes/routes')(app); // configure our routes
app.use('/api', router);

// START APPLICATION =====================================
var port = process.env.PORT || 8080; 
app.listen(port);  //Listening on 8080               

// expose app           
exports = module.exports = app; 