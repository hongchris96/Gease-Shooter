/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/classes/bullet.js":
/*!*******************************!*\
  !*** ./src/classes/bullet.js ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Util = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
// 3520 × 1619

const canvas = document.getElementById('game-canvas');
const cntx = canvas.getContext('2d');
const NORMAL_FPS_TIME_DELTA = 1000 / 60;

class Bullet {
  constructor(options){
    this.width = 580;
    this.height = 480;
    this.pos = options.pos;
    this.vel = options.vel;
    this.game = options.game;
    this.img = new Image();
    this.img.src = "../src/assets/images/projectile_sprites.png";

    this.sourceX = 0;
    this.sourceY = 1080;

    this.img.onload = () => this.draw();
  }
  
  draw(cntx){
    if (this.vel[0] < 0) {
      this.sourceX = 0;
    } else {
      this.sourceX = 590;
    }
    drawSprite(this.img, this.sourceX, this.sourceY, this.width, this.height,
      this.pos[0], this.pos[1], this.width * 0.03, this.height * 0.03);
  }

  move(timeDelta){
    const velScale = timeDelta / NORMAL_FPS_TIME_DELTA,
    offsetX = this.vel[0] * velScale,
    offsetY = this.vel[1] * velScale;
    this.pos[0] += offsetX;
    this.pos[1] += offsetY;

    if (this.pos[0] < 0 || this.pos[0] > 900 || this.pos[1] > 550 || this.pos[1] < 0) {
      this.game.removeBullet();
    }
  }

  hit(target) {
    const bulletX = this.pos[0];
    const bulletY = this.pos[1];
    const targetX = target.pos[0];
    const targetY = target.pos[1];
    if (bulletX >= targetX && bulletX < targetX + 80 && bulletY >= targetY - 10 && bulletY < targetY + 80) {
      return true;
    }
    return false;
  }

}

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
  cntx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}


module.exports = Bullet;

/***/ }),

/***/ "./src/classes/explosion.js":
/*!**********************************!*\
  !*** ./src/classes/explosion.js ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Util = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
// 3520 × 1619

class Explosion {
  constructor(options){
    this.pos = options.pos;
    this.radius = 80;
    this.game = options.game;
  }
  
  draw(cntx){
    var xcolor = cntx.createRadialGradient(this.pos[0], this.pos[1], this.radius - 25, this.pos[0], this.pos[1], this.radius, 100);
    xcolor.addColorStop(0, "yellow");
    xcolor.addColorStop(1, "red");

    cntx.beginPath();
    cntx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true);
    cntx.fillStyle = xcolor;
    cntx.fill();
  }

  hit(target) {
    const expX = this.pos[0];
    const expY = this.pos[1];
    const targetX = target.pos[0] + 50;
    const targetY = target.pos[1] + 50;
    const distance = Math.pow(Math.pow(expX - targetX, 2) + Math.pow(expY - targetY, 2), 0.5);
    if (distance < 120) {
      return true;
    }
    return false;
  }

}


module.exports = Explosion;

/***/ }),

/***/ "./src/classes/game.js":
/*!*****************************!*\
  !*** ./src/classes/game.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Goose = __webpack_require__(/*! ./goose */ "./src/classes/goose.js");
const Robo = __webpack_require__(/*! ./robot */ "./src/classes/robot.js");
const Explosion = __webpack_require__(/*! ./explosion */ "./src/classes/explosion.js");
const Util = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");

class Game {
  constructor(options) {
    this.DIM_X = 900;
    this.DIM_Y = 550;
    this.NUM_GEESE = 4;
    this.geese = [];
    this.addGoose();
    this.bullets = [];
    this.rocketMessage = false;
    this.rockets = [];
    this.explosions = [];
    this.laserMessage = false;
    this.robo = new Robo({game: this});
    this.actionKeys = [];
    this.points = 0;
    this.timer = 60;
    this.paused = false;
    this.randomPos = this.randomPos.bind(this);

    this.keydownAction = this.keydownAction.bind(this);
    this.keyupAction = this.keyupAction.bind(this);

    this.gameEnd = false;
  }

  timePassed() {
    if (!this.paused) {
      setInterval(() => {this.timer -= 1}, 1000);
    }
  }

  togglePause() {
    if (!this.paused) this.paused = true;
    else this.paused = false;
  }

  showProperTime() {
    let minutes = Math.floor(this.timer / 60).toString();
    let seconds = (this.timer % 60).toString();
    if (minutes.length === 1) {
      minutes = "0" + minutes;
    }
    if (seconds.length === 1) {
      seconds = "0" + seconds;
    }
    return `${minutes}:${seconds}`;
  }

