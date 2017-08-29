const socket = io.connect('http://localhost:8080/')
const canvas = document.getElementById('canvas-video');
const context = canvas.getContext('2d');
const img = new Image();

context.fillStyle = '#333';
context.fillText('Loading...', canvas.width/2-30, canvas.height/3);

$('#button').click((event) => {
  let data = JSON.stringify({ x: 10, y: 10 })
  $.ajax({
    type: 'POST',
    url: '/move',
    dataType: 'JSON',
    data: data
  })
})

socket.on('frame', function (data) {
  const uint8Arr = new Uint8Array(data.buffer);
  const str = String.fromCharCode.apply(null, uint8Arr);
  const base64String = btoa(str);

  img.onload = function () {
    context.drawImage(this, 0, 0, canvas.width, canvas.height)
  }
  img.src = 'data:image/png;base64,' + base64String

  $('#markers').text(JSON.stringify(data.markers, 2, null))

});

socket.on('rect', (data) => {
  let points = data.rect.map((point) => {
    return { x: Math.floor(point.x), y: Math.floor(point.y) }
  })
  $('#rect').text(JSON.stringify(points, 2, null))
})

