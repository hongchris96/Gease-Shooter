const GameView = require('./classes/game_view');
const Goose = require('./classes/goose');
  
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
  
  const kanvas = document.getElementById("game-canvas");
  const cntx = kanvas.getContext("2d");

  const currentGame = [];

  music.volume = 0.3;

  title.addEventListener('click', () => {
    title.classList.add('hidden');
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
      const zaGame = new GameView(cntx);
      currentGame.push(zaGame);
      zaGame.start();
    }, 1000);
  });

  gameMenu.addEventListener('click', () => {
    currentGame[0].pause();
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
      musicIcon.src = "../src/assets/images/music_play_icon.png";
    } else {
      music.pause();
      musicIcon.src = "../src/assets/images/music_pause_icon.png";
    }
  });

});
