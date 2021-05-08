const createError = require("http-errors");
const asyncHandler = require("express-async-handler");
const fs = require("fs").promises;
const config = require("../config");
const lockfile = require("proper-lockfile");
const logger = require("log4js").getLogger();
logger.level = "debug";
const { fetchFromDbAndCacheLocally } = require("../utils");

/**
 * @author Sudarshan K J <kjsudi@gmail.com>
 */

/*
Note: All unexpected errors arising out of failing await statements or otherwise are captured by asyncHandler, 
passes the error object to the custom error handler defined at the bottom of this page.
*/
const cacheDataLocally = asyncHandler(async (req, res, next) => {
  logger.info("< Received request to cache data locally >");

  /* File is checked if present, and only then created in the following catch block. 
    Not doing this would create a dummy file everytime with the value 'undefined'
    causing JSON.parse in the /query api to break while reading from the file*/
  try {
    await fs.access(config.LOCAL_CACHE_FILE_NAME);
  } catch {
    logger.info("< Creating new empty file >");
    await fs.writeFile(config.LOCAL_CACHE_FILE_NAME, "");
  }

  let release = await lockfile.lock(config.LOCAL_CACHE_FILE_NAME);
  /*
     We had to wrap the 'fetchFromDbAndCacheLocally' call in a try/catch block 
     since not doing so would keep the HTTP request hanging if an error occurs in the function. 
     We now throw an error received from the function and respond to the caller with the error stack. 
     Finally, the file lock is released regardless of the operation status.
    */
  try {
    await fetchFromDbAndCacheLocally();
  } catch (e) {
    throw createError(e);
  } finally {
    release();
  }
  return res.status(200).send({
    message: "Successfully stored updated data to local file cache",
  });
});

module.exports = cacheDataLocally;
