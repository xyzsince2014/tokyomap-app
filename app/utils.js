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
  fetchCurrentJst,
  fetchCurrentDatetimeJst
};
