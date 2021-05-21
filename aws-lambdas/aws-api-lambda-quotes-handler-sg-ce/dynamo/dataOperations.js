const { AWS, tableName } = require("./config");
const logger = require("log4js").getLogger();
const { getBiYear } = require("../utils/helpers");
logger.level = "debug";

var docClient = new AWS.DynamoDB.DocumentClient();

function insert(params, type) {
  return new Promise((res, rej) => {
    docClient.put(params, function (err, data) {
      if (err) {
        rej(err);
      } else {
        res(data);
        logger.info(`[${type}] Succesfully inserted data`);
      }
    });
  });
}

function deleteItem(publishedDate) {
  let params = {
    TableName: tableName,
    Key: {
      biYear: 11111,
      publishedDate: publishedDate,
    },
  };

  return new Promise((resolve, reject) => {
    docClient.delete(params, function (err, data) {
      if (err) {
        logger.error("Deleting item error", JSON.stringify(err, null, 2));
        reject(err);
      } else {
        logger.info("[ Deleted last item from index 11111 ]");
        resolve(data);
      }
    });
  });
}

exports.insertData = (data) => {
  let biYear = getBiYear(data.publishedDate);
  let params = {
    TableName: tableName,
    Item: {
      biYear,
      publishedDate: data.publishedDate,
      imageLink: data.imageLink,
      twitterLink: data.twitterLink,
      quote: data.quote,
    },
    ConditionExpression: "biYear <> :b and publishedDate <> :p",
    ExpressionAttributeValues: {
      ":b": biYear,
      ":p": data.publishedDate,
    },
  };
  return insert(params, "DAILY");
};

function readData(key) {
  let params = {
    TableName: tableName,
    KeyConditionExpression: "biYear = :by",
    ExpressionAttributeValues: {
      ":by": key,
    },
  };
  return new Promise((res, rej) => {
    docClient.query(params, function (err, data) {
      if (err) {
        logger.error("Unable to read item. Error JSON:", JSON.stringify(err));
        rej(err);
      } else {
        res(data);
      }
    });
  });
}

exports.readData = readData;

exports.insertDataWithRandomQuotes = async (quoteData, randomQuotesList) => {
  let data = await readData(11111);
  let params = {
    TableName: tableName,
    Item: {
      biYear: 11111,
      publishedDate: quoteData.publishedDate,
      imageLink: quoteData.imageLink,
      twitterLink: quoteData.twitterLink,
      quote: quoteData.quote,
      randomQuotesList,
    },
  };
  if (data.Items.length === 1) {
    await deleteItem(data.Items[0].publishedDate);
  }
  return insert(params, "BULK");
};
