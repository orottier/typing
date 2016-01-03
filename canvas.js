var imageRepository = new function() {
    this.background = new Image();
    this.background.src = 'images/sprites/background.png';

    this.background2 = new Image();
    this.background2.src = 'images/sprites/forest.png';

    this.grass = new Image();
    this.grass.src = 'images/sprites/road.png';

    this.house = new Image();
    this.house.src = 'images/sprites/house.png';

    this.house2 = new Image();
    this.house2.src = 'images/sprites/house2.png';

    this.girlfriend = new Image();
    this.girlfriend.src = 'images/elephant/girlfriend.png';

    this.elephant = [];
    for(var i=1; i<=6; i++) {
        var frame = new Image();
        frame.src = 'images/elephant/elephant' + i + '.png';
        this.elephant.push(frame);
    }
};

// abstract class
var Drawable = function(x, y) {
    this.x = x;
    this.y = y;

    // Define abstract function to be implemented in child objects
    this.draw = function() {
    };
}

var Background = function(image, speedScale) {
    Drawable.call(this, 0, 0);
    this.image = image;
    this.scale = 1; //Math.min(image.width/this.canvasWidth, image.height/this.canvasHeight);
    // Implement abstract function
    this.draw = function() {
        // image already loaded?
        if (this.image.width) {
            this.x = -this.game.distance/speedScale % this.image.width;

            for(var i=0; i<this.canvasWidth/image.width+1; i++) {
                // Pan background
                this.context.drawImage(image, this.x + i*image.width, this.y, image.width/this.scale, image.height/this.scale);
            }
        }
    };
}

var Elephant = function(frameImages) {
    this.draw = function() {
        var lineUp = 8; // line up elephant leg movement with ground
        var frame = Math.floor(this.game.distance/lineUp) % frameImages.length;
        this.context.drawImage(frameImages[frame], 30, 126, 89, 73);
    }
}

var StaticImage = function(image, distance, posy) {
    this.draw = function() {
        this.context.drawImage(image, distance - this.game.distance, posy, image.width, image.height);
    }
}

var Milestone = function(step) {
    this.distance = step;
    this.draw = function () {
        this.context.fillStyle = 'rgb(127,127,127)';
        this.context.fillText("" + this.distance, this.distance - this.game.distance, 30);
        if (this.game.distance > this.distance + 100) {
            // put up a new milestone
            this.distance += step;
        }
    }
}

var TextScroll = function() {
    this.text = "Get ready!";
    this.correct = [];
    this.colors = {
        'init': 'rgb(255, 255, 255)',
        'correct': 'rgb(127,255,127)',
        'false': 'rgb(255,127,127)'
    };

    this.draw = function() {
        var xpos = 130;
        var drawText, color;
        for(var i=0; i<this.text.length; i++) {
            if (i >= this.correct.length) {
                drawText = this.text.substr(i);
                color = this.colors.init;
                i = this.text.length; // break loop
            } else {
                drawText = this.text[i];
                color = this.colors[this.correct[i] ? 'correct' : 'false'];
            }

            this.context.fillStyle = color;
            this.context.fillText(drawText, xpos, 130);
            xpos += this.context.measureText(drawText).width;
        }
    }

    this.type = function(correct) {
        if (!correct) {
            // halt the elephant as a penalty
            this.game.targetDistance = this.game.distance;
        }
        this.correct.push(correct);
        this.game.needRedraw = true;
    }
    this.backspace = function() {
        this.correct.pop();
        this.game.needRedraw = true;
    }

    this.setText = function(text) {
        this.text = text;
        this.correct = [];
        this.game.needRedraw = true;
    }
}

var Game = function(canvas) {
    this.canvas = canvas;

    // elephant properties
    this.distance = 0; // current position
    this.targetDistance = 0; // desired position
    this.speed = 0; // current speed to get to the target position (read only!)

    // to be drawn on each frame
    this.objects = [];
    this.previousTime = 0;
    this.needRedraw = true;

    this.init = function() {
        // Test to see if canvas is supported
        if (this.canvas.getContext) {
            this.context = this.canvas.getContext('2d', {
                alpha: false,
                antialias: true,
            });
            this.context.font = "25px 'sans serif'";

            Drawable.prototype.game = this;
            Drawable.prototype.context = this.context;
            Drawable.prototype.canvasWidth = this.canvas.width;
            Drawable.prototype.canvasHeight = this.canvas.height;

            Background.prototype = Object.create(Drawable.prototype);
            Background.prototype.constructor = Background;
            Elephant.prototype = Object.create(Drawable.prototype);
            Elephant.prototype.constructor = Elephant;
            TextScroll.prototype = Object.create(Drawable.prototype);
            TextScroll.prototype.constructor = TextScroll;
            Milestone.prototype = Object.create(Drawable.prototype);
            StaticImage.prototype.constructor = StaticImage;
            StaticImage.prototype = Object.create(Drawable.prototype);
            Milestone.prototype.constructor = Milestone;

            this.place(new Background(imageRepository.background, 50), 0);
            this.place(new Background(imageRepository.background2, 7), 10);
            var grass = new Background(imageRepository.grass, 1);
            this.place(grass, 100);
            this.place(new StaticImage(imageRepository.house, 10, 101), 110);
            this.place(new StaticImage(imageRepository.girlfriend, 20000, 130), 110);
            this.place(new StaticImage(imageRepository.house2, 20100, 60), 110);
            this.place(new Elephant(imageRepository.elephant), 120);
            this.textScroll = new TextScroll();
            this.place(this.textScroll, 1000);
            this.place(new Milestone(1000), 1000);
            return true;
        } else {
            return false;
        }
    };

    this.place = function(object, zIndex) {
        for(var position=0; position<this.objects.length; position++) {
            if (this.objects.zIndex > zIndex) {
                break;
            }
        }
        this.objects.splice(position, 0, {'zIndex': zIndex, 'object': object});
    }

    // Start the animation loop
    this.start = function() {
        this.animate();
    };

    this.animate = function () {
        requestAnimFrame( this.animate.bind(this) );

        var now = (new Date()).getTime();
        this.fps = 1000/(now - this.previousTime);
        this.previousTime = now;
        this.setSpeed();
        // only render if needed
        if (this.speed || this.needRedraw) {
            this.needRedraw = false;
            this.distance += this.speed/this.fps;

            this.context.fillStyle = 'rgb(255,255,255)';
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.fillStyle = 'rgb(127,127,127)';
            for(var i=0; i<this.objects.length; i++) {
                this.objects[i].object.draw();
            }
        }
    }

    this.walk = function(distance) {
        this.targetDistance += distance;
    }
    this.setSpeed = function() {
        var diff = this.targetDistance - this.distance;
        if (diff < 2) {
            this.speed = 0;
            this.targetDistance = this.distance;
        } else {
            this.speed = (this.speed + diff) / 2; //smooth
        }
    }
}

/**
 * requestAnim shim layer by Paul Irish
 * Finds the first API that works to optimize the animation loop,
 * otherwise defaults to setTimeout().
 */
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame   ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(callback, element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

var canvas = document.getElementById('canvas');
var game = new Game(canvas);
if (game.init()) {
    game.start();
}
