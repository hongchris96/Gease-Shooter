const Game = require('./game');

class GameView {
  constructor(cntx) {
    this.game = new Game();
    this.cntx = cntx;
  }

  start() {
    setInterval(() => {
      this.game.moveObjects();
      this.game.draw(this.cntx);
    }, 17);
  }
}

module.exports = GameView;