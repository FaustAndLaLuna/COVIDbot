
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
		setTimeout(type, 50, id, word);
	}
}

$(document).ready(() => {
	offOriginal = $("#coronavirus").offset();
	off = offOriginal;
	off.top += Math.ceil(40 * Math.random()) - 20;
	$("#pandemia").offset(off);
	off = offOriginal;
	off.top += Math.ceil(40 * Math.random()) - 20;
	$("#depresion").offset(off);
	setTimeout(type, 50, "coronavirus", "coronavirus");
	setTimeout(type, 1500, "pandemia", "pandemia");
	setTimeout(type, 3000, "depresion", "recesion");
	setTimeout(window.location.redirect, 6000, "explanation.html");
})