  addGoose() {
    while (this.geese.length < this.NUM_GEESE) {
      let newGoose = new Goose({pos: this.randomPos(), game: this});
      this.geese.push(newGoose);
    }
  }

  removeGoose(theGoose) {
    this.geese.splice(this.geese.indexOf(theGoose), 1);
    this.points += 10;
    let newGoose = new Goose({pos: this.randomPos(), game: this});
    this.geese.push(newGoose);
  }

  addBullet(bullet) {
    this.bullets.push(bullet);
  }

  removeBullet(bullet) {
    if (bullet === undefined) {
      this.bullets.shift();
    } else {
      this.bullets.splice(this.bullets.indexOf(bullet), 1);
    }
  }

  unlockRocket(cntx) {
    cntx.font = "25px Comic Sans MS";
    cntx.fillStyle = "#b20000";
    cntx.textAlign = "center";
    cntx.fillText("You have unlocked Rockets. Press [2] to equip.", 450, 50);
    setTimeout(() => {
      this.rocketMessage = false;
    }, 3000);
  }

  unlockLaser(cntx) {
    cntx.font = "25px Comic Sans MS";
    cntx.fillStyle = "#b20000";
    cntx.textAlign = "center";
    cntx.fillText("You have unlocked Laser. Press [3] to equip.", 450, 50);
    setTimeout(() => {
      this.laserMessage = false;
    }, 3000);
  }

  addRocket(rocket) {
    this.rockets.push(rocket);
  }

  removeRocket(rocket) {
    if (rocket === undefined) {
      this.rockets.shift();
    } else {
      this.rockets.splice(this.rockets.indexOf(rocket), 1);
    }
  }

  addExplosion(boom) {
    this.explosions.push(boom);
    setTimeout(() => {this.explosions.shift()}, 300);
  }

  randomPos() {
    let x = Math.random() > 0.5 ? -100 : this.DIM_X + 100; 
    let y = (Math.random() * (this.DIM_Y - 100)) + 10;
    return [x, y]; 
  }

