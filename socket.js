const cv = require('opencv');
const _ = require('lodash')
const camWidth = 900 // 720;
const camHeight = 450 // 400;
const camFps = 10
const camInterval = 1000 / camFps;
const rectColor = [0, 255, 0];
const rectThickness = 2;

let camera = new cv.VideoCapture(0)
camera.setWidth(camWidth);
camera.setHeight(camHeight);

const redMin = [170, 128, 70]
const redMax = [180, 255, 255]
const blueMin = [100, 150, 140]
const blueMax = [120, 255, 250]

const detectLines = (im) => {
  let imCanny = im.copy()
  imCanny.convertHSVscale()
  imCanny.inRange(blueMin, blueMax)
  imCanny.dilate(2)

  let contours = imCanny.findContours()
  let size = contours.size()
  let threshold = 100
  let points = []
  for (let i = 0; i < size; i++) {
    if (contours.area(i) < threshold) continue
    let arcLengh = contours.arcLength(i, true)
    let epsilon = 0.1 * arcLengh
    let isColsed = true
    contours.approxPolyDP(i, epsilon, isColsed)

    if (contours.cornerCount(i) !== 4) continue
    points = [
      contours.point(i, 0),
      contours.point(i, 1),
      contours.point(i, 2),
      contours.point(i, 3)
    ]
  }

  console.log(points)

  for (let i = 0; i < points.length; i++) {
    let ci = i
    let ni = (i+1) % 4
    let p0 = [points[ci].x, points[ci].y]
    let p1 = [points[ni].x, points[ni].y]
    im.line(p0, p1)
  }
  return im
}

const detect = (socket) => {
  setInterval(function() {
    camera.read(function(err, im) {
      if (err) throw err;

      im = detectMarkers(im)
      im = detectLines(im)

      let data = {
        buffer: im.toBuffer(),
        // points: points
      }

      socket.emit('frame', data)
    });
  }, camInterval);
}



const detectMarkers = (im) => {
  let imCanny = im.copy()
  imCanny.convertHSVscale()
  imCanny.inRange(redMin, redMax)
  imCanny.dilate(2)
  let contours = imCanny.findContours()
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
  }

  for (let point of points) {
    let red = [0, 0, 255]
    im.ellipse(point.x, point.y, 10, 10, red)
  }

  return im
}


module.exports = detect

