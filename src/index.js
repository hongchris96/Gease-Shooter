const GameView = require('./classes/game_view');
const Goose = require('./classes/goose');

document.addEventListener("DOMContentLoaded", (e) => {
  
  const title = document.querySelector('.title-sign');
  const phrases = document.querySelectorAll('.catchphrases');
  const menu = document.querySelector('.pre-menu');
  
  const kanvas = document.getElementById("game-canvas");
  const cntx = kanvas.getContext("2d");

  title.addEventListener('click', () => {
    title.classList.add('hidden');
    phrases.forEach((phrase, idx) => {
      setTimeout(() => {
        phrase.classList.remove('hidden');
        phrase.classList.add('fade-in');
      }, idx * idx * 500 + idx * 3500 + 1000);
      setTimeout(() => {phrase.classList.add('hidden');}, idx * idx * 500 + idx * 4500 + 4000);
    })
    
    setTimeout(() => {
      kanvas.classList.remove('hidden');
      kanvas.classList.add('fade-in');
      const zaGame = new GameView(cntx);
      zaGame.start();
    }, 22500)
  });

});
