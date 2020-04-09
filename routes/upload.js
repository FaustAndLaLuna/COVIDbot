var express = require('express');
var router = express.Router();
var path = require('path');
var uuidv4 = require('uuid/v4');
var fs = require('fs');
var formidable = require('formidable');
var mkdirp = require('mkdirp');
var videosRepo = require('../conn/videosRepo');

var vidTable = new videosRepo();

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '2020covid19@gmail.com',
    pass: 'cobot19cineautomatico'
  }
});

//<p><%= vid.title%><br><%= vid.description%><br><%= vid.tags%><br><%= vid.linkedObj%><br><%= vid.createdAt%></p>
router.post('/', function(req, res, next){
	//TODO: Add userID and objectID.
	filename = uuidv4();
	thumbFolder = "/"+ filename.slice(0,1)+"/"+filename.slice(1,2)+"/"+filename.slice(2,3)+
				"/"+filename.slice(3,4)+"/";
	thumbName = filename.slice(4) + ".png";
	filename = thumbFolder + filename.slice(4);
	filePath = path.resolve('./uploads'+filename+".webm");
	convFilePath = path.resolve('./uploads'+filename+".mp4");
	mkdirp(path.dirname(filePath), function (err){
		if(err)
			console.log(err);
		mkdirp(path.dirname(filePath.replace("uploads", "public/thumbs")), function (err){
			if (err)
				console.log(err);

			fs.writeFile(filePath, '', function (err){
				if(err)  console.log(err);
				fTypeCheck = "";

				var form = new formidable.IncomingForm();
				form.on('fileBegin', function (name, file){
					file.path = filePath;
					fTypeCheck = file.type;
				}.bind({filename:filename, thumbFolder:thumbFolder, filePath:filePath, convFilePath:convFilePath}));
				form.on('error', function(err){
					console.log('An error has occurred uploading a file:\n ' + err);
				});
				form.parse(req, function(err, fields, files){
					console.log(fTypeCheck);
					if(!fTypeCheck.match("^video/")){
						fs.unlink(filePath, function(err){
							if(err){
								console.log(err);
							}
						});
						res.write("<h2>Tipo de archivo incorrecto!</h2> <br> <h1>Intenta subir un video</h1>");
						res.end();
						return;
					}
					let filePath = this.filePath;
					vidTable.createAssociated("SIN URL", filePath, fields.user, fields.email, fields.coords);

					var mailOptions = {
						from: '2020covid19@gmail.com',
						to: fields.email,
						subject: 'Video recibido !',
						text: 'El video que nos enviaste fue subido con éxito! \n\r Gracias por ser parte de nuestro proyecto!'
					};

					transporter.sendMail(mailOptions, function(error, info){
						if (error) {
							console.log(error);
						} else {
							console.log('Email sent: ' + info.response);
						}
					});

					res.redirect("/gracias.html");
					res.end();
					console.log(files);
					console.log(fields);
				}.bind({filename:filename, thumbFolder:thumbFolder, filePath:filePath, convFilePath:convFilePath}));
			}.bind({filename:filename, thumbFolder:thumbFolder, filePath:filePath, convFilePath:convFilePath}) );
		}.bind({filename:filename, thumbFolder:thumbFolder, filePath:filePath, convFilePath:convFilePath}) );	
	}.bind({filename:filename, thumbFolder:thumbFolder, filePath:filePath, convFilePath:convFilePath}) );
});






module.exports = router;