const axios = require("axios");
const config = require("../config/env.config");
axios.defaults.timeout = 10000;

exports.twitterSearchApi = axios.create({
  baseURL:
    "https://api.twitter.com/2/tweets/search/recent?query=from:SadhguruJV %23SadhguruQuotes -is:retweet has:hashtags",
  headers: {
    Authorization: `Bearer ${
      process.env[config.envVars.SG_TWITTER_AUTH_KEY_VAR]
    }`,
  },
});

const triggerApiObject = JSON.parse(
  process.env[config.envVars.SG_TRIGGER_APIS_VAR]
);

const authApi = axios.create({
  headers: { "x-sg-api-key": process.env[config.envVars.SG_WLSTD_API_KEY_VAR] },
});

exports.addApi = (reqBody) =>
  authApi.post(triggerApiObject.addQuotesApi, reqBody);

exports.collateApi = (reqBody) =>
  authApi.post(triggerApiObject.collateQuotesApi, reqBody);

exports.cacheApi = () => axios.post(triggerApiObject.cacheQuotesLocallyApi);
