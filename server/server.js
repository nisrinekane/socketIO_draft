const { instrument } = require('@socket.io/admin-ui')
const io = require("socket.io")(3000, {
  // cors is blocking port 3000 form communicatiing with port 8080 
  // we need to tell cors to allow it into cross origins
  cors: {
    origin: ['http://localhost:8080', 'https://admin.socket.io'],
    credentials: true,
  },
})

const userIo = io.of('/user')
userIo.on('connection', socket => {
  console.log('connected to user namespace with username '+ socket.username)
})

userIo.use((socket, next) => {
  if (socket.handshake.auth.token) {
    socket.username = getUsernameFromToken(socket.handshake.auth.token)
    next()
  } else {
    next(new Error('please send a token'))
  }
})

function getUsernameFromToken(token) {
  return token
}

// on connection, it creates a new socket and prints connection id to the console
io.on('connection', socket => {
  console.log(socket.id)
  //socket listens to custom events:
  // takes a message and room id
  socket.on('send-message', (message, room) => {
    // if room doesnt exist, broadcast to everyone but me. 
    if (room === '' ) {
      // removing 'broadcast'will hide the message from you and show it to everyone else
      socket.broadcast.emit('receive-message', message)
    } else {
      // if the room id exists, send the message to that room
      socket.to(room).emit('receive-message', message)
    }
  })
  socket.on('join-room', (room, cb) => {
    socket.join(room)
    // feedback that connection or message is successful
    cb(`Joined ${room}`)
  })
})

instrument(io, { auth: false })