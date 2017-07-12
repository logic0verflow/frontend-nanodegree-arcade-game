// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = this.y = undefined;
    this.moveYAmt = 83;
    this.speed;
    this.minY = 58;
};

// Resets the enemy location, speed, and lane once it has left
// the map
Enemy.prototype.reset = function() {
    // Spawning x location that is off screen
    this.x = -200;

    // Pick a random speed between 100 and 300, this value
    // gets multiplied by delta time
    this.speed = 100 * Math.floor((Math.random() * 4) + 1);

    // Selects a random lane number for the enemy to travel on
    var lane = Math.floor(Math.random() * 3);

    // Sets enemy's y location based on the lane
    this.y = this.minY + (this.moveYAmt * lane);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {

    // Call reset at least once before trying to move an enemy
    if (this.x === undefined) {
        this.reset();
    }

    // Update enemy location
    this.x += this.speed * dt;

    // Reset the enemy if it left the map
    if (this.x > ctx.canvas.width) {
        this.reset();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    // Create the position variables
    this.x = this.y = undefined;
};

// Start creates all the properties needed for a player object.
Player.prototype.start = function() {
    // How much the player moves horizontally
    this.moveHAmt = ctx.canvas.width / 5;

    // How much the player moves vertically
    this.moveVAmt = 83;

    // How much the player needs to move horizontally during
    // the next update
    this.xAdjustment = 0;

    // How much the player needs to move vertically during
    // the next update
    this.yAdjustment = 0;

    // The max and min x positions for the player
    this.maxX = this.moveHAmt * 4;
    this.minX = 0;

    // The max and min y positions for the player
    this.maxY = this.moveVAmt * 5 - 35;
    this.minY = -35;

    // Player needs to respawn at least once to start in the
    // correct location
    this.respawn();
}

// Reset the player position to the spawn location and ensure
// no movement is going to be applied afterwards
Player.prototype.respawn = function() {
    this.x = this.moveHAmt * 2;
    this.y = this.maxY;
    this.xAdjustment = 0;
    this.yAdjustment = 0;
};

// Update the player's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {

    // If the player has no x position, call the start function
    // only once to create a new player object with a position
    if (this.x === undefined) {
        this.start();
    }

    // Apply any horizontal movement and reset the adjustments
    this.x += this.xAdjustment;
    this.xAdjustment = 0;

    // Prevent player from leaving the map horizontally
    this.x = (this.x < this.minX) ? this.minX : this.x;
    this.x = (this.x > this.maxX) ? this.maxX : this.x;

    // Apply any vertical movement and reset the adjustments
    this.y += this.yAdjustment;
    this.yAdjustment = 0;

    // Prevent player from leaving the map vertically
    this.y = (this.y < this.minY) ? this.minY : this.y;
    this.y = (this.y > this.maxY) ? this.maxY : this.y;

    // Player reached the water, go back to starting position
    if (this.y === this.minY) {
        this.respawn();
    }
};

// Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Update the adjustment variables that will update the players
// position based on the input
Player.prototype.handleInput = function(dir) {
    this.xAdjustment = 0;
    if (dir === 'left') {
        this.xAdjustment -= this.moveHAmt;
    }
    if (dir === 'right') {
        this.xAdjustment += this.moveHAmt;
    }
    if (dir === 'up') {
        this.yAdjustment -= this.moveVAmt;
    }
    if (dir === 'down') {
        this.yAdjustment += this.moveVAmt;
    }
};

// Place all enemy objects in an array called allEnemies
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];
// Place the player object in a variable called player
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
