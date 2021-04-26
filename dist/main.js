/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/assets/images/goose-air-left.gif":
/*!**********************************************!*\
  !*** ./src/assets/images/goose-air-left.gif ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "197bb6572642d917420bd67dcd6e4177.gif");

/***/ }),

/***/ "./src/assets/images/goose_sprites.png":
/*!*********************************************!*\
  !*** ./src/assets/images/goose_sprites.png ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "17e5ceb5674abd353be3160fcef0551b.png");

/***/ }),

/***/ "./src/classes/game.js":
/*!*****************************!*\
  !*** ./src/classes/game.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Goose = __webpack_require__(/*! ./goose */ "./src/classes/goose.js");

class Game {
  constructor(options) {
    this.DIM_X = 900;
    this.DIM_Y = 550;
    this.NUM_GEESE = 5;
    this.geese = [];
    this.addGoose();

    this.randomPos = this.randomPos.bind(this);
  }

  addGoose() {
    for (let i = 0; i < this.NUM_GEESE; i++) {
      let newGoose = new Goose({pos: this.randomPos(), game: this});
      this.geese.push(newGoose);
    }
  }

  randomPos() {
    let x = Math.random() > 0.5 ? 0 : this.DIM_X; 
    let y = Math.random() * this.DIM_Y - 20;
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

  wrap(pos) {
    let x = pos[0];
    let y = pos[1];
    if (pos[0] > this.DIM_X) { 
      x -= this.DIM_X; 
      y = Math.random() * this.DIM_Y;
    }
    else if (pos[0] < 0) {
      x += this.DIM_X;
      y = Math.random() * this.DIM_Y;
    }
    return [x, y];
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
const Sprite = __webpack_require__(/*! ../utils/sprite */ "./src/utils/sprite.js");
const GooseSpriteImg = __webpack_require__(/*! ../assets/images/goose_sprites.png */ "./src/assets/images/goose_sprites.png");

class Goose extends MovingObject {
  constructor(options) {
    super(options);
    this.velo = Util.randomVec(2);
    this.color = 'blue';
    this.radius = 10;
    this.cntx = options.cntx;
    this.img = new Image();
    this.img.src = GooseSpriteImg;
    this.gooseSprites = new Sprite({
      img: this.img,
      sx: this.sx,
      sy: this.sy,
      sw: this.sw,
      sh: this.sh,
      dx: this.dx,
      dy: this.dy,
      dw: this.dw,
      dh: this.dh
    });
  }

  draw(cntx) {
    return this.gooseSprites.drawSprite(cntx);
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
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const gooseImage = __webpack_require__(/*! ../assets/images/goose-air-left.gif */ "./src/assets/images/goose-air-left.gif")

class MovingObject {
  constructor(options) {
    this.pos = options.pos;
    this.velo = options.velo;
    this.radius = options.radius;
    this.color = options.color;
    this.game = options.game;
  }

  // draw(cntx) {
    // cntx.beginPath();
    // cntx.arc(this.pos[0], this.pos[1], this.radius, 0, Math.PI * 2, true);
    // cntx.fillStyle = this.color;
    // cntx.fill();
    // cntx.strokeStyle = 'black';
    // cntx.lineWidth = 2;
    // cntx.stroke();
  // }

  move() {
    this.pos[0] += this.velo[0];
    this.pos[1] += this.velo[1];
    this.pos = this.game.wrap(this.pos);
  }
}


module.exports = MovingObject;

/***/ }),

/***/ "./src/utils/sprite.js":
/*!*****************************!*\
  !*** ./src/utils/sprite.js ***!
  \*****************************/
/***/ ((module) => {

// const GooseSpriteImg = require('../assets/images/goose_sprites.png');

// const images = {};
// images.goose = new Image();
// images.goose.src = GooseSpriteImg;

// 2640 × 1980
// 660 × 660

// const gooseWidth = '660';
// const gooseHeight = '660';
// let gooseFrameX = 2;
// let gooseFrameY = 2;

class Sprite {
  // s is source image, d is destination canvas
  constructor(options) {
    this.cntx = options.cntx;
    this.img = options.img;
    this.sx = options.sx
    this.sy = options.sy
    this.sw = options.sw
    this.sh = options.sh
    this.dx = options.dx
    this.dy = options.dy
    this.dw = options.dw
    this.dh = options.dh  
  }

  drawSprite(cntx) {
    cntx.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh)
  }
}

module.exports = Sprite;

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
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
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