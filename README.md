# InventoryManagement Web Application
This is an inventory management web application for use by a Reddit user.  The application is structured around the MEAN stack (MongoDB, Express, Angular.js, Node.js).

The following items should be installed before running the InventoryApplication:
- MongoDB (https://www.mongodb.org/downloads) if running a local copy of an inventory datastore.  If a cloud service is being used then this step is optional.
- Node.js (http://nodejs.org/download/) for the server platform for the web application.
- Express (installed via "npm install express" command after installing Node.js) for the web framework.
- Angular.js (packaged with the InventoryManagement application) for the frontend framework.

# Configuring the Database
* TBD

# Running the Application
* Configure the MongoDB database using the above steps.
* Move the code files to the server that will house the Inventory Application.  Note the server IP address.  
* Edit the server.js file "port" variable to the desired port that users will access the application.  (Default is 8080)
* Edit the MongoDB connection properties in the config/db.js configuration file to match the properites from the database configuration above.
* From the command line, run the server.js file in the main InventoryManagement directory using node.
```
    node server.js
```
* In a browser, traverse to the server IP address:port configured above.  

