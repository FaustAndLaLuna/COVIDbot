var path = require('path');
var fs = require('fs');
var ffmpeg = require("fluent-ffmpeg");
const genThumbnail = require('simple-thumbnail');
const videosRepo = require('../conn/audioRepo');

const vidTable = new audiosRepo();


function encode(videoID, URLtoVid){
	
	ISWORKING = true;
	console.log("Encoding started.")
	
	filename = URLtoVid.replace(/\..*/, "");
	filePath = path.resolve(URLtoVid);
	convFilePath = path.resolve(filename+".mp3");
	filename = filename.slice(filename.indexOf("uploads") + "uploads".length)+".mp3";
	
	ffmpeg(filePath)
	.output(convFilePath)
	.format('mp3')
	.audioCodec('libmp3lame')
	.on('end', () =>{
		vidTable.updateToEncoded(filename, URLtoVid)
		fs.unlink(filePath, (err) => {
			if(err){
				console.error(err);
			}
		});
		ISWORKING = false;
		console.log("Encoding ended.")
	})
	.on('error', function(err, stdout, stderr){
		console.log("Error: Corrupted video, aborting. Cause: " + err.message);
		fs.unlink(filePath, (err) => {
			console.error(err);
		});
		vidTable.delete(videoID);
		ISWORKING = false;
	})
	.run();	
}


async function encodeCron(){
	console.log("Am I encoding? " + ISWORKING);
	if(!ISWORKING){
		vidTable.getNextEncodable().then((result) => {
			if(result.length == 0){
				return;
			}
			encode(result[0].videoID, result[0].tempURL);
			}).catch(function(err){
				console.log(err);
			});
	}
}



exports.encodeCron = encodeCron;
