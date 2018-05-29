var express = require('express');
var router = express.Router();
const sentenceService = require('../services/sentenceService');

/* Get a random sentence pair. */
router.get('/sample', function(req, res, next) {	
	sentenceService.sample().then(function(rows) {
		res.send(rows);
	}).catch(function(err) {
		console.error(err);
		res.status(500).send(err);
	});
});


module.exports = router;
