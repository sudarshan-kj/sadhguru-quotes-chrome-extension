"use strict";
const { fetchQuote } = require("./controllers/fetchQuote");
const {
  triggerAddApi,
  triggerCollateApi,
  triggerCacheApi,
} = require("./controllers/triggerApis");

const logger = require("log4js").getLogger();
logger.level = "debug";
require("./services/init.service");

module.exports.run = async (event, context) => {
  const time = new Date();
  logger.info("[ ***INIT*** ]");
  const quote = await fetchQuote();
  await triggerAddApi(quote);
  await triggerCollateApi(quote);
  await triggerCacheApi();
  logger.info("[ ***END*** ]");
  console.log(`Your cron function "${context.functionName}" ran at ${time}`);
};
