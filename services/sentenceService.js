
function SentenceService(sentenceEmbeddingService) { 

  this.ids = [];

  this.get = function(id) { 
    return knex("sentences").where("id","=",id);
  }

  this.delete = function(id) {
  	return get(id).del();
  }
  
  this.deleteAll = function(id) {
  	return knex("sentences").del();
  }
  
  this.list = function() {
  	return knex.select("*").from('sentences');
  }
  
  this.seed = function(srcFile, batchSize) { 
  
    var sentences = [];
    var lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(srcFile)
    });
  
    lineReader.on('line', function (line) {
      var split = line.split("(\.|\n|\t)");
      if(split.length > 0) {
        for(int i = 0; i < split.length; i++) { 
          sentences.push({"text":split[i]});  
        }
      }
  
      if(sentences.length > batchSize) {
        knex("sentences").batchInsert(sentences);      
        sentences = [];
      }
  
    });
  
  }
  
  this.sample = function() { 
    if(typeof(this.ids) === "undefined") {
      this.ids = knex("sentences").select("id");
    }
    var rnd_id = this.ids[Math.floor(Math.random() * this.ids.length)];
    var rnd = this.get(rnd_id);

    var sample_id = require('sentenceEmbeddingService').sampleNearest(rnd_id);
    var sample = get(sample_id);
    return { "sentence0" : { "id": rnd_id, "text" : rnd.text },
              "sentence1" : { "id": sample_id, "text" : sample.text }};
  }
  
}


module.exports = SentenceService; 
