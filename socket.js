const cv = require('opencv');

// camera properties
const camWidth = 320;
const camHeight = 240;
const camFps = 10;
const camInterval = 1000 / camFps;

// face detection properties
const rectColor = [0, 255, 0];
const rectThickness = 2;

// initialize camera
let camera = new cv.VideoCapture(0);
camera.setWidth(camWidth);
camera.setHeight(camHeight);

const detect = (socket) => {
  setInterval(function() {
    camera.read(function(err, im) {
      if (err) throw err;

      im.detectObject('./node_modules/opencv/data/haarcascade_frontalface_alt2.xml', {}, function(err, faces) {
        if (err) throw err;

        for (let i = 0; i < faces.length; i++) {
          face = faces[i];
          im.rectangle([face.x, face.y], [face.width, face.height], rectColor, rectThickness);
        }

        socket.emit('frame', { buffer: im.toBuffer() });
      });
    });
  }, camInterval);
};

module.exports = detect