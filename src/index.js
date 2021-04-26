const MovingObject = require('./classes/moving_object');
const Goose = require('./classes/goose');

document.addEventListener("DOMContentLoaded", (e) => {
  const kanvas = document.getElementById("game-canvas");
  const cntx = kanvas.getContext("2d");
  
  // testing
  window.MovingObject = MovingObject;
  window.cntx = cntx;
  const x = new MovingObject({pos: [300, 500], velo:[2, 3], radius: 10, color: "red"});
  x.draw(cntx);

  const goo = new Goose({pos: [10, 200]});
  goo.draw(cntx);
});