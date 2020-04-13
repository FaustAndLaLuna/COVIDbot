var express = require('express');
var router = express.Router();

var videosRepo = require('../conn/QandA');

var questionsRepo = new videosRepo();

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '2020cobot19@gmail.com',
    pass: 'cobot19cineautomatico'
  }
});

// var mailOptions = {
// 	from: '2020cobot19@gmail.com',
// 	to: fields.email,
// 	subject: 'Video recibido !',
// 	text: 'El video que nos enviaste fue subido con éxito! \n\r Gracias por ser parte de nuestro proyecto!'
// };
// transporter.sendMail(mailOptions, function(error, info){
// 	if (error) {
// 		console.log(error);
// 	} else {
// 		console.log('Email sent: ' + info.response);
// 	}
// });

//<p><%= vid.title%><br><%= vid.description%><br><%= vid.tags%><br><%= vid.linkedObj%><br><%= vid.createdAt%></p>
router.get('/', function(req, res, next){
	QandA.getRandomUnanswered(2).then((result) => {
		if(result !== "undefined"){
			QandA.getRandom(3 - result.length).then( (r) => {
				res.end(JSON.stringify([...result, ...r]));
			});
		}
		else{
			QandA.getRandom(3).then( (r) => {
				res.end(JSON.stringify(r));
			});
		}
	});
});

router.post('/', function(req, res, next){
	if(req.body.ask !== "undefined"){
		QandA.create();
	}
	QandA.updateAnswer(req.body.ans, req.body.qId);
	res.redirect('gracias.html')
});






module.exports = router;