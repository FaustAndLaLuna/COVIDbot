var express = require('express');
var router = express.Router();
var path = require('path');
var uuidv4 = require('uuid/v4');
var fs = require('fs');
var formidable = require('formidable');
var mkdirp = require('mkdirp');
var videosRepo = require('../conn/videosRepo');

var vidTable = new videosRepo();

//<p><%= vid.title%><br><%= vid.description%><br><%= vid.tags%><br><%= vid.linkedObj%><br><%= vid.createdAt%></p>
router.post('/', function(req, res, next){
	filePath = uuidv4();
	filePath = "/" + filePath.slice(0,1) + "/" + filePath.slice(1,2) + "/" + filePath.slice(2,3) + "/" + filePath.slice(3,4) + "/";
	videoFilePath = "./uploads" + filePath;
	thumbFilePath = "./public/thumbs" + filePath;
	mkdirp.sync(videoFilePath);
	mkdirp.sync(thumbFilePath);
	formObject = {uploadDir: videoFilePath, keepExtensions: true};
	var form = new formidable.IncomingForm(formObject);
	form.on('error', function(err){
		console.log("Couldn't upload file because of: \n" + err);
		next(createError(500));
	});
	form.onPart = function(part){
		if((!part.filename) || part.filename.match("^video/")){
			form.handlePart(part);
		} else {
			res.write("<h1>ERROR, el archivo es del tipo incorrecto.</h1>");
			return;
		}
	};
	form.parse(req, function(err, fields, files){
		user = JSON.parse(fields.user);
		obj = JSON.parse(fields.obj);
		if(err){
			console.log(err);
		}
		for(var key in files){
			file = files[key];
			if(! file.type.match("^video/")){
				fs.unlink(file.path, function(err){
					if(err){
						console.log(err);
					}
				});
				res.write("<h2>Tipo de archivo incorrecto!</h2> <br> <h1>Intenta subir un video</h1>");
				res.end();
				return;
			}
			else{
				vidTable.createAssociated("SIN URL", "./"+file.path, user.id, obj.objectID, fields.description, fields.title, fields.tags);
				res.redirect("/success.html");
			}
		}
	});
});






module.exports = router;