const fetch = require("node-fetch");
const config = require('../config');
const util = require('../utils');

/**
 * Fetches profiles from RS.
 *
 * @param {*} subs
 * @returns user profiles 
 */
const fetchProfiles = async (subs) => {
  try {
    const accessToken = await getClientAccessToken();

    const response = await fetch(
      config.protectedResource.profilesEndpoint,
      {
        method: 'POST',
        headers: {'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json'},
        body: JSON.stringify({subs: Array.isArray(subs) ? subs : [subs]}),
        timeout: 2000
      },
    );

    if (!response.ok) {
      // todo
      const errorDetail = await response.text(); 
      console.error(`RS Error (Status ${response.status}): ${errorDetail}`);
      throw new Error(`RS fetchProfiles failed with status ${response.status}`);
    }

    const responseBody = await response.json();

    return responseBody;

  } catch (e) {
    console.error('RS fetchProfiles failed:', e.responseData || e.message);
    throw e;
  }
};

/**
 * Fetches an access token with Client Credentials Grant.
 */
const getClientAccessToken = async () => {
  // todo: use token cached in redis
  // if (cachedToken && Date.now() < tokenExpiresAt) {
  //   return cachedToken;
  // }

  try {
    const response = await fetch(
      config.auth.tokenEndpoint,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${util.encodeClientCredentials(config.client.clientId, config.client.clientSecret)}`,
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({
          'grant_type': 'client_credentials', // todo: to be a constant
          'scope': 'profile' // todo: to be a constant
        }),
        timeout: 2000 // todo: to be a constant
      },
    );

    if (!response.ok) {
      throw new Error(`AS Token request failed with status ${response.status}`);
    }

    return (await response.json()).accessToken;

  } catch (e) {
    console.error('AS Failed to get Client Access Token:', e.responseData || e.message);
    throw e;
  }
};

module.exports = {
  fetchProfiles
};
