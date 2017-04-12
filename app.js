// Require in db conncetion string
require('./api/data/dbconnection.js').open();
var express = require('express');
// Instantiate Express
var app = express();
// Get node module to handle static file paths
var path = require('path');

// Grab the routes folder
var routes = require('./api/routes');

// application variable 'port' set to 3000
app.set('port', 3000);

// Logging function - shows all asset requests in terminal
// First param '/css' can be changed to only log whatever dir you want
app.use('/css', function(req, res, next){
	console.log(req.method, req.url);
	next();
});

//Define static folder - it looks for index.html
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', routes);

// assign app.listen to a var to be able to access it's methods i.e. 'port'
var server = app.listen(app.get('port'), function() {
    var port = server.address().port;
    console.log('Magic happens on port ' + port);
});
