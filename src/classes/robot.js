const Util = require('../utils/utils');
const Bullet = require('./bullet');
const Rocket = require('./rocket');
// const RoboImage = require('../assets/images/robo_sprites.png');
// 1840 × 1280
const canvas = document.getElementById('game-canvas');
const cntx = canvas.getContext('2d');
const NORMAL_FPS_TIME_DELTA = 1000 / 60;

class Robot {
  constructor(options){
    this.width = 920;
    this.height = 640;
    this.pos = [380, 410];
    this.vel = [0, 0];
    this.game = options.game;
    this.leftAirFrames = [0, 0];
    this.rightAirFrames = [1, 0];
    this.leftGroundFrames = [0, 1];
    this.rightGroundFrames = [1, 1];
    this.img = new Image();
    this.img.src = "../src/assets/images/robo_sprites.png";
    this.frameX = this.rightGroundFrames[0];
    this.frameY = this.rightGroundFrames[1];
    this.weapon = 'pistol';
    this.laserStatus = false;
    this.img.onload = () => this.draw();
  }
  
  draw(dirArray) {
    let firstTwoKeys = [];
    if (dirArray !== undefined) {
      firstTwoKeys = dirArray.slice(0, 2);
    }

    if (firstTwoKeys.includes("left") && firstTwoKeys.includes("right")) {
      if (this.pos[1] < 400) {
        this.frameX = firstTwoKeys[1] === "left" ? this.leftAirFrames[0] : this.rightAirFrames[0];
        this.frameY = firstTwoKeys[1] === "left" ? this.leftAirFrames[1] : this.rightAirFrames[1];
      } else {
        this.frameX = firstTwoKeys[1] === "left" ? this.leftGroundFrames[0] : this.rightGroundFrames[0];
        this.frameY = firstTwoKeys[1] === "left" ? this.leftGroundFrames[1] : this.rightGroundFrames[1];
      }
    } else if (firstTwoKeys.includes("left") && !firstTwoKeys.includes("right")) {
      if (this.pos[1] < 400) {
        this.frameX = this.leftAirFrames[0];
        this.frameY = this.leftAirFrames[1];
      } else {
        this.frameX = this.leftGroundFrames[0];
        this.frameY = this.leftGroundFrames[1];
      }
    } else if (firstTwoKeys.includes("right") && !firstTwoKeys.includes("left")){
      if (this.pos[1] < 400) {
        this.frameX = this.rightAirFrames[0];
        this.frameY = this.rightAirFrames[1];
      } else {
        this.frameX = this.rightGroundFrames[0];
        this.frameY = this.rightGroundFrames[1];
      } 
    } else {
      if (this.pos[1] < 400) {
        if (this.frameX === this.leftGroundFrames[0] && this.frameY === this.leftGroundFrames[1]) {
          this.frameX = this.leftAirFrames[0];
          this.frameY = this.leftAirFrames[1];
        } else if (this.frameX === this.rightGroundFrames[0] && this.frameY === this.rightGroundFrames[1]) {
          this.frameX = this.rightAirFrames[0];
          this.frameY = this.rightAirFrames[1];
        }
      } else {
        if (this.frameX === this.leftAirFrames[0] && this.frameY === this.leftAirFrames[1]) {
          this.frameX = this.leftGroundFrames[0];
          this.frameY = this.leftGroundFrames[1];
        } else if (this.frameX === this.rightAirFrames[0] && this.frameY === this.rightAirFrames[1]) {
          this.frameX = this.rightGroundFrames[0];
          this.frameY = this.rightGroundFrames[1];
        }
      }
    }

    drawSprite(this.img, this.width * this.frameX, this.height * this.frameY, this.width, this.height,
      this.pos[0], this.pos[1], this.width * 0.15, this.height * 0.15);
    if (this.laserStatus) {
      let laserPos;
      let lineDir;
      if (this.frameX === this.leftAirFrames[0] || this.frameX === this.leftGroundFrames[0]) {
        laserPos = [this.pos[0] + 35, this.pos[1] + 65];
        lineDir = [0 ,laserPos[1]]
      } else if (this.frameX === this.rightAirFrames[0] || this.frameX === this.rightGroundFrames[0]) {
        laserPos = [this.pos[0] + 100, this.pos[1] + 65];
        lineDir = [900, laserPos[1]];
      }
      cntx.beginPath();
      cntx.moveTo(laserPos[0], laserPos[1]);
      cntx.lineTo(...lineDir);
      cntx.lineWidth = 5;
      cntx.strokeStyle = '#ff0000';
      cntx.stroke();
    }
  }

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
    } else if (dirArray.length > 1) {
      let firstTwoKeys = dirArray.slice(0, 2);
      if ((firstTwoKeys.includes("up") && firstTwoKeys.includes("down")) || 
          (firstTwoKeys.includes("left") && firstTwoKeys.includes("right"))) {
            switch(firstTwoKeys[1]) {
              case "left":
                if (this.pos[0] > -40) this.vel[0] = -6;
                break;
              case "up":
                if (this.pos[1] > -20) this.vel[1] = -3;
                break;
              case "right":
                if (this.pos[0] < 800) this.vel[0] = 6;
                break;
              case "down":
                if (this.pos[1] < 460) this.vel[1] = 3;
                break;
            }
      } else {
        if (firstTwoKeys.includes("up") && firstTwoKeys.includes("left")) {
          if (this.pos[0] > -40 && this.pos[1] > -20) {
            this.vel[0] = -6;
            this.vel[1] = -3;
          }
        } else if (firstTwoKeys.includes("up") && firstTwoKeys.includes("right")) {
          if (this.pos[0] < 800 && this.pos[1] > -20) {
            this.vel[0] = 6;
            this.vel[1] = -3;
          }
        } else if (firstTwoKeys.includes("down") && firstTwoKeys.includes("left")) {
          if (this.pos[0] > -40 && this.pos[1] < 460) {
            this.vel[0] = -6;
            this.vel[1] = 3;
          }
        } else if (firstTwoKeys.includes("down") && firstTwoKeys.includes("right")) {
          if (this.pos[0] < 800 && this.pos[1] < 460) {
            this.vel[0] = 6;
            this.vel[1] = 3;
          }
        }
      }
    }
  }

  move(timeDelta) {
  
    const velScale = timeDelta / NORMAL_FPS_TIME_DELTA,
    offsetX = this.vel[0] * velScale,
    offsetY = this.vel[1] * velScale;
    if (this.pos[0] + offsetX < 800 && this.pos[0] + offsetX > -40) {
      this.pos[0] += offsetX;
    }
    if (this.pos[1] + offsetY < 460 && this.pos[1] + offsetY > -20) {
      if (this.pos[1] >= 400 && this.vel[1] === 1) {
        this.pos[1] = this.pos[1];
      } else {
        this.pos[1] += offsetY;
      }
    }
    
  }

  switchWeapon(weaponType) {
    this.weapon = weaponType;
  }

  fireBullet() {
    let bulletVel;
    if (this.frameX === this.leftAirFrames[0] || this.frameX === this.leftGroundFrames[0]) {
      bulletVel = [-12, 0];
    } else if (this.frameX === this.rightAirFrames[0] || this.frameX === this.rightGroundFrames[0]) {
      bulletVel = [12, 0];
    }

    let bulletPos = [this.pos[0] + 70, this.pos[1] + 50];

    const bullet = new Bullet({
      pos: bulletPos,
      vel: bulletVel,
      game: this.game
    });

    this.game.addBullet(bullet);
  }

  fireRocket() {
    let rocketVel;
    let rocketPos;
    if (this.frameX === this.leftAirFrames[0] || this.frameX === this.leftGroundFrames[0]) {
      rocketVel = [-2, 0];
      rocketPos = [this.pos[0] - 30, this.pos[1] + 50];
    } else if (this.frameX === this.rightAirFrames[0] || this.frameX === this.rightGroundFrames[0]) {
      rocketVel = [2, 0];
      rocketPos = [this.pos[0] + 70, this.pos[1] + 50];
    }

    const rocket = new Rocket({
      pos: rocketPos,
      vel: rocketVel,
      game: this.game
    });

    this.game.addRocket(rocket);
  }

  fireLaser() {
    this.laserStatus = true;
  }

  turnOffLaser() {
    this.laserStatus = false;
  }

  laserHit(target) {
    const laserX = this.pos[0] + 65;
    const laserY = this.pos[1] + 65;
    const targetX = target.pos[0];
    const targetY = target.pos[1];
    if (this.frameX === this.leftAirFrames[0] || this.frameX === this.leftGroundFrames[0]) {
      if (laserX >= targetX + 60 && laserY >= targetY && laserY < targetY + 80) return true;
    } else if (this.frameX === this.rightAirFrames[0] || this.frameX === this.rightGroundFrames[0]) {
      if (laserX < targetX && laserY >= targetY && laserY < targetY + 80) return true;
    }
    return false;
  }

}

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
  cntx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

module.exports = Robot;