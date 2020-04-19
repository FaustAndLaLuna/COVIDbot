var express = require('express');
var router = express.Router();
var path = require('path');
const videosRepo = require('../conn/videosRepo');
const vidTable = new videosRepo();

router.get('/:first/:second/:third/:fourth/:filename', (req, res) => {
	resObj = {}
	req.responseObj.videoURL = '/' + req.params.first + '/' + req.params.second + '/' + req.params.third +
					"/" + req.params.fourth + '/' + req.params.filename;
	vidTable.getAuthorFromURL(req.responseObj.videoURL).then((ans) => {
		req.responseObj.author = ans;
		res.render('vid', req.responseObj);
	});
});

module.exports = router;