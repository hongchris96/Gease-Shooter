/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/classes/game.js":
/*!*****************************!*\
  !*** ./src/classes/game.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Goose = __webpack_require__(/*! ./goose */ "./src/classes/goose.js");

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
      let newGoose = new Goose({pos: this.randomPos()});
      this.geese.push(newGoose);
    }
  }

  randomPos() {
    let x = Math.random() > 0.5 ? 0 : this.DIM_X; 
    let y = Math.random() * this.DIM_Y;
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

/***/ }),

/***/ "./src/classes/goose.js":
/*!******************************!*\
  !*** ./src/classes/goose.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const MovingObject = __webpack_require__(/*! ./moving_object */ "./src/classes/moving_object.js");
const Util = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.js");

class Goose extends MovingObject {
  constructor(options) {
    super(options);

    this.velo = Util.randomVec(3);
    this.color = 'blue';
    this.radius = 10;
  }

  draw(cntx) {
    return super.draw(cntx);
  }

  move() {
    return super.move();
  }
}

module.exports = Goose;

/***/ }),

/***/ "./src/classes/moving_object.js":
/*!**************************************!*\
  !*** ./src/classes/moving_object.js ***!
  \**************************************/
/***/ ((module) => {



class MovingObject {
  constructor(options) {
    this.pos = options.pos;
    this.velo = options.velo;
    this.radius = options.radius;
    this.color = options.color;
    // this.game = options.game;
  }

  draw(cntx) {
    cntx.beginPath();
    cntx.arc(this.pos[0], this.pos[1], this.radius, 0, Math.PI * 2, true);
    cntx.fillStyle = this.color;
    cntx.fill();
    cntx.strokeStyle = 'black';
    cntx.lineWidth = 2;
    cntx.stroke();
  }

  move() {
    this.pos[0] += this.velo[0];
    this.pos[1] += this.velo[1];
  }
}


module.exports = MovingObject;

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

const MovingObject = __webpack_require__(/*! ./classes/moving_object */ "./src/classes/moving_object.js");
const Goose = __webpack_require__(/*! ./classes/goose */ "./src/classes/goose.js");

document.addEventListener("DOMContentLoaded", (e) => {
  const kanvas = document.getElementById("game-canvas");
  const cntx = kanvas.getContext("2d");
  
  // testing
  window.MovingObject = MovingObject;
  window.cntx = cntx;
  window.GameView = GameView;
  // const x = new MovingObject({pos: [300, 530], velo:[2, 3], radius: 10, color: "red"});
  // x.draw(cntx);
  // const goo = new Goose({pos: [10, 200]});
  // goo.draw(cntx);
  // -------
  
  const zaGame = new GameView(cntx);
  zaGame.start();
});
})();

/******/ })()
;
//# sourceMappingURL=main.js.map