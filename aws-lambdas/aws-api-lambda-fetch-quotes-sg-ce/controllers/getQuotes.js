const fs = require("fs").promises;
const asyncHandler = require("express-async-handler");
const lockfile = require("proper-lockfile");
const createError = require("http-errors");
const logger = require("log4js").getLogger();
logger.level = "debug";
const config = require("../config");
const { fetchFromDb, isStaleData } = require("../utils");

/**
 * @author Sudarshan K J <kjsudi@gmail.com>
 */

const getQuotes = asyncHandler(async (req, res, next) => {
  logger.info("< Received read request >");
  try {
    /* The following lock check on the file is necessary to avoid reading an empty file, which is created
      just before the /cacheAndStoreLocally api starts writing data to it. This lock check prevents reading such empty files
      since the lock is released only after completely writing to it.*/

    let isLocked = await lockfile.check(config.LOCAL_CACHE_FILE_NAME);

    if (isLocked) {
      console.warn("< File is locked, fetching from DB >");
      let data = await fetchFromDb();
      if (data) return res.status(200).send({ data });
      else throw createError(500, "Data from db was empty");
    } else {
      let dataFromFile = await fs.readFile(
        config.LOCAL_CACHE_FILE_NAME,
        "utf-8"
      );

      if (!dataFromFile) throw new Error("< Empty file >");
      dataFromFile = JSON.parse(dataFromFile);
      if (isStaleData(dataFromFile.publishedDate))
        throw new Error("< !!! Stale data found in cache !!! >");
      logger.info("< OK: Returning data from Local File Cache >");
      return res.status(200).send({ data: dataFromFile, fromCache: true });
    }
  } catch (e) {
    console.log("!...FETCHING FROM DB...CATCH BLOCK...! since: ", e);
    const data = await fetchFromDb();
    if (data) return res.status(200).send({ data, fromCache: false });
    else throw createError(500, "Data from db was empty");
  }
});

module.exports = getQuotes;
