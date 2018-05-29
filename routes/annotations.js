var express = require('express');
var router = express.Router();
const annotationService = require('../services/annotationService');


/* List all annotations. */
router.get('/', function(req, res, next) {	
	annotationService.list().then(function(rows) {
		res.send(rows);
	}).catch(function(err) {
		console.error(err);
		res.status(500).send(err);
	});
});


/* Create a single annotation */
router.post('/', function(req, res, next) {	
	if(!req.body['user'] || !req.body["annotation"] || !req.body["sentencePair"] || !req.body["sentencePair"]["id"] ) {
		res.status(500).send("User, annotation value and sentence pair must be specified.");
		return;
	}
	
	annotationService.create(req.body['user'],req.body["annotation"],req.body["sentencePair"]["id"]).then(function(annotation) {
		res.status(200).send(annotation);
	})
	.catch(function(e) {
		res.status(500).send(e);						
	});

});

/* Delete a single annotation */
router.post('/:id/delete', function(req, res, next) {	
	if(!req.params["id"]) {
		res.status(500).send("ID must be provided.");
		return;
	}
	
	annotationService.del(req.params["id"])
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

module.exports = router;
