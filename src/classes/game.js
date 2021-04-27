const Goose = require('./goose');
const Util = require('../utils/utils');

class Game {
  constructor(options) {
    this.DIM_X = 900;
    this.DIM_Y = 550;
    this.NUM_GEESE = 5;
    this.geese = [];
    this.addGoose();

    this.randomPos = this.randomPos.bind(this);
  }

  addGoose() {
    for (let i = 0; i < this.NUM_GEESE; i++) {
      let newGoose = new Goose({pos: this.randomPos(), game: this});
      this.geese.push(newGoose);
    }
  }

  randomPos() {
    let x = Math.random() > 0.5 ? -99 : this.DIM_X + 99; 
    let y = Math.random() * this.DIM_Y - 70;
    return [x, y]; 
  }

  draw(cntx) {
    cntx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
    for (let i = 0; i < this.geese.length; i++) {
      this.geese[i].draw(cntx);
    }
  }

  moveObjects() {
    this.geese.forEach(goose => {
      goose.move();
    });
  }

  wrap(pos, vel) {
    let x = pos[0];
    let y = pos[1];
    let newVel = vel;
    if (pos[0] > this.DIM_X) { 
      x -= this.DIM_X + 99; 
      y = Math.random() * this.DIM_Y - 70;
      newVel = Util.randomVec(2);
    }
    else if (pos[0] < -99) {
      x += this.DIM_X + 99;
      y = Math.random() * this.DIM_Y - 70;
      newVel = Util.randomVec(2);
    }
    return [[x, y], newVel];
  }

}

module.exports = Game;