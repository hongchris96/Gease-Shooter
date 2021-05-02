# Geese-Shooter

Geese Shooter is a side-view 2D platform game where a player controls a robot character using keyboard keys. The goal of the game is to score points by killing geese. Each goose kill gives the player 10 points. The game ends when the player scores 1000 points.

[Geese Shooter Live](https://hongchris96.github.io/Geese-Shooter/)

------
## Technologies

* Javascript
* HTML, Canvas, image sprites
* CSS

------
## Features
##
### Character movement and action
###
Players are able to fully control their robot character using the keyboard. The Robot is able to fly in all directions; it walks and shoots horizontally. When facing different directions or starting to fly, the robot's frame changes. Goose disappears when hit by projectiles. Walking and flying animations are implemented for the geese to indicate movement.

![movement1](https://github.com/hongchris96/Geese-Shooter/blob/main/readme/movement-1.gif)

In my robot class, a directional array is passed in from the keys event listener in game class. Velocity vector is updated according to the directional array.
```javascript
addSpeed(dirArray) {
    if (dirArray === undefined) dirArray = [];

    if (dirArray.length === 0) this.vel = [0, 0];

    if (!dirArray.includes("up")) {
      if (this.pos[1] < 400) this.vel[1] = 1;
      else if (this.pos[1] >= 400) this.vel[1] = 0;
    }

    if (dirArray.length === 1){
      switch(dirArray[0]) {
        case "left":
          if (this.pos[0] > -40) this.vel[0] = -6;
          break;
        case "up":
          if (this.pos[1] > -20) this.vel[1] = -8;
          break;
        case "right":
          if (this.pos[0] < 800) this.vel[0] = 6;
          break;
        case "down":
          if (this.pos[1] < 460) this.vel[1] = 3;
          break;
      }
    }
}
```

Inside my goose class, the goose position increments by 1px per frame. My goose image changes its source frame every 200ms. The game runs on 60 frames per second which is 12 frames per 200ms. I keep track of the prevPos and current position; when the difference is 12px apart, it means 12 frames have passed and it's time to shift the source frame. I utilized modulo for frame rotation.
```javascript
draw(cntx){
  
    if (Math.abs(this.pos[0] - this.prevPos[0]) > 13) {
      this.prevPos = this.pos;
    }

    if (Math.round(Math.abs(this.pos[0] - this.prevPos[0])) === 12) {
      debugger
      this.prevPos = this.pos;
      this.counter += 1;
      if (this.vel[0] < 0) {
        if (this.pos[1] < 400) {
          this.frameX = this.leftAirFrames[this.counter % 2][0];
          this.frameY = this.leftAirFrames[this.counter % 2][1];
        } else {
          this.frameX = this.leftGroundFrames[this.counter % 4][0];
          this.frameY = this.leftGroundFrames[this.counter % 4][1];
        }
      } else {
        if (this.pos[1] < 400) {
          this.frameX = this.rightAirFrames[this.counter % 2][0];
          this.frameY = this.rightAirFrames[this.counter % 2][1];
        } else {
          this.frameX = this.rightGroundFrames[this.counter % 4][0];
          this.frameY = this.rightGroundFrames[this.counter % 4][1];
        }
      }
    }
    drawSprite(this.img, this.width * this.frameX, this.height * this.frameY, this.width, this.height,
      this.pos[0], this.pos[1], this.width * 0.15, this.height * 0.15);
 }
```

------
### Player weapons upgrade as the player accumulate points from kills
###
Robot's initial weapon is a pistol. Each goose kill gives 10 points. At 100 points, rocket projectile is unlocked. Rockets explode upon impact.

![movement2](https://github.com/hongchris96/Geese-Shooter/blob/main/readme/movement-2.gif)

Everytime when I remove a goose, I add 10 points to one of the game instance variable.
```javascript
removeGoose(theGoose) {
    this.geese.splice(this.geese.indexOf(theGoose), 1);
    this.points += 10;
    let newGoose = new Goose({pos: this.randomPos(), game: this});
    this.geese.push(newGoose);
}
```
When reaching 100 points, inside my game draw method. Rocket message gets triggered
```javascript
    if (this.points === 100) {
      this.rocketMessage = true;
    }
    if (this.rocketMessage) {
      this.unlockRocket(cntx);
    }
    if (this.points >= 500 && this.points < 600) {
      this.laserMessage = true;
    }
    if (this.laserMessage) {
      this.unlockLaser(cntx);
    }
```
In my key event listener, access to higher grade weapon is dependent on points.
```javascript
case "1":
    this.robo.switchWeapon('pistol');
    break;
case "2":
    if (this.points >= 100) this.robo.switchWeapon('rocket');
    break;
case "3":
    if (this.points >= 500) this.robo.switchWeapon('laser');
    break;
```

In my checkCollision method, explosion object is added when the rocket hits a goose, and it last for 3 seconds, eliminating any goose that collides with the explosion object.
```javascript
for (let i = 0; i < rockets.length; i++) {
  for (let j = 0; j < geese.length; j++) {
    if (this.rockets[i] !== undefined) {
      if (this.rockets[i].hit(this.geese[j])) {
        let site = [this.geese[j].pos[0] + 50, this.geese[j].pos[1] + 50];
        let boom = new Explosion({pos: site, game: this});
        this.removeGoose(this.geese[j]);
        this.removeRocket(this.rockets[i]);
        this.addExplosion(boom);
      }
    }
  }
}
for (let i = 0; i < explosions.length; i++) {
  for (let j = 0; j < geese.length; j++) {
    if (this.explosions[i] !== undefined) {
      if (this.explosions[i].hit(this.geese[j])) {
        this.removeGoose(this.geese[j]);
      }
    }
  }
}
```
```javascript
addExplosion(boom) {
  this.explosions.push(boom);
  setTimeout(() => {this.explosions.shift()}, 300);
}
```

------
### Future Features

* Add sound effects to buttons and collisions
* Add different characters and projectiles
* Add health bars and damage to robot

