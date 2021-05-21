const createError = require("http-errors");
const asyncHandler = require("express-async-handler");
const config = require("../config");
const envConfig = require("../config/env.config");

/**
 * @author Sudarshan K J <kjsudi@gmail.com>
 */

/*
The following api validates an input api key

*/
const validateApiKey = asyncHandler(async (req, res, next) => {
  const header = req.headers[config.API_KEY_HEADER];
  if (!header) {
    throw createError(403);
  }
  if (header !== process.env[envConfig.envVars.SG_WLSTD_API_KEY_VAR]) {
    throw createError(401);
  }
  return next();
});

module.exports = validateApiKey;
