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
    this.speed = 0;

    // Define abstract function to be implemented in child objects
    this.draw = function() {
    };
}

var Background = function(image) {
    Drawable.call(this, 0, 0);
    this.image = image;
    this.speed = 1;
    this.scale = Math.min(image.width/this.canvasWidth, image.height/this.canvasHeight);
    // Implement abstract function
    this.draw = function() {
        // Pan background
        this.x -= this.speed;
        this.context.drawImage(image, this.x, this.y, image.width/this.scale, image.height/this.scale);
        // Draw another image at the top edge of the first image
        this.context.drawImage(image, this.x + this.canvasWidth, this.y, image.width/this.scale, image.height/this.scale);

        if (this.x <= -this.canvasWidth) {
            this.x += image.width/this.scale;
        }
    };
}

var Elephant = function(frameImages) {
    this.counter = 0;
    this.speed = 1;
    this.fps = 5;
    this.draw = function() {
        this.counter += 1;
        if (this.counter >= frameImages.length*this.fps) {
            this.counter = 0;
        }
        this.context.drawImage(frameImages[Math.floor(this.counter/this.speed/this.fps)], 10, 100, 35, 35);
    }
}

var Game = function(canvas) {
    this.objects = [];
    this.canvas = canvas;
    this.init = function() {
        // Test to see if canvas is supported
        if (this.canvas.getContext) {
            this.context = this.canvas.getContext('2d');

            Drawable.prototype.context = this.context;
            Drawable.prototype.canvasWidth = this.canvas.width;
            Drawable.prototype.canvasHeight = this.canvas.height;

            Background.prototype = Object.create(Drawable.prototype);
            Background.prototype.constructor = Background;
            Elephant.prototype = Object.create(Drawable.prototype);
            Elephant.prototype.constructor = Elephant;

            this.place(new Background(imageRepository.background), 0);
            this.place(new Elephant(imageRepository.elephant), 10);
            var grass = new Background(imageRepository.grass);
            grass.speed = 5;
            this.place(grass, 20);
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
        for(var i=0; i<this.objects.length; i++) {
            this.objects[i].object.draw();
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
