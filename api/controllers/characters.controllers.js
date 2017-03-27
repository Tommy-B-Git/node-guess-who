var dbconn = require('../data/dbconnection.js');
var ObjectId = require('mongodb').ObjectId;
var characterData = require('../data/characters.json');

module.exports.charactersGetAll = function(req, res) {

    var db = dbconn.get();

    var collection = db.collection('characters');
    // Get the documents from the collection
    // Need to use to Array() as its only a curson if you dont
    collection
        .find()
        .toArray(function(err, docs) {
            console.log("Found characters!", docs);
            res
                .status(200)
                .json(docs);
        });

    //console.log('db', db);
    //console.log("GET the Characters");
    //console.log(req.query);
    res
        .status(200)
        .json(characterData);
};

module.exports.charactersGetOne = function(req, res) {
    var db = dbconn.get();
    var collection = db.collection('characters');
    var characterId = req.params.characterId;

    console.log("GET characterId", characterId);

    collection.findOne({}, function(err, doc) {
        res
            .status(200)
            .json(doc);
    });

};
