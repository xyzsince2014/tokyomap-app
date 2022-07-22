const usrLogic = require('../logics/usrLogic');

const execute = io => {
  io.origins('*:*');

  io.on('connection', socket => {
    socket.on('initSocketState', async () => {
      const client = transaction.getClient();
      try {
        const tweets = await usrLogic.getTweets(client);
        socket.emit('initSocketState:resolve', tweets);
      } catch (e) {
        console.log(`${utils.fetchCurrentDatetimeJst()} [socketService.getTweets] ${e}`);
        socket.emit('initSocketState:reject', e);
      } finally {
        client.release();
      }
    });

    socket.on('postTweet', async ({sub, geolocation, message}) => {
      const client = await pool.connect();
      try {
        // todo: transaction.begin();
        await client.query('begin');
        const tweets = await usrLogic.postTweet(client, {sub, geolocation, message});
        await client.query('commit');
        socket.emit('postTweet:resolve', tweets);
        socket.broadcast.emit('postTweet:resolve', tweets);
      } catch (e) {
        // todo: transaction.rollback(); // try-catch inside
        await client.query('rollback');
        console.log(`eor in postTweet() : ${e}`); // todo: use CloudWatchLog
        socket.emit('postTweet:reject', e);
      } finally {
        client.release();
      }
    });
  });
};

module.exports = {
    execute,
};
