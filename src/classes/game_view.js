const Game = require('./game');

class GameView {
  constructor(cntx) {
    this.cntx = cntx;
    this.game = new Game();
  }

  start() {
    setInterval(() => {
      this.game.moveObjects();
      this.game.draw(this.cntx);
    }, 17);
  }
}

module.exports = GameView;