var express = require('express');
var router = express.Router();
var ctrlCharacters = require('../controllers/characters.controllers.js');

// Map controller to route
router
    .route('/characters')
    .get(ctrlCharacters.charactersGetAll);

router
    .route('/characters/:id')
    .get(ctrlCharacters.charactersGetOne);

module.exports = router;
