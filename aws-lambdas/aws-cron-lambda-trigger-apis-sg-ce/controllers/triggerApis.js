const { addApi, collateApi, cacheApi } = require("../utils/authAxios");
const logger = require("log4js").getLogger();
logger.level = "debug";

exports.triggerAddApi = async (quote) => {
  try {
    logger.info("[ Triggering ADD api ]");
    let reqBody = { data: [quote] };
    let response = await addApi(reqBody);
    logger.info("[ Successfully triggered ADD api ]");
    logger.info("[ Response from ADD api ] => ", response.data);
  } catch (e) {
    logger.error("Error occurred while triggering ADD api: ", e);
  }
};

exports.triggerCollateApi = async (latestQuote) => {
  try {
    logger.info("[ Triggering COLLATE api ]");
    let reqBody = { data: [latestQuote] };
    let response = await collateApi(reqBody);
    logger.info("[ Successfully triggered COLLATE api ]");
    logger.info("[ Response status from COLLATE api ] => ", response.status);
  } catch (e) {
    logger.error("Error occurred while triggering COLLATE api: ", e);
  }
};

exports.triggerCacheApi = async () => {
  try {
    logger.info("[ Triggering LOCAL CACHE api ]");
    let response = await cacheApi();
    logger.info("[ Successfully triggered LOCAL CACHE api ]");
    logger.info("[ Response from LOCAL CACHE api ] => ", response.data);
  } catch (e) {
    logger.error("Error occurred while triggering LOCAL CACHE api: ", e);
  }
};
