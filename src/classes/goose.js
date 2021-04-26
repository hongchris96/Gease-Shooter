const MovingObject = require('./moving_object');
const Util = require('../utils/utils');

class Goose extends MovingObject {
  constructor(options) {
    super(options);

    this.vel = Util.randomVec(5);
    this.color = 'blue';
    this.radius = 10;
  }

  draw(cntx) {
    return super.draw(cntx);
  }
}

module.exports = Goose;