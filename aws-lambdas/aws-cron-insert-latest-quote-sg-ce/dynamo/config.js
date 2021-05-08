let AWS = require("aws-sdk");

AWS.config.update({
  region: "ap-south-1",
  // remove the following property to connect to the account associated with your AWS Access key and AWS Secret Key
  //endpoint: "http://localhost:8000",
});

exports.AWS = AWS;
exports.tableName = "DailyMysticQuotes_SG";
