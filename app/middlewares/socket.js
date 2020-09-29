const mariaSocket = require('../models/socket');

const socketHandler = io => {
  io.origins('*:*');

  io.on('connection', socket => {
    socket.on('initState', async () => {
      const tweets = await mariaSocket.getTweets();
      socket.emit('initState:done', tweets);
    });

    socket.on('broadcastTweet', async ({ tweet, userId }) => {
      await mariaSocket.updateTweets({ tweet, userId });
      const tweets = await mariaSocket.getTweets();
      socket.emit(`broadcastTweet:done`, tweets);
    });
  });
};

module.exports = {
    socketHandler,
};
