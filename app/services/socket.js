const mariaSocket = require('../models/socket');

const socketHandler = io => {
  io.origins('*:*');

  io.on('connection', socket => {
    socket.on('initSocketState', async () => {
      const tweets = await mariaSocket.getTweets();
      socket.emit('initSocketState:done', tweets);
    });

    socket.on('postTweet', async ({ tweet, userId }) => {
      await mariaSocket.updateTweets({ tweet, userId });
      const tweets = await mariaSocket.getTweets();
      socket.emit('postTweet:done', tweets);
      socket.broadcast.emit('postTweet:done', tweets);
    });
  });
};

module.exports = {
    socketHandler,
};
