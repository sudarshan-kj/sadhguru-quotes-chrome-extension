const { readData } = require("../dynamo");
const config = require("../config");
const logger = require("log4js").getLogger();
const fs = require("fs").promises;
logger.level = "debug";

/**
 * @author Sudarshan K J <kjsudi@gmail.com>
 */

const getRandomNumber = (n) => Math.trunc(Math.random() * n);
/*
A method which attempts to fetch the latest quote from 
*/
const fetchFromDb = async () => {
  try {
    const random = getRandomNumber(2000);
    logger.info("< Fetching latest quote from DB >");
    console.time(`[DB_PULL]-${random}`);
    const response = await readData(11111);
    logger.info("< Successfully fetched latest quote from DB >");
    console.timeEnd(`[DB_PULL]-${random}`);
    const data = response.Items[0];
    return data;
  } catch (e) {
    throw e;
  }
};

/*
A method which attempts to fetch the latest quote from db and writes to a local file on disk
*/
exports.fetchFromDbAndCacheLocally = async () => {
  try {
    const random = getRandomNumber(2000);
    const data = await fetchFromDb();
    logger.info("< Attempting to insert new data to file >");
    /*A random number is appended to the console log becasue in cases of high concurrent requests
      multiple console logs would be initialized with the same value. Appending a random number decreases its probability*/
    console.time(`[FILE_WRITE]-${random}`);
    await fs.writeFile(
      config.LOCAL_CACHE_FILE_NAME,
      JSON.stringify(data),
      "utf-8"
    );
    logger.info("< Successfully inserted new data to file >");
    console.timeEnd(`[FILE_WRITE]-${random}`);
    return data;
  } catch (e) {
    throw e;
  }
};

exports.isStaleData = (publishedDate) => {
  const ADD_MINS_OFFSET = 1455;
  const now = new Date();
  const nextTriggerDate = new Date(publishedDate);
  nextTriggerDate.setMinutes(nextTriggerDate.getMinutes() + ADD_MINS_OFFSET);
  return now.valueOf() >= nextTriggerDate.valueOf();
};

exports.fetchFromDb = fetchFromDb;