  draw(cntx) {
    cntx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
    cntx.font = "100px Comic Sans MS";
    if (this.timer > 10) cntx.fillStyle = "gray";
    else cntx.fillStyle = "red";
    cntx.textAlign = "left";
    cntx.globalAlpha = 0.2;
    cntx.fillText(`\u{1F553} ${this.showProperTime()}`, 240, 310);
    cntx.globalAlpha = 1;
    for (let i = 0; i < this.geese.length; i++) {
      this.geese[i].draw(cntx);
    }
    this.robo.draw(this.actionKeys);
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].draw(cntx);
    }
    for (let i = 0; i < this.rockets.length; i++) {
      this.rockets[i].draw(cntx);
    }
    for (let i = 0; i < this.explosions.length; i++) {
      this.explosions[i].draw(cntx);
    }
    cntx.font = "30px Comic Sans MS";
    cntx.fillStyle = "black";
    cntx.textAlign = "right";
    cntx.fillText(`${this.points} \u{1F536}`, 870, 60);
    if (this.points === 100) {
      this.NUM_GEESE = 6;
      this.addGoose();
    } else if (this.points >= 500 && this.points < 600) {
      this.NUM_GEESE = 12;
      if (this.geese.length < 12) this.addGoose();
    } else if (this.points >= 2000 && this.points < 2100) {
      this.NUM_GEESE = 16;
      if (this.geese.length < 16) this.addGoose();
    } else if (this.points >= 4000 && this.points < 4200) {
      this.NUM_GEESE = 25;
      if (this.geese.length < 25) this.addGoose();
    }
    if (this.points === 100) {
      this.rocketMessage = true;
    }
    if (this.rocketMessage) {
      this.unlockRocket(cntx);
    }
    if (this.points >= 500 && this.points < 600) {
      this.laserMessage = true;
    }
    if (this.laserMessage) {
      this.unlockLaser(cntx);
    }
  }

  checkCollision() {
    const geese = this.geese;
    const bullets = this.bullets;
    const rockets = this.rockets;
    const explosions = this.explosions;
    for (let i = 0; i < bullets.length; i++) {
      for (let j = 0; j < geese.length; j++) {
        if (this.bullets[i] !== undefined) {
          if (this.bullets[i].hit(this.geese[j])) {
            this.removeGoose(this.geese[j]);
            this.removeBullet(this.bullets[i]);
          }
        }
      }
    }
    for (let i = 0; i < rockets.length; i++) {
      for (let j = 0; j < geese.length; j++) {
        if (this.rockets[i] !== undefined) {
          if (this.rockets[i].hit(this.geese[j])) {
            let site = [this.geese[j].pos[0] + 50, this.geese[j].pos[1] + 50];
            let boom = new Explosion({pos: site, game: this});
            this.removeGoose(this.geese[j]);
            this.removeRocket(this.rockets[i]);
            this.addExplosion(boom);
          }
        }
      }
    }
    for (let i = 0; i < explosions.length; i++) {
      for (let j = 0; j < geese.length; j++) {
        if (this.explosions[i] !== undefined) {
          if (this.explosions[i].hit(this.geese[j])) {
            this.removeGoose(this.geese[j]);
          }
        }
      }
    }
    if (this.robo.laserStatus) {
      for (let j = 0; j < geese.length; j++) {
        if (this.robo.laserHit(this.geese[j])) {
          this.removeGoose(this.geese[j]);
        }
      }
    }
  }

  moveObjects(timeDelta) {
    this.robo.move(timeDelta);
    this.geese.forEach(goose => {
      goose.move(timeDelta);
    });
    this.bullets.forEach(bullet => {
      bullet.move(timeDelta);
    });
    this.rockets.forEach(rocket => {
      rocket.addSpeed();
      rocket.move(timeDelta);
    });
  }

  wrap(pos, vel) {
    let x = pos[0];
    let y = pos[1];
    let newVel = vel;
    if (pos[0] > this.DIM_X + 100) { 
      x -= this.DIM_X + 200; 
      y = (Math.random() * (this.DIM_Y - 100)) + 10;
      newVel = Util.randomVec(1);
    }
    else if (pos[0] < -100) {
      x += this.DIM_X + 100;
      y = (Math.random() * (this.DIM_Y - 100)) + 10;
      newVel = Util.randomVec(1);
    }
    return [[x, y], newVel];
  }

  keydownAction(e) {
    switch(e.key) {
      case "w": 
        if (!this.actionKeys.includes("up")) this.actionKeys.push('up');
        break;
      case "a": 
        if (!this.actionKeys.includes("left")) this.actionKeys.push('left');
        break;
      case "s": 
        if (!this.actionKeys.includes("down")) this.actionKeys.push('down');
        break;
      case "d": 
        if (!this.actionKeys.includes("right")) this.actionKeys.push('right');
        break;
      case "1":
        this.robo.switchWeapon('pistol');
        break;
      case "2":
        if (this.points >= 100) this.robo.switchWeapon('rocket');
        break;
      case "3":
        if (this.points >= 500) this.robo.switchWeapon('laser');
        break;
      case " ":
        if (this.robo.weapon === 'pistol') {
          this.robo.fireBullet();
        } else if (this.robo.weapon === 'rocket') {
          this.robo.fireRocket();
        } else if (this.robo.weapon === 'laser') {
          this.robo.fireLaser();
        }
        break;
    }
    this.robo.addSpeed(this.actionKeys);
  }

  keyupAction(e) {
    switch(e.key) {
      case "w": 
        this.actionKeys = this.actionKeys.filter(ele => ele !== "up");
        break;
      case "a": 
        this.actionKeys = this.actionKeys.filter(ele => ele !== "left");
        break;
      case "s": 
        this.actionKeys = this.actionKeys.filter(ele => ele !== "down");
        break;
      case "d": 
        this.actionKeys = this.actionKeys.filter(ele => ele !== "right");
        break;
      case " ":
        if (this.robo.weapon === "laser") {
          this.robo.turnOffLaser();
        }
        break;
    }
    this.robo.addSpeed(this.actionKeys);
  }

  addKeysListener() {
    document.addEventListener("keydown", this.keydownAction);
  }

  removeKeysListener() {
    document.addEventListener("keyup", this.keyupAction);
  }

  removeEventListener4ThisGame() {
    document.removeEventListener("keydown", this.keydownAction);
    document.removeEventListener("keyup", this.keyupAction);
  }

}


module.exports = Game;

/***/ }),

/***/ "./src/classes/game_view.js":
/*!**********************************!*\
  !*** ./src/classes/game_view.js ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Game = __webpack_require__(/*! ./game */ "./src/classes/game.js");

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

/***/ }),

