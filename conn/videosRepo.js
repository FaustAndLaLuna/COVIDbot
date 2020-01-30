var fs = require('fs');
var POOL = require('./pool').POOL;

class videosRepo{
	constructor(){
		const sql = `CREATE TABLE IF NOT EXISTS videos(
			videoID int PRIMARY KEY  AUTO_INCREMENT,
			userID int DEFAULT -1,
			description text,
			title text,
			tags text,
			transcription text,
			isTranscripted boolean DEFAULT false,
			objectID int DEFAULT -1,
			isEncoded boolean DEFAULT FALSE,
			videoURL varchar(100) DEFAULT NULL,
			timePublished datetime,
			tempURL varchar(100) DEFAULT NULL)`;
			/* `, CONSTRAINT fk_user
			FOREIGN KEY (userID)
			REFERENCES users(id)
				ON UPDATE CASCADE
				ON DELETE CASCADE,
			CONSTRAINT fk_objects
			FOREIGN KEY (objectID)
			REFERENCES objects(objectID)
				ON UPDATE CASCADE
				ON DELETE CASCADE);` */
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
				conn.query("SELECT * FROM videos WHERE isTranscripted = false limit 1;", function(err, result){
					conn.release();
					if(err) reject(err);
					return resolve(result);
				});
			});
		});
	}
	
	createAssociated(videoURL, tempURL, userID, objectID, description, title, tags){
		let q = 'INSERT INTO videos (videoURL, timePublished, tempURL, userID, objectID, description, title, tags) VALUES ' +
				"(?, NOW(), ?, ?, ?, ?, ?, ?)"
		POOL.getConnection(function (err, conn){
			conn.query(q, [videoURL, tempURL, userID, objectID, description, title, tags], function(err,result){
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