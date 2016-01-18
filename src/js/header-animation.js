function HeaderNavigation(){
	"use strict";

	this.sprite = null;
	this.drawnObjects = null;
	this.drawnObjectsParams = [];
	this.objectSet = null;
	this.canvas = null;
	this.ctx = null;
	this.skylinePattern = null;
	this.cloudLayer1 = null;
	this.cloudLayer2 = null;
	this.topOffset = 150; //used to translate objects to the bottom of the canvas
	this.astralPosition = {
		rad: 0,
		x: 0,
		y: 0
	};
	this.lastFrame = 0;
	this.cloudLayer1Offset = 0;
	this.cloudLayer2Offset = 0;
	this.playing = true;

	this.init = function(){
		var _this = this;
		this.canvas = document.querySelector('header canvas');
		this.ctx = this.canvas.getContext('2d');

		this.loadDrawnObjects();
		this.selectObjectSet();

		window.addEventListener('resize', function() {
			_this.selectObjectSet();
		}, true);

		this.sprite = new Image();
		this.sprite.src = "/images/sprite.png";
		this.sprite.onload = function(){
			this.drawnObjectsParams.push([this.sprite, 0, 955, 32, 64, 0, 0, 32, 64]);
			this.drawnObjectsParams.push([this.sprite, 43, 955, 64, 64, 0, 0, 64, 64]);
			this.drawnObjectsParams.push([this.sprite, 109, 987, 32, 32, 0, 0, 32, 32]);

			(function drawLoop(timestamp){
				requestAnimFrame(drawLoop);
				_this.Draw(timestamp);
			})();
		}.bind(this);

		var skyline = new Image();
		skyline.src = "/images/skyline.png";
		skyline.onload = function(){
			this.skylinePattern = this.ctx.createPattern(skyline, 'repeat-x');
		}.bind(this);

		var clouds1 = new Image();
		clouds1.src = "/images/cloudslayer1.png";
		clouds1.onload = function(){
			this.cloudLayer1 = this.ctx.createPattern(clouds1, 'repeat-x');
		}.bind(this);

		var clouds2 = new Image();
		clouds2.src = "/images/cloudslayer2.png";
		clouds2.onload = function(){
			this.cloudLayer2 = this.ctx.createPattern(clouds2, 'repeat-x');
		}.bind(this);
	};

	this.loadDrawnObjects = function(){
		var objects = {
			large: [],
			small: []
		};
		objects.large.push({x:85,y:43,h:64,w:64,t:1});
		objects.large.push({x:133,y:84,h:32,w:32,t:2});

		objects.large.push({x:225,y:35,h:64,w:32,t:0});
		objects.large.push({x:205,y:80,h:32,w:32,t:2});

		objects.large.push({x:305,y:48,h:35,w:25,t:1});
		objects.large.push({x:280,y:50,h:64,w:32,t:0});
		objects.large.push({x:355,y:38,h:64,w:64,t:1});
		objects.large.push({x:320,y:80,h:32,w:32,t:2});

		objects.large.push({x:455,y:38,h:64,w:32,t:0});
		objects.large.push({x:420,y:77,h:32,w:32,t:2});

		objects.large.push({x:505,y:40,h:64,w:32,t:0});
		objects.large.push({x:590,y:67,h:40,w:28,t:1});

		objects.large.push({x:605,y:40,h:64,w:32,t:0});
		objects.large.push({x:540,y:67,h:64,w:64,t:1});
		objects.large.push({x:620,y:53,h:64,w:32,t:0});

		objects.large.push({x:780,y:50,h:64,w:32,t:0});
		objects.large.push({x:855,y:38,h:64,w:64,t:1});
		objects.large.push({x:820,y:95,h:32,w:32,t:2});

		objects.large.push({x:525,y:105,h:32,w:32,t:2});
		objects.small.push({x:10,y:43,h:64,w:64,t:1});
		objects.small.push({x:80,y:84,h:32,w:32,t:2});

		objects.small.push({x:195,y:35,h:64,w:32,t:0});
		objects.small.push({x:225,y:80,h:32,w:32,t:2});

		objects.small.push({x:305,y:48,h:32,w:32,t:2});
		objects.small.push({x:280,y:50,h:64,w:64,t:1});
		objects.small.push({x:355,y:38,h:64,w:64,t:1});

		this.drawnObjects = objects;
	};

	this.selectObjectSet = function(){
		if(document.querySelector('body').offsetWidth >  400){
			this.objectSet = this.drawnObjects.large;
		}else{
			this.objectSet = this.drawnObjects.small;
		}
	};

	this.GetAlpha = function(){
		var y = this.astralPosition.y*-0.00133+0.326;
		return Math.max(0, y);
	};

	this.Draw = function(timestamp){
		// Limit to 60 fps
		if(!this.playing || timestamp-this.lastFrame < 1000/60){
			return;
		}
		this.lastFrame = timestamp;
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Draw skyline for clipping
		this.drawSkyline();
		this.ctx.globalCompositeOperation = "source-out";
		this.drawSky();

		this.ctx.globalCompositeOperation = "source-atop";
		this.astralPosition.rad += 0.005;
		this.drawAstralItems(this.astralPosition.rad);

		this.ctx.globalCompositeOperation = "source-over";
		this.cloudLayer1Offset -= 0.6;
		this.cloudLayer2Offset -= 0.4;
		this.drawClouds();

		this.ctx.globalCompositeOperation = "source-over";
		this.drawSkyline();
		this.drawShadows();
		this.drawObjects();
		this.tint();
	};

	this.drawSkyline = function(){
		this.ctx.save();
		this.ctx.translate(0, this.topOffset);
		this.ctx.fillStyle = this.skylinePattern;
    	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    	this.ctx.restore();
	};

	this.tint = function(){
		var baseColors = [200, 100, 0]; // base orange
		var newColors = [];
		var alpha = Math.max(0.4-this.GetAlpha(), 0);

		var y = Math.min(Math.max(this.astralPosition.y, 1), 250);
		var p = 1-0.008*y;
		for(var x = 0; x<3;x++){
			newColors[x] = Math.floor(baseColors[x]*p);
		}

		this.ctx.globalCompositeOperation = "source-atop";
		this.ctx.fillStyle = "rgba("+newColors[0]+","+newColors[1]+","+newColors[2]+","+alpha+")";
		this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
	};

	this.drawSky = function(){
		var baseColors = [47, 169, 214];
		var newColors = [];

		var y = Math.min(Math.max(this.astralPosition.y, 1), 250);
		var p = 1.044444+0.002177778*y;
		for(var x = 0; x<3;x++){
			newColors[x] = Math.floor(baseColors[x]*p);
		}

		this.ctx.globalAlpha = 0.8;
		this.ctx.fillStyle = "rgba("+newColors[0]+","+newColors[1]+","+newColors[2]+",0.5)";
		this.ctx.fillRect(0, 0, this.canvas.width, this.topOffset+100);
		this.ctx.globalAlpha = 1;
	};

	this.drawClouds = function(){
		var imageWidth = 1181;
		this.ctx.save();
		this.ctx.translate(this.cloudLayer1Offset, 0);
		this.ctx.fillStyle = this.cloudLayer1;
		this.ctx.fillRect(0, 0, imageWidth*2, this.canvas.height);
		this.ctx.restore();

		this.ctx.save();
		this.ctx.translate(this.cloudLayer2Offset, 0);
		this.ctx.fillStyle = this.cloudLayer2;
		this.ctx.fillRect(0, 0, imageWidth*2, this.canvas.height);
		this.ctx.restore();

		if(this.cloudLayer1Offset <= -imageWidth){
			this.cloudLayer1Offset = 0;
		}
		if(this.cloudLayer2Offset <= -imageWidth){
			this.cloudLayer2Offset = 0;
		}
	};

	this.drawShadows = function(){
		var buffer;
		var bctx;

		// Draw shadows to a buffer so they can be colored;
		buffer = document.createElement('canvas');
		buffer.width = this.canvas.width;
		buffer.height = this.canvas.height;
		bctx = buffer.getContext('2d');

		for(var key in this.objectSet){
			bctx.save();
			bctx.globalAlpha = this.GetAlpha();
			bctx.translate(0, this.canvas.height);
			var t = this.objectSet[key];
			var trans = this.transValues(t);
			//scale-x, skew-x, skew-y, scale-y, translate-x, translate-y
			bctx.transform(1,0,trans.skew*trans.skewDirection,-trans.scale,trans.x,trans.y);
			if(isNaN(t.t)){
				bctx.drawImage(this.sprite,t.sx,t.sy,t.w,t.h,0,0,t.w,t.h);
			}else{
				bctx.drawImage.apply(bctx, this.drawnObjectsParams[t.t]);
			}
			bctx.restore();
		}
		bctx.globalCompositeOperation = 'source-in';
		bctx.fillStyle = "black";
		bctx.fillRect(0,0,this.canvas.width,this.canvas.height);

		// Draw buffer to screen
		this.ctx.drawImage(buffer ,0 ,0);
	};

	this.drawObjects = function(){
		this.ctx.save();
		// Determine offset so we can center the trees on the page
		var offsetX = (window.innerWidth-1000)/2; // Trees are 1k wide
		offsetX = Math.max(offsetX, 0);
		for(var key in this.objectSet){
			var t = this.objectSet[key];
			if(isNaN(t.t)){
				this.ctx.drawImage(this.sprite,t.sx,t.sy,t.w,t.h,t.x,t.y+this.topOffset,t.w,t.h);
			}else{
				this.ctx.drawImage.apply(this.ctx,
					[].concat(this.drawnObjectsParams[t.t].slice(0,5), [t.x+offsetX,t.y+this.topOffset,t.w,t.h]));
			}
		}
		this.ctx.restore();
	};

	this.drawAstralItems = function(theta){
		var x = this.canvas.width/2.5;
		var y = 200;
		var xPos = x*Math.cos(theta+Math.PI)+this.canvas.width/2.2;
		var yPos = y*Math.sin(theta+Math.PI)+this.topOffset+y/3;

		this.astralPosition.x = xPos;
		this.astralPosition.y = yPos;

		this.ctx.drawImage(this.sprite, 296, 879, 150, 150, xPos, yPos, 150, 150);

		xPos = x*Math.cos(theta)+this.canvas.width/2.2;
		yPos = y*Math.sin(theta)+this.topOffset+y/3;
		this.ctx.drawImage(this.sprite, 430, 879, 150, 150, xPos, yPos, 150, 150);
	};

	this.transValues = function(t){
		var P1 = {};
		P1.y = t.y+100;
		P1.x = t.x;

		//sun
		var P2 = {};
		P2.x = this.astralPosition.x+50;
		P2.y = this.astralPosition.y;

		var P3 = {};

		P3.x = P2.x;
		P3.y = P1.y;

		//get lengths
		var L12 = this.lineLength(P1,P2);
		var L13 = this.lineLength(P1,P3);
		var L23 = this.lineLength(P2,P3);
		var cos = (180/Math.PI)*Math.acos((L12*L12 + L23*L23 - L13*L13)/(2 * L12 * L23));
		// My max angle will be around 140, min will be around 0
		var trans = {};

		//right or left of sun
		trans.skewDirection = 1;
		if(P2.x <= P1.x){
			trans.skewDirection = -1;
		}


		//translate 0-90* into 0-2 for skew factor
		trans.skew = cos*0.02211114+0.00999779;
		//translate 0-2 into .3-.7 for the y scale
		trans.scale = trans.skew*0.2+0.3;
		var skewModifier = t.w*(7/6)+(19/3);
		//determine new width (stem in top middle)
		var width = (skewModifier*trans.skew)+t.w;
		//test new width calc
		var len = this.lineLength({x:0,y:0},{x:t.w,y:t.h});
		width = len*trans.skew;
		width = trans.skew*t.h+t.w;
		var height = t.h*trans.scale;

		trans.y = -this.canvas.height+t.y+t.h+height-4+this.topOffset;
		if(typeof t.sy != "undefined"){
			trans.y += t.ys;
		}
		trans.x = t.x-width+(t.w);
		if(trans.skewDirection == -1){
			trans.x = t.x-t.w+width;
		}
		return trans;
	};

	this.lineLength = function(P1, P2){
		return Math.sqrt(Math.abs((P1.x - P2.x)*(P1.x - P2.x) + (P1.y - P2.y)*(P1.y - P2.y)));
	};

	this.pause = function(){
		this.playing = false;
	};

	this.play = function(){
		this.playing = true;
	};
}

var headerNavigation = new HeaderNavigation();
headerNavigation.init();