function AnimatedSprite(options){
	var playing = false;
	var direction = "down";
	var _this = this;
	var currentFrame = 0;


	this.options = extend({
		srcWidth: 64,
		srcHeight: 64,
		destWidth: 64,
		destHeight: 64,
		frames: [],
		fps: 8
	}, options);
	this.lastFrame = 0;
	this.ctx;
	this.spriteSheet;
	
	this.init = function(){
		this.options.canvas.width = this.options.destWidth;
		this.options.canvas.height = this.options.destHeight;
		this.spriteSheet = new Image();
		this.spriteSheet.src = this.options.spriteSheet;
		this.ctx = this.options.canvas.getContext('2d');
		(function drawLoop(timestamp){
			requestAnimFrame(drawLoop);
			_this.render(timestamp);
		})();
	};

	this.play = function(){
		playing = true;
	};

	this.pause = function(){
		playing = false;
	};

	this.setDirection = function(newDirection){
		direction = newDirection;
	};

	this.render = function(timestamp){
		var frame;
		if(!playing){
			return;
		}

		if(timestamp-this.lastFrame < 1000/this.options.fps){
			return;
		}
		this.lastFrame = timestamp;

		currentFrame = (currentFrame+1)%this.options.frames[direction].length;
		frame = this.options.frames[direction][currentFrame];

		this.ctx.clearRect(0,0,this.options.destWidth, this.options.destWidth);
		this.ctx.drawImage(this.spriteSheet, frame.x, frame.y,
			this.options.srcWidth, this.options.srcHeight, 0, 0,
			this.options.destWidth, this.options.destHeight);
	};

	this.init();
}