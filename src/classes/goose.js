const MovingObject = require('./moving_object');
const Util = require('../utils/utils');

class Goose extends MovingObject {
  constructor(options) {
    super(options);

    this.velo = Util.randomVec(3);
    this.color = 'blue';
    this.radius = 10;
  }

  draw(cntx) {
    return super.draw(cntx);
  }

  move() {
    return super.move();
  }
}

module.exports = Goose;