const logger = require("log4js").getLogger();
logger.level = "debug";
const envConfig = require("../config/env.config");

const envVarNotSet = (envVariable) => {
  logger.error(`${envVariable} env variable is not set`);
};

const callExit = () => {
  logger.warn("***Exiting process***");
  process.exit(1);
};

const checkBulkInsertWhitelistedApiKeys = () => {
  const sgBulkInsertWhitelistedApiKey =
    process.env[envConfig.envVars.SG_WLSTD_API_KEY_VAR];
  if (!sgBulkInsertWhitelistedApiKey) {
    envVarNotSet(envConfig.envVars.SG_WLSTD_API_KEY_VAR);
    callExit();
  }
};

const checkPrivateKeyEnv = () => {
  const sgPrivateKeyVar = process.env[envConfig.envVars.SG_PRIVATE_KEY_VAR];
  if (!sgPrivateKeyVar) {
    envVarNotSet(envConfig.envVars.SG_PRIVATE_KEY_VAR);
    callExit();
  }
};

const checkEnvVars = () => {
  checkPrivateKeyEnv();
  checkBulkInsertWhitelistedApiKeys();
};

const preCheckAppConfig = () => {
  logger.debug("< Performing App config PRE-CHECK >");
  checkEnvVars();
  logger.debug("< App config PRE-CHECK successful >");
};

preCheckAppConfig();
