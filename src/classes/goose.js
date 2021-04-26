const MovingObject = require('./moving_object');
const Util = require('../utils/utils');
const Sprite = require('../utils/sprite');
const GooseSpriteImg = require('../assets/images/goose_sprites.png');

class Goose extends MovingObject {
  constructor(options) {
    super(options);
    this.velo = Util.randomVec(2);
    this.color = 'blue';
    this.radius = 10;
    this.cntx = options.cntx;
    this.img = new Image();
    this.img.src = GooseSpriteImg;
    this.gooseSprites = new Sprite({
      img: this.img,
      sx: this.sx,
      sy: this.sy,
      sw: this.sw,
      sh: this.sh,
      dx: this.dx,
      dy: this.dy,
      dw: this.dw,
      dh: this.dh
    });
  }

  draw(cntx) {
    return this.gooseSprites.drawSprite(cntx);
  }

  move() {
    return super.move();
  }
}

module.exports = Goose;