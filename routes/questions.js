var express = require('express');
var router = express.Router();

var videosRepo = require('../conn/QandA');

var QandA = new videosRepo();

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
				console.log(...result, ...r)
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
	if(req.body.ask !== "undefined" &&  req.body.ask !== null && !! req.body.ask ){
		if(req.body.name !== "undefined" &&  req.body.name !== null && !! req.body.name ){
			if(req.body.email !== "undefined" &&  req.body.email !== null && !! req.body.email ){
				QandA.create(req.body.ask, req.body.name, req.body.email);
				res.redirect('gracias.html');
			} else {
				return;
			}
		} else {
			return;
		}
	}
	console.log(req.body);
	if(req.body.qId !== "undefined" &&  req.body.qId !== null && !! req.body.ask ){
		if(req.body.ans !== "undefined" &&  req.body.ans !== null && !! req.body.ans ){
			QandA.updateAnswer(req.body.qId, req.body.ans);
			res.redirect('gracias.html');
		}
	}
});






module.exports = router;