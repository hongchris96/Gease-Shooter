const Game = require('./game');

class GameView {
  constructor(cntx) {
    this.cntx = cntx;
    this.game = new Game();
    this.game.addKeysListener();
    this.game.removeKeysListener();
  }

  start() {
    this.game.timePassed();
    setInterval(() => {
      if (!this.game.paused) {
        this.game.checkCollision();
        this.game.moveObjects();
        this.game.draw(this.cntx);
      }
    }, 17);
  }

  pause() {
    this.game.togglePause();
  }
}

module.exports = GameView;