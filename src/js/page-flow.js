if(!Modernizr.canvas || !Modernizr.csstransforms){
	Array.prototype.slice.call(document.querySelectorAll("section")).forEach(function(section){
		section.style.display = "none";
	});
	document.querySelector("#sorry").style.display = "block";
	document.querySelector("#begin").style.display = "none";
}else{

	document.addEventListener("DOMContentLoaded", function(event) {
		var dragonTimeout;
		var textBoxNodes =  Array.prototype.slice.call(document.querySelectorAll(".text-box"));
		var canvasElements;
		var treesEl;
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
				aboutoffset: '140p',
				personaloffset: '270p',
				developeroffset: '950p',
				servicesoffset: '1200p',
				// Text boxes in the developer section
				textbox1: '320p',
				textbox2: '450p',
				textbox3: '580p',
				textbox4: '710p',
				textbox5: '840p'
			},
			keyframe: function(element, name, direction) {
				console.log(name);
				if(name.substr(0, 19) === "data_personaloffset" ||
					name === "data_developeroffset" ||
					name.substr(0, 12) === "data_textbox"){
					dragonSprite.setDirection(direction);
					dragonSprite.play();
					clearTimeout(dragonTimeout);
					dragonTimeout = setTimeout(function(){
						dragonSprite.pause();
					}, 200);

					textBoxNodes.forEach(function(node){
						if(window.getComputedStyle(node).opacity === "1" && !node.classList.contains('animated')){
							animateText(node);
						}
					});
				}

				if(name === "data_headeroffset"){
					headerNavigation.pause();
				}else if(name === "data_headeroffset-1"){
					headerNavigation.play();
				}
			},
			mobileDeceleration: 1
		});

		function resizeCanvas(event) {
			Array.prototype.forEach.call(canvasElements, function(element){
				element.width = window.innerWidth;
			});
		}

		function animateText(node) {
			var spanNodes = node.querySelectorAll("span");
			var strLen = 0;
			var animatedTextTimeout;
			var fontColor =  "white";
			animatedTextTimeout = setInterval(function(){
				if(spanNodes[strLen].textContent === "["){
					fontColor = "#FA2525";
				}

				spanNodes[strLen].style.color = fontColor;

				if(spanNodes[strLen].textContent === "]"){
					fontColor = "white";
				}
				strLen++;
				if(strLen === spanNodes.length){
					clearInterval(animatedTextTimeout);
					toggleClass(node, "filled");
				}
			}, 20);
		}

		function wrapTextInSpans(node){
			var textContent = node.textContent.split('');
			textContent = "<span>" + textContent.join("</span><span>") + "</span>";
			node.innerHTML = textContent;
		}

		textBoxNodes.forEach(function(node){
			wrapTextInSpans(node);
		});
		treesEl = qs("#trees-fallback");

		canvasElements = document.querySelectorAll("canvas.full-width");
		window.addEventListener("resize", resizeCanvas);
		resizeCanvas();
	});
}