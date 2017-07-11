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

      const lower_hsv_threshold = [170, 100, 0]
      const upper_hsv_threshold = [180, 255, 255]

      im.convertHSVscale()
      im.inRange(lower_hsv_threshold, upper_hsv_threshold)

      let contours = im.findContours()
      let data = {
        contours: [],
        size: contours.size()
      }

      for (let c = 0; c < contours.size(); c++) {
        data.contours[c] = []
        for (let i = 0; i < contours.cornerCount(c); i++) {
          let point = contours.point(c, i)
          data.contours[c][i] = { x: point.x, y: point.y }
        }
      }

      // im.rectangle([face.x, face.y], [face.width, face.height], rectColor, rectThickness);
      socket.emit('frame', { buffer: im.toBuffer() })
    });
  }, camInterval);
};

module.exports = detect