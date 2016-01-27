var express =   require("express");
var multer  =   require('multer');
var app     =   express();
var mongoose = require('mongoose');
var config = require("./config/config");
var jade = require("jade");
var util = require('util');
var glob = require("glob");
var PythonShell = require("python-shell");
var fs = require('fs');
var cors = require('./cors');


app.use(cors());


mongoose.connect(config.db);

var db = mongoose.connection;
db.on('error', function () {
	throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
	require(model);
});


var NcFile = mongoose.model("NcFile");

function render(res, file, options){
	res.send(jade.renderFile("app/views/" + file, options));
}

function JSONFileName(path){
	var fileName = path.replace(/^.*[\\\/]/, '');
	fileName = fileName.substr(0, fileName.lastIndexOf(".")) + ".json";
	return fileName;
}

var storage =   multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './data/nc');
	},
	filename: function (req, file, callback) {
		callback(null,  Date.now() + file.originalname);
	}
});
var upload = multer({ storage : storage}).single('ncFile');

app.get('/',function(req,res){
	res.sendFile(__dirname + "/index.html");
});

app.get('/home', function(req, res){
	render(res, "index.jade", {title:"Home"});
});

app.get('/entries', function(req, res){
	NcFile.find(function (err, entries) {
		if (err){render(res, "error.jade", {message: "An error has occured.", error: err});}
		else if(entries.length!=0){render(res, "entries.jade", {title:"Entries", entries: entries});}
		else{ render(res, "message.jade", {title:"No entries", message: "There doesn't appear to be any entries..."})}
	});

});

app.get('/entry/:entryId', function(req, res){
	NcFile.find({_id: req.params.entryId}, function (err, entry){
		if(err) render(res, "error.jade", {message: "Error finding record", error: err});
		else{
			render(res, "entry.jade", {title:"Entry found", entry: entry[0]});
			}
		});
});

app.get('/entry/:entryId/json', function(req, res){
	NcFile.find({_id: req.params.entryId}, function (err, entry){
		if(err) render(res, "error.jade", {message: "Error finding record", error: err});
		else{
			res.sendFile(config.root + "/" + entry[0].jsonloc);
			}
		});
});


app.get('/upload', function(req, res){
	render(res, "upload.jade", {title:"Upload"});
});


app.post('/upload',function(req,res){

	upload(req,res,function(err) {
		if(err) {
			console.log(err);
			return res.end("Error uploading file. Check the console.");
		}

		var file = req.file;

		console.log((file.path));

		PythonShell.run('mk_json.py', {args: [file.path]}, function(err, success){
			if(err) render(res, "error.jade", {message: "Error while converting to JSON.", error: err});
			else{
				fs.writeFile(config.root + "/data/json/" + JSONFileName(file.path), success[0].replace(/'/g, '"'), function(err) {
					if(err) {
						return console.log(err);
					}

					var entry = new NcFile({title:file.originalname, uploader:req.body.uploader, desc:req.body.desc, loc:file.path, jsonloc:"data/json/" + JSONFileName(file.path)});

					entry.save(function(err, entry){
						if (err) render(res, "error.jade", {message: "An error has occured.", error: err});
						res.redirect("/entry/" + entry.id);
					});

				});
			}
		});


	});
});


app.get("/visualize", function (req, res) {
	render(res, "visualize.jade", {});
});

app.use(express.static('public'));

app.listen(5000,function(){
	console.log("Working on port 5000");
});
