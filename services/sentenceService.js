
function SentenceService() { 

  this.ids = [];
  this.min_sentence_length = 10;

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

  this.batchInsert = function(sentences) { 
    knex.batchInsert("sentences",sentences)
    .then(function(ids) {
      console.log("Batch insert complete");
    }).catch(function(error) { 
      throw error;
    });      
  }
  
  this.seed = function(srcFile, batchSize) { 
  
    var sentences = [];
    var lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(srcFile)
    });
    var lineNum = 0;
    var min_sentence_length = this.min_sentence_length;
  
    var service = this;

    return lineReader.on('line', function (line) {
      var split = line.split(/(\.)/);
      if(split.length > 0) {
        for(var i = 0; i < split.length; i++) { 
          if(split[i].length > min_sentence_length) {
              sentences.push({"text":split[i].replace("'","")});  
                if(sentences.length > batchSize) {
                  service.batchInsert(sentences);
                  sentences = [];
                }
          }
        }
      }
      if(lineNum % 500 == 0) {
        console.log("Line " + lineNum + " completed.");
      }
      lineNum++;
    });
  }

  this.random = function() { 
    service = this;
    var get_random = function() { 
      var id = service.ids[Math.floor(Math.random() * service.ids.length)];
      console.log("Returning random sample at id : " + id);
      return service.get(id);
    };

    if(typeof(this.ids) === "undefined" || this.ids.length == 0) {
      console.log("Rebuilding ID index");
      return knex("sentences").select("id").then(function(res) {
        service.ids = Object.keys(res);
        return get_random()
      });
    } else {
      return get_random();
    }
  }
}


module.exports = SentenceService; 
