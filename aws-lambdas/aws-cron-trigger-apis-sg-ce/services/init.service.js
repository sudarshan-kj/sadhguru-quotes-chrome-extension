const logger = require("log4js").getLogger();
logger.level = "debug";
const envConfig = require("../config/env.config");

const invalidValue = () => {
  logger.error(
    `Invalid value found in ${
      process.env[envConfig.envVars.SG_TRIGGER_APIS_VAR]
    }`
  );
};

const envVarNotSet = (envVariable) => {
  logger.error(`${envVariable} env variable is not set`);
};

const callExit = () => {
  logger.warn("***Exiting process***");
  process.exit(1);
};

const checkTriggerApisKeyEnv = () => {
  const sgTriggerApisKey = process.env[envConfig.envVars.SG_TRIGGER_APIS_VAR];
  if (!sgTriggerApisKey) {
    envVarNotSet(envConfig.envVars.SG_TRIGGER_APIS_VAR);
    callExit();
  }
  try {
    const triggerApisObject = JSON.parse(sgTriggerApisKey);
    if (
      !triggerApisObject.addQuotesApi ||
      !triggerApisObject.collateQuotesApi ||
      !triggerApisObject.cacheQuotesLocallyApi
    ) {
      invalidValue();
      callExit();
    }
  } catch {
    logger.error(
      `Error occurred while parsing json from env variable: ${envConfig.envVars.SG_TRIGGER_APIS_VAR}`
    );
    callExit();
  }
};

const checkWhitelistedApiKey = () => {
  const sgWhitelistedApiKey =
    process.env[envConfig.envVars.SG_WLSTD_API_KEY_VAR];
  if (!sgWhitelistedApiKey) {
    envVarNotSet(envConfig.envVars.SG_WLSTD_API_KEY_VAR);
    callExit();
  }
};

const checkTwitterAuthKey = () => {
  const twitterAuthKey = process.env[envConfig.envVars.SG_TWITTER_AUTH_KEY_VAR];
  if (!twitterAuthKey) {
    envVarNotSet(envConfig.envVars.SG_TWITTER_AUTH_KEY_VAR);
    callExit();
  }
};

const checkEnvVars = () => {
  checkTwitterAuthKey();
  checkTriggerApisKeyEnv();
  checkWhitelistedApiKey();
};

const preCheckAppConfig = () => {
  logger.debug("< Performing App config PRE-CHECK >");
  checkEnvVars();
  logger.debug("< App config PRE-CHECK successful >");
};

preCheckAppConfig();
