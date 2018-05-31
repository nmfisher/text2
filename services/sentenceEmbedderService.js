
function SentenceEmbedderService(modelPath) {

  this.numSamples = 10000;
  this.topK = 5;
  
  var createKDTree = require("static-kdtree");
  
  this.embed = function(sentence) {
    var words = sentence.text.split(" ");
    var words_ = [];
    for(var j = 0; j < words.length; j++) {
      if(words[j].length > 0) {
        words_.push(words[j]);
      }
    }
    var vectors = this.model.getVectors(words_);
    if(vectors.length == 0)
      return null;
    var embedding = null;
    for(var i = 0; i < vectors.length; i++) { 
      if(embedding == null) {
        embedding = vectors[i];
      } else {
        embedding = vectors[i].add(embedding);
      }
    }

    for(var i = 0; i < embedding.values.length; i++) {
      embedding.values[i] /= vectors.length;
    }
    return embedding;
  }

  this.db_to_embedding = function(row) { 
      if(typeof(row) === "undefined") {
        return null;
      }
      var embedding = [];
      var values = row["embedding"].split(" ");
      for(var i= 0; i < values.length; i++) { 
        var floatVal = parseFloat(values[i]);
        embedding.push(floatVal);
      }
      return { sentence_id : row["sentence_id"], embedding: embedding };
  }

  this.get = function(id) { 
    var service = this;
    return knex("embeddings").where("sentence_id", "=", id).then(function(res) {
      console.log(res);
      return service.db_to_embedding(res[0]);
    });
  }

  this.toString = function(embedding) { 
    var embeddingString = "";
    for(var i = 0; i < embedding.values.length; i++) { 
      embeddingString += embedding.values[i] + " ";
    }
    embeddingString = embeddingString.replace(/ $/, "");
    return embeddingString;
  }

  this.batchInsert = function(sentences) {
    var batchSize = 500;
    var embeddings = [];
    var statement = "";
    var num = 0;
    for(var i = 0; i < sentences.length; i++) { 
      var sentence = sentences[i];
      var embedding = this.embed(sentence);
      if(embedding != null) { 
        var embeddingString = this.toString(embedding);
        statement = "INSERT INTO embeddings(sentence_id, embedding) VALUES(" + sentence.id + ",'"+ embeddingString + "');";
        db.run(statement);
        num++;
      }
    }
    console.log("Completed " + num + " rows");
  }

  this.sampleNearest = function() { 
    var service = this;

    return knex.raw("SELECT * FROM embeddings ORDER BY RANDOM() LIMIT 1").then(function(base) {
      base = service.db_to_embedding(base[0]);
      return knex.raw("SELECT * FROM embeddings ORDER BY RANDOM() LIMIT " + service.numSamples).then(function(rows) {
        var points = [];
        var embeddings = [];

        for(var i = 0; i < rows.length; i++) { 
          var embedding = service.db_to_embedding(rows[i]);
          embeddings.push(embedding);
          points.push(embedding["embedding"]);
        }
        var tree = createKDTree(points);
        console.log(tree);
        var knn = tree.knn(base.embedding, service.topK);
        console.log(knn);
        var nearest = knn[Math.floor(Math.random() * knn.length)];
        console.log(nearest);
        return { "base_id" : base["sentence_id"], "nearest_id" : embeddings[nearest]["sentence_id"] };
      });
    });
  }
}

module.exports = SentenceEmbedderService; 

