// Require in MongoClient
var MongoClient = require('mongodb').MongoClient;

// Build connection string - protocol://server&port/db-name
var dburl = 'mongodb://localhost:27017/guessWho';

var _connection = null;

var open = function() {
    MongoClient.connect(dburl, function(err, db) {
    	// Error handling
        if (err) {
            console.log("DB connection failed!");
            return;
        }
        // Set _connection
        _connection = db;
        console.log("DB connection open!", db);
    });
};

var get = function() {
    return _connection;
};

module.exports = {
    open: open,
    get: get
};
