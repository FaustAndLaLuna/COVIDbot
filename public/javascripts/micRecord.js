var recorder = null; 
var video;

  
//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var recorder; 						//WebAudioRecorder object
var input; 							//MediaStreamAudioSourceNode  we'll be recording
var encodeAfterRecord = true;       // when to encode
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext; //new audio context to help us record
var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var audioBlob;

recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);

$(document).ready(() => {
    cookie = getCookieObj();
    if(cookie.user)
        $("#user").val(cookie.user);
    if(cookie.email)
        $("#email").val(cookie.email);
    if(cookie.email)
        $("#emailVerif").val(cookie.email);
    if(cookie.coords)
        $("#coords").val(cookie.coords);

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position) => {
            coords = position.coords;
            changedCoords = {longitude: coords.longitude, latitude: coords.latitude};
            console.log(JSON.stringify(changedCoords));
            $("#coords").attr("value", JSON.stringify(changedCoords));
        });
    }
    $("#toSubmit").click(upload);
});
function getCookieObj(){
    var cookie = {};
    let cookieParts = document.cookie.split("; ");
    cookieParts.forEach((part) => {
        keyValue = part.split("=");
        key = keyValue[0];
        value = keyValue[1];
        cookie[key] = value; 
    });
    return cookie;
}
function typeNotStopping(id, word){
    currStr = document.getElementById(id).innerHTML;
    if(currStr.length < word.length) {
        document.getElementById(id).innerHTML = word.substring(0, currStr.length + 1);
        setTimeout(typeNotStopping, 50 + Math.ceil(Math.random() * 16) - 8, id, word );
    }
    else{
        setTimeout(untypeNotStopping, 238, id, word);
    }
}

function untypeNotStopping(id, word){
    currStr = document.getElementById(id).innerHTML;
    if(currStr.length > 1){
        document.getElementById(id).innerHTML = word.substring(0, currStr.length - 1);
        setTimeout(untypeNotStopping, 75 + Math.ceil(Math.random() * 24) - 12, id, word);
    }
    else{
        setTimeout(typeNotStopping, 50, id, words[Math.floor(Math.random() * words.length)]);
    }
}


function startRecording() {
	var constraints = { audio: true, video:false }
	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		audioContext = new AudioContext();
		gumStream = stream;
		input = audioContext.createMediaStreamSource(stream);
		encodingType = "mp3";
		

		recorder = new WebAudioRecorder(input, {
		  workerDir: "js/", // must end with slash
		  encoding: encodingType,
		  numChannels:2, //2 is the default, mp3 encoding supports only 2
		  onEncoderLoading: function(recorder, encoding) {
		  },
		  onEncoderLoaded: function(recorder, encoding) {
		  }
		});

		recorder.onComplete = function(recorder, blob) {
			audioBlob = blob;
			createDownloadLink(blob,recorder.encoding);
			recordButton.disabled = false;
			stopButton.disabled = true;
		}

		recorder.setOptions({
		  timeLimit:120,
		  encodeAfterRecord:encodeAfterRecord,
	      ogg: {quality: 0.5},
	      mp3: {bitRate: 160}
	    });

		recorder.startRecording();
	}).catch(function(err) {
        console.log(err);
	  	recordButton.disabled = false;
    	stopButton.disabled = true;
	});

	//disable the record button
    recordButton.disabled = true;
    stopButton.disabled = false;
}

function stopRecording() {
	gumStream.getAudioTracks()[0].stop();
	stopButton.disabled = true;
	recordButton.disabled = false;
	recorder.finishRecording();
}

function createDownloadLink(el, blob,encoding) {
	var url = URL.createObjectURL(blob);
	var au = document.createElement('audio');
	var li = document.createElement('li');
	var link = document.createElement('a');
	au.controls = true;
	au.src = url;
	link.href = url;
    li.innerHTML = "";
	li.appendChild(au);
	li.appendChild(link);

	recordingsList.innerHTML = "";
	recordingsList.appendChild(li);
}

var words = ["subiendo..."];
		function typeNotStopping(id, word){
			currStr = document.getElementById(id).innerHTML;
			if(currStr.length < word.length) {
				document.getElementById(id).innerHTML = word.substring(0, currStr.length + 1);
				setTimeout(typeNotStopping, 50 + Math.ceil(Math.random() * 16) - 8, id, word );
			}
			else{
				setTimeout(untypeNotStopping, 238, id, word);
			}
		}

		function untypeNotStopping(id, word){
			currStr = document.getElementById(id).innerHTML;
			if(currStr.length > 1){
				document.getElementById(id).innerHTML = word.substring(0, currStr.length - 1);
				setTimeout(untypeNotStopping, 75 + Math.ceil(Math.random() * 24) - 12, id, word);
			}
			else{
				setTimeout(typeNotStopping, 50, id, words[Math.floor(Math.random() * words.length)]);
			}
		}
		
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


function postBlob(event){
    if (event.data && event.data.size > 0){
        sendBlobAsBase64(event.data);
    }
}

function sendBlobAsBase64(blob){
    const reader = new FileReader();

    reader.addEventListener('load', ()=>{
        const dataUrl = reader.result;
        const base64EncodedData = dataUrl.split(',')[1];
        sendDataToBackend(base64EncodedData);
    });
}

