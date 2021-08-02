var express = require('express');
var router = express.Router();
var path = require('path');
const videosRepo = require('../conn/videosRepo')

const vidTable = new videosRepo();

router.post('/', function(req, res, next) {
	vidTable.getAll().then((allVids) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(allVids));
	});
});

module.exports = router;
