const Util = require('../utils/utils');
// 3520 × 1619

const canvas = document.getElementById('game-canvas');
const cntx = canvas.getContext('2d');


class Rocket {
  constructor(options){
    this.width = 1760;
    this.height = 400;
    this.pos = options.pos;
    this.vel = options.vel;
    this.game = options.game;
    this.img = new Image();
    this.img.src = "../src/assets/images/projectile_sprites.png";

    this.sourceX = 0;
    this.sourceY = 400;

    this.img.onload = () => this.draw();
  }
  
  draw(cntx){
    if (this.vel[0] < 0) {
      this.sourceX = 0;
    } else {
      this.sourceX = 1760;
    }
    drawSprite(this.img, this.sourceX, this.sourceY, this.width, this.height,
      this.pos[0], this.pos[1], this.width * 0.06, this.height * 0.06);
  }

  move(){
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];

    if (this.pos[0] < -100 || this.pos[0] > 900 || this.pos[1] > 550 || this.pos[1] < 0) {
      this.game.removeRocket();
    }
  }

  hit(target) {
    const rocketX = this.pos[0];
    const rocketY = this.pos[1];
    const targetX = target.pos[0];
    const targetY = target.pos[1];
    if (rocketX >= targetX - 80 && rocketX < targetX + 60 && rocketY >= targetY - 20 && rocketY < targetY + 80) {
      return true;
    }
    return false;
  }

}

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
  cntx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}


module.exports = Rocket;