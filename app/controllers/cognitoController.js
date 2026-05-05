const preCognitoService = require('../services/preCognitoService');
const proCognitoService = require('../services/proCognitoService');

const authorise = async (req, res) => {
  try {
    cleanUpSession(req.session);
    const url = await preCognitoService.execute(req.session);
    res.redirect(url);
  } catch (e) {
    console.error(`[Cognito Authorise Error] ${e.message}`);
    cleanUpSession(req.session);
    res.redirect(`${process.env.DOMAIN}/error?error=auth_failed`);
  }
};

const callback = async (req, res) => {
  try {
    await proCognitoService.execute(req.query, req.session);
    res.redirect(process.env.DOMAIN);
  } catch (e) {
    console.error(`[Cognito Callback Error] ${e.message}`);
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
  res.header('Cache-Control', 'no-store');
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
  // Cognitoの場合は、/oauth2/revoke エンドポイントを叩くか、フロントエンド側でCognitoのログアウトURLにリダイレクトさせるのが一般的です。
  // ここではセッションとCookieのクリアを最低限行います。

  res.clearCookie(process.env.SESSION_KEY);

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
