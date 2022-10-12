const statusCodes = require("http-status-codes");
const redis = require('redis');
const cookieParser = require("cookie-parser");

const preAuthoriseService = require('../services/preAuthoriseService');
const proAuthoriseService = require('../services/proAuthoriseService');

const redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);

redisClient.on('error', error => {
  console.log('Reids error:' + error);
});

/**
 * redirect the user to the authorisation endpoint
 */
const authorise = async (req, res) => {
  try {
    cleanUpSession(req.session);
    const url = await preAuthoriseService.execute(req.session);
    res.redirect(url);
  } catch (e) { // todo: manage error properly
    console.log(JSON.stringify(e));
    // res.render('error', {error: e});
  }
};

/**
 * fetch tokens and the userInfo from the token endpoint after authorisation
 */
const callback = async (req, res) => {
  try {
    await proAuthoriseService.execute(req.query, req.session);
    res.redirect(process.env.DOMAIN);
  } catch (e) {
    // todo: manage an error properly
    console.log(e);
    cleanUpSession(req.session);
    // res.render('error', {error: 'Unable to get tokens, server response: ' + e})
  }
};

/**
 * execute authentication
 */
const authenticate = async (req, res) => {

  res.header('Cache-Control', 'no-store');

  // authorised by Twitter, FB or LINE
  if(req.isAuthenticated()) {
    console.log(`Authorised by Twiiter, FB, or LINE`);
    res.status(statusCodes.OK).json({userId: req.session.passport.user.userId});
    return;
  }

  // check if authorised by auth server or not
  const userInfo = req.session.userInfo;
  if(!userInfo || !userInfo.sub) {
    console.log('Unauthtorised by sub');
    res.status(statusCodes.UNAUTHORIZED).json({userId: ''});
    return;
  }

  console.log('Authtorised by sub');
  res.status(statusCodes.OK).json({userId: userInfo.sub});
  return;
};

/**
 * sign out
 */
const signout = async (req, res) => {

  req.logout();
  res.clearCookie(process.env.SESSION_KEY);

  // todo: req.session.destory()
  await redisClient.del('sess:' + cookieParser.signedCookie(req.cookies[process.env.SESSION_KEY], process.env.SESSION_SECRET), (err, reply) => {
    if(err) {
      console.log(`failed to delete: ${e}`);
    }
  });

  cleanUpSession(req.session);
  res.redirect(process.env.DOMAIN);
};

/**
 * clean up the session
 */
const cleanUpSession = session => {
  session.accessToken = null;
  session.refreshToken = null;
  session.scopes = null;
  session.idToken = null;
  session.state = null;
  session.codeVerifier = null;
  session.userInfo = null;
};

module.exports = {
  authorise,
  callback,
  authenticate,
  signout,
};
