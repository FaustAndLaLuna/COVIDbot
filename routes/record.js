var express = require('express');
var router = express.Router();
var path = require('path');

const objectsRepo = require('../conn/objectsRepo.js');
var createError = require('http-errors');
const objectsDB = new objectsRepo();

// TODO Set Index
router.get('/', function(req, res, next) {
	objectsDB.getObject(req.query.objectID).then(
		function(obj){
			req.responseObj.obj = obj[0];
			userAgent = req.get('User-Agent');
			if(!!userAgent.match("/iPad|iPhone|iPod/")){
				res.redirect('videoiOS.html');
			} else {
				res.redirect('video.html');
			}
		}
	);
	
});


module.exports = router;
