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
    this.lastTime = 0;
    requestAnimationFrame(this.gameloop.bind(this));
    // gameInterval = setInterval(() => {
    //   if (!this.game.paused) {
    //     this.game.checkCollision();
    //     this.game.moveObjects();
    //     this.game.draw(this.cntx);
    //   }
    // }, 17);
  }

  gameloop(time) {
    const timeDelta = time - this.lastTime;
    if (this.game !== undefined) {
      if (!this.game.paused) {
        this.game.checkCollision();
        this.game.moveObjects();
        this.game.draw(this.cntx);
      }
    }
    this.lastTime = time;
    requestAnimationFrame(this.gameloop.bind(this));
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