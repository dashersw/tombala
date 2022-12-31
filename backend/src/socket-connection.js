const io = require('socket.io')

let socketServer = null

module.exports = (app, server) => {
  if (socketServer) return socketServer

  socketServer = io(server, {
    cors: {
      origin: 'https://tombala.gg',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })

  socketServer.on('connection', socket => {
    socket.on('join-room', eventId => {
      socket.join(eventId)
    })
  })

  return socketServer
}
