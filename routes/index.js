var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var files = fileService.listIncomplete().then(function(rows) {
		res.render('index', { unlabelled: rows });	
	})
  
});

module.exports = router;
