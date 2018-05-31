var express = require('express');
var router = express.Router();

/* Get a random sentence pair. */
router.get('/sample', function(req, res, next) {
  console.log("Sampling sentence pairs...");	
  router.sentenceEmbedderService.sampleNearest().then(function(pair) {
      console.log("Nearest : " + pair);
      router.sentenceService.get(pair.base_id).then(function(base) {
        router.sentenceService.get(pair.nearest_id).then(function(nearest) {
          res.send({ 
            "sentence0" : base[0],
            "sentence1" : nearest[0] 
          });
        });
      });
    });
});

module.exports = router;
