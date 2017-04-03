(function(){
	if(!Modernizr.canvas || !Modernizr.csstransforms){
		Array.prototype.slice.call(document.querySelectorAll("section")).forEach(function(section){
			section.style.display = "none";
		});
		document.querySelector("#sorry").style.display = "block";
		document.querySelector("#begin").style.display = "none";
	}else{
		// % offset of page height to do the animatons
		var scrollConstants = {
			headeroffset: '80p',
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
		};

		var scrollSnapConstants = {
			start: {
				position: 0,
				title: "Start"
			},
			intro: {
				position: 0.8,
				title: "Intro"
			},
			aboutoffset: {
				position: 1.4,
				title: "About Jeremy"
			},
			developeroffset: {
				position: 10.9,
				title: "Contact"
			},
			servicesoffset: {
				position: 12.15,
				title: "Finish"
			},
			textbox1: {
				position: 3.3,
				title: "Career: DMP"
			},
			textbox2: {
				position: 4.6,
				title: "Career: Digitas"
			},
			textbox3: {
				position: 5.9,
				title: "Career: Compuware"
			},
			textbox4: {
				position: 7.2,
				title: "Career: Nexient"
			},
			textbox5: {
				position: 8.54,
				title: "Career"
			}
		};

		document.addEventListener("DOMContentLoaded", function(event) {
			var animatedSpriteTimeout;
			var scrollSnapTimeout;
			var textBoxNodes =  Array.prototype.slice.call(document.querySelectorAll(".text-box"));
			var canvasElements;
			var previousScrollPosition = window.scrollY;

			var scrollTimeout;
			function scrollTo(to) {
				if(scrollTimeout){
					clearInterval(scrollTimeout);
				}
				var difference = to - window.scrollY;
				var perTick = (window.innerHeight/7)*Math.sign(difference);

				setTimeout(function() {
					window.scrollTo(0, window.scrollY + perTick);
					if (Math.abs(window.scrollY-to) < 100){
						return;
					}
					scrollTo(to);
				}, 20);
			}

			var animatedSprite = new AnimatedSprite({
				canvas: document.querySelector("#dragon-sprite"),
				spriteSheet: "/images/sprite.png",
				frames: {
					"up": [
						{x: 0, y: 709},
						{x: 64, y: 709},
						{x: 128, y: 709},
						{x: 64, y: 709}
					],
					"down": [
						{x: 0, y: 784},
						{x: 64, y: 784},
						{x: 128, y: 784},
						{x: 64, y: 784}
					]
				}
			});

			var scrollTrackerElement = document.querySelector('.scroll-tracker');
			Object.keys(scrollSnapConstants).forEach(function(key){
				// Create the position tracker
				var span = document.createElement('span');
				var label = document.createElement('label');
				label.innerText = scrollSnapConstants[key].title;
				span.appendChild(label);
				span.className = key;
				span.style.top = 100*scrollSnapConstants[key].position+'%';
				scrollTrackerElement.insertBefore(span, scrollTrackerElement.childNodes[2]);
			});

			scrollTrackerElement.addEventListener('click', function (event){
				var target = scrollSnapConstants[event.target.className];
				if(target){
					scrollTo(target.position*window.innerHeight);
				}

			});

			var currentPositonTracker = document.querySelector('.current-position');
			document.addEventListener('scroll', function(){
				// Prevent bouncing back on scroll stop
				clearTimeout(scrollSnapTimeout);
				if(Math.abs(window.scrollY - previousScrollPosition) < 10){
					return;
				}

				// Animated sprite section
				var direction = (window.scrollY > previousScrollPosition) ? 'down' : 'up';

				animatedSprite.setDirection(direction);
				animatedSprite.play();
				clearTimeout(animatedSpriteTimeout);
				animatedSpriteTimeout = setTimeout(function(){
					animatedSprite.pause();
				}, 200);
				previousScrollPosition = window.scrollY;

				currentPositonTracker.style.top = (window.scrollY/window.innerHeight) * 100 + '%';
			});

			skrollr.init({
				constants: scrollConstants,
				keyframe: function(element, name) {
					if(name.substr(0, 19) === "data_personaloffset" ||
						name === "data_developeroffset" ||
						name.substr(0, 12) === "data_textbox"){
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
				if(!spanNodes.length){
					return;
				}
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

			canvasElements = document.querySelectorAll("canvas.full-width");
			window.addEventListener("resize", resizeCanvas);
			resizeCanvas();
		});
	}
})();