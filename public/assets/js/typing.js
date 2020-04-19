var words = ["soledad","ansiedad","coronavirus","depresión","crisis","recesión","respiradores","salúd","miedo","cuarentena","aburrición","frustración","COVID19","preocupación","pandemia","contagio","muertes","mortalidad","contingencia","letalidad","respiradores","mascarillas", "pneumonia"]

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

function type(id, word){
	currStr = document.getElementById(id).innerHTML;
	if(currStr.length < word.length) {
		document.getElementById(id).innerHTML = word.substring(0, currStr.length + 1);
		setTimeout(type, 50 + Math.ceil(Math.random() * 16) - 8, id, word );
	}
	else{
		if(Math.random() > 0.3)
			setTimeout(untype, 238, id, word);
	}
}

function typeCoronavirus(){
	currStr2 = document.getElementById("coronavirus1").innerHTML;
	if(currStr2.length < "coronavirus".length){
		document.getElementById("coronavirus1").innerHTML = "coronavirus".substring(0, currStr2.length + 1);
		setTimeout(typeCoronavirus, 450);
	}
}

function untype(id, word){
	currStr = document.getElementById(id).innerHTML;
	if(currStr.length > 1){
		document.getElementById(id).innerHTML = word.substring(0, currStr.length - 1);
		setTimeout(untype, 75 + Math.ceil(Math.random() * 24) - 12, id, word);
	}
	else{
		setTimeout(type, 50, id, words[Math.floor(Math.random() * words.length)]);
	}
}

function changeOffset(element){
	var offset = {top: 0, left: 0};
	offset.top = (Math.random() * $(window).height() * 0.5) + 0.2 * $(window).height();
	offset.left = (Math.random() * $(window).width() * 0.6) + 0.1 * $(window).width();
	element.css("font-size", +(3.5 + Math.random() * 4 - 1.5 )+"vw");
	element.offset(offset);
}


$(document).ready(() => {
	var wait = 0;
	var maxWords = $(window).width() < 768? 750: 550;
	setTimeout(typeNotStopping, 50, "coronavirus", "cobot19");
	if($(window).width() < 768){
		$("#coronavirus").offset({top:$(window).height() * .35, left:0});
	}

	
	console.log(maxWords);

	setTimeout(() => {
		if($(window).width() >= 768){

			$("#coronavirus").after('<p id="coronavirus1" style="font-size: 7vw;z-index: 9;text-align: center; position:absolute;width:100%;color:white;text-shadow: 2px 2px 15px black"></p>');
			$("#coronavirus1").offset({top:$(window).height() * .35, left:0});
		}
		else{
			$("#coronavirus").after('<p id="coronavirus1" style="font-size: 10vw;z-index: 9;text-align: center; position:absolute;width:100%;color:white;text-shadow: 2px 2px 15px black"></p>');
			$("#coronavirus1").offset({top:$(window).height() * .4175, left: 0});
		}
		setTimeout(typeCoronavirus, 150);
	}, 7500);

	for(var i = 0; i < maxWords; i++){
		$("#coronavirus").after('<p id="pandemia'+i+'" style="font-size: 5vw;z-index: 3;text-align: center; position:absolute;width = 100%;"></p>');
		el = $("#pandemia"+i);
		changeOffset(el);
		wait = wait + 1500 * Math.exp(-0.6 * i) + 80;
		//setTimeout(type, i * 150 + Math.random() * 1000, "pandemia" + i, words[Math.floor(Math.random() * words.length)]);
		setTimeout(type, wait, "pandemia" + i, words[Math.floor(Math.random() * words.length)]);
	}

	$("#spacer").height($(window).height() * 0.8 - $("#spacer").offset().top);
	// setTimeout(window.location.redirect, 6000, "explanation.html");
})