/***/ "./src/classes/goose.js":
/*!******************************!*\
  !*** ./src/classes/goose.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Util = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
// const GooseImage = require('../assets/images/goose_sprites.png');

const canvas = document.getElementById('game-canvas');
const cntx = canvas.getContext('2d');
const NORMAL_FPS_TIME_DELTA = 1000 / 60;

class Goose {
  constructor(options){
    this.width = 660;
    this.height = 660;
    this.pos = options.pos;
    this.prevPos = this.pos;
    this.vel = Util.randomVec(1);
    this.game = options.game;
    this.leftAirFrames = [[3, 1], [3, 2]];
    this.rightAirFrames = [[3, 0], [2, 2]];
    this.leftGroundFrames = [[0, 2], [1, 2], [2, 0], [2, 1]];
    this.rightGroundFrames = [[0, 0], [1, 0], [0, 1], [1, 1]];
    this.counter = 0;
    this.frameCount = 0;
    this.img = new Image();
    this.img.src = "../src/assets/images/goose_sprites.png";

    if (this.vel[0] < 0) {
      if (this.pos[1] < 400) {
        this.frameX = this.leftAirFrames[0][0];
        this.frameY = this.leftAirFrames[0][1];
      } else {
        this.frameX = this.leftGroundFrames[0][0];
        this.frameY = this.leftGroundFrames[0][1];
      }
    } else {
      if (this.pos[1] < 400) {
        this.frameX = this.rightAirFrames[0][0];
        this.frameY = this.rightAirFrames[0][1];
      } else {
        this.frameX = this.rightGroundFrames[0][0];
        this.frameY = this.rightGroundFrames[0][1];
      }
    }

    this.img.onload = () => this.draw();
  }
  
  draw(cntx){
  
    if (Math.abs(this.pos[0] - this.prevPos[0]) > 13) {
      this.prevPos = this.pos;
    }

    if (Math.round(Math.abs(this.pos[0] - this.prevPos[0])) === 12) {

      this.prevPos = this.pos;
      this.counter += 1;
      if (this.vel[0] < 0) {
        if (this.pos[1] < 400) {
          this.frameX = this.leftAirFrames[this.counter % 2][0];
          this.frameY = this.leftAirFrames[this.counter % 2][1];
        } else {
          this.frameX = this.leftGroundFrames[this.counter % 4][0];
          this.frameY = this.leftGroundFrames[this.counter % 4][1];
        }
      } else {
        if (this.pos[1] < 400) {
          this.frameX = this.rightAirFrames[this.counter % 2][0];
          this.frameY = this.rightAirFrames[this.counter % 2][1];
        } else {
          this.frameX = this.rightGroundFrames[this.counter % 4][0];
          this.frameY = this.rightGroundFrames[this.counter % 4][1];
        }
      }
    }
    drawSprite(this.img, this.width * this.frameX, this.height * this.frameY, this.width, this.height,
      this.pos[0], this.pos[1], this.width * 0.15, this.height * 0.15);
  }
  
  move(timeDelta){
    const velScale = timeDelta / NORMAL_FPS_TIME_DELTA,
    offsetX = this.vel[0] * velScale,
    offsetY = this.vel[1] * velScale;
    this.pos[0] += offsetX;
    this.pos[1] += offsetY;
    let newVal = this.game.wrap(this.pos, this.vel);
    this.pos = newVal[0];
    this.vel = newVal[1];
  }

}

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
  cntx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}


module.exports = Goose;

/***/ }),

/***/ "./src/classes/robot.js":
/*!******************************!*\
  !*** ./src/classes/robot.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Util = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
const Bullet = __webpack_require__(/*! ./bullet */ "./src/classes/bullet.js");
const Rocket = __webpack_require__(/*! ./rocket */ "./src/classes/rocket.js");
// const RoboImage = require('../assets/images/robo_sprites.png');
// 1840 × 1280
const canvas = document.getElementById('game-canvas');
const cntx = canvas.getContext('2d');
const NORMAL_FPS_TIME_DELTA = 1000 / 60;

class Robot {
  constructor(options){
    this.width = 920;
    this.height = 640;
    this.pos = [380, 410];
    this.vel = [0, 0];
    this.game = options.game;
    this.leftAirFrames = [0, 0];
    this.rightAirFrames = [1, 0];
    this.leftGroundFrames = [0, 1];
    this.rightGroundFrames = [1, 1];
    this.img = new Image();
    this.img.src = "../src/assets/images/robo_sprites.png";
    this.frameX = this.rightGroundFrames[0];
    this.frameY = this.rightGroundFrames[1];
    this.weapon = 'pistol';
    this.laserStatus = false;
    this.img.onload = () => this.draw();
  }
  
