

/**
 * creates a buffer from the string `<clientId>:<clientSecret>`, and returns it according to base64, where clientId and clientSecret are both percent-encoded
 */
const encodeClientCredentials = (clientId, clientSecret) => {
  const buffer = Buffer.from(encodeURIComponent(clientId) + ":" + encodeURIComponent(clientSecret));
  return buffer.toString("base64");
};

const fetchCurrentJst = () => {
  const localUnixTime = Date.now(); // msec
  const jstTimelag = 9 * 60; // jst timelag from utc in min
  const timezoneOffset = new Date().getTimezoneOffset(); // @utc → 0, @jst → -540(min)
  const clientTimelagFromJst = (timezoneOffset + jstTimelag) * 60 * 1000; // msec
  return new Date(localUnixTime + clientTimelagFromJst);
};

const fetchCurrentDatetimeJst = () =>
  fetchCurrentJst()
    .toLocaleString('en-GB', {
      hour12: false,
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    .replace(',', '');

module.exports = {
  encodeClientCredentials,
  fetchCurrentJst,
  fetchCurrentDatetimeJst,
};
