const express = require('express')

const io = require('socket.io')({
  path: '/io/webrtc',
})

const app = express()
const port = process.env.PORT || 8080

const rooms = {}
const messages = {}

app.use(express.static(`${__dirname}/build`))
app.get('/', (req, res, next) => {
  res.sendFile(`${__dirname}/build/index.html`)
})

app.get('/:room', (req, res, next) => {
  res.sendFile(`${__dirname}/build/index.html`)
})

const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
)

io.listen(server)

io.on('connection', (socket) => {
  console.log('connected')
})

const peers = io.of('/webrtcPeer')

peers.on('connection', (socket) => {
  const { room } = socket.handshake.query

  rooms[room] =
    (rooms[room] && rooms[room].set(socket.id, socket)) ||
    new Map().set(socket.id, socket)
  messages[room] = messages[room] || []

  console.log(socket.id)
  socket.emit('connection-success', {
    success: socket.id,
    peerCount: rooms[room].size,
    messages: messages[room],
  })

  const broadcast = () => {
    const _connectedPeers = rooms[room]

    for (const [socketID, _socket] of _connectedPeers.entries()) {
      _socket.emit('joined-peers', {
        peerCount: rooms[room].size,
      })
    }
  }
  broadcast()
  const disconnectedPeer = (socketID) => {
    const _connectedPeers = rooms[room]
    for (const [_socketID, _socket] of _connectedPeers.entries()) {
      _socket.emit('peer-disconnected', {
        peerCount: rooms[room].size,
        socketID,
      })
    }
  }

  socket.on('new-message', (data) => {
    console.log('new-message', JSON.parse(data.payload))

    messages[room] = [...messages[room], JSON.parse(data.payload)]
  })

  socket.on('disconnect', () => {
    console.log('disconnected')

    rooms[room].delete(socket.id)
    messages[room] = rooms[room].size === 0 ? null : messages[room]
    disconnectedPeer(socket.id)
  })

  socket.on('onlinePeers', (data) => {
    const _connectedPeers = rooms[room]
    for (const [socketID, _socket] of _connectedPeers.entries()) {
      if (socketID !== data.socketID.local) {
        console.log('online-peer', data.socketID, socketID)
        socket.emit('online-peer', socketID)
      }
    }
  })

  socket.on('offer', (data) => {
    const _connectedPeers = rooms[room]
    for (const [socketID, socket] of _connectedPeers.entries()) {
      if (socketID === data.socketID.remote) {
        socket.emit('offer', {
          sdp: data.payload,
          socketID: data.socketID.local,
        })
      }
    }
  })

  socket.on('answer', (data) => {
    const _connectedPeers = rooms[room]
    for (const [socketID, socket] of _connectedPeers.entries()) {
      if (socketID === data.socketID.remote) {
        console.log('Answer', socketID, data.socketID, data.payload.type)
        socket.emit('answer', {
          sdp: data.payload,
          socketID: data.socketID.local,
        })
      }
    }
  })

  socket.on('candidate', (data) => {
    const _connectedPeers = rooms[room]

    for (const [socketID, socket] of _connectedPeers.entries()) {
      if (socketID === data.socketID.remote) {
        socket.emit('candidate', {
          candidate: data.payload,
          socketID: data.socketID.local,
        })
      }
    }
  })
})
