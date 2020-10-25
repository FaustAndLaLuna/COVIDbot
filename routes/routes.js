//Routes for stuff
var path = require('path');

var videoRouter 	= require('./video.js');
var vidPlayerRouter = require('./vidPlayer.js');
var recuerdosRouter = require('./recuerdos.js');
var uploadRouter 	= require('./upload.js');
var uploadAudioRouter 	= require('./uploadAudio.js');
var recordRouter 	= require('./record.js');
var questionsRouter	= require('./questions.js');

module.exports = function(app, passport){
	
	//app.use("/", indexRouter);
	
	app.use('/uploads', videoRouter);
	app.use('/vid', vidPlayerRouter);
	
	app.use('/upload', uploadRouter);
	app.use('/uploadAudio', uploadAudioRouter);
	app.use('/videos.html', recordRouter);

	app.use("/archivos", recuerdosRouter);
	app.use("/videos", recordRouter);

	app.use("/questions", questionsRouter);
	
	//Routers: Return all questions and answers.
	//Ask a question
	//Answer a question and send a mail
}




