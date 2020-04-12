//Routes for stuff
var path = require('path');
var indexRouter 	= require("./index.js");
var uploadRouter 	= require('./upload.js');
var uploadAltRouter = require('./uploadAlternative.js');
var videoRouter 	= require('./video.js');
var vidPlayerRouter = require('./vidPlayer.js');
var contactPostRouter = require('./contacto.js');
var objectRouter = require('./object.js');
var recuerdosRouter = require('./recuerdos.js');
var sell = require('./sell.js');
// var biographyRouter = require('./biography.js');
var uploadRouter 	= require('./uploadAlt.js');
// var adminRecord 	= require("./adminRecord.js");
// var sellAdmin		= require("./sellAdmin.js");
var uploadRouter 	= require('./upload.js');
var recordRouter 	= require('./record.js');

module.exports = function(app, passport){
	
	//app.use("/", indexRouter);
	
	app.use('/uploads', videoRouter);
	app.use('/vid', vidPlayerRouter);
	
	app.use('/upload', uploadRouter);
	app.use('/videos.html', recordRouter);

	app.use("/recuerdos.html", recuerdosRouter);
	app.use("/videos", recordRouter);

	app.use("/questions", questionsRouter);

	//Routers: Return all questions and answers.
	//Ask a question
	//Answer a question and send a mail
}




