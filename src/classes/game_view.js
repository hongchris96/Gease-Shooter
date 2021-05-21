const Game = require('./game');

const gameOverModalBackground = document.querySelector('.game-over-modal-background');
const gameOver = document.querySelector('.game-over');
const gameOverHead = document.querySelector('h1.win-lose');
const gameOverMessage = document.querySelector('p.game-over-message');

let animFram;

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
      if (this.game.timer === 0) { 
          this.game.paused = true;
          this.game.gameEnd = true;
          let heading;
          let gameMessage;
          if (this.game.points >= 10000) {
            heading = "You Win";
            gameMessage = `Congrats! You have completed the game with ${this.game.points} points.`
            gameOverHead.classList.remove('lose-only');
            gameOverHead.classList.add('win-only');
          } else if (this.game.points < 10000 && this.game.points > 7000) {
            gameOverHead.classList.remove('win-only');
            gameOverHead.classList.add('lose-only');
            heading = "Game Over";
            gameMessage = `Almost there but not quite, needed ${10000 - this.game.points} more points to win.`
          } else {
            gameOverHead.classList.remove('win-only');
            gameOverHead.classList.add('lose-only');
            heading = "Game Over";
            gameMessage = `You need ${10000 - this.game.points} more points to win. Better luck next time.`
          }
          gameOverHead.textContent = heading;
          gameOverMessage.textContent = gameMessage;
          gameOverModalBackground.classList.remove('hidden');
          gameOverModalBackground.classList.add('fade-in');
          gameOver.classList.remove('hidden');
          gameOver.classList.add('fade-in');
      }
    }
    this.lastTime = time;
    animFram = requestAnimationFrame(this.gameloop.bind(this));
  }

  pause() {
    this.game.togglePause();
  }

  destroy() {
    cancelAnimationFrame(animFram);
    this.game.removeEventListener4ThisGame();
    this.game = null;
  }
}

module.exports = GameView;