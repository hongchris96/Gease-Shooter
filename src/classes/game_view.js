const Game = require('./game');

let gameInterval;
const gameOverModalBackground = document.querySelector('.game-over-modal-background');
const gameOver = document.querySelector('.game-over');

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
  }

  gameloop(time) {
    const timeDelta = time - this.lastTime;
    if (this.game !== null) {
      if (!this.game.paused) {
        this.game.checkCollision();
        this.game.moveObjects(timeDelta);
        this.game.draw(this.cntx);
      }
    }
    this.lastTime = time;
    requestAnimationFrame(this.gameloop.bind(this));
    if (this.game.timer === 0) { 
        this.game.paused = true;
        this.game.gameEnd = true;
        gameOverModalBackground.classList.remove('hidden');
        gameOverModalBackground.classList.add('fade-in');
        gameOver.classList.remove('hidden');
        gameOver.classList.add('fade-in');
    }
  }

  pause() {
    this.game.togglePause();
  }

  destroy() {
    this.game.removeEventListener4ThisGame();
    this.game = null;
  }
}

module.exports = GameView;