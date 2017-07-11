const cv = require('opencv');
const camWidth = 320;
const camHeight = 240;
const camFps = 10;
const camInterval = 1000 / camFps;
const rectColor = [0, 255, 0];
const rectThickness = 2;

let camera = new cv.VideoCapture(0);
camera.setWidth(camWidth);
camera.setHeight(camHeight);

const detect = (socket) => {
  setInterval(function() {
    camera.read(function(err, im) {
      if (err) throw err;

      const lower_hsv_threshold = [20, 50, 50]
      const upper_hsv_threshold = [100, 255, 255]

      im.convertHSVscale()
      im.inRange(lower_hsv_threshold, upper_hsv_threshold)

      socket.emit('frame', { buffer: im.toBuffer() })
    });
  }, camInterval);
};

module.exports = detect