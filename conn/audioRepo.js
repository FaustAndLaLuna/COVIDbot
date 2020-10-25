var fs = require('fs');
var POOL = require('./pool').POOL;

class audiosRepo{
	constructor(){
		const sql = `CREATE TABLE IF NOT EXISTS audios(
			audioID int PRIMARY KEY AUTO_INCREMENT,
			questionID int,
			transcription text,
			isTranscripted boolean DEFAULT false,
			isEncoded boolean DEFAULT false,
			audioURL varchar(100) DEFAULT NULL,
			timePublished datetime,
            tempURL varchar(100) DEFAULT NULL
            );`



		POOL.getConnection(function (error, conn){
			conn.query(sql, function(err, result){
				if(err)	console.log(err);
				conn.release();
			});
		});
		console.log("BIOGRAFO.audios created");
	}
	
	updateToEncoded(videoURL, tempURL){
		let q = `UPDATE audios
		 SET audioURL = ?,
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
		let q = "DELETE FROM audios WHERE audioID = ?;"
		POOL.getConnection(function (err, conn){
			conn.query(q, [videoID], function(err, result){
				if (err)	console.log(err);
				conn.release();
				return;
			});
		});
	}
	
	updateToTranscripted(transcription, videoID){
		let q = 'UPDATE audios SET transcription = ?, isTranscripted = TRUE WHERE audioID = ?';
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
				conn.query("SELECT * FROM audios WHERE isTranscripted = false AND isEncoded = true limit 1;", function(err, result){
					conn.release();
					if(err) reject(err);
					return resolve(result);
				});
			});
		});
	}
	
	createAssociated(videoURL, tempURL, questionID){
		let q = 'INSERT INTO audios (audioURL, timePublished, tempURL, questionID) VALUES (?, NOW(), ?, ?)'
		POOL.getConnection(function (err, conn){
			conn.query(q, [videoURL, tempURL, questionID], function(err,result){
				if (err)	console.log(err);
				conn.release();
				return;
			});
		});
	}
	
	create(videoURL, timePublished, tempURL, questionID){
		let q = 'INSERT INTO audios (audioURL, timePublished, tempURL) VALUES ' +
			"(?, ?, ?, ?)";
		POOL.getConnection(function (err, conn){
			conn.query(q, [videoURL, timePublished, tempURL, questionID], function(err,result){
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
				conn.query("SELECT * FROM audios", function(err, result){
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
				conn.query("SELECT * FROM audios WHERE objectID = ?", [objectID], function(err, result){
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
				conn.query("SELECT user FROM audios WHERE audioURL = ?", [URL], function(err, result){
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
				conn.query("SELECT * FROM audios WHERE isEncoded = false limit 1;", function(err, result){
					conn.release();
					if(err) reject(err);
					return resolve(result);
				});
			});
		});
	}
	
}



module.exports = audiosRepo;