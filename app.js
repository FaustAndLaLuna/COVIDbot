const https = require('https');
const http = require('http');
const fs = require('fs');

global.ISWORKING = false;
global.ISDEV = false;
ISDEV = true;
//ISDEV is currently NOT used
var redirect = "/";

var createError 		= require('http-errors');
var express 			= require('express');
var path 				= require('path');
var cookieParser 		= require('cookie-parser');
var logger 				= require('morgan');
const encodeMod 		= require('./serverSideModules/encode');
const encodeAudioMod 	= require('./serverSideModules/encodeAudio');
const transcriptMod		= require('./serverSideModules/transcript');
var CronJob 			= require('cron').CronJob;
var mysql 				= require('mysql');
//const job = CronJob('* * * * * *', encodeMod.encodeCron);
const job = new CronJob('1-59/2 * * * * *', encodeMod.encodeCron);
const job2 = new CronJob('1-59/2 * * * * *', encodeAudioMod.encodeCron);
job.start();
job2.start();
//const transJob = new CronJob('*/2 * * * * *', transcriptMod.transcriptionCron);
//transJob.start();
var passport 			= require('passport');
var flash 				= require('connect-flash');
var session 			= require('express-session');
var cookieParser 		= require('cookie-parser');
const { connect } = require('http2');

express.static.mime.define({'text/html':['mem']});

var app = express();
console.log("+++++++++++++++++++++++++++++++++++");
console.log("===================================");
console.log("===================================");
console.log("+++++++++++++++++++++++++++++++++++");

require('./middleware/passport.js')(passport);
//IMPORTANT LINE;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.enable("trust proxy");
//**********************************CHANGE FOR HTTPS */
// app.use(function(req, res, next){
// 		if (!req.secure) {
// 			return res.redirect('https://' + req.get('host') + req.url);
// 		}
// 		next();
// });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './public'), {dotfiles: 'allow'}));
app.use('/thumbs', express.static(path.join(__dirname, './public/thumbs')));

app.use(flash());
app.use(cookieParser());
app.use(session({
	secret: "genericnonrandomstring",
	saveUninitialized: true,
	resave: true,
	cookie: {secure: true, httpOnly: false, path: '/', maxAge: 259200000}
}));
app.use(passport.initialize());
app.use(passport.session());



app.use(function(req,res,next){
	cookies = req.cookies;
	Object.setPrototypeOf(cookies, {});
	if(cookies.hasOwnProperty("redirect")){
		redirectCookie = cookies.redirect;
		req.session.returnTo = redirectCookie.lastAddress;
		var curr = redirectCookie.currAddress.toLowerCase();
		if(!(curr === "/login.html" || curr === "/signup.html" || curr === "/login" || curr === "/signup"))
			redirectCookie.lastAddress = redirectCookie.currAddress;
	}
	else {
		redirectCookie = {};
	}
	redirectCookie.currAddress = req.url;
	res.cookie("redirect", redirectCookie);
	req.responseObj = {isLoggedIn:false};
	if(req.isAuthenticated()){
		req.responseObj.user = req.user;
		req.responseObj.isLoggedIn = true;
	}
	next();
});
	
require('./routes/routes.js')(app, passport);
//IMPORTANT LINE;
//IMPORTANT everything under this function will be login dependent.
/*
app.use(function(req, res, next){
	req.responseObj.isLoggedInFlag = true;
	if(req.responseObj.isLoggedIn)
		next();
	else res.redirect('/login.html');
});
 */
//require('./routes/routesLogIn.js')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//***********REMOVE FOR HTTPS */

http.createServer(app).listen(80);

//****************REMOVE COMMENTS FOR HTTPS */

// https.createServer({
// 	key:fs.readFileSync('/etc/letsencrypt/live/cobot19.com/privkey.pem'),
// 	cert:fs.readFileSync('/etc/letsencrypt/live/cobot19.com/cert.pem'),
// 	ca:fs.readFileSync('/etc/letsencrypt/live/cobot19.com/chain.pem')
// },app).listen(443);


module.exports = app;