  draw(dirArray) {
    let firstTwoKeys = [];
    if (dirArray !== undefined) {
      firstTwoKeys = dirArray.slice(0, 2);
    }

    if (firstTwoKeys.includes("left") && firstTwoKeys.includes("right")) {
      if (this.pos[1] < 400) {
        this.frameX = firstTwoKeys[1] === "left" ? this.leftAirFrames[0] : this.rightAirFrames[0];
        this.frameY = firstTwoKeys[1] === "left" ? this.leftAirFrames[1] : this.rightAirFrames[1];
      } else {
        this.frameX = firstTwoKeys[1] === "left" ? this.leftGroundFrames[0] : this.rightGroundFrames[0];
        this.frameY = firstTwoKeys[1] === "left" ? this.leftGroundFrames[1] : this.rightGroundFrames[1];
      }
    } else if (firstTwoKeys.includes("left") && !firstTwoKeys.includes("right")) {
      if (this.pos[1] < 400) {
        this.frameX = this.leftAirFrames[0];
        this.frameY = this.leftAirFrames[1];
      } else {
        this.frameX = this.leftGroundFrames[0];
        this.frameY = this.leftGroundFrames[1];
      }
    } else if (firstTwoKeys.includes("right") && !firstTwoKeys.includes("left")){
      if (this.pos[1] < 400) {
        this.frameX = this.rightAirFrames[0];
        this.frameY = this.rightAirFrames[1];
      } else {
        this.frameX = this.rightGroundFrames[0];
        this.frameY = this.rightGroundFrames[1];
      } 
    } else {
      if (this.pos[1] < 400) {
        if (this.frameX === this.leftGroundFrames[0] && this.frameY === this.leftGroundFrames[1]) {
          this.frameX = this.leftAirFrames[0];
          this.frameY = this.leftAirFrames[1];
        } else if (this.frameX === this.rightGroundFrames[0] && this.frameY === this.rightGroundFrames[1]) {
          this.frameX = this.rightAirFrames[0];
          this.frameY = this.rightAirFrames[1];
        }
      } else {
        if (this.frameX === this.leftAirFrames[0] && this.frameY === this.leftAirFrames[1]) {
          this.frameX = this.leftGroundFrames[0];
          this.frameY = this.leftGroundFrames[1];
        } else if (this.frameX === this.rightAirFrames[0] && this.frameY === this.rightAirFrames[1]) {
          this.frameX = this.rightGroundFrames[0];
          this.frameY = this.rightGroundFrames[1];
        }
      }
    }

    drawSprite(this.img, this.width * this.frameX, this.height * this.frameY, this.width, this.height,
      this.pos[0], this.pos[1], this.width * 0.15, this.height * 0.15);
    if (this.laserStatus) {
      let laserPos;
      let lineDir;
      if (this.frameX === this.leftAirFrames[0] || this.frameX === this.leftGroundFrames[0]) {
        laserPos = [this.pos[0] + 35, this.pos[1] + 65];
        lineDir = [0 ,laserPos[1]]
      } else if (this.frameX === this.rightAirFrames[0] || this.frameX === this.rightGroundFrames[0]) {
        laserPos = [this.pos[0] + 100, this.pos[1] + 65];
        lineDir = [900, laserPos[1]];
      }
      cntx.beginPath();
      cntx.moveTo(laserPos[0], laserPos[1]);
      cntx.lineTo(...lineDir);
      cntx.lineWidth = 5;
      cntx.strokeStyle = '#ff0000';
      cntx.stroke();
    }
  }

