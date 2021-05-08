const serverless = require("serverless-http");
const cors = require("cors");
const express = require("express");
const logger = require("log4js").getLogger();
const createError = require("http-errors");
logger.level = "debug";
const app = express();
const getQuotes = require("./controllers/getQuotes");
const cacheDataLocally = require("./controllers/cacheDataLocally");

app.use(cors());
app.use(express.json());
app.disable("x-powered-by");

/**
 * @author Sudarshan K J <kjsudi@gmail.com>
 */

/*
The /quotes api attempts to fetch quotes from the local file. If that fails, it attempts to fetch
quotes from . This api is to be triggered by browser clients
*/
app.get("/quotes", getQuotes);

/*
The following api is triggered by a cron job after fetching a new quote from a source ( twitter ), which directs this api to
fetch the latest quote from db and store it locally in its file acting as a file cache.
It's necessary that this api is called before accessing /quotes api (if there is new data present), 
in order to update the file with the latest data.
*/

app.post("/cacheQuoteLocally", cacheDataLocally);

/* Handler for invalid path (404)*/
app.use((req, res, next) => {
  next(createError(404));
});

/* Custom ERROR Handler */
app.use((error, req, res, next) => {
  let errorStatus = error.status || 500;
  logger.error("Error status: ", errorStatus);
  logger.error("Message: ", error.message);
  res.status(errorStatus);
  res.json({
    status: errorStatus,
    message: error.message,
    stack: error.stack,
  });
});

app.listen(9000);

module.exports.handler = serverless(app);
