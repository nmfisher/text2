var express = require('express');
var router = express.Router();
const fileService = require('../services/fileService');

/* GET file listing. */
router.get('/', function(req, res, next) {	
	fileService.list().then(function(rows) { 
		res.status(200).send(rows);
	});
});

router.get('/complete', function(req, res, next) {
	fileService.listComplete().then(function(rows) {
		res.send(rows);	
	}).catch(function(err) {
		console.error(err);	
		res.status(500).send(err);
	});	
});

router.get('/incomplete', function(req, res, next) {
	fileService.listIncomplete().then(function(rows) {
		res.send(rows);	
	}).catch(function(err) {
		console.error(err);	
		res.status(500).send(err);
	});	
});

router.post('/labels/remove', function(req, res, next) {
	fileService.removeAllLabels().then(function(removed) {
		if(removed == 0) {
			res.status(404).send("No labelled documents found.");
		} else {
			res.send(removed + " labels removed.");	
		}
	}).catch(function(err) {
		console.error(err);	
		res.status(500).send(err);
	});	
});



/* show file contents. */
router.get('/:id/display', function(req, res, next) {	
	if(!req.params["id"]) {
		res.status(500).send("id must be provided.");
		return;
	}
	
	try { 
		fileService.getStream(req.params["id"]).then((tuple) => {
			var file = tuple[0];
			var stream = tuple[1];			
			res.setHeader('Content-disposition', 'inline;filename='+file.filename);
			stream.pipe(res);
		});
	} catch(err) {
		console.error(err);
		res.status(500).send(err);
	}
});

/* GET file DB record. */
router.get('/:id', function(req, res, next) {	
	if(!req.params["id"]) {
		res.status(404).send("File ID not found");
		return;
	}
	
	fileService.load(req.params["id"]).then(function(row) {
		res.send(row)
	}).catch(function(e) {
		console.error(e)
	});
});

router.get('/:id/labels', function(req, res, next) {	

	if(!req.params["id"]) {
		res.status(500).send("Parameter id must not be empty.");
		return;
	}	
	fileService.getLabels(req.params["id"]).then(function(rows) {
		res.send(rows)
	}).catch(function(e) {
		console.error(e);
		res.status(500).send(e);
	});
});

router.post('/:id/labels/add', function(req, res, next) {
	
	if(!req.params["id"]) {
		console.error('No id provided.');
		res.status(500).send("Parameter id must not be empty.");
		return;
	} else if (!req.body["label_name"]) {
		console.error('No label name provided');
		res.status(500).send("Parameter label_name must not be empty.");
		return;
	}
	
	
	fileService.addLabel(req.params["id"], req.body["label_name"])
	.then(function() {
		res.status(200).send({status:"OK"});
	})
	.catch(function(e) {
		console.error(e);
		res.status(500).send(e);
	});
});		

router.post('/:id/complete', function(req, res, next) {
	
	if(!req.params["id"]) {
		console.error('No id provided.');
		res.status(500).send("Parameter id must not be empty.");
		return;
	} 
	
	fileService.markComplete(req.params["id"])
	.then(function() {
		res.status(200).send({status:"OK"});
	})
	.catch(function(e) {
		console.error(e);
		res.status(500).send(e);
	});
});		

router.post('/:id/incomplete', function(req, res, next) {
	
	if(!req.params["id"]) {
		console.error('No id provided.');
		res.status(500).send("Parameter id must not be empty.");
		return;
	} 
	
	fileService.markIncomplete(req.params["id"])
	.then(function() {
		res.status(200).send({status:"OK"});
	})
	.catch(function(e) {
		console.error(e);
		res.status(500).send(e);
	});
});		

router.post('/:id/corrupt', function(req, res, next) {

	if(!req.params["id"]) {
		console.error('No id provided.');
		res.status(500).send("Parameter id must not be empty.");
		return;
	} 
	try {
        fileService.markCorrupt(req.params["id"])
        .then(function() {
            res.status(200).send({status:"OK"});
        })
        .catch(function(e) {
            console.error(e);
            res.status(500).send(e);
        });
    } catch(err) {
        console.error(e);
    }
});		

router.post('/:id/incorrupt', function(req, res, next) {
	
	if(!req.params["id"]) {
		console.error('No id provided.');
		res.status(500).send("Parameter id must not be empty.");
		return;
	} 
	
	fileService.markIncorrupt(req.params["id"])
	.then(function() {
		res.status(200).send({status:"OK"});
	})
	.catch(function(e) {
		console.error(e);
		res.status(500).send(e);
	});
});		

router.post('/:id/labels/remove', function(req, res, next) {
	
	if(!req.params["id"]) {
		console.error('No id provided.');
		res.status(500).send("Parameter id must not be empty.");
		return;
	} else if (!req.body["label_name"]) {
		console.error('No label name provided');
		res.status(500).send("Parameter label_name must not be empty.");
		return;
	}
	
	
	fileService.removeLabel(req.params["id"], req.body["label_name"])
	.then(function() {
		res.status(200).send({status:"OK"});
	})
	.catch(function(e) {
		console.error(e);
		res.status(500).send(e);
	});
});		

module.exports = router;
