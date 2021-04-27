const GameView = require('./classes/game_view');
const Goose = require('./classes/goose');

document.addEventListener("DOMContentLoaded", (e) => {
  const kanvas = document.getElementById("game-canvas");
  const cntx = kanvas.getContext("2d");

  // testing

  // -------
  
  const zaGame = new GameView(cntx);
  zaGame.start();
});