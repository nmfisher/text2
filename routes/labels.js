var express = require('express');
var router = express.Router();
const labelService = require('../services/labelService');


/* List all labels. */
router.get('/', function(req, res, next) {	
	labelService.list().then(function(rows) {
		res.send(rows);
	}).catch(function(err) {
		console.error(err);
		res.status(500).send(err);
	});
});


/* Create a single label */
router.post('/', function(req, res, next) {	
	if(!req.body['name']) {
		res.status(500).send("Parameter name must not be empty.");
		return;
	}
	
	labelService.create(req.body['name']).then(function(label) {
		res.status(200).send(label);
	})
	.catch(function(e) {
		res.status(500).send(e);						
	});

});

/* Delete a single label */
router.post('/:id/delete', function(req, res, next) {	
	if(!req.params["id"]) {
		res.status(500).send("ID must be provided.");
		return;
	}
	
	labelService.del(req.params["id"])
				.then(function(deleted) {
					if(deleted == 0) {
						res.status(404).send("Label not found");
					} else {
						res.status(200).send('OK');
					}
				})
				.catch(function(e) {
					console.error(e);
					res.status(500).send({"error":e});						
				});

});

/* Delete all labels */
router.post('/deleteAll', function(req, res, next) {	
	labelService.delAll()
				.then(function(deleted) {
					if(deleted == 0) {
						res.status(404).send("No labels found");
					} else {
						res.status(200).send('OK');
					}
				})
				.catch(function(e) {
					console.error(e);
					res.status(500).send({"error":e});						
				});

});

/* Rename a single label */
router.post('/:id/rename', function(req, res, next) {	
	if(!(req.params["id"] && req.body["newName"])) {
		res.status(500).send("Label ID & new name must be provided.");
		return;
	}
	labelService.rename(req.params["id"], req.body["newName"]).then(function(renamed) {
					if(renamed == 0) {
						res.status(404).send("Label not found");
					} else {
						res.status(200).send('OK');
					}
				})
				.catch(function(e) {
					console.error(e);
					res.status(500).send({"error":e});						
				});

});

module.exports = router;
