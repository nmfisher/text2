const labelService = require('../services/labelService');
const fs = require('fs');
const recursive = require("recursive-readdir");
const path = require('path');


var getStream = function(id) {
	return this.load(id).then((file) => {
		return [file, fs.createReadStream(file.filepath)];
	});
}

var addLabel = function(id, labelName) {
	var file = load(id);
	return knex.first("id")
		.from('labels')
		.where('name',labelName).then(function(label_row) {
			if(typeof(label_row) === "undefined") {
				throw new Error("Label not found");
			}
			return file.then(function(file_row) {
				if(typeof(file_row) === "undefined") {
					throw new Error("File not found under filepath: " + filepath);
				}
				return knex.table('file_labels')
					.insert({id: null, label_id: label_row.id, file_id:file_row.id});
			});
		});
}
	
var removeLabel = function(id, labelName) {
	var file = load(id);
	return knex.first("id")
		.from('labels')
		.where('name',labelName).then(function(label_row) {
			return file.then(function(file_row) {
						return knex.table('file_labels')
									.where('label_id','=', label_row.id)
									.andWhere('file_id', '=', file_row.id).del();
					});
		});
}
	
var removeAllLabels = function() {
	return knex("file_labels").select("*").del();
}

var insertIfNull = function(filepath) {	
	return knex.table('files')
		.select('id')
		.where('filepath',filepath)
		.then(function(row) {		
			if(row.length == 0) {
				return knex.table('files')
					.insert({id:null, filepath:filepath, filename: filepath.split(path.sep).pop(), complete: false, corrupt: false })
			}
		});
}
var recurseDir = (dir, cb) => {
	 fs.readdirSync(dir).forEach((file) => {
		if (fs.statSync(dir + file).isDirectory()) {
			recurseDir(dir + file + path.sep, cb);
		} else {
			cb(dir + file, file);
		}
    });
};	 

var init = function() {
  console.log("Initializing file service...");
	var fileService = this;
  if(typeof(global.baseDir) != "undefined" && typeof(global.baseDir) != null) {
    console.log("Reading files from input directory : " + global.baseDir);
   	recurseDir(global.baseDir + path.sep, (filepath, filename) => {
        if(typeof(global.inputFileRegex) == "undefined" || global.inputFileRegex.test(filename)) {
            console.log(filename);
         	fileService.insertIfNull(filepath);
        }
    });
  } else {
    console.log("No directory specified for direct file input, skipping...");
  }
}

var list = function() {
	return knex.table("files").select('*');
}

var listComplete = function() {
	return knex.table("files").select('*').where('complete','=',true).orWhere('corrupt','=',true);
}

var listIncomplete = function() {
	return knex.table("files").select('*').where('complete','!=',true).andWhere('corrupt','!=',true);
}

var listLabelled = function(callback) {
	var fileService = this;
	return knex("files").select('*').where('id','IN', knex("file_labels").select('file_id as id')).map(function(file) {
		return fileService.getLabels(file.id).then(function(labels) {
			file.labels = labels;
			return file;
		});
	})
}

var listUnlabelled = function(callback) {
	return knex("files").select('*').where('id','NOT IN', knex("file_labels").select('file_id as id'));
}

var load = function(id) {
	return knex("files").select('*').where('id','=', id).then((files) => { return files[0] });
}

var markComplete= function(id) {
    return knex("files").where('id','=', id).update({ complete: true });
}

var markIncomplete= function(id) {
    return knex("files").where('id','=', id).update({ complete: false });
}

var markCorrupt = function(id) {
    return knex("files").where('id','=', id).update({ corrupt: true });
}

var markIncorrupt = function(id) {
    return knex("files").where('id','=', id).update({ corrupt: false });
}

var getLabels = function(id) {
	return knex('files').join('file_labels', "files.id", '=', "file_labels.file_id")
						.join('labels','labels.id', '=','file_labels.label_id')
						.select('labels.id','labels.name')
						.where('files.id', id)
}

var normalizeFilename = function (filename) {
	return filename.replace(/(..)\\\//g,"");
}

module.exports = {
	addLabel: addLabel,
	getLabels: getLabels,
	getStream: getStream,
	init: init,
	list: list,
    listComplete: listComplete,
    listIncomplete: listIncomplete,
	listLabelled: listLabelled,
	listUnlabelled: listUnlabelled,
	load: load,
    markCorrupt:markCorrupt,
    markIncorrupt:markIncorrupt,
    markComplete:markComplete,
    markIncomplete:markIncomplete,
	insertIfNull: insertIfNull,
	removeLabel: removeLabel,
	removeAllLabels: removeAllLabels
}
