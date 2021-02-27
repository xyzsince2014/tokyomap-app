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
      try {
        await mariaSocket.postTweet({userId, geolocation, message});
        const tweets = await mariaSocket.getTweets();
        socket.emit('postTweet:resolve', tweets);
        socket.broadcast.emit('postTweet:resolve', tweets);
      } catch (err) {
        console.log(`Error in postTweet() : ${err}`); // todo: use CloudWatchLog
        socket.emit('postTweet:reject', err);
      }
    });
  });
};

module.exports = {
    socketHandler,
};