  addSpeed(dirArray) {
    if (dirArray === undefined) dirArray = [];

    if (dirArray.length === 0) this.vel = [0, 0];

    if (!dirArray.includes("up")) {
      if (this.pos[1] < 400) this.vel[1] = 1;
      else if (this.pos[1] >= 400) this.vel[1] = 0;
    }

    if (dirArray.length === 1){
      switch(dirArray[0]) {
        case "left":
          if (this.pos[0] > -40) this.vel[0] = -6;
          break;
        case "up":
          if (this.pos[1] > -20) this.vel[1] = -8;
          break;
        case "right":
          if (this.pos[0] < 800) this.vel[0] = 6;
          break;
        case "down":
          if (this.pos[1] < 460) this.vel[1] = 3;
          break;
      }
    } else if (dirArray.length > 1) {
      let firstTwoKeys = dirArray.slice(0, 2);
      if ((firstTwoKeys.includes("up") && firstTwoKeys.includes("down")) || 
          (firstTwoKeys.includes("left") && firstTwoKeys.includes("right"))) {
            switch(firstTwoKeys[1]) {
              case "left":
                if (this.pos[0] > -40) this.vel[0] = -6;
                break;
              case "up":
                if (this.pos[1] > -20) this.vel[1] = -3;
                break;
              case "right":
                if (this.pos[0] < 800) this.vel[0] = 6;
                break;
              case "down":
                if (this.pos[1] < 460) this.vel[1] = 3;
                break;
            }
      } else {
        if (firstTwoKeys.includes("up") && firstTwoKeys.includes("left")) {
          if (this.pos[0] > -40 && this.pos[1] > -20) {
            this.vel[0] = -6;
            this.vel[1] = -3;
          }
        } else if (firstTwoKeys.includes("up") && firstTwoKeys.includes("right")) {
          if (this.pos[0] < 800 && this.pos[1] > -20) {
            this.vel[0] = 6;
            this.vel[1] = -3;
          }
        } else if (firstTwoKeys.includes("down") && firstTwoKeys.includes("left")) {
          if (this.pos[0] > -40 && this.pos[1] < 460) {
            this.vel[0] = -6;
            this.vel[1] = 3;
          }
        } else if (firstTwoKeys.includes("down") && firstTwoKeys.includes("right")) {
          if (this.pos[0] < 800 && this.pos[1] < 460) {
            this.vel[0] = 6;
            this.vel[1] = 3;
          }
        }
      }
    }
  }

  move(timeDelta) {
  
    const velScale = timeDelta / NORMAL_FPS_TIME_DELTA,
    offsetX = this.vel[0] * velScale,
    offsetY = this.vel[1] * velScale;
    if (this.pos[0] + offsetX < 800 && this.pos[0] + offsetX > -40) {
      this.pos[0] += offsetX;
    }
    if (this.pos[1] + offsetY < 460 && this.pos[1] + offsetY > -20) {
      if (this.pos[1] >= 400 && this.vel[1] === 1) {
        this.pos[1] = this.pos[1];
      } else {
        this.pos[1] += offsetY;
      }
    }
    
  }

  switchWeapon(weaponType) {
    this.weapon = weaponType;
  }

  fireBullet() {
    let bulletVel;
    if (this.frameX === this.leftAirFrames[0] || this.frameX === this.leftGroundFrames[0]) {
      bulletVel = [-12, 0];
    } else if (this.frameX === this.rightAirFrames[0] || this.frameX === this.rightGroundFrames[0]) {
      bulletVel = [12, 0];
    }

    let bulletPos = [this.pos[0] + 70, this.pos[1] + 50];

    const bullet = new Bullet({
      pos: bulletPos,
      vel: bulletVel,
      game: this.game
    });

    this.game.addBullet(bullet);
  }

  fireRocket() {
    let rocketVel;
    let rocketPos;
    if (this.frameX === this.leftAirFrames[0] || this.frameX === this.leftGroundFrames[0]) {
      rocketVel = [-2, 0];
      rocketPos = [this.pos[0] - 30, this.pos[1] + 50];
    } else if (this.frameX === this.rightAirFrames[0] || this.frameX === this.rightGroundFrames[0]) {
      rocketVel = [2, 0];
      rocketPos = [this.pos[0] + 70, this.pos[1] + 50];
    }

    const rocket = new Rocket({
      pos: rocketPos,
      vel: rocketVel,
      game: this.game
    });

    this.game.addRocket(rocket);
  }

  fireLaser() {
    this.laserStatus = true;
  }

  turnOffLaser() {
    this.laserStatus = false;
  }

  laserHit(target) {
    const laserX = this.pos[0] + 65;
    const laserY = this.pos[1] + 65;
    const targetX = target.pos[0];
    const targetY = target.pos[1];
    if (this.frameX === this.leftAirFrames[0] || this.frameX === this.leftGroundFrames[0]) {
      if (laserX >= targetX + 60 && laserY >= targetY && laserY < targetY + 80) return true;
    } else if (this.frameX === this.rightAirFrames[0] || this.frameX === this.rightGroundFrames[0]) {
      if (laserX < targetX && laserY >= targetY && laserY < targetY + 80) return true;
    }
    return false;
  }

}

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
  cntx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

module.exports = Robot;

/***/ }),

