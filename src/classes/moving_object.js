const gooseImage = require('../assets/images/goose-air-left.gif')

class MovingObject {
  constructor(options) {
    this.pos = options.pos;
    this.velo = options.velo;
    this.radius = options.radius;
    this.color = options.color;
    this.game = options.game;
  }

  draw(cntx) {
    cntx.beginPath();
    cntx.arc(this.pos[0], this.pos[1], this.radius, 0, Math.PI * 2, true);
    cntx.fillStyle = this.color;
    cntx.fill();
    cntx.strokeStyle = 'black';
    cntx.lineWidth = 2;
    cntx.stroke();
  }

  move() {
    this.pos[0] += this.velo[0];
    this.pos[1] += this.velo[1];
    this.pos = this.game.wrap(this.pos);
  }
}


module.exports = MovingObject;