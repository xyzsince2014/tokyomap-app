/**
 * cf. https://stackoverflow.com/questions/3393854/get-and-set-a-single-cookie-with-node-js-http-server
 * @param {Object} options
 * @param {string} [options.name='']
 * @param {string} [options.value='']
 * @param {Date} [options.expires]
 * @param {number} [options.maxAge]
 * @param {string} [options.domain]
 * @param {string} [options.path]
 * @param {boolean} [options.secure]
 * @param {boolean} [options.httpOnly]
 * @param {boolean} [options.hostOnly]
 * @param {'Strict'|'Lax'|'None'} [options.sameSite]
 * @return {string}
 */
const handleSetCookie = options =>
  `${options.name || ""}=${options.value || ""}` +
  (options.expires ? `; Expires=${options.expires.toUTCString()}` : "") +
  (options.maxAge ? `; Max-Age=${options.maxAge}` : "") +
  (options.domain ? `; Domain=${options.domain}` : "") +
  (options.path ? `; Path=${options.path}` : "") +
  (options.secure ? "; Secure" : "") +
  (options.httpOnly ? "; HttpOnly" : "") +
  (options.hostOnly ? "; HostOnly" : "") +
  (options.sameSite ? `; SameSite=${options.sameSite}` : "");

module.exports = {
  handleSetCookie,
};
