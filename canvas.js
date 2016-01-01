var imageRepository = new function() {
    this.background = new Image();
    this.background.src = 'images/stars.png';

    this.grass = new Image();
    this.grass.src = 'images/grass.png';

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
    this.scale = Math.min(image.width/this.canvasWidth, image.height/this.canvasHeight);
    // Implement abstract function
    this.draw = function() {
        // Pan background
        this.x -= this.game.speed/speedScale;
        this.context.drawImage(image, this.x, this.y, image.width/this.scale, image.height/this.scale);
        // Draw another image at the top edge of the first image
        this.context.drawImage(image, this.x + this.canvasWidth, this.y, image.width/this.scale, image.height/this.scale);

        if (this.x <= -this.canvasWidth) {
            this.x = 0;
        }
    };
}

var Elephant = function(frameImages) {
    this.counter = 0;
    this.fps = 5;
    this.draw = function() {
        this.counter += 1;
        var frame = Math.floor(this.counter/100*this.game.speed);
        if (frame >= frameImages.length) {
            this.counter = 0;
            frame = 0;
        }
        this.context.drawImage(frameImages[frame], 10, 100, 85, 85);
    }
}

var TextScroll = function() {
    this.draw = function() {
        this.context.fillText("Je moet even deze tekst typen, joo?", 130, 130);
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

    this.init = function() {
        // Test to see if canvas is supported
        if (this.canvas.getContext) {
            this.context = this.canvas.getContext('2d', {
                alpha: false,
                antialias: true,
            });
            this.context.font = "30px 'sans serif'";

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

            this.place(new Background(imageRepository.background, 100), 0);
            this.place(new Elephant(imageRepository.elephant), 10);
            var grass = new Background(imageRepository.grass, 10);
            this.place(grass, 20);
            this.place(new TextScroll(), 100);
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
        this.distance += this.speed/this.fps;
        console.log('speed', this.speed, 'distance', this.distance);

        this.context.fillStyle = 'rgb(255,255,255)';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = 'rgb(127,127,127)';
        for(var i=0; i<this.objects.length; i++) {
            this.objects[i].object.draw();
        }
    }

    this.walk = function(distance) {
        this.targetDistance += distance;
    }
    this.setSpeed = function() {
        var diff = 1.0*(this.targetDistance - this.distance);
        if (diff < 1) {
            this.speed = 0;
            this.distance = this.targetDistance;
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