function sendDataToBackend(b64data){
	text1 = document.getElementById('title').value;
	text2 = document.getElementById('description');
	text3temp = document.getElementById('tags');
	text3 = JSON.stringify(text3temp.split(" "));
    const body = JSON.stringify({data:b64data, user:$("#user").val(), email: $("#email").val()});
    fetch('/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body
    }).then(res => {
        return res.json();
    });
}

function upload() {	
	$("#greyout").css("visibility","visible");
	$("#uploading").css("visibility","visible");
	
    document.getElementById('btn-start-recording').disabled = true;
    document.getElementById('btn-stop-recording').disabled = true;
	
	if(coords)
		document.cookie = "coords="+JSON.stringify(coords);
    
    var csrftoken = getCookie('csrftoken');
    var blob = audioBlob;
    var formData = new FormData(document.getElementById('form'));
    formData.append("blob", blob, 'video'); //not using name
                                            // so it's called video
    var xhr = new XMLHttpRequest();
    xhr.open('POST', './upload', true);
    xhr.setRequestHeader("X-CSRFToken", csrftoken );
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
        } else if (xhr.readyState == 4 && xhr.status == 400 || xhr.readyState == 4 && xhr.status == 500) {
            alert("Error while Uploading - The admins have been notified. Please try again later");
        }
    };
    xhr.send(formData);
};





function getCookieObj(){
    var cookie = {};
    let cookieParts = document.cookie.split("; ");
    cookieParts.forEach((part) => {
        keyValue = part.split("=");
        key = keyValue[0];
        value = keyValue[1];
        cookie[key] = value; 
    });
    return cookie;
}
    
$(document).ready(() => {
    cookie = getCookieObj();
    $("#name").val(cookie["user"]);
    $("#email").val(cookie["email"]);
    $("#name").css("display","none");
    $("#email").css("display","none");
    $.getJSON('/questions', function(qs){
        for(i = 1; i < 4; i++){
            $("#q"+i+"q").text(qs[i-1].question);
            $("#q"+i+"id").val(qs[i-1].questionID);  
        }
    });

    $("#ask").submit(function(event){
        event.preventDefault(); 
        $(this).css("opacity", "0");
        $("#graciasAsk").css("opacity", "1");
        $.post( "/questions", $("#ask").serialize(), function( response ) {
        });
    });
    let i = 1;
    for(i = 1; i < 4; i++){
        offset = {top: 0, left: $("#graciasq"+i).offset().left};
        offset.top = $("#q"+i).offset().top + $("#q" + i).height() / 2 - $("#graciasq" + i).height()/2; 
        $("#graciasq" + i).offset(offset);
    }

    $("#q1").submit(function(event){
        if(! $("#q1a").val() ){
            return;
        }
        event.preventDefault();
        $(this).css("opacity", "0");
        $("#graciasq1").css("opacity", "1");
        var csrftoken = getCookie('csrftoken');
        var blob = audioBlob;
        var formData = new FormData(document.getElementById('form'));
        formData.append("blob", blob, 'video'); //not using name
                                                // so it's called video
        var xhr = new XMLHttpRequest();
        xhr.open('POST', './upload', true);
        xhr.setRequestHeader("X-CSRFToken", csrftoken );
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
            } else if (xhr.readyState == 4 && xhr.status == 400 || xhr.readyState == 4 && xhr.status == 500) {
                alert("Error while Uploading - The admins have been notified. Please try again later");
            }
        };
        xhr.send(formData);
    });
    $("#q2").submit(function(event){
        event.preventDefault();
        if(! $("#q2a").val() ){
            return;
        }
        $(this).css("opacity", "0");
        $("#graciasq2").css("opacity", "1");
        var csrftoken = getCookie('csrftoken');
        var blob = audioBlob;
        var formData = new FormData(document.getElementById('form'));
        formData.append("blob", blob, 'video'); //not using name
                                                // so it's called video
        var xhr = new XMLHttpRequest();
        xhr.open('POST', './upload', true);
        xhr.setRequestHeader("X-CSRFToken", csrftoken );
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
            } else if (xhr.readyState == 4 && xhr.status == 400 || xhr.readyState == 4 && xhr.status == 500) {
                alert("Error while Uploading - The admins have been notified. Please try again later");
            }
        };
        xhr.send(formData);
    });
    $("#q3").submit(function(event){
        if(! $("#q3a").val() ){
            return;
        }
        event.preventDefault();
        console.log($("#q3").serialize());
        $(this).css("opacity", "0");
        $("#graciasq3").css("opacity", "1");
        var csrftoken = getCookie('csrftoken');
        var blob = audioBlob;
        var formData = new FormData(document.getElementById('form'));
        formData.append("blob", blob, 'video'); //not using name
                                                // so it's called video
        var xhr = new XMLHttpRequest();
        xhr.open('POST', './upload', true);
        xhr.setRequestHeader("X-CSRFToken", csrftoken );
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
            } else if (xhr.readyState == 4 && xhr.status == 400 || xhr.readyState == 4 && xhr.status == 500) {
                alert("Error while Uploading - The admins have been notified. Please try again later");
            }
        };
        xhr.send(formData);
    });
});