var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var readlineSync = require('readline-sync');
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var fs = require('fs-extra');

/******* CLI ARGS **********************/
var argv = require('minimist')(process.argv.slice(2));

if ("help" in argv || "h" in argv) {
    console.log("Usage: " + __filename + " --db=/path/to/sqlitedb --sentence_file=/path/to/sentence/file --model_path=/path/to/w2v/model --input_dir=/path/to/dir/with/documents --file_regex=[regex_to_match_files]");
    process.exit(-1);
}

global.baseDir = argv.input_dir;

if(argv.file_regex) {
  global.inputFileRegex = new RegExp(argv.file_regex);
}

var dbPath = argv.db;
var defaultDbPath = (process.env.HOME || '').toLowerCase() + "/.text2/db.sql";

function promptDbPath() {
	while(true) {
		dbPath = readlineSync.question('Enter path to DB file: ');			
		if(dbPath) {
			break;
		}
	}
	return dbPath;
}

if(!dbPath) {
	while(true) {
		var useDefault = readlineSync.question('Path to SQLite DB file not provided - use default ('+defaultDbPath+')? [Y]es/[N]o/[A]bort ');
		
		if(useDefault.toLowerCase() === "a") {
			process.exit(-1);
		} else if (useDefault.toLowerCase() == "y") {
			dbPath = defaultDbPath;
			break;
		} else if (useDefault.toLowerCase() == "n") {
			dbPath = promptDbPath();
			break;
		}
	}
}

console.log("Using SQLite DB at " + dbPath);

if (fs.existsSync(dbPath)) {
	console.log("Found existing SQLite DB at " + dbPath);
} else { 
	console.log(dbPath + " does not exists, creating new SQLite DB...");
  var parentDir = require('path').dirname(dbPath);
  console.log("Checking for parent directory at " + parentDir);
  if(!fs.existsSync(parentDir)) {
    console.log("Parent directory does not exist, creating...");
    fs.mkdirSync(parentDir);
    console.log("Database directory created.");
  } else {
    console.log("Parent directory exists.");
  }
}

var app = express();

global.db = new sqlite3.Database(dbPath);

db.run('PRAGMA foreign_keys = ON');
db.exec("CREATE TABLE IF NOT EXISTS files (id INTEGER PRIMARY KEY, filepath TEXT UNIQUE NOT NULL, filename TEXT NOT NULL, complete BOOLEAN NOT NULL, corrupt BOOLEAN NOT NULL);\
        CREATE TABLE IF NOT EXISTS labels (id INTEGER PRIMARY KEY, name TEXT UNIQUE NOT NULL);\
        CREATE TABLE IF NOT EXISTS file_labels (id INTEGER PRIMARY KEY, file_id INTEGER,label_id INTEGER,FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE, FOREIGN KEY (label_id) REFERENCES labels(id) ON DELETE CASCADE, UNIQUE(file_id, label_id)); \
        CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT NOT NULL); \
        CREATE TABLE IF NOT EXISTS sentences (id INTEGER PRIMARY KEY, text TEXT NOT NULL); \
        CREATE TABLE IF NOT EXISTS embeddings (id INTEGER PRIMARY KEY, sentence_id INTEGER, embedding TEXT NOT NULL, FOREIGN KEY (sentence_id) REFERENCES sentences(id)); \
        CREATE TABLE IF NOT EXISTS annotations (id INTEGER PRIMARY KEY, sentence0_id INTEGER, sentence1_id INTEGER, annotation TEXT NOT NULL, FOREIGN KEY (sentence0_id) REFERENCES sentences(id), FOREIGN KEY (sentence1_id) REFERENCES sentences(id));", 
function(err) { 
  if(err != null) {
    throw(db_init_err = err);
  }
  
  var knex = require('knex')({
    dialect: 'sqlite3',
    connection: {
      filename: dbPath
    },
    useNullAsDefault: true,
  pool: {
      afterCreate: function (conn, cb) {
  		conn.run('PRAGMA foreign_keys = ON', cb);
  	}
    }
  });
  
  global.knex = knex;
  
  console.log("Database initialization complete.");
  
  /************ SERVICES *******/
  var fileService = require('./services/fileService');
  fileService.init();
  console.log("File service initialization complete.");
  
  var SentenceEmbedderService = require('./services/sentenceEmbedderService');
  var sentenceEmbedderService = new SentenceEmbedderService();

  var w2v = require( 'word2vec' )
  w2v.loadModel(argv.model_path, function(err, model) { 
    sentenceEmbedderService.model = model;
    console.log("Sentence embedder service initialization complete.");
    var SentenceService = require('./services/sentenceService');
    var sentenceService = new SentenceService(sentenceEmbedderService);
    console.log("Sentence service initialization complete.");
    
    if(typeof(argv.sentence_file) != "undefined") {
      console.log("Parsing file at " + argv.sentence_file + " to extract sentences.");
        if(sentenceService.list().length > 0) {
        console.log("INFO: Database is non-empty. If you have previously parsed the specified file into the database, you will end up with duplicate sentences. This is not a huge problem.");
      } 
      var seed_batch_size = 200; // the number of sentences after which a batch insert will be performed
    
      sentenceService.seed(argv.sentence_file, seed_batch_size).on('close', function() {
        console.log("Creating sentence embeddings...");
        sentenceService.list().then(function(sentences) {
          sentenceEmbedderService.batchInsert(sentences);
        }); 
     });
    }
  
    var annotationService = require('./services/annotationService');
    console.log("Annotation service initialization complete.");
  
    /************* ROUTES ********/
    
    var index = require('./routes/index');                                                                                             
    var files = require('./routes/files');
    var labels = require('./routes/labels');
    var sentences = require('./routes/sentences');
    sentences.sentenceEmbedderService = sentenceEmbedderService;
    sentences.sentenceService = sentenceService;
    var annotations = require('./routes/annotations');
    annotations.annotationService = annotationService;
     
    // view engine setup
    app.set('views', path.join(__dirname, 'frontend/dist') );
    app.set('view engine', 'ejs');
    app.engine ('html', require('ejs').renderFile );
    
    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static( path.join(__dirname, 'frontend/dist')));
    
    fs.copySync(path.resolve(__dirname,'./node_modules/bootstrap/dist/css/bootstrap.css'), './public/stylesheets/bootstrap.css');
    fs.copySync(path.resolve(__dirname,'./node_modules/bootstrap/dist/js/bootstrap.js'), './public/javascripts/bootstrap.js');
    fs.copySync(path.resolve(__dirname,'./node_modules/pdfjs-dist/build/pdf.min.js'), './public/javascripts/pdf.min.js');
    fs.copySync(path.resolve(__dirname,'./node_modules/pdfjs-dist/build/pdf.worker.min.js'), './public/javascripts/pdf.worker.min.js');
    
    app.use('/', index);
    app.use('/files', files);
    app.use('/labels', labels);
    app.use('/sentences', sentences);
    app.use('/annotations', annotations);
    
    
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });
    
    // error handler
    app.use(function(err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
    
      // render the error page
      res.status(err.status || 500);
      console.log(err);
      res.render('error');
    });
    
    console.log("Running on port " + app.get('port'));
  });
});

module.exports = app;


