const createError = require("http-errors");
const protectedRouter = require("express").Router();
const CryptoJS = require("crypto-js");
const envConfig = require("../config/env.config");
const asyncHandler = require("express-async-handler");
const {
  insertData,
  readData,
  insertDataWithRandomQuotes,
} = require("../dynamo/dataOperations");
const validateApiKey = require("../middlewares/validateApiKey");
const { getBiYear } = require("../utils/helpers");
const logger = require("log4js").getLogger();
logger.level = "debug";

/**
 * @author Sudarshan K J <kjsudi@gmail.com>
 */

/*
The following api validates if the client is allowed to make a request to this api based on the input api key and thereby
supports inserting data into a known index.
*/
const bulkInsert = asyncHandler(async (req, res, next) => {
  logger.info("[ Quote Insert request - START ]");
  const quotesData = req.body.data;
  //Guard clause
  if (!quotesData || !quotesData.length) {
    throw createError(400, "Bad input");
  }
  for (const quote of quotesData) {
    try {
      await insertData(quote);
    } catch (e) {
      logger.warn("[ Data already exists ]");
    }
  }
  logger.info("[ Quote Insert request - END ]");
  return res.status(200).send({ message: "Successfully inserted data" });
});

async function getMultipleQuotes(collateCount) {
  let today = new Date();
  let biYear = getBiYear(today);
  const quotesB1 = await readData(biYear);
  today.setMonth(today.getMonth() - 6);
  const quotesB2 = await readData(getBiYear(today));
  let quotes = [...quotesB1.Items, ...quotesB2.Items].splice(0, collateCount);
  return quotes;
}

const insertEncryptedRandomQuotes = async (latestQuote, collateCount) => {
  try {
    const quotes = await getMultipleQuotes(collateCount);
    let privateKey = process.env[envConfig.envVars.SG_PRIVATE_KEY_VAR];
    var encryptedQuotes = CryptoJS.AES.encrypt(
      JSON.stringify(quotes),
      privateKey
    ).toString();
    await insertDataWithRandomQuotes(latestQuote, encryptedQuotes);
    logger.info("[ *Inserted random encrypted quotes to database* ]");
    return [latestQuote, quotes, encryptedQuotes];
  } catch (e) {
    logger.error(
      "Something went wrong while inserting encrypted random quotes",
      e
    );
    throw e;
  }
};

const collateAndInsert = asyncHandler(async (req, res, next) => {
  logger.info("[ Collate Quote request - START ]");
  const quotesData = req.body.data;
  const collateCount = parseInt(req.query.collateCount);
  //Guard clause
  if (!quotesData || !quotesData.length) {
    throw createError(400, "Bad input");
  }
  if (!collateCount) {
    throw createError(400, "Invalid count");
  }
  const [latest, randomQuotesList] = await insertEncryptedRandomQuotes(
    quotesData[0],
    collateCount
  );
  logger.info("[ Collate Quote request - END ]");
  return res.status(200).send({
    latest,
    randomQuotesList,
    count: randomQuotesList.length,
  });
});

protectedRouter.use("", validateApiKey);
protectedRouter.post("/bulk", bulkInsert);
protectedRouter.post("/collate", collateAndInsert);

module.exports = protectedRouter;
