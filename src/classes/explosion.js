const Util = require('../utils/utils');
// 3520 × 1619

class Explosion {
  constructor(options){
    this.pos = options.pos;
    this.radius = 80;
    this.game = options.game;
  }
  
  draw(cntx){
    var xcolor = cntx.createRadialGradient(this.pos[0], this.pos[1], this.radius - 25, this.pos[0], this.pos[1], this.radius, 100);
    xcolor.addColorStop(0, "yellow");
    xcolor.addColorStop(1, "red");

    cntx.beginPath();
    cntx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true);
    cntx.fillStyle = xcolor;
    cntx.fill();
  }

  hit(target) {
    const expX = this.pos[0];
    const expY = this.pos[1];
    const targetX = target.pos[0] + 50;
    const targetY = target.pos[1] + 50;
    const distance = Math.pow(Math.pow(expX - targetX, 2) + Math.pow(expY - targetY, 2), 0.5);
    if (distance < 120) {
      return true;
    }
    return false;
  }

}


module.exports = Explosion;