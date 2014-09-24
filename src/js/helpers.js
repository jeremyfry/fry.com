(function(){if(!/*@cc_on!@*/0){return;}var e = "abbr,article,aside,audio,bb,canvas,datagrid,datalist,details,dialog,eventsource,figure,footer,header,hgroup,mark,menu,meter,nav,output,progress,section,time,video".split(',');for(var i=0;i<e.length;i++){document.createElement(e[i]);}})();
function extend(a, b){
	for(var key in b)
		if(b.hasOwnProperty(key))
			a[key] = b[key];
	return a;
}

window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		function( callback ){
			window.setTimeout(callback, 1000 / 60);
		};
})();

window.qs = document.querySelector.bind(document);

window.toggleClass = function(node, className){
	if (node.classList) {
		node.classList.toggle(className);
	} else {
		var classes = node.className.split(' ');
		var existingIndex = classes.indexOf(className);

	if (existingIndex >= 0)
		classes.splice(existingIndex, 1);
	else
		classes.push(className);

		node.className = classes.join(' ');
	}
}