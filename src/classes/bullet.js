const Util = require('../utils/utils');
// 3520 × 1619

const canvas = document.getElementById('game-canvas');
const cntx = canvas.getContext('2d');
const NORMAL_FPS_TIME_DELTA = 1000 / 60;

class Bullet {
  constructor(options){
    this.width = 580;
    this.height = 480;
    this.pos = options.pos;
    this.vel = options.vel;
    this.game = options.game;
    this.img = new Image();
    this.img.src = "./src/assets/images/projectile_sprites.png";

    this.sourceX = 0;
    this.sourceY = 1080;

    this.img.onload = () => this.draw();
  }
  
  draw(cntx){
    if (this.vel[0] < 0) {
      this.sourceX = 0;
    } else {
      this.sourceX = 590;
    }
    drawSprite(this.img, this.sourceX, this.sourceY, this.width, this.height,
      this.pos[0], this.pos[1], this.width * 0.03, this.height * 0.03);
  }

  move(timeDelta){
    const velScale = timeDelta / NORMAL_FPS_TIME_DELTA,
    offsetX = this.vel[0] * velScale,
    offsetY = this.vel[1] * velScale;
    this.pos[0] += offsetX;
    this.pos[1] += offsetY;

    if (this.pos[0] < 0 || this.pos[0] > 900 || this.pos[1] > 550 || this.pos[1] < 0) {
      this.game.removeBullet();
    }
  }

  hit(target) {
    const bulletX = this.pos[0];
    const bulletY = this.pos[1];
    const targetX = target.pos[0];
    const targetY = target.pos[1];
    if (bulletX >= targetX && bulletX < targetX + 80 && bulletY >= targetY - 10 && bulletY < targetY + 80) {
      return true;
    }
    return false;
  }

}

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
  cntx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}


module.exports = Bullet;