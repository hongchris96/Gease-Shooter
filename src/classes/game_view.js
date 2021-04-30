const Game = require('./game');

let gameInterval;

class GameView {
  constructor(cntx) {
    this.cntx = cntx;
    this.game = null;
  }
  
  start() {
    this.game = new Game();
    this.game.addKeysListener();
    this.game.removeKeysListener();
    this.game.timePassed();
    gameInterval = setInterval(() => {
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

  destroy() {
    clearInterval(gameInterval);
    this.game.removeEventListener4ThisGame();
    this.game = null;
  }
}

module.exports = GameView;