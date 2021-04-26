const Goose = require('./goose');

class Game {
  constructor() {
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
    let x = Math.random() > 0.5 ? 0 : this.DIM_X; 
    let y = Math.random() * this.DIM_Y - 20;
    return [x, y]; 
  }

  draw(cntx) {
    cntx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
    for (let i = 0; i < this.geese.length; i++) {
      this.geese[i].draw(cntx);
    }
  }

  moveObjects() {
    this.geese.forEach(goose => goose.move());
  }

  wrap(pos) {
    let x = pos[0];
    let y = pos[1];
    if (pos[0] > this.DIM_X) { 
      x -= this.DIM_X; 
      y = Math.random() * this.DIM_Y;
    }
    else if (pos[0] < 0) {
      x += this.DIM_X;
      y = Math.random() * this.DIM_Y;
    }
    return [x, y];
  }

}

module.exports = Game;