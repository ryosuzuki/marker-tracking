const cv = require('opencv');
const _ = require('lodash')
const camWidth = 700 // 720;
const camHeight = 420 // 400;
const camFps = 10
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

      const redMin = [170, 128, 70]
      const redMax = [180, 255, 255]

      const blueMin = [100, 150, 140]
      const blueMax = [120, 255, 250]

      let origin = im.copy()

      im.convertHSVscale()
      im.inRange(blueMin, blueMax)
      im.dilate(2)

      // socket.emit('frame', { buffer: im.toBuffer() })

      // return

      let out = new cv.Matrix(im.height(), im.width());
      let contours = im.findContours()

      // for (let i = 0; i < contours.size(); i++) {
      //   out.drawContour(contours, i, [0, 0, 255])
      // }

      let threshold = 40
      let ids = []
      for (let i = 0; i < contours.size(); i++) {
        if (threshold < contours.area(i)) {
          ids.push(i)
        }
      }

      // console.log(" size " + contours.size() + " filter " + ids.length)
      let points = []
      for (let id of ids) {
        let point = { x: 0, y: 0 }
        let count = contours.cornerCount(id)
        for (let i = 0; i < count; i++) {
          let pos = contours.point(id, i)
          point.x += pos.x
          point.y += pos.y
        }
        point.x /= count
        point.y /= count
        points.push(point)
        origin.ellipse(point.x, point.y, 10, 10, [0, 0, 255])
      }

      let data = {
        buffer: origin.toBuffer(),
        points: points
      }

      socket.emit('frame', data)
    });
  }, camInterval);
};

module.exports = detect