const { triggerCacheApi } = require("./utils/authAxios");
const logger = require("log4js").getLogger();
logger.level = "debug";

exports.triggerCacheApi = async () => {
  try {
    logger.info("[ Triggering local cache api ]");
    let response = await triggerCacheApi.post("");
    logger.info("[ Successfully triggered local cache api ]");
    logger.info("[ Response from trigger api ] => ", response.data);
  } catch (e) {
    logger.error("Error occurred while trigger cache api", e);
  }
};
