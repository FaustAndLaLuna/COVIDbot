var words = ["coronavirus","depresión económica","crisis","recesión","respiradores","salúd","miedo","cuarentena","aburrición","frustración","COVID19","SARS","pandemia","contagio","muertes","inmudidad de rebaño","contingencia","letalidad","respiradores","mascarillas", "aislamiento social"]

function type(id, word){
	currStr = document.getElementById(id).innerHTML;
	if(currStr.length < word.length) {
		document.getElementById(id).innerHTML = word.substring(0, currStr.length + 1);
		setTimeout(type, 50 + Math.ceil(Math.random() * 11), id, word );
	}
	else{
		if(Math.random() > 0.3)
			setTimeout(untype, 238, id, word);
	}
}

function untype(id, word){
	currStr = document.getElementById(id).innerHTML;
	if(currStr.length > 1){
		document.getElementById(id).innerHTML = word.substring(0, currStr.length - 1);
		setTimeout(untype, 65 + Math.ceil(Math.random() * 23), id, word);
	}
	else{
		setTimeout(type, 50, id, words[Math.floor(Math.random() * words.length)]);
	}
}

function changeOffset(element){
	var offset = {top: 0, left: 0};
	offset.top = (Math.random() * $(window).height() * 0.5) + 0.2 * $(window).height();
	offset.left = (Math.random() * $(window).width() * 0.5) + 0.2 * $(window).width();
	element.css("font-size", +(4.5 + Math.random() * 3 - 1.5 )+"vw");
	element.offset(offset);
}


$(document).ready(() => {
	setTimeout(type, 50, "coronavirus", "coronavirus");
	for(var i = 1; i <21; i++){
		el = $("#pandemia"+i);
		changeOffset(el);
		setTimeout(type, i * 500 + Math.random() * 1000, "pandemia" + i, words[Math.floor(Math.random() * words.length)]);
	}
	$("#spacer").height($(window).height() * 0.8 - $("#spacer").offset().top);
	// setTimeout(window.location.redirect, 6000, "explanation.html");
})