/***/ "./src/classes/rocket.js":
/*!*******************************!*\
  !*** ./src/classes/rocket.js ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Util = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
// 3520 × 1619

const canvas = document.getElementById('game-canvas');
const cntx = canvas.getContext('2d');
const NORMAL_FPS_TIME_DELTA = 1000 / 60;

class Rocket {
  constructor(options){
    this.width = 1760;
    this.height = 400;
    this.pos = options.pos;
    this.vel = options.vel;
    this.game = options.game;
    this.img = new Image();
    this.img.src = "../src/assets/images/projectile_sprites.png";

    this.sourceX = 0;
    this.sourceY = 400;

    this.img.onload = () => this.draw();
  }
  
  draw(cntx){
    if (this.vel[0] < 0) {
      this.sourceX = 0;
    } else {
      this.sourceX = 1760;
    }
    drawSprite(this.img, this.sourceX, this.sourceY, this.width, this.height,
      this.pos[0], this.pos[1], this.width * 0.06, this.height * 0.06);
  }

  addSpeed() {
    if (this.vel[0] > 0) {
      this.vel[0] += 0.15;
    } else if (this.vel[0] < 0) {
      this.vel[0] -= 0.15;
    }
  }

  move(timeDelta){
    const velScale = timeDelta / NORMAL_FPS_TIME_DELTA,
    offsetX = this.vel[0] * velScale,
    offsetY = this.vel[1] * velScale;
    this.pos[0] += offsetX;
    this.pos[1] += offsetY;

    if (this.pos[0] < -100 || this.pos[0] > 900 || this.pos[1] > 550 || this.pos[1] < 0) {
      this.game.removeRocket();
    }
  }

  hit(target) {
    const rocketX = this.pos[0];
    const rocketY = this.pos[1];
    const targetX = target.pos[0];
    const targetY = target.pos[1];
    if (rocketX >= targetX - 80 && rocketX < targetX + 60 && rocketY >= targetY - 20 && rocketY < targetY + 80) {
      return true;
    }
    return false;
  }

}

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
  cntx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}


module.exports = Rocket;

/***/ }),

/***/ "./src/utils/utils.js":
/*!****************************!*\
  !*** ./src/utils/utils.js ***!
  \****************************/
