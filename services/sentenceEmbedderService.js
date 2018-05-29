
function SentenceEmbedderService(modelPath) {

  var createKDTree = require("static-kdtree");
  this.ids = {};
  this.vectors = [];
  this.initialize = function(sentences) {
    var w2v = require( 'word2vec' );
    w2v.loadModel(modelPath);
    for(int i = 0; i < sentences.length; i++) {
      var words = sentences[i].text.split(" ");
      var words_ = [];
      for(int j = 0; j < words.length; j++) {
        if(words[j].length > 0) {
          words_.push(words[j]);
        }
      }
      this.vectors.push(w2v.getVectors(words)); 
      this.ids[sentences[i].id] = this.ids.length;
    }
    this.tree = createKDTree(vectors);
  }

  this.sampleNearest = function(sentenceId) { 
    var vector = this.vectors[this.ids[sentenceId]];
    var num_sample = 20;
    var knn = this.tree.knn(vector, num_sample);
    return knn[Math.floor(Math.random() * num_sample)];
  }
}

module.exports = SentenceEmbedderService; 

