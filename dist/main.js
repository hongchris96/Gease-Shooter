/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/classes/game.js":
/*!*****************************!*\
  !*** ./src/classes/game.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Goose = __webpack_require__(/*! ./goose */ "./src/classes/goose.js");
const Robo = __webpack_require__(/*! ./robot */ "./src/classes/robot.js");
const Util = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");

class Game {
  constructor(options) {
    this.DIM_X = 900;
    this.DIM_Y = 550;
    this.NUM_GEESE = 5;
    this.geese = [];
    this.addGoose();
    this.robo = new Robo({game: this});
    this.actionKeys = [];
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
    this.robo.draw(this.actionKeys);
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

  addKeysListener() {
    document.addEventListener("keydown", (e) => {
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
      }
      this.robo.move(this.actionKeys);
    });
  }

  removeKeysListener() {
    document.addEventListener("keyup", (e) => {
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
      }
      this.robo.move(this.actionKeys);
    });
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

class GameView {
  constructor(cntx) {
    this.cntx = cntx;
    this.game = new Game();
    this.game.addKeysListener();
    this.game.removeKeysListener();
  }

  start() {
    setInterval(() => {
      this.game.moveObjects();
      this.game.draw(this.cntx);
    }, 17);
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


class Goose {
  constructor(options){
    this.width = 660;
    this.height = 660;
    this.pos = options.pos;
    this.vel = Util.randomVec(2);
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
    this.frameCount += 1;
    if (this.frameCount === 12) {
      this.frameCount = 0;
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
  move(){
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
    let newVal = this.game.wrap(this.pos, this.vel);
    this.pos = newVal[0];
    this.vel = newVal[1];
  }

}

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
  cntx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

// function animate(){
//   cntx.clearRect(0, 0, canvas.width, canvas.height);
//   newgoose[i].draw();
//   newgoose[i].move();
// }

module.exports = Goose;

/***/ }),

/***/ "./src/classes/robot.js":
/*!******************************!*\
  !*** ./src/classes/robot.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Util = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");
// const RoboImage = require('../assets/images/robo_sprites.png');
// 1840 × 1280
const canvas = document.getElementById('game-canvas');
const cntx = canvas.getContext('2d');


class Robot {
  constructor(options){
    this.width = 920;
    this.height = 640;
    this.pos = [380, 410];
    this.vel = [10, 10];
    this.game = options.game;
    this.leftAirFrames = [0, 0];
    this.rightAirFrames = [1, 0];
    this.leftGroundFrames = [0, 1];
    this.rightGroundFrames = [1, 1];
    this.img = new Image();
    this.img.src = "../src/assets/images/robo_sprites.png";
    this.frameX = this.rightGroundFrames[0];
    this.frameY = this.rightGroundFrames[1];

    this.img.onload = () => this.draw();
  }
  
  draw(dirArray){
    let firstTwoKeys = dirArray.slice(0, 2);
    if (firstTwoKeys.includes("left")) {
      if (this.pos[1] < 400) {
        this.frameX = this.leftAirFrames[0];
        this.frameY = this.leftAirFrames[1];
      } else {
        this.frameX = this.leftGroundFrames[0];
        this.frameY = this.leftGroundFrames[1];
      }
    } else if (firstTwoKeys.includes("right")){
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
  }

  move(dirArray){
    console.log(dirArray);
    if (dirArray.length === 1){
      switch(dirArray[0]) {
        case "left":
          if (this.pos[0] > -40) this.pos[0] -= this.vel[0];
          break;
        case "up":
          if (this.pos[1] > -20) this.pos[1] -= this.vel[1];
          break;
        case "right":
          if (this.pos[0] < 800) this.pos[0] += this.vel[0];
          break;
        case "down":
          if (this.pos[1] < 460) this.pos[1] += this.vel[1];
          break;
      }
    } else if (dirArray.length > 1) {
      let firstTwoKeys = dirArray.slice(0, 2);
      if ((firstTwoKeys.includes("up") && firstTwoKeys.includes("down")) || 
          (firstTwoKeys.includes("left") && firstTwoKeys.includes("right"))) {
            switch(firstTwoKeys[0]) {
              case "left":
                if (this.pos[0] > -40) this.pos[0] -= this.vel[0];
                break;
              case "up":
                if (this.pos[1] > -20) this.pos[1] -= this.vel[1];
                break;
              case "right":
                if (this.pos[0] < 800) this.pos[0] += this.vel[0];
                break;
              case "down":
                if (this.pos[1] < 460) this.pos[1] += this.vel[1];
                break;
            }
      } else {
        if (firstTwoKeys.includes("up") && firstTwoKeys.includes("left")) {
          if (this.pos[0] > -40 && this.pos[1] > -20) {
            this.pos[0] -= this.vel[0];
            this.pos[1] -= this.vel[1];
          }
        } else if (firstTwoKeys.includes("up") && firstTwoKeys.includes("right")) {
          if (this.pos[0] < 800 && this.pos[1] > -20) {
            this.pos[0] += this.vel[0];
            this.pos[1] -= this.vel[1];
          }
        } else if (firstTwoKeys.includes("down") && firstTwoKeys.includes("left")) {
          if (this.pos[0] > -40 && this.pos[1] < 460) {
            this.pos[0] -= this.vel[0];
            this.pos[1] += this.vel[1];
          }
        } else if (firstTwoKeys.includes("down") && firstTwoKeys.includes("right")) {
          if (this.pos[0] < 800 && this.pos[1] < 460) {
            this.pos[0] += this.vel[0];
            this.pos[1] += this.vel[1];
          }
        }
      }
    }
  }

}

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
  cntx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

// function animate(){
//   cntx.clearRect(0, 0, canvas.width, canvas.height);
//   newgoose[i].draw();
//   newgoose[i].move();
// }

module.exports = Robot;

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
  const kanvas = document.getElementById("game-canvas");
  const cntx = kanvas.getContext("2d");

  // testing

  // -------
  
  const zaGame = new GameView(cntx);
  zaGame.start();
});
})();

/******/ })()
;
//# sourceMappingURL=main.js.map