/***/ ((module) => {


const Util = {
  scale(vec, mag){
    return [vec[0] * mag, vec[1] * mag];
  },
  randomVec(length) {
    const deg = Math.random() < 0.5 ? 0 : Math.PI;
    return Util.scale([Math.cos(deg), Math.sin(deg)], length);
  }
};

module.exports = Util;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
const GameView = __webpack_require__(/*! ./classes/game_view */ "./src/classes/game_view.js");
const Goose = __webpack_require__(/*! ./classes/goose */ "./src/classes/goose.js");
  
document.addEventListener("DOMContentLoaded", (e) => {
    
  const title = document.querySelector('.title-sign');
  const phrases = document.querySelectorAll('.catchphrases');
  const menu = document.querySelector('.pre-menu');
  const startButton = document.querySelector('.start-game');
  const instructionButton = document.querySelector('.instruction');
  const instructionPage = document.querySelector('.controls');
  const backToMenu = document.querySelector('.go-back');
  const music = document.getElementById('theme-music');
  const musicIcon = document.getElementById('music-icon');
  const gameMenu = document.getElementById('menu-icon');
  const modalBackground = document.querySelector('.modal-background');
  const modal = document.querySelector('.modal');
  const gameOverModalBackground = document.querySelector('.game-over-modal-background');
  const gameOver = document.querySelector('.game-over');
  const exitButton = document.querySelector('.exit-button');
  const restartButton = document.querySelector('.restart-button');
  const gameOverExitButton = document.querySelector('.game-over-exit-button');
  const playAgainButton = document.querySelector('.play-again-button');
  
  const kanvas = document.getElementById("game-canvas");
  const cntx = kanvas.getContext("2d");
  const zaGame = new GameView(cntx);

  music.volume = 0.25;
  music.loop = true;

  title.addEventListener('click', () => {
    title.classList.add('hidden');
    music.play();
    musicIcon.src = "../src/assets/images/music_play_icon.png";
    phrases.forEach((phrase, idx) => {
      setTimeout(() => {
        phrase.classList.remove('hidden');
        phrase.classList.add('fade-in');
      }, idx * 3500 + 1000);
      setTimeout(() => {phrase.classList.add('hidden');}, idx * 3500 + 4000);
    });

    setTimeout(() => {
      menu.classList.remove('hidden');
      menu.classList.add('fade-in');
    }, 15000);
  });

  startButton.addEventListener('click', () => {
    menu.classList.add('hidden');
    setTimeout(() => {
      kanvas.classList.remove('hidden');
      kanvas.classList.add('fade-in');
      gameMenu.classList.remove('hidden');
      gameMenu.classList.add('fade-in');
      zaGame.start();
    }, 1000);
  });

  gameMenu.addEventListener('click', () => {
    zaGame.pause();
    modalBackground.classList.remove('hidden');
    modalBackground.classList.add('fade-in');
    modal.classList.remove('hidden');
    modal.classList.add('fade-in');
  });

  modalBackground.addEventListener('click', () => {
    zaGame.pause();
    modalBackground.classList.remove('fade-in');
    modalBackground.classList.add('hidden');
    modal.classList.remove('fade-in');
    modal.classList.add('hidden');
  });

  exitButton.addEventListener('click', () => {
    modalBackground.classList.remove('fade-in');
    modalBackground.classList.add('hidden');
    modal.classList.remove('fade-in');
    modal.classList.add('hidden');
    kanvas.classList.remove('fade-in');
    kanvas.classList.add('hidden');
    gameMenu.classList.remove('fade-in');
    gameMenu.classList.add('hidden');
    zaGame.destroy();
    setTimeout(() => {
      menu.classList.remove('hidden');
      menu.classList.add('fade-in');
    }, 1000);
  });

  restartButton.addEventListener('click', () => {
    modalBackground.classList.remove('fade-in');
    modalBackground.classList.add('hidden');
    modal.classList.remove('fade-in');
    modal.classList.add('hidden');
    kanvas.classList.remove('fade-in');
    kanvas.classList.add('hidden');
    zaGame.destroy();
    setTimeout(() => {
      kanvas.classList.remove('hidden');
      kanvas.classList.add('fade-in');
      zaGame.start();
    }, 1000);
  });

  gameOverExitButton.addEventListener('click', () => {
    gameOverModalBackground.classList.remove('fade-in');
    gameOverModalBackground.classList.add('hidden');
    gameOver.classList.remove('fade-in');
    gameOver.classList.add('hidden');
    kanvas.classList.remove('fade-in');
    kanvas.classList.add('hidden');
    gameMenu.classList.remove('fade-in');
    gameMenu.classList.add('hidden');
    zaGame.destroy();
    setTimeout(() => {
      menu.classList.remove('hidden');
      menu.classList.add('fade-in');
    }, 1000);
  });

  playAgainButton.addEventListener('click', () => {
    gameOverModalBackground.classList.remove('fade-in');
    gameOverModalBackground.classList.add('hidden');
    gameOver.classList.remove('fade-in');
    gameOver.classList.add('hidden');
    kanvas.classList.remove('fade-in');
    kanvas.classList.add('hidden');
    zaGame.destroy();
    setTimeout(() => {
      kanvas.classList.remove('hidden');
      kanvas.classList.add('fade-in');
      zaGame.start();
    }, 1000);
  });

  instructionButton.addEventListener('click', () => {
    menu.classList.add('hidden');
    setTimeout(() => {
      instructionPage.classList.remove('hidden');
      instructionPage.classList.add('fade-in');
    }, 1000);
  });

  backToMenu.addEventListener('click', () => {
    instructionPage.classList.add('hidden');
    setTimeout(() => {
      menu.classList.remove('hidden');
      menu.classList.add('fade-in');
    }, 1000);
  });

  musicIcon.addEventListener('click', () => {
    if (music.paused) {
      music.play();
    } else {
      music.pause();
    }
  });

  musicIcon.addEventListener('mouseenter', () => {
    let srcArray = musicIcon.src.split('/');
    if (srcArray[srcArray.length-1] === "music_pause_icon.png") {
      musicIcon.src = "../src/assets/images/music_play_icon.png";
    } else {
      musicIcon.src = "../src/assets/images/music_pause_icon.png";
    }
  });

  musicIcon.addEventListener('mouseleave', () => {
    let srcArray = musicIcon.src.split('/');
    if (srcArray[srcArray.length-1] === "music_pause_icon.png") {
      if (music.paused) musicIcon.src = "../src/assets/images/music_pause_icon.png";
      else musicIcon.src = "../src/assets/images/music_play_icon.png";
    } else {
      if (music.paused) musicIcon.src = "../src/assets/images/music_pause_icon.png";
      else musicIcon.src = "../src/assets/images/music_play_icon.png";
    }
  });

});

})();

/******/ })()
;
//# sourceMappingURL=main.js.map