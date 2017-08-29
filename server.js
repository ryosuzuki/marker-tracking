const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use('/', express.static(__dirname))
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
})

app.post('/move', (req, res) => {
  console.log(req.body)
})

const server = http.Server(app)
server.listen(8080, () => {
  console.log('listening 8080')
})

const io = socketio(server)
const socket = require('./socket')
io.on('connection', socket)


