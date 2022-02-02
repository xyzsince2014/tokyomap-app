const usrLogic = require('../logics/usrLogic');

const execute = io => {
  io.origins('*:*');

  io.on('connection', socket => {
    socket.on('initSocketState', async () => {
      try {
        const tweets = await usrLogic.getTweets();
        socket.emit('initSocketState:resolve', tweets);
      } catch (e) {
        socket.emit('initSocketState:reject', e);
      }
    });

    socket.on('postTweet', async ({userId, geolocation, message}) => {
      try {
        const tweets = await usrLogic.postTweet({sub: userId, geolocation, message});
        socket.emit('postTweet:resolve', tweets);
        socket.broadcast.emit('postTweet:resolve', tweets);
      } catch (e) {
        socket.emit('postTweet:reject', e);
      }
    });
  });
};

module.exports = {
  execute,
};
