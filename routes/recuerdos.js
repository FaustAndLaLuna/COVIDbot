var express = require('express');
var router = express.Router();
var path = require('path');
const videosRepo = require('../conn/videosRepo')

const vidTable = new videosRepo();

// TODO Set Index
router.get('/', function(req, res, next) {
	resObj = {};
	
	vidTable.getAll().then((allVids) => {
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify(allVids));
	});
	
	
	
	//res.sendFile(path.resolve('./public/record.html'));
});


module.exports = router;
