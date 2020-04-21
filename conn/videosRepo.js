var fs = require('fs');
var POOL = require('./pool').POOL;

class videosRepo{
	constructor(){
		const sql = `CREATE TABLE IF NOT EXISTS videos(
			videoID int PRIMARY KEY AUTO_INCREMENT,
			user text,
			email text,
			transcription text,
			isTranscripted boolean DEFAULT false,
			isEncoded boolean DEFAULT false,
			videoURL varchar(100) DEFAULT NULL,
			timePublished datetime,
			tempURL varchar(100) DEFAULT NULL,
			questionario text,
			coords text);`



		POOL.getConnection(function (error, conn){
			conn.query(sql, function(err, result){
				if(err)	console.log(err);
				conn.release();
			});
		});
		console.log("BIOGRAFO.videos created");
	}
	
	updateToEncoded(videoURL, tempURL){
		let q = `UPDATE videos 
		 SET videoURL = ?,
		 tempURL = ?,
		 isEncoded = TRUE
		 WHERE tempURL = ? ` ;
		POOL.getConnection(function (err, conn){
			conn.query(q, [videoURL, "COMPLETADO", tempURL], function(err, result){
				if (err)	console.log(err);
				conn.release();
				return;
			});
		});
	}
	
	delete(videoID){
		let q = "DELETE FROM videos WHERE videoID = ?;"
		POOL.getConnection(function (err, conn){
			conn.query(q, [videoID], function(err, result){
				if (err)	console.log(err);
				conn.release();
				return;
			});
		});
	}
	
	updateToTranscripted(transcription, videoID){
		let q = 'UPDATE videos SET transcription = ?, isTranscripted = TRUE WHERE videoID = ?';
		POOL.getConnection(function(err, conn){
			if (err)	console.log(err);
			conn.query(q, [transcription, videoID], function(err, result){
				if(err)	console.log(err);
					conn.release();
					return;
			});
		});
	}
	
	getNextTranscriptable(){
		return new Promise(function (resolve, reject){
			POOL.getConnection(function(err, conn){
				if(err)	reject(err);
				conn.query("SELECT * FROM videos WHERE isTranscripted = false AND isEncoded = true limit 1;", function(err, result){
					conn.release();
					if(err) reject(err);
					return resolve(result);
				});
			});
		});
	}
	
	createAssociated(videoURL, tempURL, user, email, coords){
		let q = 'INSERT INTO videos (videoURL, timePublished, tempURL, user, email, coords) VALUES (?, NOW(), ?, ?, ?, ?)'
		POOL.getConnection(function (err, conn){
			conn.query(q, [videoURL, tempURL, user, email, coords], function(err,result){
				if (err)	console.log(err);
				conn.release();
				return;
			});
		});
	}
	
	create(videoURL, timePublished, tempURL){
		let q = 'INSERT INTO videos (videoURL, timePublished, tempURL) VALUES ' +
			"(?, ?, ?)";
		POOL.getConnection(function (err, conn){
			conn.query(q, [videoURL, timePublished, tempURL], function(err,result){
				conn.release();
				if (err)	console.log(err);
				return;
			});
		});
	}

	//TODO: Set update, delete, get(one) for sale/sold
	getAll(){
		return new Promise(function (resolve, reject){
			POOL.getConnection(function(err, conn){
				if(err)	reject(err);
				conn.query("SELECT * FROM videos", function(err, result){
					conn.release();
					if(err) reject(err);
					return resolve(result);
				});
			});
		});
	}

	getAllFromObject(objectID){
		return new Promise(function (resolve, reject){
			POOL.getConnection(function(err, conn){
				if(err)	reject(err);
				conn.query("SELECT * FROM videos WHERE objectID = ?", [objectID], function(err, result){
					conn.release();
					if(err) reject(err);
					return resolve(result);
				});
			});
		});
	}

	getAuthorFromURL(URL){
		return new Promise(function (resolve, reject){
			POOL.getConnection(function(error, conn){
				if(error) reject(error);
				conn.query("SELECT user FROM videos WHERE videoURL = ?", [URL], function(err, result){
					var r = null;
					conn.release();
					if(err) reject(err);
					if(result[0]) r = result[0].user;
					return resolve(r);
				});
			});
		});
	}
	
	getNextEncodable(){
		return new Promise(function (resolve, reject){
			POOL.getConnection(function(err, conn){
				if(err)	reject(err);
				conn.query("SELECT * FROM videos WHERE isEncoded = false limit 1;", function(err, result){
					conn.release();
					if(err) reject(err);
					return resolve(result);
				});
			});
		});
	}
	
}



module.exports = videosRepo;