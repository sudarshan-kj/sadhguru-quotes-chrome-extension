const { AWS, tableName } = require("./config");
const logger = require("log4js").getLogger();
logger.level = "debug";

var dynamodb = new AWS.DynamoDB();

exports.createTable = () => {
  return new Promise((res, rej) => {
    let params = {
      TableName: tableName,
      KeySchema: [
        { AttributeName: "biYear", KeyType: "HASH" },
        { AttributeName: "publishedDate", KeyType: "RANGE" },
      ],
      AttributeDefinitions: [
        { AttributeName: "biYear", AttributeType: "N" },
        { AttributeName: "publishedDate", AttributeType: "S" },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10,
      },
    };
    dynamodb.createTable(params, function (err, data) {
      if (err) {
        logger.error(
          "Unable to create table. Error JSON:",
          JSON.stringify(err, null, 2)
        );
        rej(err);
      } else {
        logger.info(
          "Created table. Table description JSON:",
          JSON.stringify(data, null, 2)
        );
        res("Table created");
      }
    });
  });
};

exports.deleteTable = () => {
  return new Promise((res, rej) => {
    let params = {
      TableName: tableName,
    };

    dynamodb.deleteTable(params, function (err, data) {
      if (err) {
        logger.error(
          "Unable to delete table. Error JSON:",
          JSON.stringify(err, null, 2)
        );
        rej(err);
      } else {
        logger.info(
          "Deleted table. Table description JSON:",
          JSON.stringify(data, null, 2)
        );
        res("deleted");
      }
    });
  });
};
