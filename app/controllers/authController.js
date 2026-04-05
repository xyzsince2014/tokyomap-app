const { promisify } = require('util');
const statusCodes = require("http-status-codes");
const redis = require('redis');
const cookieParser = require("cookie-parser");

const preAuthoriseService = require('../services/preAuthoriseService');
const proAuthoriseService = require('../services/proAuthoriseService');
const revokeService = require('../services/revokeService');

const redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
const redisDelAsync = promisify(redisClient.del).bind(redisClient);

redisClient.on('error', error => {
  console.log('[Redis Error] ' + error);
  res.redirect(`${process.env.DOMAIN}/error?error=redis_failed`);
});

/**
 * Redirects the user to the authorisation endpoint of the auth server.
 *
 * @param {*} req
 * @param {*} res
 */
const authorise = async (req, res) => {
  try {
    cleanUpSession(req.session);
    const url = await preAuthoriseService.execute(req.session);
    res.redirect(url);

  } catch (e) {
    console.error(`[Authorise Error] ${e.message}`);
    cleanUpSession(req.session);
    res.redirect(`${process.env.DOMAIN}/error?error=auth_failed`);
  }
};

/**
 * Fetches tokens from the token endpoint after authorisation, verifies them, and requests the userInfo from the resoruce server.
 *
 * @param {*} req
 * @param {*} res
 */
const callback = async (req, res) => {
  try {
    // TODO(oidc-hardening): Handle callback `error` / `error_description` parameters before token exchange and return a safe response.
    await proAuthoriseService.execute(req.query, req.session);
    res.redirect(process.env.DOMAIN);

  } catch (e) {
    console.error(`[Callback Error] ${e.message}`);
    cleanUpSession(req.session);
    res.redirect(`${process.env.DOMAIN}/error?error=auth_failed`);
  }
};

/**
 * Executes authentication.
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
const authenticate = async (req, res) => {

  // Force fresh authentication check and prevent sensitive data leakage on shared devices
  // e.g. via the "Back" button
  res.header('Cache-Control', 'no-store');

  // check if authorised by the AS or not
  const userInfo = req.session.userInfo;
  if(!userInfo || !userInfo.sub) {
    res.status(statusCodes.UNAUTHORIZED).json({userId: ''});
    return;
  }

  res.status(statusCodes.OK).json({userId: userInfo.sub});
};

/**
 * Signs out.
 *
 * @param {*} req
 * @param {*} res
 */
const signout = async (req, res) => {

  /* clean up the AS (revoke tokens) */
  try {
    const {accessToken, refreshToken} = req.session;
    if (accessToken) {
      await revokeService.execute(accessToken, 'access_token');
    }
    if (refreshToken) {
      await revokeService.execute(refreshToken, 'refresh_token');
    }
  } catch (e) {
    console.error(`[Sign Out Error] ${e.message}`);
  }

  /* clenaup the RP */
  res.clearCookie(process.env.SESSION_KEY);

  // todo: req.session.destroy()
  const sessionKey = cookieParser.signedCookie(req.cookies[process.env.SESSION_KEY], process.env.SESSION_SECRET);
  if (sessionKey) {
    await redisDelAsync('sess:' + sessionKey);
  }

  cleanUpSession(req.session);
  res.redirect(process.env.DOMAIN);
};

/**
 * Cleans up the session.
 *
 * @param {*} session
 */
const cleanUpSession = session => {
  session.accessToken = null;
  session.refreshToken = null;
  session.userInfo = null;
  session.idToken = null;
  session.scope = null;
  session.state = null;
  session.nonce = null;
  session.codeVerifier = null;
};

module.exports = {
  authorise,
  callback,
  authenticate,
  signout,
};
