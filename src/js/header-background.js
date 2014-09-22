function HeaderBackground(canvas){
	"use strict";

	this.sprite = null;
	this.canvas = null;
	this.ctx = null;
	this.cloudLayer1 = null;
	this.cloudLayer2 = null;
	this.cloudLayer1Offset = Math.floor(Math.random() * -650) + 1;
	this.cloudLayer2Offset = Math.floor(Math.random() * -650) + 1;

	this.init = function(canvas){
		var buffer;
		var bctx;
		var _this = this;

		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		this.sprite = new Image;
		this.sprite.src = "/images/sprite.png";
		this.sprite.onload = function(){
			// Draw shadows to a buffer so they can be colored;
			buffer = document.createElement('canvas');
			buffer.width = 650;
			buffer.height = 140;
			bctx = buffer.getContext('2d');
			bctx.drawImage(_this.sprite, 0, 543, 650, 140, 0, 0, 370, 80);
			_this.cloudLayer1 = _this.ctx.createPattern(buffer, 'repeat-x');

			bctx.clearRect(0, 0, 650, 140);
			bctx.drawImage(_this.sprite, 420, 290, 650, 140, 0, 0, 370, 80);
			_this.cloudLayer2 = _this.ctx.createPattern(buffer, 'repeat-x');

			var requestAnimFrame = (function(){
				return  window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					function( callback ){
						window.setTimeout(callback, 1000 / 60);
					};
			})();

			
			(function drawLoop(timestamp){
				requestAnimFrame(drawLoop);
				_this.Draw(timestamp);
			})();	
		};
	}
	
	this.Draw = function(timestamp){
		// Limit to 60 fps
		if(timestamp-this.lastFrame < 1000/60){
			return;
		}
		this.lastFrame = timestamp;
		this.cloudLayer1Offset -= .6;
		this.cloudLayer2Offset -= .4;

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.DrawClouds();
	}

	this.DrawClouds = function(){
		var imageWidth = 650;
		this.ctx.globalAlpha = 0.5;
		this.ctx.save();
		this.ctx.translate(this.cloudLayer1Offset, 0);
		this.ctx.fillStyle = this.cloudLayer1;
		this.ctx.fillRect(0, 0, imageWidth*3, this.canvas.height);
		this.ctx.restore()
		
		this.ctx.save();
		this.ctx.translate(this.cloudLayer2Offset, 0);
		this.ctx.fillStyle = this.cloudLayer2;
		this.ctx.fillRect(0, 0, imageWidth*3, this.canvas.height);
		this.ctx.restore()

		if(this.cloudLayer1Offset <= -imageWidth){
			this.cloudLayer1Offset = 0;
		}
		if(this.cloudLayer2Offset <= -imageWidth){
			this.cloudLayer2Offset = 0;
		}
	}

	this.init(canvas);
};
