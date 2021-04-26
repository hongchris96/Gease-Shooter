// const GooseSpriteImg = require('../assets/images/goose_sprites.png');

// const images = {};
// images.goose = new Image();
// images.goose.src = GooseSpriteImg;

// 2640 × 1980
// 660 × 660

// const gooseWidth = '660';
// const gooseHeight = '660';
// let gooseFrameX = 2;
// let gooseFrameY = 2;

class Sprite {
  // s is source image, d is destination canvas
  constructor(options) {
    this.cntx = options.cntx;
    this.img = options.img;
    this.sx = options.sx
    this.sy = options.sy
    this.sw = options.sw
    this.sh = options.sh
    this.dx = options.dx
    this.dy = options.dy
    this.dw = options.dw
    this.dh = options.dh  
  }

  drawSprite(cntx) {
    cntx.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh)
  }
}

module.exports = Sprite;