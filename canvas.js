var canvas = document.getElementById('canvas');

var imageRepository = new function() {
    this.background = new Image();
    this.background.src = 'images/stars.png';
};

// abstract class
var Drawable = function(x, y) {
    console.log("New Drawable", x, y);
    this.x = x;
    this.y = y;
    this.speed = 0;

    // Define abstract function to be implemented in child objects
    this.draw = function() {
    };
}

var Background = function(image) {
    console.log("New background", image);
    Drawable.call(this, 0, 0);
    this.image = image;
    this.speed = 1;
    // Implement abstract function
    this.draw = function() {
        // Pan background
        this.x -= this.speed;
        this.context.drawImage(image, this.x, this.y);
        // Draw another image at the top edge of the first image
        this.context.drawImage(image, this.x + this.canvasWidth, this.y);

        // If the image scrolled off the screen, reset
        if (this.x <= -this.canvasWidth) {
            this.x = 0;
        }
    };
}

var Game = function() {
    this.init = function() {
        // Get the canvas element
        this.bgCanvas = document.getElementById('canvas');
        // Test to see if canvas is supported
        if (this.bgCanvas.getContext) {
            this.bgContext = this.bgCanvas.getContext('2d');

            Drawable.prototype.context = this.bgContext;
            Drawable.prototype.canvasWidth = this.bgCanvas.width;
            Drawable.prototype.canvasHeight = this.bgCanvas.height;

            // Set Background to inherit properties from Drawable
            Background.prototype = Object.create(Drawable.prototype);
            Background.prototype.constructor = Background;

            this.background = new Background(imageRepository.background);
            return true;
        } else {
            return false;
        }
    };

    // Start the animation loop
    this.start = function() {
        animate();
    };
}

function animate() {
	requestAnimFrame( animate );
	game.background.draw();
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
            function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
            };
})();

var game = new Game();
if(game.init()) {
    game.start();
}
