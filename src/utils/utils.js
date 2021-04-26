
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