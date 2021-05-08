import AWS from "aws-sdk";

AWS.config.region = "ap-south-1"; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: "ap-south-1:e4ecea6d-3ba8-4ea0-b3a4-7958bd9fca57",
});

let docClient = new AWS.DynamoDB.DocumentClient();

export const readData = (key) => {
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
