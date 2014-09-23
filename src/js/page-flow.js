document.addEventListener("DOMContentLoaded", function(event) {
	// Skrollr
	function windowHeight(m) {
		return window.outerHeight*m;
	}
	var dragonTimeout;
	var dragonSprite = new AnimatedSprite({
		canvas: document.querySelector("#dragon-sprite"),
		spriteSheet: "/images/sprite.png",
		frames: {
			"up": [
				{x: 0, y: 710},
				{x: 64, y: 710},
				{x: 128, y: 710},
				{x: 64, y: 710}
			],
			"down": [
				{x: 0, y: 794},
				{x: 64, y: 794},
				{x: 128, y: 794},
				{x: 64, y: 794}
			]
		}
	});
	var s = skrollr.init({
		constants: {
			headeroffset: 350,
			aboutoffset: windowHeight(1.4),
			fatheroffset: windowHeight(2.7),
			developeroffset: windowHeight(8),
			servicesoffset: windowHeight(10)
		},
		keyframe: function(element, name, direction) {
			dragonSprite.setDirection(direction);
			dragonSprite.play();
			clearTimeout(dragonTimeout);
			dragonTimeout = setTimeout(function(){
				dragonSprite.pause();
			}, 200)			
		}
	});

	// Header and Header backgrouns
	var canvasElements;
	var treesEl;
	function resizeCanvas(event) {
		Array.prototype.forEach.call(canvasElements, function(element){
			element.width = window.innerWidth;
		});
	}
	
	if(Modernizr.canvas){
		treesEl = qs("#trees-fallback");
		treesEl.parentNode.removeChild(treesEl);
	}

	Array.prototype.forEach.call(document.querySelectorAll("section h1"), function(element){
		var el = document.createElement('canvas');
		el.className = 'header-background';
		element.insertAdjacentElement('beforebegin', el);
		new HeaderBackground(el);
	});

	canvasElements = document.querySelectorAll("canvas.full-width");
	window.addEventListener("resize", resizeCanvas);
	resizeCanvas();
});



/* global values */
var rgb = {};							
var DayCycle = 'day';

/* being document ready */
function RawrSortOf(){
	var snd = new Audio("/wp-content/themes/jfry/holy-grail.m4a");
	var monster = qs("#monster")
	snd.play();
	//.animate({height:'150px',width:'150px'},'fast')
 	//.delay(4000).animate({height:'50px',width:'50px'},'fast');
}
