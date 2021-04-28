const Goose = require('./goose');
const Robo = require('./robot');
const Explosion = require('./explosion');
const Util = require('../utils/utils');

class Game {
  constructor(options) {
    this.DIM_X = 900;
    this.DIM_Y = 550;
    this.NUM_GEESE = 8;
    this.geese = [];
    this.addGoose();
    this.bullets = [];
    this.rockets = [];
    this.explosions = [];
    this.robo = new Robo({game: this});
    this.actionKeys = [];
    this.points = 0;
    this.timer = 0;
    this.randomPos = this.randomPos.bind(this);
  }

  timePassed() {
    setInterval(() => {this.timer += 1}, 1000);
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
    for (let i = 0; i < this.NUM_GEESE; i++) {
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
    let y = Math.random() * this.DIM_Y - 70;
    return [x, y]; 
  }

  draw(cntx) {
    cntx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
    cntx.font = "100px Comic Sans MS";
    cntx.fillStyle = "gray";
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
  }

  checkCollision() {
    const geese = this.geese;
    const bullets = this.bullets;
    const rockets = this.rockets;
    const explosions = this.explosions;
    for (let i = 0; i < bullets.length; i++) {
      for (let j = 0; j < geese.length; j++) {
        if (this.bullets[i].hit(this.geese[j])) {
          this.removeGoose(this.geese[j]);
          this.removeBullet(this.bullets[i]);
        }
      }
    }
    for (let i = 0; i < rockets.length; i++) {
      for (let j = 0; j < geese.length; j++) {
        if (this.rockets[i].hit(this.geese[j])) {
          let site = [this.geese[j].pos[0] + 50, this.geese[j].pos[1] + 50];
          let boom = new Explosion({pos: site, game: this});
          this.removeGoose(this.geese[j]);
          this.removeRocket(this.rockets[i]);
          this.addExplosion(boom);
        }
      }
    }
    for (let i = 0; i < explosions.length; i++) {
      for (let j = 0; j < geese.length; j++) {
        if (this.explosions[i].hit(this.geese[j])) {
          this.removeGoose(this.geese[j]);
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

  moveObjects() {
    this.geese.forEach(goose => {
      goose.move();
    });
    this.bullets.forEach(bullet => {
      bullet.move();
    })
    this.rockets.forEach(rocket => {
      rocket.move();
    })
  }

  wrap(pos, vel) {
    let x = pos[0];
    let y = pos[1];
    let newVel = vel;
    if (pos[0] > this.DIM_X + 100) { 
      x -= this.DIM_X + 200; 
      y = Math.random() * this.DIM_Y - 70;
      newVel = Util.randomVec(2);
    }
    else if (pos[0] < -100) {
      x += this.DIM_X + 100;
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
        case "1":
          this.robo.switchWeapon('pistol');
          break;
        case "2":
          this.robo.switchWeapon('rocket');
          break;
        case "3":
          this.robo.switchWeapon('laser');
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
        case " ":
          if (this.robo.weapon === "laser") {
            this.robo.turnOffLaser();
          }
          break;
      }
      this.robo.move(this.actionKeys);
    });
  }

}

module.exports = Game;