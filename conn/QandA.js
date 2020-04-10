var fs = require('fs');
var POOL = require('./pool').POOL;

class questionsRepo{
	constructor(){
		const sql = `CREATE TABLE IF NOT EXISTS questions(
			questionID int PRIMARY KEY AUTO_INCREMENT,
			question TEXT,
			answers TEXT,
			qName TEXT,
			qEmail TEXT);`
				
		POOL.getConnection(function (error, conn){
			conn.query(sql, function(err, result){
				if(err)	console.log(err);
				conn.release();
			});
		});
		console.log("BIOGRAFO.questions created");
	}
	
	create(question, qName, qEmail){
		let q = "INSERT INTO questions (question, qName, qEmail) VALUES ( ?, ?, ?);";
		POOL.getConnection(function (err, conn){
			conn.query(q, [question, qName, qEmail], function(err, result){
				if (err)	console.log(err);
				conn.release();
				return;
			});
		});
	}

	updateAnswer(questionID, answer){
		answer = ";;___" + answer;
		let q = "UPDATE questions SET answers = CONCAT(answers,?) WHERE questionID = ?;"
		POOL.getConnection(function (err, conn){
			conn.query(q, [qanswer, questionID], function(err, result){
				if (err)	console.log(err);
				conn.release();
				return;
			});
		});
	}
	
	getAll(){
		let q = "SELECT * FROM questions;"
		return new Promise(function(resolve, reject) {
			POOL.getConnection(function(err, conn){
				if(err)	reject(err);
				conn.query(q, function(err, result){
					if(err)	reject(err);
					conn.release();
					resolve(result);
				});
			});
		});
	}

	getAllFromUser(user){
		let q = "SELECT * FROM questions WHERE user = ?;"
		return new Promise(function(resolve, reject){
			POOL.getConnection(function(err, conn){
				if(err)	reject(err);
				conn.query(q, "", function(err, result){
					if(err)	reject(err);
					conn.release();
					resolve(result);
				});
			});
		});
	}

	getRandom(){
		let q = "SELECT question FROM questions ORDER BY rand() LIMIT 3;"
		return new Promise(function(resolve, reject){
			POOL.getConnection(function(err, conn){
				if(err)	reject(err);
				conn.query(q, function(err, result){
					if(err)	reject(err);
					conn.release();
					resolve(result);
				});
			});
		});
	}

	getRandomUnanswered(){
		let q = "SELECT question FROM questions WHERE answer = ? ORDER BY rand() LIMIT 3;"
		return new Promise(function(resolve, reject){
			POOL.getConnection(function(err, conn){
				if(err)	reject(err);
				conn.query(q, "", function(err, result){
					if(err)	reject(err);
					conn.release();
					resolve(result);
				});
			});
		});
	}
	
/* 	getAllQuestionsFromUser(questionUserId){
		let q = "SELECT * FROM questions WHERE userID = ?;";
		return new Promise(function(resolve, reject){
			POOL.getConnection(function (err, conn){
				if(err) reject(err);
				conn.query(q, [questionUserID], function(err, result){
					if (err)	reject(err);
					conn.release();
					resolve(result);
				});
			});
		});	
	}
	
	getAllAnswersFromUser(answerUserId){
	let q = "SELECT * FROM questions WHERE answerUserID = ?;";
		return new Promise(function(resolve, reject){
			POOL.getConnection(function (err, conn){
				if(err) reject(err);
				conn.query(q, [answerUserID], function(err, result){
					if (err)	reject(err);
					conn.release();
					resolve(result);
				});
			});
		});	
	} */
}




module.exports = questionsRepo;