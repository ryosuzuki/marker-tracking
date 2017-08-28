const cv = require('opencv');
const _ = require('lodash')
const camWidth = 720;
const camHeight = 400;
const camFps = 10;
const camInterval = 1000 / camFps;
const rectColor = [0, 255, 0];
const rectThickness = 2;

let camera = new cv.VideoCapture(0)
camera.setWidth(camWidth);
camera.setHeight(camHeight);

const detect = (socket) => {
  setInterval(function() {
    camera.read(function(err, im) {
      if (err) throw err;

      const lower_hsv_threshold = [0, 0, 0]
      const upper_hsv_threshold = [180, 255, 100]

      let origin = _.clone(im)

      // im.convertHSVscale()
      // im.inRange(lower_hsv_threshold, upper_hsv_threshold)

      socket.emit('frame', { buffer: im.toBuffer() })
    });
  }, camInterval);
};

module.exports = detect