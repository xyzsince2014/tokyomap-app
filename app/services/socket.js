const mariaSocket = require('../models/socket');

const socketHandler = io => {
  io.origins('*:*');

  io.on('connection', socket => {
    socket.on('initSocketState', async () => {
      try {
        const tweets = await mariaSocket.getTweets();
        socket.emit('initSocketState:resolve', tweets);
      } catch (err) {
        console.log(`Error in getTweets() : ${err}`); // todo: use CloudWatchLog
        socket.emit('initSocketState:reject', err);
      }
    });

    socket.on('postTweet', async ({userId, geolocation, message}) => {
      await mariaSocket.postTweet({userId, geolocation, message});
      const tweets = await mariaSocket.getTweets();
      socket.emit('postTweet:done', tweets);
      socket.broadcast.emit('postTweet:done', tweets);
    });
  });
};

module.exports = {
    socketHandler,
};
