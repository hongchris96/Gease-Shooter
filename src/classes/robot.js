const Util = require('../utils/utils');
// const RoboImage = require('../assets/images/robo_sprites.png');
// 1840 × 1280
const canvas = document.getElementById('game-canvas');
const cntx = canvas.getContext('2d');


class Robot {
  constructor(options){
    this.width = 920;
    this.height = 640;
    this.pos = [380, 410];
    this.vel = [10, 10];
    this.game = options.game;
    this.leftAirFrames = [0, 0];
    this.rightAirFrames = [1, 0];
    this.leftGroundFrames = [0, 1];
    this.rightGroundFrames = [1, 1];
    this.img = new Image();
    this.img.src = "../src/assets/images/robo_sprites.png";
    this.frameX = this.rightGroundFrames[0];
    this.frameY = this.rightGroundFrames[1];

    this.img.onload = () => this.draw();
  }
  
  draw(dirArray){
    let firstTwoKeys = dirArray.slice(0, 2);
    if (firstTwoKeys.includes("left")) {
      if (this.pos[1] < 400) {
        this.frameX = this.leftAirFrames[0];
        this.frameY = this.leftAirFrames[1];
      } else {
        this.frameX = this.leftGroundFrames[0];
        this.frameY = this.leftGroundFrames[1];
      }
    } else if (firstTwoKeys.includes("right")){
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
  }

  move(dirArray){
    console.log(dirArray);
    if (dirArray.length === 1){
      switch(dirArray[0]) {
        case "left":
          if (this.pos[0] > -40) this.pos[0] -= this.vel[0];
          break;
        case "up":
          if (this.pos[1] > -20) this.pos[1] -= this.vel[1];
          break;
        case "right":
          if (this.pos[0] < 800) this.pos[0] += this.vel[0];
          break;
        case "down":
          if (this.pos[1] < 460) this.pos[1] += this.vel[1];
          break;
      }
    } else if (dirArray.length > 1) {
      let firstTwoKeys = dirArray.slice(0, 2);
      if ((firstTwoKeys.includes("up") && firstTwoKeys.includes("down")) || 
          (firstTwoKeys.includes("left") && firstTwoKeys.includes("right"))) {
            switch(firstTwoKeys[0]) {
              case "left":
                if (this.pos[0] > -40) this.pos[0] -= this.vel[0];
                break;
              case "up":
                if (this.pos[1] > -20) this.pos[1] -= this.vel[1];
                break;
              case "right":
                if (this.pos[0] < 800) this.pos[0] += this.vel[0];
                break;
              case "down":
                if (this.pos[1] < 460) this.pos[1] += this.vel[1];
                break;
            }
      } else {
        if (firstTwoKeys.includes("up") && firstTwoKeys.includes("left")) {
          if (this.pos[0] > -40 && this.pos[1] > -20) {
            this.pos[0] -= this.vel[0];
            this.pos[1] -= this.vel[1];
          }
        } else if (firstTwoKeys.includes("up") && firstTwoKeys.includes("right")) {
          if (this.pos[0] < 800 && this.pos[1] > -20) {
            this.pos[0] += this.vel[0];
            this.pos[1] -= this.vel[1];
          }
        } else if (firstTwoKeys.includes("down") && firstTwoKeys.includes("left")) {
          if (this.pos[0] > -40 && this.pos[1] < 460) {
            this.pos[0] -= this.vel[0];
            this.pos[1] += this.vel[1];
          }
        } else if (firstTwoKeys.includes("down") && firstTwoKeys.includes("right")) {
          if (this.pos[0] < 800 && this.pos[1] < 460) {
            this.pos[0] += this.vel[0];
            this.pos[1] += this.vel[1];
          }
        }
      }
    }
  }

}

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
  cntx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

// function animate(){
//   cntx.clearRect(0, 0, canvas.width, canvas.height);
//   newgoose[i].draw();
//   newgoose[i].move();
// }

module.exports = Robot;