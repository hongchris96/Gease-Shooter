const Util = require('../utils/utils');
// const GooseImage = require('../assets/images/goose_sprites.png');

const canvas = document.getElementById('game-canvas');
const cntx = canvas.getContext('2d');


class Goose {
  constructor(options){
    this.width = 660;
    this.height = 660;
    this.pos = options.pos;
    this.vel = Util.randomVec(2);
    this.game = options.game;
    this.leftAirFrames = [[3, 1], [3, 2]];
    this.rightAirFrames = [[3, 0], [2, 2]];
    this.leftGroundFrames = [[0, 2], [1, 2], [2, 0], [2, 1]];
    this.rightGroundFrames = [[0, 0], [1, 0], [0, 1], [1, 1]];
    this.counter = 0;
    this.frameCount = 0;
    this.img = new Image();
    this.img.src = "../src/assets/images/goose_sprites.png";

    if (this.vel[0] < 0) {
      if (this.pos[1] < 400) {
        this.frameX = this.leftAirFrames[0][0];
        this.frameY = this.leftAirFrames[0][1];
      } else {
        this.frameX = this.leftGroundFrames[0][0];
        this.frameY = this.leftGroundFrames[0][1];
      }
    } else {
      if (this.pos[1] < 400) {
        this.frameX = this.rightAirFrames[0][0];
        this.frameY = this.rightAirFrames[0][1];
      } else {
        this.frameX = this.rightGroundFrames[0][0];
        this.frameY = this.rightGroundFrames[0][1];
      }
    }

    this.img.onload = () => this.draw();
  }
  
  draw(cntx){
    this.frameCount += 1;
    if (this.frameCount === 12) {
      this.frameCount = 0;
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
  move(){
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
    let newVal = this.game.wrap(this.pos, this.vel);
    this.pos = newVal[0];
    this.vel = newVal[1];
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

module.exports = Goose;