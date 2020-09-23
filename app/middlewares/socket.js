const mariaSocket = require('../models/socket');

const socketHandler = io => {
  io.origins('*:*');

  io.on('connection', socket => {
    socket.on('initState', async () => {
      const initialTweets = await mariaSocket.getTweets();
      socket.emit('initState:done', initialTweets);
    });
  
  //   // 更新をbroadcast
  //   socket.on('broadCastReserve', async ({ boxId, userId }) => {
  //     const reservedBox = await updateReservedBox({ boxId, userId }) || [];
  
  //     socket.broadcast.emit(`broadCastReserve:receive`, JSON.parse(reservedBox));
  //   });
  
  //   socket.on('updateSelected', async ({ boxId, userId }) => {
  //     const selectedBox = await updateSelectedBox({ boxId, userId }) || [];
  
  //     socket.emit('updateSelected:receive', JSON.parse(selectedBox));
  //   });
  });
};

module.exports = {
    socketHandler,
};
