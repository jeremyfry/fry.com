function HeaderNavigation(){
	"use strict";

	this.sprite = null;
	this.trees = [];
	this.treeImages = [];
	this.canvas = null;
	this.ctx = null;
	this.skylinePattern = null;
	this.cloudLayer1 = null;
	this.cloudLayer2 = null;
	this.topOffset = 150; //used to translate trees to the bottom of the canvas
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
		this.canvas = document.querySelector('header canvas');
		this.ctx = this.canvas.getContext('2d');

		this.sprite = new Image;
		this.sprite.src = "/images/sprite.png";

		var skyline = new Image;
		skyline.src = "/images/skyline.png";
		skyline.onload = function(){
			this.skylinePattern = this.ctx.createPattern(skyline, 'repeat-x');
		}.bind(this);

		var clouds1 = new Image;
		clouds1.src = "/images/cloudslayer1.png";
		clouds1.onload = function(){
			this.cloudLayer1 = this.ctx.createPattern(clouds1, 'repeat-x');
		}.bind(this);

		var clouds2 = new Image;
		clouds2.src = "/images/cloudslayer2.png";
		clouds2.onload = function(){
			this.cloudLayer2 = this.ctx.createPattern(clouds2, 'repeat-x');
		}.bind(this);

		this.treeImages.push(new Image);
		this.treeImages.push(new Image);
		this.treeImages.push(new Image);

		this.treeImages[0].src = "data:image/png;base64,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";
		this.treeImages[1].src = "data:image/png;base64,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";
		this.treeImages[2].src = "data:image/png;base64,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";

		var _this = this;
		(function drawLoop(timestamp){
			requestAnimFrame(drawLoop);
			_this.Draw(timestamp);
		})();
	}

	this.LoadTrees = function(){
		var trees = [];
		if(document.querySelector('body').offsetWidth >  400){
			trees.push({x:100,y:50,h:70,w:90,t:"dragon", sx:340, sy:460, ys: -9});
			trees.push({x:670,y:15,h:115,w:150,t:"castle", sx:355, sy:115, ys: -5});

			trees.push({x:123,y:44,h:55,w:39,t:2});
			trees.push({x:85,y:43,h:60,w:42,t:1});

			trees.push({x:225,y:35,h:55,w:39,t:0});

			trees.push({x:305,y:48,h:35,w:25,t:1});
			trees.push({x:280,y:50,h:60,w:42,t:0});
			trees.push({x:355,y:38,h:60,w:42,t:1});
			trees.push({x:320,y:50,h:60,w:42,t:2});

			trees.push({x:385,y:55,h:40,w:28,t:2});
			trees.push({x:405,y:30,h:60,w:42,t:2});

			trees.push({x:455,y:38,h:60,w:42,t:0});
			trees.push({x:420,y:47,h:60,w:42,t:2});

			trees.push({x:505,y:40,h:55,w:39,t:0});
			trees.push({x:590,y:67,h:40,w:28,t:1});


			trees.push({x:605,y:40,h:60,w:42,t:0});
			trees.push({x:540,y:67,h:60,w:42,t:1});
			trees.push({x:620,y:53,h:60,w:42,t:0});

			trees.push({x:780,y:50,h:60,w:42,t:0});
			trees.push({x:855,y:38,h:60,w:42,t:1});
			trees.push({x:820,y:50,h:60,w:42,t:2});
		}else{
			trees.push({x:345,y:0,h:115,w:150,t:"castle", sx:355, sy:115, ys: -5});

			trees.push({x:505,y:40,h:55,w:39,t:0});
			trees.push({x:590,y:67,h:40,w:28,t:1});

			trees.push({x:555,y:40,h:60,w:42,t:0});
			trees.push({x:450,y:27,h:60,w:42,t:1});
			trees.push({x:610,y:53,h:60,w:42,t:0});
		}
		this.trees = trees;
	}

	this.GetAlpha = function(){
		var y = this.astralPosition.y*-0.00133+0.326;
		return Math.max(0, y);
	}

	this.Draw = function(timestamp){
		// Limit to 60 fps
		if(!this.playing || timestamp-this.lastFrame < 1000/60){
			return;
		}
		this.lastFrame = timestamp;

		this.LoadTrees();
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Draw skyline for clipping
		this.drawSkyline();
		this.ctx.globalCompositeOperation = "source-out";
		this.drawSky();

		this.ctx.globalCompositeOperation = "source-atop";
		this.astralPosition.rad += .005;
		this.drawAstralItems(this.astralPosition.rad);

		this.ctx.globalCompositeOperation = "source-over";
		this.cloudLayer1Offset -= .6;
		this.cloudLayer2Offset -= .4;
		this.drawClouds();

		this.ctx.globalCompositeOperation = "source-over";
		this.drawSkyline();
		this.drawShadows();
		this.drawTrees();
		this.tint();
	}

	this.drawSkyline = function(){
		this.ctx.save();
		this.ctx.translate(0, this.topOffset);
		this.ctx.fillStyle = this.skylinePattern;
    	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    	this.ctx.restore();
	}

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
	}

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
	}

	this.drawClouds = function(){
		var imageWidth = 1181;
		this.ctx.save();
		this.ctx.translate(this.cloudLayer1Offset, 0);
		this.ctx.fillStyle = this.cloudLayer1;
		this.ctx.fillRect(0, 0, imageWidth*2, this.canvas.height);
		this.ctx.restore()

		this.ctx.save();
		this.ctx.translate(this.cloudLayer2Offset, 0);
		this.ctx.fillStyle = this.cloudLayer2;
		this.ctx.fillRect(0, 0, imageWidth*2, this.canvas.height);
		this.ctx.restore()

		if(this.cloudLayer1Offset <= -imageWidth){
			this.cloudLayer1Offset = 0;
		}
		if(this.cloudLayer2Offset <= -imageWidth){
			this.cloudLayer2Offset = 0;
		}
	}

	this.drawShadows = function(){
		var buffer;
		var bctx;

		// Draw shadows to a buffer so they can be colored;
		buffer = document.createElement('canvas');
		buffer.width = this.canvas.width;
		buffer.height = this.canvas.height;
		bctx = buffer.getContext('2d');

		for(var tree in this.trees){
			bctx.save();
			bctx.globalAlpha = this.GetAlpha();
			bctx.translate(0, this.canvas.height);
			var t = this.trees[tree];
			var trans = this.transValues(t);
			//scale-x, skew-x, skew-y, scale-y, translate-x, translate-y
			bctx.transform(1,0,trans.skew*trans.skewDirection,-trans.scale,trans.x,trans.y);
			if(isNaN(t.t)){
				bctx.drawImage(this.sprite,t.sx,t.sy,t.w,t.h,0,0,t.w,t.h);
			}else{
				bctx.drawImage(this.treeImages[t.t],0,0,t.w,t.h);
			}
			bctx.restore();
		}
		bctx.globalCompositeOperation = 'source-in';
		bctx.fillStyle = "black";
		bctx.fillRect(0,0,this.canvas.width,this.canvas.height);

		// Draw buffer to screen
		this.ctx.drawImage(buffer ,0 ,0);
	}

	this.drawTrees = function(){
		this.ctx.save();
		// Draw trees
		for(var tree in this.trees){
			var t = this.trees[tree];
			if(isNaN(t.t)){
				this.ctx.drawImage(this.sprite,t.sx,t.sy,t.w,t.h,t.x,t.y+this.topOffset,t.w,t.h);
			}else{
				this.ctx.drawImage(this.treeImages[t.t],t.x,t.y+this.topOffset,t.w,t.h);
			}
		}
		this.ctx.restore();
	}

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
	}

	this.transValues = function(t){
		var P1 = {};
		P1.y = t.y+100;
		P1.x = t.x;

		//sun
		var P2 = {}
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
};

var headerNavigation = new HeaderNavigation();
headerNavigation.init();