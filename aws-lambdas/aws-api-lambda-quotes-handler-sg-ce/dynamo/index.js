let AWS = require("aws-sdk");

AWS.config.update({
  region: "ap-south-1",
});

var docClient = new AWS.DynamoDB.DocumentClient();

exports.readData = (key) => {
  let params = {
    TableName: "DailyMysticQuotes_SG",
    KeyConditionExpression: "biYear = :by",
    ExpressionAttributeValues: {
      ":by": key,
    },
  };
  return new Promise((res, rej) => {
    docClient.query(params, function (err, data) {
      if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err));
        rej(err);
      } else {
        res(data);
      }
    });
  });
};
